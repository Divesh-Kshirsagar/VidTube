import { ApiError } from "../utils/ApiError.js";

/**
 * Error middleware to handle all errors in the application
 * This middleware is used to handle errors thrown by the controllers
 * It returns a consistent error response format to the client
 */
const errorMiddleware = (err, req, res, next) => {
    // Default values for error response
    let statusCode = err.statusCode || 500;
    let message = err.message || "Something went wrong";
    let errors = err.errors || [];

    // Handle specific error types
    if (err.name === "ValidationError") {
        // Mongoose validation error
        statusCode = 400;
        const validationErrors = Object.values(err.errors).map(error => error.message);
        message = "Validation Error";
        errors = validationErrors;
    } else if (err.name === "CastError") {
        // Mongoose cast error (invalid ObjectId)
        statusCode = 400;
        message = `Invalid ${err.path}: ${err.value}`;
    } else if (err.code === 11000) {
        // MongoDB duplicate key error
        statusCode = 409;
        message = "Duplicate value error";
        const field = Object.keys(err.keyValue)[0];
        errors = [`${field} already exists`];
    }

    // Create ApiError instance
    const apiError = new ApiError(
        statusCode,
        message,
        errors,
        err.stack
    );

    // Return JSON response
    return res.status(statusCode).json({
        success: false,
        message: apiError.message,
        errors: apiError.errors,
        stack: process.env.NODE_ENV === "development" ? apiError.stack : undefined
    });
};

export { errorMiddleware };
