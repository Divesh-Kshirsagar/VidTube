import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Playlist } from "../models/playlist.model.js";
import { Video } from "../models/video.model.js";
import mongoose from "mongoose";

/**
 * @route POST /api/v1/playlists
 * @description Create a new playlist
 * @access Private (User must be logged in)
 */
const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body;

    // Validate name
    if (!name) {
        throw new ApiError(400, "Name is required");
    }

    // Create playlist
    const playlist = await Playlist.create({
        name,
        description,
        owner: req.user._id,
        videos: [],
    });

    return res
        .status(201)
        .json(new ApiResponse(201, playlist, "Playlist created successfully"));
});

/**
 * @route GET /api/v1/playlists
 * @description Get all playlists of the logged in user
 * @access Private (User must be logged in)
 */
const getUserPlaylists = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    const playlistsAggregate = Playlist.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(req.user._id),
            },
        },
        {
            $lookup: {
                from: "videos",
                localField: "videos",
                foreignField: "_id",
                as: "videos",
            },
        },
        {
            $addFields: {
                videosCount: { $size: "$videos" },
                videos: { $slice: ["$videos", 0, 5] }, // Get first 5 videos for preview
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

    const playlists = await Playlist.aggregatePaginate(
        playlistsAggregate,
        options
    );

    return res
        .status(200)
        .json(
            new ApiResponse(200, playlists, "User playlists fetched successfully")
        );
});

/**
 * @route GET /api/v1/playlists/:playlistId
 * @description Get a playlist by ID
 * @access Public or Private (depends on the owner's settings)
 */
const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;

    // Validate playlistId
    if (!playlistId) {
        throw new ApiError(400, "Playlist ID is required");
    }

    // Check if playlistId is valid
    if (!mongoose.Types.ObjectId.isValid(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID");
    }

    const playlist = await Playlist.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(playlistId),
            },
        },
        {
            $lookup: {
                from: "videos",
                localField: "videos",
                foreignField: "_id",
                as: "videos",
                pipeline: [
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
                ],
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
                videosCount: { $size: "$videos" },
            },
        },
    ]);

    if (!playlist || playlist.length === 0) {
        throw new ApiError(404, "Playlist not found");
    }

    // Check if user is the owner of the playlist
    if (playlist[0].owner._id.toString() !== req.user?._id?.toString()) {
        // For future: Check if playlist is public/private
        // For now, all playlists are accessible
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, playlist[0], "Playlist fetched successfully")
        );
});

/**
 * @route GET /api/v1/playlists/user/:userId
 * @description Get all playlists of a user
 * @access Public
 */
const getUserPlaylistsByUserId = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // Validate userId
    if (!userId) {
        throw new ApiError(400, "User ID is required");
    }

    // Check if userId is valid
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new ApiError(400, "Invalid user ID");
    }

    const playlistsAggregate = Playlist.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId),
            },
        },
        {
            $lookup: {
                from: "videos",
                localField: "videos",
                foreignField: "_id",
                as: "videos",
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
                videosCount: { $size: "$videos" },
                videos: { $slice: ["$videos", 0, 5] }, // Get first 5 videos for preview
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

    const playlists = await Playlist.aggregatePaginate(
        playlistsAggregate,
        options
    );

    return res
        .status(200)
        .json(
            new ApiResponse(200, playlists, "User playlists fetched successfully")
        );
});

/**
 * @route PUT /api/v1/playlists/:playlistId
 * @description Update a playlist
 * @access Private (Only the playlist owner can update)
 */
const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    const { name, description } = req.body;

    // Validate playlistId
    if (!playlistId) {
        throw new ApiError(400, "Playlist ID is required");
    }

    // Check if playlistId is valid
    if (!mongoose.Types.ObjectId.isValid(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID");
    }

    // Validate name
    if (!name) {
        throw new ApiError(400, "Name is required");
    }

    // Find playlist
    const playlist = await Playlist.findById(playlistId);

    // Check if playlist exists
    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    // Check if user is the owner of the playlist
    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this playlist");
    }

    // Update playlist
    playlist.name = name;
    playlist.description = description;
    await playlist.save();

    return res
        .status(200)
        .json(new ApiResponse(200, playlist, "Playlist updated successfully"));
});

/**
 * @route DELETE /api/v1/playlists/:playlistId
 * @description Delete a playlist
 * @access Private (Only the playlist owner can delete)
 */
const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;

    // Validate playlistId
    if (!playlistId) {
        throw new ApiError(400, "Playlist ID is required");
    }

    // Check if playlistId is valid
    if (!mongoose.Types.ObjectId.isValid(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID");
    }

    // Find playlist
    const playlist = await Playlist.findById(playlistId);

    // Check if playlist exists
    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    // Check if user is the owner of the playlist
    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this playlist");
    }

    // Delete playlist
    await Playlist.findByIdAndDelete(playlistId);

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Playlist deleted successfully"));
});

/**
 * @route POST /api/v1/playlists/:playlistId/videos/:videoId
 * @description Add a video to a playlist
 * @access Private (Only the playlist owner can add videos)
 */
const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;

    // Validate playlistId
    if (!playlistId) {
        throw new ApiError(400, "Playlist ID is required");
    }

    // Check if playlistId is valid
    if (!mongoose.Types.ObjectId.isValid(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID");
    }

    // Validate videoId
    if (!videoId) {
        throw new ApiError(400, "Video ID is required");
    }

    // Check if videoId is valid
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    // Find playlist
    const playlist = await Playlist.findById(playlistId);

    // Check if playlist exists
    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    // Check if user is the owner of the playlist
    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(
            403,
            "You are not authorized to add videos to this playlist"
        );
    }

    // Check if video exists
    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    // Check if video is already in the playlist
    if (playlist.videos.includes(videoId)) {
        throw new ApiError(400, "Video is already in the playlist");
    }

    // Add video to playlist
    playlist.videos.push(videoId);
    await playlist.save();

    return res
        .status(200)
        .json(
            new ApiResponse(200, playlist, "Video added to playlist successfully")
        );
});

/**
 * @route DELETE /api/v1/playlists/:playlistId/videos/:videoId
 * @description Remove a video from a playlist
 * @access Private (Only the playlist owner can remove videos)
 */
const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;

    // Validate playlistId
    if (!playlistId) {
        throw new ApiError(400, "Playlist ID is required");
    }

    // Check if playlistId is valid
    if (!mongoose.Types.ObjectId.isValid(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID");
    }

    // Validate videoId
    if (!videoId) {
        throw new ApiError(400, "Video ID is required");
    }

    // Check if videoId is valid
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    // Find playlist
    const playlist = await Playlist.findById(playlistId);

    // Check if playlist exists
    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    // Check if user is the owner of the playlist
    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(
            403,
            "You are not authorized to remove videos from this playlist"
        );
    }

    // Check if video is in the playlist
    if (!playlist.videos.includes(videoId)) {
        throw new ApiError(400, "Video is not in the playlist");
    }

    // Remove video from playlist
    playlist.videos = playlist.videos.filter(
        (video) => video.toString() !== videoId
    );
    await playlist.save();

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                playlist,
                "Video removed from playlist successfully"
            )
        );
});

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    getUserPlaylistsByUserId,
    updatePlaylist,
    deletePlaylist,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
};
