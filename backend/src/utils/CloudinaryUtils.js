const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});
const uploadFileToCloudinary = async (fileBuffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ resource_type: "auto" }, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      })
      .end(fileBuffer); 
  });
};
// const uploadFileToCloudinary = async(file)=>{
//     const cloudinaryResponse = await cloudinary.uploader.upload(file.path)
//     return cloudinaryResponse
// }
module.exports = { uploadFileToCloudinary };
