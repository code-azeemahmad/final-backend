// future proof reuseable code
import { v2 as cloudinary } from "cloudinary";
import fs from 'fs';
import "dotenv/config";

cloudinary.config({
  cloud_name: `${process.env.CLOUDINARY_CLOUD_NAME}`,
  api_key: `${process.env.CLOUDINARY_API_KEY}`,
  api_secret: `${process.env.CLOUDINARY_API_SECRET}`,
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath)  return null;
        // upload file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        });
        // file has been uploaded successfully
        fs.unlinkSync(localFilePath);
        console.log("File has been uploaded successfully on cloudinary", response.url);
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath);   // remove the locally saved temporary file as the upload operation got failed
        return null;
    }
}

export {uploadOnCloudinary};

// strategy
/*
upload file from user through multer, cloudinary is just a service like aws
1) take file from user and place it temporarily on our local server
2) take file from local storage using cloudinary and upload it on server
requires 2 steps, production grade, have a second chance of upload
*/