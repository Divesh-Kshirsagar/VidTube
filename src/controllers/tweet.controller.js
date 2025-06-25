import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Tweet } from "../models/tweet.model.js";
import { Like } from "../models/like.model.js";
import mongoose from "mongoose";

/**
 * @route POST /api/v1/tweets
 * @description Create a tweet
 * @access Private (User must be logged in)
 */
const createTweet = asyncHandler(async (req, res) => {
    const { content } = req.body;

    // Validate content
    if (!content) {
        throw new ApiError(400, "Content is required");
    }

    // Create tweet
    const tweet = await Tweet.create({
        content,
        owner: req.user._id,
    });

    return res
        .status(201)
        .json(new ApiResponse(201, tweet, "Tweet created successfully"));
});

/**
 * @route GET /api/v1/tweets
 * @description Get all tweets (with pagination)
 * @access Public
 */
const getAllTweets = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    const tweetsAggregate = Tweet.aggregate([
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
                likesCount: { $size: { $ifNull: ["$likes", []] } },
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

    const tweets = await Tweet.aggregatePaginate(tweetsAggregate, options);

    // Check if user has liked each tweet
    if (req.user) {
        const tweetIds = tweets.docs.map((tweet) => tweet._id);
        const userLikes = await Like.find({
            tweet: { $in: tweetIds },
            likedBy: req.user._id,
        });

        const userLikesMap = new Map();
        userLikes.forEach((like) => {
            userLikesMap.set(like.tweet.toString(), true);
        });

        tweets.docs = tweets.docs.map((tweet) => {
            return {
                ...tweet,
                isLiked: userLikesMap.has(tweet._id.toString()),
            };
        });
    }

    return res
        .status(200)
        .json(new ApiResponse(200, tweets, "Tweets fetched successfully"));
});

/**
 * @route GET /api/v1/tweets/user/:userId
 * @description Get all tweets by a user
 * @access Public
 */
const getUserTweets = asyncHandler(async (req, res) => {
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

    const tweetsAggregate = Tweet.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId),
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
                likesCount: { $size: { $ifNull: ["$likes", []] } },
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

    const tweets = await Tweet.aggregatePaginate(tweetsAggregate, options);

    // Check if user has liked each tweet
    if (req.user) {
        const tweetIds = tweets.docs.map((tweet) => tweet._id);
        const userLikes = await Like.find({
            tweet: { $in: tweetIds },
            likedBy: req.user._id,
        });

        const userLikesMap = new Map();
        userLikes.forEach((like) => {
            userLikesMap.set(like.tweet.toString(), true);
        });

        tweets.docs = tweets.docs.map((tweet) => {
            return {
                ...tweet,
                isLiked: userLikesMap.has(tweet._id.toString()),
            };
        });
    }

    return res
        .status(200)
        .json(new ApiResponse(200, tweets, "User tweets fetched successfully"));
});

/**
 * @route PUT /api/v1/tweets/:tweetId
 * @description Update a tweet
 * @access Private (Only the tweet owner can update)
 */
const updateTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    const { content } = req.body;

    // Validate tweetId
    if (!tweetId) {
        throw new ApiError(400, "Tweet ID is required");
    }

    // Check if tweetId is valid
    if (!mongoose.Types.ObjectId.isValid(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID");
    }

    // Validate content
    if (!content) {
        throw new ApiError(400, "Content is required");
    }

    // Find tweet
    const tweet = await Tweet.findById(tweetId);

    // Check if tweet exists
    if (!tweet) {
        throw new ApiError(404, "Tweet not found");
    }

    // Check if user is the owner of the tweet
    if (tweet.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this tweet");
    }

    // Update tweet
    tweet.content = content;
    await tweet.save();

    return res
        .status(200)
        .json(new ApiResponse(200, tweet, "Tweet updated successfully"));
});

/**
 * @route DELETE /api/v1/tweets/:tweetId
 * @description Delete a tweet
 * @access Private (Only the tweet owner can delete)
 */
const deleteTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;

    // Validate tweetId
    if (!tweetId) {
        throw new ApiError(400, "Tweet ID is required");
    }

    // Check if tweetId is valid
    if (!mongoose.Types.ObjectId.isValid(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID");
    }

    // Find tweet
    const tweet = await Tweet.findById(tweetId);

    // Check if tweet exists
    if (!tweet) {
        throw new ApiError(404, "Tweet not found");
    }

    // Check if user is the owner of the tweet
    if (tweet.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this tweet");
    }

    // Delete tweet
    await Tweet.findByIdAndDelete(tweetId);

    // Delete all likes related to this tweet
    await Like.deleteMany({ tweet: tweetId });

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Tweet deleted successfully"));
});

export {
    createTweet,
    getAllTweets,
    getUserTweets,
    updateTweet,
    deleteTweet,
};
