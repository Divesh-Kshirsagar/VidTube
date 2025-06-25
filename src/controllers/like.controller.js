import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Like } from "../models/like.model.js";
import { Video } from "../models/video.model.js";
import { Comment } from "../models/comment.model.js";
import { Tweet } from "../models/tweet.model.js";
import mongoose from "mongoose";

/**
 * @route POST /api/v1/likes/toggle/video/:videoId
 * @description Toggle like on a video
 * @access Private (User must be logged in)
 */
const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    // Validate videoId
    if (!videoId) {
        throw new ApiError(400, "Video ID is required");
    }

    // Check if videoId is valid
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    // Check if video exists
    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    // Check if user has already liked the video
    const existingLike = await Like.findOne({
        video: videoId,
        likedBy: req.user._id,
    });

    if (existingLike) {
        // User has already liked the video, so unlike it
        await Like.findByIdAndDelete(existingLike._id);
        return res
            .status(200)
            .json(new ApiResponse(200, {}, "Video unliked successfully"));
    } else {
        // User has not liked the video, so like it
        const like = await Like.create({
            video: videoId,
            likedBy: req.user._id,
        });
        return res
            .status(201)
            .json(new ApiResponse(201, like, "Video liked successfully"));
    }
});

/**
 * @route POST /api/v1/likes/toggle/comment/:commentId
 * @description Toggle like on a comment
 * @access Private (User must be logged in)
 */
const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    // Validate commentId
    if (!commentId) {
        throw new ApiError(400, "Comment ID is required");
    }

    // Check if commentId is valid
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new ApiError(400, "Invalid comment ID");
    }

    // Check if comment exists
    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    // Check if user has already liked the comment
    const existingLike = await Like.findOne({
        comment: commentId,
        likedBy: req.user._id,
    });

    if (existingLike) {
        // User has already liked the comment, so unlike it
        await Like.findByIdAndDelete(existingLike._id);
        return res
            .status(200)
            .json(new ApiResponse(200, {}, "Comment unliked successfully"));
    } else {
        // User has not liked the comment, so like it
        const like = await Like.create({
            comment: commentId,
            likedBy: req.user._id,
        });
        return res
            .status(201)
            .json(new ApiResponse(201, like, "Comment liked successfully"));
    }
});

/**
 * @route POST /api/v1/likes/toggle/tweet/:tweetId
 * @description Toggle like on a tweet
 * @access Private (User must be logged in)
 */
const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;

    // Validate tweetId
    if (!tweetId) {
        throw new ApiError(400, "Tweet ID is required");
    }

    // Check if tweetId is valid
    if (!mongoose.Types.ObjectId.isValid(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID");
    }

    // Check if tweet exists
    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
        throw new ApiError(404, "Tweet not found");
    }

    // Check if user has already liked the tweet
    const existingLike = await Like.findOne({
        tweet: tweetId,
        likedBy: req.user._id,
    });

    if (existingLike) {
        // User has already liked the tweet, so unlike it
        await Like.findByIdAndDelete(existingLike._id);
        return res
            .status(200)
            .json(new ApiResponse(200, {}, "Tweet unliked successfully"));
    } else {
        // User has not liked the tweet, so like it
        const like = await Like.create({
            tweet: tweetId,
            likedBy: req.user._id,
        });
        return res
            .status(201)
            .json(new ApiResponse(201, like, "Tweet liked successfully"));
    }
});

/**
 * @route GET /api/v1/likes/videos/:videoId
 * @description Get all likes for a video
 * @access Public
 */
const getVideoLikes = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    // Validate videoId
    if (!videoId) {
        throw new ApiError(400, "Video ID is required");
    }

    // Check if videoId is valid
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    // Get likes count
    const likesCount = await Like.countDocuments({
        video: videoId,
    });

    // Check if user has liked the video
    let userLiked = false;
    if (req.user) {
        const userLike = await Like.findOne({
            video: videoId,
            likedBy: req.user._id,
        });
        userLiked = !!userLike;
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                likesCount,
                userLiked,
            },
            "Video likes fetched successfully"
        )
    );
});

/**
 * @route GET /api/v1/likes/comments/:commentId
 * @description Get all likes for a comment
 * @access Public
 */
const getCommentLikes = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    // Validate commentId
    if (!commentId) {
        throw new ApiError(400, "Comment ID is required");
    }

    // Check if commentId is valid
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new ApiError(400, "Invalid comment ID");
    }

    // Get likes count
    const likesCount = await Like.countDocuments({
        comment: commentId,
    });

    // Check if user has liked the comment
    let userLiked = false;
    if (req.user) {
        const userLike = await Like.findOne({
            comment: commentId,
            likedBy: req.user._id,
        });
        userLiked = !!userLike;
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                likesCount,
                userLiked,
            },
            "Comment likes fetched successfully"
        )
    );
});

/**
 * @route GET /api/v1/likes/tweets/:tweetId
 * @description Get all likes for a tweet
 * @access Public
 */
const getTweetLikes = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;

    // Validate tweetId
    if (!tweetId) {
        throw new ApiError(400, "Tweet ID is required");
    }

    // Check if tweetId is valid
    if (!mongoose.Types.ObjectId.isValid(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID");
    }

    // Get likes count
    const likesCount = await Like.countDocuments({
        tweet: tweetId,
    });

    // Check if user has liked the tweet
    let userLiked = false;
    if (req.user) {
        const userLike = await Like.findOne({
            tweet: tweetId,
            likedBy: req.user._id,
        });
        userLiked = !!userLike;
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                likesCount,
                userLiked,
            },
            "Tweet likes fetched successfully"
        )
    );
});

/**
 * @route GET /api/v1/likes/user/liked-videos
 * @description Get all videos liked by the user
 * @access Private (User must be logged in)
 */
const getLikedVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    const likedVideosAggregate = Like.aggregate([
        {
            $match: {
                likedBy: new mongoose.Types.ObjectId(req.user._id),
                video: { $exists: true },
            },
        },
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "video",
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
            $addFields: {
                video: { $arrayElemAt: ["$video", 0] },
            },
        },
        {
            $project: {
                video: 1,
            },
        },
        {
            $replaceRoot: {
                newRoot: "$video",
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

    const likedVideos = await Video.aggregatePaginate(
        likedVideosAggregate,
        options
    );

    return res
        .status(200)
        .json(
            new ApiResponse(200, likedVideos, "Liked videos fetched successfully")
        );
});

export {
    toggleVideoLike,
    toggleCommentLike,
    toggleTweetLike,
    getVideoLikes,
    getCommentLikes,
    getTweetLikes,
    getLikedVideos,
};
