import { Router } from "express";
import { 
    createTweet,
    getAllTweets,
    getUserTweets,
    updateTweet,
    deleteTweet 
} from "../controllers/tweet.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Public routes
router.get("/", getAllTweets);
router.get("/user/:userId", getUserTweets);

// Protected routes
router.post("/", verifyJWT, createTweet);
router.put("/:tweetId", verifyJWT, updateTweet);
router.delete("/:tweetId", verifyJWT, deleteTweet);

export default router;
