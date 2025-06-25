import { Router } from "express";
import { 
    toggleVideoLike,
    toggleCommentLike,
    toggleTweetLike,
    getVideoLikes,
    getCommentLikes,
    getTweetLikes,
    getLikedVideos 
} from "../controllers/like.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Public routes
router.get("/videos/:videoId", getVideoLikes);
router.get("/comments/:commentId", getCommentLikes);
router.get("/tweets/:tweetId", getTweetLikes);

// Protected routes
router.post("/toggle/video/:videoId", verifyJWT, toggleVideoLike);
router.post("/toggle/comment/:commentId", verifyJWT, toggleCommentLike);
router.post("/toggle/tweet/:tweetId", verifyJWT, toggleTweetLike);
router.get("/user/liked-videos", verifyJWT, getLikedVideos);

export default router;
