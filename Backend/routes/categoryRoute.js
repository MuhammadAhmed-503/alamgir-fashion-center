import express from "express";
import adminAuth from "../middleware/adminAuth.js";
import {
  addSubCategory,
  createCategory,
  deleteCategory,
  getPublicCategories,
  removeSubCategory,
} from "../controllers/categoryController.js";

const categoryRouter = express.Router();

categoryRouter.get("/public", getPublicCategories);
categoryRouter.post("/create", adminAuth, createCategory);
categoryRouter.post("/add-sub", adminAuth, addSubCategory);
categoryRouter.post("/remove-sub", adminAuth, removeSubCategory);
categoryRouter.post("/delete", adminAuth, deleteCategory);

export default categoryRouter;

