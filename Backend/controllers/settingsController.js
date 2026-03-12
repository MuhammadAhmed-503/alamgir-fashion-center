import { v2 as cloudinary } from "cloudinary";
import settingsModel from "../models/settingsModel.js";

const SETTINGS_KEY = "global";

const getPublicSettings = async (req, res) => {
  try {
    let settings = await settingsModel.findOne({ key: SETTINGS_KEY });
    if (!settings) {
      settings = await settingsModel.create({ key: SETTINGS_KEY });
    }

    res.json({
      success: true,
      settings: { 
        heroImageUrl: settings.heroImageUrl || "",
        logoUrl: settings.logoUrl || ""
      },
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const updateHeroImage = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.json({ success: false, message: "Hero image is required" });
    }

    const uploadResult = await cloudinary.uploader.upload(file.path, {
      resource_type: "image",
      folder: "afc/hero",
    });

    const heroImageUrl = uploadResult.secure_url;

    const settings = await settingsModel.findOneAndUpdate(
      { key: SETTINGS_KEY },
      { key: SETTINGS_KEY, heroImageUrl },
      { upsert: true, new: true }
    );

    res.json({
      success: true,
      message: "Hero image updated",
      settings: { 
        heroImageUrl: settings.heroImageUrl || "",
        logoUrl: settings.logoUrl || ""
      },
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const updateLogoImage = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.json({ success: false, message: "Logo image is required" });
    }

    const uploadResult = await cloudinary.uploader.upload(file.path, {
      resource_type: "image",
      folder: "afc/logo",
    });

    const logoUrl = uploadResult.secure_url;

    const settings = await settingsModel.findOneAndUpdate(
      { key: SETTINGS_KEY },
      { key: SETTINGS_KEY, logoUrl },
      { upsert: true, new: true }
    );

    res.json({
      success: true,
      message: "Logo image updated",
      settings: { 
        heroImageUrl: settings.heroImageUrl || "",
        logoUrl: settings.logoUrl || ""
      },
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { getPublicSettings, updateHeroImage, updateLogoImage };
