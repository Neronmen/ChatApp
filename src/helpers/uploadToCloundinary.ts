import { v2 as cloudinary } from "cloudinary";
import * as streamifier from "streamifier";
import * as dotenv from "dotenv";
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET,
});

let streamUpload = (buffer) => {
    return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream((error, result) => {
            if (result) {
                console.log(result)
                resolve(result);
            } else {
                console.log(error)
                reject(error);
            }
        });
        streamifier.createReadStream(buffer).pipe(stream);
    });
};


export const uploadToCloudinary = async (buffer) => {
    let result: any = await streamUpload(buffer);
    return result.secure_url;
};


