const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const { uploadOnCloudinary, deleteFromCloudinary } = require("../utils/cloudinary");

const uploadSingleFile = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "Please upload a file");
  }

  const folder = req.body.folder || "ds_portfolio";
  const result = await uploadOnCloudinary(req.file.path, folder);

  if (!result) {
    throw new ApiError(500, "Error uploading file to Cloudinary");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        url: result.secure_url,
        public_id: result.public_id,
        format: result.format,
        resource_type: result.resource_type,
        bytes: result.bytes,
      },
      "File uploaded successfully"
    )
  );
});

const uploadMultipleFiles = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    throw new ApiError(400, "Please upload at least one file");
  }

  const folder = req.body.folder || "ds_portfolio";
  const uploadPromises = req.files.map((file) => uploadOnCloudinary(file.path, folder));
  const results = await Promise.all(uploadPromises);

  const formattedResults = results.map((result) => ({
    url: result.secure_url,
    public_id: result.public_id,
    format: result.format,
    resource_type: result.resource_type,
    bytes: result.bytes,
  }));

  return res.status(200).json(
    new ApiResponse(200, formattedResults, "Files uploaded successfully")
  );
});

const deleteFile = asyncHandler(async (req, res) => {
  const publicId = req.params[0] || req.params.publicId || req.body.publicId || req.query.publicId;
  const resourceType = req.body.resourceType || req.query.resourceType || "image";

  if (!publicId) {
    throw new ApiError(400, "Public ID is required to delete an asset");
  }

  const result = await deleteFromCloudinary(publicId, resourceType);

  return res.status(200).json(
    new ApiResponse(200, result, "File deleted from Cloudinary successfully")
  );
});

module.exports = {
  uploadSingleFile,
  uploadMultipleFiles,
  deleteFile,
};
