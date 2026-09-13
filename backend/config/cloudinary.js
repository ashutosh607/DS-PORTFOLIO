const { v2: cloudinary } = require("cloudinary");

const cloudName = process.env.CLOUDINARY_CLOUD_NAME ? process.env.CLOUDINARY_CLOUD_NAME.trim() : "";
const apiKey = process.env.CLOUDINARY_API_KEY ? process.env.CLOUDINARY_API_KEY.trim() : "";
const apiSecret = process.env.CLOUDINARY_API_SECRET ? process.env.CLOUDINARY_API_SECRET.trim() : "";

// Only mark as configured if valid non-placeholder credentials are provided
const isCloudinaryConfigured = Boolean(
  cloudName &&
  cloudName !== "demo" &&
  apiKey &&
  apiKey !== "123456789012345" &&
  apiSecret &&
  apiSecret !== "abcdefghijklmnopqrstuvwxyz12"
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
}

module.exports = {
  cloudinary,
  isCloudinaryConfigured,
};
