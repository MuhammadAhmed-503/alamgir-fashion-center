import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    heroImageUrl: { type: String, default: "" },
    logoUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

const settingsModel =
  mongoose.models.Settings || mongoose.model("Settings", settingsSchema);

export default settingsModel;
