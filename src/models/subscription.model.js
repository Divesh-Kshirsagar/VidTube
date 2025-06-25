/*
id (string pk)
subscriber (ObjectId users)
channel (ObjectId users)
createdAt (Date)
updatedAt (Date) 
*/

import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new Schema(
    {        channel: {
            type: Schema.Types.ObjectId,
            ref: "User", //The channel Subscribing to 
            required: true
        },
        subscriber: {
            type: Schema.Types.ObjectId,
            ref: "User", // The person subscribing
            required: true
        },
    },
    { timestamps: true }
);

export const Subscription = mongoose.model("Subscription", subscriptionSchema);

