import {v2 as cloudinary} from "cloudinary";
import fs from "fs";
          
// cloudinary.config({ 
//   cloud_name: process.env.CLOUDINARY_NAME, 
//   api_key: process.env.CLOUDINARY_API_KEY, 
//   api_secret: process.env.CLOUDINARY_SECRET_API
// });

// import {v2 as cloudinary} from 'cloudinary';
          
cloudinary.config({ 
  cloud_name: 'dldfcyzdc', 
  api_key: '628497147953721', 
  api_secret: '4XdDFQeDVPIdKQFJeMrBUnxzodY' 
});



const uploadFile = async (localFilePath) => {
    try {
        if(!localFilePath) {
             console.log(localFilePath); 
             console.error("No local file path")
            return null
        }
        const response = await cloudinary.uploader.upload(localFilePath, {resource_type: "auto"});  
        // console.log("File uploaded on cloudinary successfully", response.url, response)
        // console.log(response)
        fs.unlinkSync(localFilePath)
        return response;  

    } catch (error) {
        console.error('Error uploading file to Cloudinary:', error.message);
        // console.log(error +" cloudinary file error")
        fs.unlinkSync(localFilePath)
        return null
    }
}

export { uploadFile }