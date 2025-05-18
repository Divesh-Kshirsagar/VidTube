/*
id (string pk)
watchHistory (ObjectId[] videos)
username (string)
email (string)
password (string)
fullName (string)
avatar (string)
coverImage (string)
refreshToken (string)
createdAt (Date)
updatedAt (Date)
*/

import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
    {
        username: {
            type: String,
            lowercase: true,
            trim: true,
            unique: true,
            required: true,
            index: true,
        },
        email: {
            type: String,
            lowercase: true,
            trim: true,
            unique: true,
            required: true,
        },
        fullname: {
            type: String,
            required: true,
        },
        avatar: {
            type: String,
            required: true,
        },
        coverimage: {
            type: String,
        },
        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video",
            },
        ],
        password: [String, "Password is required!"],
        refreshToken: {
            type: String,
        },
    },
    { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
