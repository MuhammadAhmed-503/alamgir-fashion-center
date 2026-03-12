import categoryModel from "../models/categoryModel.js";

const normalize = (value) => String(value || "").trim();
const normalizeLower = (value) => normalize(value).toLowerCase();

const ensureDefaults = async () => {
  const count = await categoryModel.countDocuments();
  if (count > 0) return;

  await categoryModel.create([
    {
      name: "Men",
      nameLower: "men",
      subCategories: [
        { name: "Topwear", nameLower: "topwear" },
        { name: "Bottomwear", nameLower: "bottomwear" },
        { name: "Winterwear", nameLower: "winterwear" },
      ],
    },
    {
      name: "Women",
      nameLower: "women",
      subCategories: [
        { name: "Topwear", nameLower: "topwear" },
        { name: "Bottomwear", nameLower: "bottomwear" },
        { name: "Winterwear", nameLower: "winterwear" },
      ],
    },
    {
      name: "Kids",
      nameLower: "kids",
      subCategories: [
        { name: "Topwear", nameLower: "topwear" },
        { name: "Bottomwear", nameLower: "bottomwear" },
        { name: "Winterwear", nameLower: "winterwear" },
      ],
    },
  ]);
};

const getPublicCategories = async (req, res) => {
  try {
    await ensureDefaults();
    const categories = await categoryModel.find({}).sort({ nameLower: 1 });
    res.json({
      success: true,
      categories: categories.map((c) => ({
        _id: c._id,
        name: c.name,
        subCategories: (c.subCategories || []).map((s) => s.name),
      })),
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const name = normalize(req.body?.name);
    if (!name) return res.json({ success: false, message: "Category name is required" });

    const nameLower = normalizeLower(name);
    const exists = await categoryModel.findOne({ nameLower });
    if (exists) {
      return res.json({ success: false, message: "Category already exists" });
    }

    const category = await categoryModel.create({
      name,
      nameLower,
      subCategories: [],
    });

    res.json({
      success: true,
      message: "Category created",
      category: { _id: category._id, name: category.name, subCategories: [] },
    });
  } catch (error) {
    console.log(error);
    const message =
      error?.code === 11000 ? "Category already exists" : error.message;
    res.json({ success: false, message });
  }
};

const addSubCategory = async (req, res) => {
  try {
    const subCategoryName = normalize(req.body?.name);
    if (!subCategoryName) {
      return res.json({ success: false, message: "Sub category name is required" });
    }

    const categoryId = req.body?.categoryId;
    const categoryName = req.body?.categoryName;

    const query = categoryId
      ? { _id: categoryId }
      : { nameLower: normalizeLower(categoryName) };

    const category = await categoryModel.findOne(query);
    if (!category) {
      return res.json({ success: false, message: "Category not found" });
    }

    const subLower = normalizeLower(subCategoryName);
    const exists = (category.subCategories || []).some(
      (s) => s.nameLower === subLower
    );
    if (exists) {
      return res.json({ success: false, message: "Sub category already exists" });
    }

    category.subCategories.push({ name: subCategoryName, nameLower: subLower });
    await category.save();

    res.json({
      success: true,
      message: "Sub category added",
      category: {
        _id: category._id,
        name: category.name,
        subCategories: category.subCategories.map((s) => s.name),
      },
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const removeSubCategory = async (req, res) => {
  try {
    const categoryId = req.body?.categoryId;
    const name = normalize(req.body?.name);
    if (!categoryId || !name) {
      return res.json({ success: false, message: "categoryId and name are required" });
    }

    const category = await categoryModel.findById(categoryId);
    if (!category) return res.json({ success: false, message: "Category not found" });

    const nameLower = normalizeLower(name);
    category.subCategories = (category.subCategories || []).filter(
      (s) => s.nameLower !== nameLower
    );
    await category.save();

    res.json({
      success: true,
      message: "Sub category removed",
      category: {
        _id: category._id,
        name: category.name,
        subCategories: category.subCategories.map((s) => s.name),
      },
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const id = req.body?.id;
    if (!id) return res.json({ success: false, message: "id is required" });
    await categoryModel.findByIdAndDelete(id);
    res.json({ success: true, message: "Category deleted" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  getPublicCategories,
  createCategory,
  addSubCategory,
  removeSubCategory,
  deleteCategory,
};

