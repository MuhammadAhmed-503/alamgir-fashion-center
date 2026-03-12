import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    nameLower: { type: String, required: true },
  },
  { _id: false }
);

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    nameLower: { type: String, required: true, unique: true },
    subCategories: { type: [subCategorySchema], default: [] },
  },
  { timestamps: true }
);

const categoryModel =
  mongoose.models.Category || mongoose.model("Category", categorySchema);

export default categoryModel;
