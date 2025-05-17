import express, { urlencoded } from "express";
import cors from "cors";

const app = express();

// Common Middlewares
app.use(express.json({ limit: "16kb" }));
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("../public"));



// Import Routes
import healthCheckRouter from "./routes/healthCheck.router.js";

// Routes
app.use("/api/v1/healthcheck", healthCheckRouter);


export default app;
