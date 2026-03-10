const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const {
  updateProfileAvatar,
  updateUserProfile,
} = require("../controllers/user.controller");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

router.patch("/me", authMiddleware, updateUserProfile);
router.post(
  "/me/avatar",
  authMiddleware,
  upload.single("avatar"),
  updateProfileAvatar
);

module.exports = router;
