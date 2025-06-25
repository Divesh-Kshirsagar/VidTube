import { Router } from "express";
import { 
    addComment, 
    getVideoComments, 
    updateComment, 
    deleteComment 
} from "../controllers/comment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Public routes
router.get("/:videoId", getVideoComments);

// Protected routes
router.post("/:videoId", verifyJWT, addComment);
router.put("/:commentId", verifyJWT, updateComment);
router.delete("/:commentId", verifyJWT, deleteComment);

export default router;
