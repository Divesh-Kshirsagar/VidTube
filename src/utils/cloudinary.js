import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";


dotenv.config({ path: "src/.env" });

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        });
        // file has been uploaded successfull
        console.log("file is uploaded on cloudinary ", response.url);
        fs.unlinkSync(localFilePath);
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath); // remove the locally saved temporary file as the upload operation got failed
        return null;
    }
};

/**
 * Delete a file from Cloudinary
 * @param {string} publicId - The public ID of the file to delete
 * @param {string} resourceType - The resource type ('image' or 'video')
 * @returns {Object|null} - Response from Cloudinary or null if an error occurs
 */
const deleteFromCloudinary = async (publicId, resourceType = "image") => {
    try {
        if (!publicId) {
            console.error("No public ID provided for deletion");
            return null;
        }
        
        console.log(`Attempting to delete ${resourceType} with ID: ${publicId}`);
        
        const response = await cloudinary.uploader.destroy(publicId, {
            resource_type: resourceType
        });
        
        console.log(`Deletion response:`, response);
        return response;
    } catch (error) {
        console.error(`Error deleting ${resourceType} from Cloudinary:`, error);
        return null;
    }
}

export { uploadOnCloudinary, deleteFromCloudinary };
