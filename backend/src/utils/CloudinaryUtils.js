const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dybin4ift",
  api_key: "365442834899926",
  api_secret: "vV_8onrdCklf0cniqcnrnlZcAX0",
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
