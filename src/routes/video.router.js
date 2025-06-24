import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
} from "../controllers/video.controller.js";

const router = Router();

/**
 * Public routes - accessible without authentication
 */
// Get all published videos with filtering and pagination
router.get("/", getAllVideos);

// Get video details by ID
router.get("/:videoId", getVideoById);

/**
 * Protected routes - require authentication
 */
// Upload and publish a new video
router.post(
    "/",
    verifyJWT,
    upload.fields([
        {
            name: "videoFile",
            maxCount: 1,
        },
        {
            name: "thumbnail",
            maxCount: 1,
        },
    ]),
    publishAVideo
);

// Update video details
router.patch(
    "/:videoId", 
    verifyJWT, 
    upload.single("thumbnail"),
    updateVideo
);

// Delete a video
router.delete("/:videoId", verifyJWT, deleteVideo);

// Toggle video publish status
router.patch("/toggle/publish/:videoId", verifyJWT, togglePublishStatus);

export default router;
