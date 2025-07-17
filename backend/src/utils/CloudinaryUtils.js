const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dybin4ift",
  api_key: "",
  api_secret: "",
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
