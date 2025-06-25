import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middlewares/error.middleware.js";

const app = express();

// Common Middlewares
app.use(express.json({ limit: "16kb" }));
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("../public"));
app.use(cookieParser())


// Import Routes
import healthCheckRouter from "./routes/healthCheck.router.js";
import userRouter from "./routes/user.route.js";
import commentRouter from "./routes/comment.router.js";
import likeRouter from "./routes/like.router.js";
import tweetRouter from "./routes/tweet.router.js";
import subscriptionRouter from "./routes/subscription.router.js";
import playlistRouter from "./routes/playlist.router.js";
import videoRouter from "./routes/video.router.js";

// Routes
app.use("/api/v1/healthcheck", healthCheckRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/likes", likeRouter);
app.use("/api/v1/tweets", tweetRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);
app.use("/api/v1/playlists", playlistRouter);
app.use("/api/v1/videos", videoRouter);

// Error middleware (must be after all routes)
app.use(errorMiddleware);

export default app;
