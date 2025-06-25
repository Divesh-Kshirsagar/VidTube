import { Router } from "express";
import { 
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    getUserPlaylistsByUserId,
    updatePlaylist,
    deletePlaylist,
    addVideoToPlaylist,
    removeVideoFromPlaylist 
} from "../controllers/playlist.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Public routes
router.get("/:playlistId", getPlaylistById);
router.get("/user/:userId", getUserPlaylistsByUserId);

// Protected routes
router.post("/", verifyJWT, createPlaylist);
router.get("/", verifyJWT, getUserPlaylists);
router.put("/:playlistId", verifyJWT, updatePlaylist);
router.delete("/:playlistId", verifyJWT, deletePlaylist);
router.post("/:playlistId/videos/:videoId", verifyJWT, addVideoToPlaylist);
router.delete("/:playlistId/videos/:videoId", verifyJWT, removeVideoFromPlaylist);

export default router;
