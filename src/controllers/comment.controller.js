import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Comment } from "../models/comment.model.js";
import mongoose from "mongoose";

/**
 * @route POST /api/v1/comments/:videoId
 * @description Create a comment on a video
 * @access Private (User must be logged in)
 */
const addComment = asyncHandler(async (req, res) => {
    // Get content from request body
    const { content } = req.body;
    // Get videoId from params
    const { videoId } = req.params;

    // Validate content
    if (!content) {
        throw new ApiError(400, "Content is required");
    }

    // Validate videoId
    if (!videoId) {
        throw new ApiError(400, "Video ID is required");
    }

    // Check if videoId is valid
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    // Create comment
    const comment = await Comment.create({
        content,
        video: videoId,
        owner: req.user._id,
    });

    // Return response
    return res
        .status(201)
        .json(new ApiResponse(201, comment, "Comment added successfully"));
});

/**
 * @route GET /api/v1/comments/:videoId
 * @description Get all comments for a video
 * @access Public
 */
const getVideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // Validate videoId
    if (!videoId) {
        throw new ApiError(400, "Video ID is required");
    }

    // Check if videoId is valid
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const commentAggregate = Comment.aggregate([
        {
            $match: {
                video: new mongoose.Types.ObjectId(videoId),
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            fullName: 1,
                            avatar: 1,
                        },
                    },
                ],
            },
        },
        {
            $addFields: {
                owner: { $arrayElemAt: ["$owner", 0] },
            },
        },
        {
            $sort: { createdAt: -1 },
        },
    ]);

    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
    };

    const comments = await Comment.aggregatePaginate(commentAggregate, options);

    return res
        .status(200)
        .json(
            new ApiResponse(200, comments, "Comments fetched successfully")
        );
});

/**
 * @route PUT /api/v1/comments/:commentId
 * @description Update a comment
 * @access Private (Only the comment owner can update)
 */
const updateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;

    // Validate content
    if (!content) {
        throw new ApiError(400, "Content is required");
    }

    // Validate commentId
    if (!commentId) {
        throw new ApiError(400, "Comment ID is required");
    }

    // Check if commentId is valid
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new ApiError(400, "Invalid comment ID");
    }

    // Find comment
    const comment = await Comment.findById(commentId);

    // Check if comment exists
    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    // Check if user is the owner of the comment
    if (comment.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this comment");
    }

    // Update comment
    comment.content = content;
    await comment.save();

    return res
        .status(200)
        .json(new ApiResponse(200, comment, "Comment updated successfully"));
});

/**
 * @route DELETE /api/v1/comments/:commentId
 * @description Delete a comment
 * @access Private (Only the comment owner can delete)
 */
const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    // Validate commentId
    if (!commentId) {
        throw new ApiError(400, "Comment ID is required");
    }

    // Check if commentId is valid
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new ApiError(400, "Invalid comment ID");
    }

    // Find comment
    const comment = await Comment.findById(commentId);

    // Check if comment exists
    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    // Check if user is the owner of the comment
    if (comment.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this comment");
    }

    // Delete comment
    await Comment.findByIdAndDelete(commentId);

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Comment deleted successfully"));
});

export { 
    addComment,
    getVideoComments,
    updateComment,
    deleteComment
};
