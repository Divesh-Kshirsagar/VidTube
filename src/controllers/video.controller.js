import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/users.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";

/**
 * @route GET /api/v1/videos
 * @description Get all videos with filtering, sorting, and pagination
 * @access Public
 */
const getAllVideos = asyncHandler(async (req, res) => {
    const { 
        page = 1, 
        limit = 10, 
        query, 
        sortBy = "createdAt", 
        sortType = "desc", 
        userId 
    } = req.query;

    // Create filter object
    const filter = { isPublished: true };

    // Add title search if query is provided
    if (query) {
        filter.$or = [
            { title: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } }
        ];
    }

    // Add user filter if userId is provided
    if (userId) {
        // Validate userId
        if (!isValidObjectId(userId)) {
            throw new ApiError(400, "Invalid user ID");
        }
        filter.Owner = new mongoose.Types.ObjectId(userId);
    }

    // Create sort object
    const sortOptions = {};
    sortOptions[sortBy] = sortType === "asc" ? 1 : -1;

    // Create aggregation pipeline
    const videoAggregation = Video.aggregate([
        {
            $match: filter
        },
        {
            $lookup: {
                from: "users",
                localField: "Owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            fullName: 1,
                            avatar: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                owner: { $arrayElemAt: ["$owner", 0] }
            }
        },
        {
            $sort: sortOptions
        }
    ]);

    // Apply pagination
    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10)
    };

    // Get paginated results
    const videos = await Video.aggregatePaginate(videoAggregation, options);

    return res
        .status(200)
        .json(
            new ApiResponse(200, videos, "Videos fetched successfully")
        );
});

/**
 * @route POST /api/v1/videos
 * @description Upload and publish a new video
 * @access Private (User must be logged in)
 */
const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description, duration } = req.body;
    
    // Validate required fields
    if (!title || !description) {
        throw new ApiError(400, "Title and description are required");
    }
    
    // Log request files for debugging
    console.log("Request files:", req.files);
    
    // Check if files are uploaded
    if (!req.files || 
        !req.files.videoFile || 
        !req.files.videoFile[0] || 
        !req.files.thumbnail || 
        !req.files.thumbnail[0]) {
        throw new ApiError(400, "Video and thumbnail files are required");
    }
    
    // Get file paths
    const videoLocalPath = req.files?.videoFile[0]?.path;
    const thumbnailLocalPath = req.files?.thumbnail[0]?.path;
    
    // Validate file paths
    if (!videoLocalPath) {
        throw new ApiError(400, "Video file is missing or upload failed");
    }
    
    if (!thumbnailLocalPath) {
        throw new ApiError(400, "Thumbnail file is missing or upload failed");
    }
    
    console.log("Video file path:", videoLocalPath);
    console.log("Thumbnail file path:", thumbnailLocalPath);

    // Upload files to cloudinary
    const videoFile = await uploadOnCloudinary(videoLocalPath);
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    // Validate upload response
    if (!videoFile || !videoFile.url) {
        throw new ApiError(400, "Error uploading video to cloudinary");
    }

    if (!thumbnail || !thumbnail.url) {
        throw new ApiError(400, "Error uploading thumbnail to cloudinary");
    }

    // Create video document in database
    const videoData = await Video.create({
        videoFile: videoFile.url,
        thumbnail: thumbnail.url,
        title,
        description,
        duration: duration || 0,
        Owner: req.user._id,
        isPublished: true
    });

    // Get the created video with populated owner
    const createdVideo = await Video.findById(videoData._id);

    if (!createdVideo) {
        throw new ApiError(500, "Failed to create video, please try again");
    }

    return res
        .status(201)
        .json(new ApiResponse(201, createdVideo, "Video published successfully"));
});

/**
 * @route GET /api/v1/videos/:videoId
 * @description Get video details by ID and increment view count
 * @access Public
 */
