import { Router } from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    updateAvatar,
    updateCoverImage,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1,
        },
        {
            name: "coverImage",
            maxCount: 1,
        },
    ]),
    registerUser
);

router.route("/login").post(upload.none(), loginUser);

router.route("/logout").post(verifyJWT, logoutUser);

router.route("/updateAvatar").patch(
    verifyJWT,
    upload.single("avatar"),
    updateAvatar
);

router.route("/cover-image").patch(
    verifyJWT,
    upload.single("coverImage"),
    updateCoverImage
);

export default router;
