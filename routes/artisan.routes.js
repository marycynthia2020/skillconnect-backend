const express = require("express");
const router = express.Router();
const {getAllArtisans, getASingleArtisanById, updateArtisanDetails, } = require("../controllers/artisan.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.patch("/me", authMiddleware, updateArtisanDetails)
router.get("/", getAllArtisans);
router.get("/:id", getASingleArtisanById)

module.exports = router;
