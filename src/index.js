import app from "./app.js";
import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config({ path: "src/.env" });

const port = process.env.PORT || 8001;

connectDB()
    .then(
        app.listen(port, () => {
            console.log(`Sever started at port number ${port}`);
        })
    )
    .catch((err) => {
        console.log("MongoDB connection failed!", err);
    });
