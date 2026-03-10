const Joi = require("joi");
const { Artisan, Client } = require("../models");
const cloudinary = require("../config/cloudinary");

async function updateUserProfile(req, res, next) {
  const user = req.user;
  const {contactAddress, city, state } = req.body;

  if (!contactAddress && !city && !state ) {
    return res.status(400).json({
      success: false,
      message: "Details are required",
    });
  }

  const requestSchema = Joi.object({
    contactAddress: Joi.string().min(3).max(30).optional(),
  });
  const validateInput = {};
  if (contactAddress !== undefined)
    validateInput.contactAddress = contactAddress;

  const { error } = requestSchema.validate(validateInput, { abortEarly: true });

  if (error) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      error: error.details[0].message,
    });
  }

  try {
    if (contactAddress !== undefined) user.contactAddress = contactAddress;
    if (city !== undefined) user.city = city;
    if (state !== undefined) user.state = state;
    await user.save();

    const userDetails = user.toJSON();
    delete userDetails.password;

    return res.status(200).json({
      success: true,
      message: "Profile succesfully updated",
      userDetails,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
}

async function updateProfileAvatar(req, res) {
  const user = req.user;

  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No file provided",
    });
  }

  try {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "avatars" },
      async (error, result) => {
        if (error) {
          console.log(error);
          return res.status(500).json({
            success: false,
            message: "Upload failed",
          });
        }
        user.photoURL = result.secure_url;
        await user.save();
        return res.status(200).json({
          success: true,
          message: "Profile picture succesfully uploaded",
          photoURL: result.secure_url,
        });
      }
    );
    uploadStream.end(req.file.buffer);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Upload failed",
    });
  }
}
module.exports = {
  updateUserProfile,
  updateProfileAvatar,
};
