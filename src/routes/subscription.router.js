import { Router } from "express";
import { 
    toggleSubscription,
    getUserSubscribedChannels,
    getChannelSubscribers,
    getChannelSubscribersCount 
} from "../controllers/subscription.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Public routes
router.get("/user/:userId", getUserSubscribedChannels);
router.get("/channel/:channelId", getChannelSubscribers);
router.get("/channel/:channelId/count", getChannelSubscribersCount);

// Protected routes
router.post("/toggle/:channelId", verifyJWT, toggleSubscription);

export default router;
