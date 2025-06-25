import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Subscription } from "../models/subscription.model.js";
import { User } from "../models/users.model.js";
import mongoose from "mongoose";

/**
 * @route POST /api/v1/subscriptions/toggle/:channelId
 * @description Toggle subscription to a channel
 * @access Private (User must be logged in)
 */
const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    // Validate channelId
    if (!channelId) {
        throw new ApiError(400, "Channel ID is required");
    }

    // Check if channelId is valid
    if (!mongoose.Types.ObjectId.isValid(channelId)) {
        throw new ApiError(400, "Invalid channel ID");
    }

    // Check if user is trying to subscribe to themselves
    if (channelId === req.user._id.toString()) {
        throw new ApiError(400, "You cannot subscribe to yourself");
    }

    // Check if channel exists
    const channel = await User.findById(channelId);
    if (!channel) {
        throw new ApiError(404, "Channel not found");
    }

    // Check if user is already subscribed to the channel
    const existingSubscription = await Subscription.findOne({
        channel: channelId,
        subscriber: req.user._id,
    });

    if (existingSubscription) {
        // User is already subscribed, so unsubscribe
        await Subscription.findByIdAndDelete(existingSubscription._id);
        return res
            .status(200)
            .json(new ApiResponse(200, {}, "Unsubscribed successfully"));
    } else {
        // User is not subscribed, so subscribe
        const subscription = await Subscription.create({
            channel: channelId,
            subscriber: req.user._id,
        });
        return res
            .status(201)
            .json(new ApiResponse(201, subscription, "Subscribed successfully"));
    }
});

/**
 * @route GET /api/v1/subscriptions/user/:userId
 * @description Get list of channels a user has subscribed to
 * @access Public
 */
const getUserSubscribedChannels = asyncHandler(async (req, res) => {
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

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const subscriptionsAggregate = Subscription.aggregate([
        {
            $match: {
                subscriber: new mongoose.Types.ObjectId(userId),
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "channel",
                foreignField: "_id",
                as: "channel",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            fullName: 1,
                            avatar: 1,
                            coverImage: 1,
                        },
                    },
                ],
            },
        },
        {
            $addFields: {
                channel: { $arrayElemAt: ["$channel", 0] },
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

    const subscriptions = await Subscription.aggregatePaginate(
        subscriptionsAggregate,
        options
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            subscriptions,
            "User subscribed channels fetched successfully"
        )
    );
});

/**
 * @route GET /api/v1/subscriptions/channel/:channelId
 * @description Get list of subscribers of a channel
 * @access Public
 */
const getChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // Validate channelId
    if (!channelId) {
        throw new ApiError(400, "Channel ID is required");
    }

    // Check if channelId is valid
    if (!mongoose.Types.ObjectId.isValid(channelId)) {
        throw new ApiError(400, "Invalid channel ID");
    }

    // Check if channel exists
    const channel = await User.findById(channelId);
    if (!channel) {
        throw new ApiError(404, "Channel not found");
    }

    const subscribersAggregate = Subscription.aggregate([
        {
            $match: {
                channel: new mongoose.Types.ObjectId(channelId),
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "subscriber",
                foreignField: "_id",
                as: "subscriber",
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
                subscriber: { $arrayElemAt: ["$subscriber", 0] },
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

    const subscribers = await Subscription.aggregatePaginate(
        subscribersAggregate,
        options
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            subscribers,
            "Channel subscribers fetched successfully"
        )
    );
});

/**
 * @route GET /api/v1/subscriptions/channel/:channelId/count
 * @description Get the count of subscribers of a channel
 * @access Public
 */
const getChannelSubscribersCount = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    // Validate channelId
    if (!channelId) {
        throw new ApiError(400, "Channel ID is required");
    }

    // Check if channelId is valid
    if (!mongoose.Types.ObjectId.isValid(channelId)) {
        throw new ApiError(400, "Invalid channel ID");
    }

    // Check if channel exists
    const channel = await User.findById(channelId);
    if (!channel) {
        throw new ApiError(404, "Channel not found");
    }

    // Get subscribers count
    const subscribersCount = await Subscription.countDocuments({
        channel: channelId,
    });

    // Check if user is subscribed to the channel
    let isSubscribed = false;
    if (req.user) {
        const subscription = await Subscription.findOne({
            channel: channelId,
            subscriber: req.user._id,
        });
        isSubscribed = !!subscription;
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                subscribersCount,
                isSubscribed,
            },
            "Channel subscribers count fetched successfully"
        )
    );
});

export {
    toggleSubscription,
    getUserSubscribedChannels,
    getChannelSubscribers,
    getChannelSubscribersCount,
};