const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    
    // Validate videoId
    if (!videoId) {
        throw new ApiError(400, "Video ID is required");
    }
    
    // Check if videoId is valid
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID format");
    }
    
    // Get video with owner details
    const video = await Video.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(videoId),
                isPublished: true
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "Owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            fullName: 1,
                            avatar: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                owner: { $arrayElemAt: ["$owner", 0] }
            }
        }
    ]);
    
    // Check if video exists
    if (!video || video.length === 0) {
        throw new ApiError(404, "Video not found");
    }
    
    // Increment view count
    await Video.findByIdAndUpdate(
        videoId,
        {
            $inc: { views: 1 }
        }
    );
    
    // Add updated view count to response
    video[0].views += 1;
    
    return res
        .status(200)
        .json(
            new ApiResponse(200, video[0], "Video fetched successfully")
        );
});

/**
 * @route PATCH /api/v1/videos/:videoId
 * @description Update video details including title, description, thumbnail
 * @access Private (Only video owner can update)
 */
const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { title, description } = req.body;
    
    // Validate videoId
    if (!videoId) {
        throw new ApiError(400, "Video ID is required");
    }
    
    // Check if videoId is valid
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID format");
    }
    
    // Find the video
    const video = await Video.findById(videoId);
    
    // Check if video exists
    if (!video) {
        throw new ApiError(404, "Video not found");
    }
    
    // Check if user is the owner of the video
    if (video.Owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You don't have permission to update this video");
    }
    
    // Update fields if provided
    if (title) video.title = title;
    if (description) video.description = description;
    
    // Handle thumbnail update if provided
    if (req.file) {
        const thumbnailLocalPath = req.file.path;
        
        if (thumbnailLocalPath) {
            // Delete old thumbnail from cloudinary
            if (video.thumbnail) {
                const publicId = video.thumbnail.split('/').pop().split('.')[0];
                await deleteFromCloudinary(publicId);
            }
            
            // Upload new thumbnail
            const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
            
            if (!thumbnail || !thumbnail.url) {
                throw new ApiError(400, "Error uploading thumbnail");
            }
            
            // Update thumbnail URL
            video.thumbnail = thumbnail.url;
        }
    }
    
    // Save updated video
    await video.save();
    
    return res
        .status(200)
        .json(
            new ApiResponse(200, video, "Video updated successfully")
        );
});

/**
 * @route DELETE /api/v1/videos/:videoId
 * @description Delete a video and its files from cloudinary
 * @access Private (Only video owner can delete)
 */
const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    
    // Validate videoId
    if (!videoId) {
        throw new ApiError(400, "Video ID is required");
    }
    
    // Check if videoId is valid
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID format");
    }
    
    // Find the video
    const video = await Video.findById(videoId);
    
    // Check if video exists
    if (!video) {
        throw new ApiError(404, "Video not found");
    }
    
    // Check if user is the owner of the video
    if (video.Owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You don't have permission to delete this video");
    }
    
    // Delete video file from cloudinary
    if (video.videoFile) {
        const videoPublicId = video.videoFile.split('/').pop().split('.')[0];
        await deleteFromCloudinary(videoPublicId, "video");
    }
    
    // Delete thumbnail from cloudinary
    if (video.thumbnail) {
        const thumbnailPublicId = video.thumbnail.split('/').pop().split('.')[0];
        await deleteFromCloudinary(thumbnailPublicId);
    }
    
    // Delete video from database
    await Video.findByIdAndDelete(videoId);
    
    return res
        .status(200)
        .json(
            new ApiResponse(200, {}, "Video deleted successfully")
        );
});

/**
 * @route PATCH /api/v1/videos/toggle/publish/:videoId
 * @description Toggle the publish status of a video
 * @access Private (Only video owner can toggle status)
 */
const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    
    // Validate videoId
    if (!videoId) {
        throw new ApiError(400, "Video ID is required");
    }
    
    // Check if videoId is valid
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID format");
    }
    
    // Find the video
    const video = await Video.findById(videoId);
    
    // Check if video exists
    if (!video) {
        throw new ApiError(404, "Video not found");
    }
    
    // Check if user is the owner of the video
    if (video.Owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You don't have permission to update this video");
    }
    
    // Toggle publish status
    video.isPublished = !video.isPublished;
    
    // Save updated video
    await video.save();
    
    const statusMessage = video.isPublished ? "published" : "unpublished";
    
    return res
        .status(200)
        .json(
            new ApiResponse(200, video, `Video ${statusMessage} successfully`)
        );
});

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus,
};
