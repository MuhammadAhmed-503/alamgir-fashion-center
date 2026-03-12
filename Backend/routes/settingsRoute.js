import express from "express";
import adminAuth from "../middleware/adminAuth.js";
import upload from "../middleware/multer.js";
import {
  getPublicSettings,
  updateHeroImage,
  updateLogoImage,
} from "../controllers/settingsController.js";

const settingsRouter = express.Router();

settingsRouter.get("/public", getPublicSettings);
settingsRouter.post("/hero-image", adminAuth, upload.single("image"), updateHeroImage);
settingsRouter.post("/logo-image", adminAuth, upload.single("image"), updateLogoImage);

export default settingsRouter;
