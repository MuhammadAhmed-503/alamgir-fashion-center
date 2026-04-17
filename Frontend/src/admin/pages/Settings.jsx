import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../config";
import { useTheme } from "../../context/ThemeContext";

const Settings = ({ token }) => {
  const { isDarkMode } = useTheme();
  const [heroImageUrl, setHeroImageUrl] = useState("");
  const [heroFile, setHeroFile] = useState(null);
  const [logoUrl, setLogoUrl] = useState("");
  const [logoFile, setLogoFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [newSubCategoryName, setNewSubCategoryName] = useState("");

  const heroPreviewUrl = useMemo(() => {
    if (heroFile) return URL.createObjectURL(heroFile);
    return heroImageUrl || "";
  }, [heroFile, heroImageUrl]);
  const logoPreviewUrl = useMemo(() => {
    if (logoFile) return URL.createObjectURL(logoFile);
    return logoUrl || "";
  }, [logoFile, logoUrl]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        if (!backendUrl) {
          toast.error("Backend URL is missing. Set VITE_BACKEND_URL in Admin .env");
          return;
        }
        const response = await axios.get(backendUrl + "/api/settings/public");
        if (response.data?.success) {
          setHeroImageUrl(response.data.settings?.heroImageUrl || "");
          setLogoUrl(response.data.settings?.logoUrl || "");
        } else {
          toast.error(response.data?.message || "Failed to load settings");
        }
      } catch (error) {
        const status = error?.response?.status;
        const message =
          status === 404
            ? "Settings API not found. Restart/update backend (GET /api/settings/public)."
            : error?.response?.data?.message || error.message;
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const refreshCategories = async () => {
    if (!backendUrl) return;
    try {
      setCategoriesLoading(true);
      const response = await axios.get(backendUrl + "/api/category/public");
      if (response.data?.success) {
        const items = response.data.categories || [];
        setCategories(items);
        setSelectedCategoryId((prev) => prev || items?.[0]?._id || "");
      } else {
        toast.error(response.data?.message || "Failed to load categories");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setCategoriesLoading(false);
    }
  };

  useEffect(() => {
    refreshCategories();
  }, []);

  useEffect(() => {
    if (!heroFile) return;
    const url = URL.createObjectURL(heroFile);
    return () => URL.revokeObjectURL(url);
  }, [heroFile]);
  useEffect(() => {
    if (!logoFile) return;
    const url = URL.createObjectURL(logoFile);
    return () => URL.revokeObjectURL(url);
  }, [logoFile]);

  const onSaveHero = async (e) => {
    e.preventDefault();
    if (!heroFile) {
      toast.error("Please choose an image");
      return;
    }

    try {
      setSaving(true);
      if (!backendUrl) {
        toast.error("Backend URL is missing. Set VITE_BACKEND_URL in Admin .env");
        return;
      }
      const formData = new FormData();
      formData.append("image", heroFile);
      const response = await axios.post(
        backendUrl + "/api/settings/hero-image",
        formData,
        { headers: { token } }
      );

      if (response.data?.success) {
        setHeroImageUrl(response.data.settings?.heroImageUrl || "");
        setHeroFile(null);
        toast.success("Hero image updated");
      } else {
        toast.error(response.data?.message || "Failed to update hero image");
      }
    } catch (error) {
      const status = error?.response?.status;
      const message =
        status === 404
          ? "Settings API not found. Restart/update backend (POST /api/settings/hero-image)."
          : error?.response?.data?.message || error.message;
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const onSaveLogo = async (e) => {
    e.preventDefault();
    if (!logoFile) {
      toast.error("Please choose a logo image");
      return;
    }
    try {
      setSaving(true);
      if (!backendUrl) {
        toast.error("Backend URL is missing. Set VITE_BACKEND_URL in Admin .env");
        return;
      }
      const formData = new FormData();
      formData.append("image", logoFile);
      const response = await axios.post(
        backendUrl + "/api/settings/logo-image",
        formData,
        { headers: { token } }
      );
      if (response.data?.success) {
        setLogoUrl(response.data.settings?.logoUrl || "");
        setLogoFile(null);
        toast.success("Logo updated");
      } else {
        toast.error(response.data?.message || "Failed to update logo");
      }
    } catch (error) {
      const status = error?.response?.status;
      const message =
        status === 404
          ? "Settings API not found. Restart/update backend (POST /api/settings/logo-image)."
          : error?.response?.data?.message || error.message;
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const onCreateCategory = async () => {
    const name = newCategoryName.trim();
    if (!name) {
      toast.error("Please enter a category name");
      return;
    }
    if (!backendUrl) return;

    try {
      setSaving(true);
      const response = await axios.post(
        backendUrl + "/api/category/create",
        { name },
        { headers: { token } }
      );
      if (response.data?.success) {
        toast.success("Category created");
        setNewCategoryName("");
        await refreshCategories();
      } else {
        toast.error(response.data?.message || "Failed to create category");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setSaving(false);
    }
  };

  const onAddSubCategory = async () => {
    const name = newSubCategoryName.trim();
    if (!selectedCategoryId) {
      toast.error("Please select a category");
      return;
    }
    if (!name) {
      toast.error("Please enter a sub category name");
      return;
    }
    if (!backendUrl) return;

    try {
      setSaving(true);
      const response = await axios.post(
        backendUrl + "/api/category/add-sub",
        { categoryId: selectedCategoryId, name },
        { headers: { token } }
      );
      if (response.data?.success) {
        toast.success("Sub category added");
        setNewSubCategoryName("");
        await refreshCategories();
      } else {
        toast.error(response.data?.message || "Failed to add sub category");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setSaving(false);
    }
  };

  const onDeleteCategory = async (id) => {
    if (!backendUrl) return;
    if (!window.confirm("Delete this category?")) return;
    try {
      setSaving(true);
      const response = await axios.post(
        backendUrl + "/api/category/delete",
        { id },
        { headers: { token } }
      );
      if (response.data?.success) {
        toast.success("Category deleted");
        setSelectedCategoryId("");
        await refreshCategories();
      } else {
        toast.error(response.data?.message || "Failed to delete category");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setSaving(false);
    }
  };

  const onRemoveSubCategory = async (categoryId, name) => {
    if (!backendUrl) return;
    try {
      setSaving(true);
      const response = await axios.post(
        backendUrl + "/api/category/remove-sub",
        { categoryId, name },
        { headers: { token } }
      );
      if (response.data?.success) {
        toast.success("Sub category removed");
        await refreshCategories();
      } else {
        toast.error(response.data?.message || "Failed to remove sub category");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div
        className={`flex items-center gap-3 py-10 ${
          isDarkMode ? "text-slate-300" : "text-gray-600"
        }`}
      >
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-500 border-t-transparent"></div>
        Loading settings...
      </div>
    );
  }

  return (
    <form onSubmit={onSaveHero} className="flex flex-col w-full gap-4 max-w-4xl mx-auto">
      <div className="flex items-center justify-between w-full mb-2">
        <h2
          className={`text-2xl font-bold ${
            isDarkMode ? "text-white" : "text-slate-800"
          }`}
        >
          Store Settings
        </h2>
      </div>

      <div
        className={`w-full p-6 rounded-2xl ${
          isDarkMode ? "bg-slate-800" : "bg-white"
        } border ${isDarkMode ? "border-slate-700" : "border-slate-200"}`}
      >
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p
              className={`font-medium ${
                isDarkMode ? "text-slate-200" : "text-slate-700"
              }`}
            >
              Hero Image (Frontend)
            </p>
            <p
              className={`text-sm mt-1 ${
                isDarkMode ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Recommended: 1600×900 or larger, JPG/PNG/WebP
            </p>
          </div>

          <label
            htmlFor="heroImage"
            className={`px-4 py-2 rounded-xl border cursor-pointer transition-all ${
              isDarkMode
                ? "bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-850"
                : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
            }`}
          >
            Choose Image
            <input
              id="heroImage"
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => setHeroFile(e.target.files?.[0] || null)}
            />
          </label>
        </div>

        <div className="mt-5">
          {heroPreviewUrl ? (
            <div
              className={`overflow-hidden rounded-2xl border ${
                isDarkMode ? "border-slate-700" : "border-slate-200"
              }`}
            >
              <img
                src={heroPreviewUrl}
                alt="Hero Preview"
                className="w-full h-[280px] object-cover"
              />
            </div>
          ) : (
            <div
              className={`h-[280px] rounded-2xl border-2 border-dashed flex items-center justify-center ${
                isDarkMode
                  ? "border-slate-700 text-slate-400"
                  : "border-slate-200 text-slate-500"
              }`}
            >
              No hero image set yet
            </div>
          )}
        </div>

        <div className="mt-5 flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className={`px-6 py-3 rounded-xl text-white font-medium transition-all ${
              saving
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-500 to-teal-600 hover:from-indigo-600 hover:to-teal-700"
            }`}
          >
            {saving ? "Saving..." : "Save Hero Image"}
          </button>

          <button
            type="button"
            disabled={!heroFile || saving}
            onClick={() => setHeroFile(null)}
            className={`px-6 py-3 rounded-xl font-medium transition-all border ${
              isDarkMode
                ? "border-slate-700 text-slate-200 hover:bg-slate-900"
                : "border-slate-200 text-slate-700 hover:bg-slate-50"
            } ${!heroFile || saving ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            Reset
          </button>
        </div>
      </div>

      <div
        className={`w-full p-6 rounded-2xl ${
          isDarkMode ? "bg-slate-800" : "bg-white"
        } border ${isDarkMode ? "border-slate-700" : "border-slate-200"}`}
      >
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p
              className={`font-medium ${
                isDarkMode ? "text-slate-200" : "text-slate-700"
              }`}
            >
              Brand Logo
            </p>
            <p
              className={`text-sm mt-1 ${
                isDarkMode ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Recommended: Square PNG/SVG, transparent background
            </p>
          </div>

          <label
            htmlFor="brandLogo"
            className={`px-4 py-2 rounded-xl border cursor-pointer transition-all ${
              isDarkMode
                ? "bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-850"
                : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
            }`}
          >
            Choose Logo
            <input
              id="brandLogo"
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
            />
          </label>
        </div>

        <div className="mt-5">
          {logoPreviewUrl ? (
            <div className="flex items-center gap-4">
              <img
                src={logoPreviewUrl}
                alt="Logo Preview"
                className={`w-16 h-16 rounded-xl object-contain border ${
                  isDarkMode ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-white"
                }`}
              />
              <span className={isDarkMode ? "text-slate-300" : "text-slate-700"}>
                Preview
              </span>
            </div>
          ) : (
            <div
              className={`h-[90px] rounded-2xl border-2 border-dashed flex items-center justify-center ${
                isDarkMode
                  ? "border-slate-700 text-slate-400"
                  : "border-slate-200 text-slate-500"
              }`}
            >
              No logo set yet
            </div>
          )}
        </div>

        <div className="mt-5 flex items-center gap-3">
          <button
            type="button"
            onClick={onSaveLogo}
            disabled={saving}
            className={`px-6 py-3 rounded-xl text-white font-medium transition-all ${
              saving
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-500 to-teal-600 hover:from-indigo-600 hover:to-teal-700"
            }`}
          >
            {saving ? "Saving..." : "Save Logo"}
          </button>

          <button
            type="button"
            disabled={!logoFile || saving}
            onClick={() => setLogoFile(null)}
            className={`px-6 py-3 rounded-xl font-medium transition-all border ${
              isDarkMode
                ? "border-slate-700 text-slate-200 hover:bg-slate-900"
                : "border-slate-200 text-slate-700 hover:bg-slate-50"
            } ${!logoFile || saving ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            Reset
          </button>
        </div>
      </div>

      <div
        className={`w-full p-6 rounded-2xl ${
          isDarkMode ? "bg-slate-800" : "bg-white"
        } border ${isDarkMode ? "border-slate-700" : "border-slate-200"}`}
      >
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p
              className={`font-medium ${
                isDarkMode ? "text-slate-200" : "text-slate-700"
              }`}
            >
              Categories
            </p>
            <p
              className={`text-sm mt-1 ${
                isDarkMode ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Create categories and sub categories for products
            </p>
          </div>
          <button
            type="button"
            onClick={refreshCategories}
            disabled={categoriesLoading || saving}
            className={`px-4 py-2 rounded-xl border transition-all ${
              isDarkMode
                ? "bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-850"
                : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
            } ${categoriesLoading || saving ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {categoriesLoading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className={`text-sm font-semibold mb-3 ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
              Add Category
            </p>
            <div className="flex flex-wrap items-stretch gap-3 min-w-0">
              <input
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className={`flex-1 min-w-0 px-4 py-3 rounded-xl border ${
                  isDarkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-slate-50 border-slate-200"
                }`}
                type="text"
                placeholder="e.g., Accessories"
              />
              <button
                type="button"
                onClick={onCreateCategory}
                disabled={saving}
                className={`shrink-0 px-5 py-3 rounded-xl text-white font-medium transition-all ${
                  saving
                    ? "bg-indigo-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-indigo-500 to-teal-600 hover:from-indigo-600 hover:to-teal-700"
                }`}
              >
                Create
              </button>
            </div>
          </div>

          <div>
            <p className={`text-sm font-semibold mb-3 ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
              Add Sub Category
            </p>
            <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch gap-3 min-w-0">
              <select
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
                className={`sm:w-56 shrink-0 px-4 py-3 rounded-xl border ${
                  isDarkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-slate-50 border-slate-200"
                }`}
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <input
                value={newSubCategoryName}
                onChange={(e) => setNewSubCategoryName(e.target.value)}
                className={`flex-1 min-w-0 px-4 py-3 rounded-xl border ${
                  isDarkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-slate-50 border-slate-200"
                }`}
                type="text"
                placeholder="e.g., Sunglasses"
              />
              <button
                type="button"
                onClick={onAddSubCategory}
                disabled={saving}
                className={`shrink-0 px-5 py-3 rounded-xl text-white font-medium transition-all ${
                  saving
                    ? "bg-indigo-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-indigo-500 to-teal-600 hover:from-indigo-600 hover:to-teal-700"
                }`}
              >
                Add
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {categories.length === 0 ? (
            <div className={isDarkMode ? "text-slate-400" : "text-slate-500"}>
              {categoriesLoading ? "Loading categories..." : "No categories yet"}
            </div>
          ) : (
            categories.map((cat) => (
              <div
                key={cat._id}
                className={`p-4 rounded-2xl border ${
                  isDarkMode ? "border-slate-700 bg-slate-900/40" : "border-slate-200 bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className={`font-semibold ${isDarkMode ? "text-slate-200" : "text-slate-800"}`}>
                    {cat.name}
                  </div>
                  <button
                    type="button"
                    onClick={() => onDeleteCategory(cat._id)}
                    disabled={saving}
                    className={`px-3 py-1.5 rounded-xl text-sm border transition-all ${
                      isDarkMode
                        ? "border-slate-700 text-red-400 hover:bg-red-900/30"
                        : "border-slate-200 text-red-600 hover:bg-red-50"
                    } ${saving ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    Delete
                  </button>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {(cat.subCategories || []).length === 0 ? (
                    <span className={isDarkMode ? "text-slate-500" : "text-slate-500"}>
                      No sub categories
                    </span>
                  ) : (
                    cat.subCategories.map((sub) => (
                      <span
                        key={`${cat._id}-${sub}`}
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm border ${
                          isDarkMode
                            ? "border-slate-700 bg-slate-800 text-slate-200"
                            : "border-slate-200 bg-white text-slate-700"
                        }`}
                      >
                        {sub}
                        <button
                          type="button"
                          onClick={() => onRemoveSubCategory(cat._id, sub)}
                          disabled={saving}
                          className={`${isDarkMode ? "text-slate-400 hover:text-red-400" : "text-slate-400 hover:text-red-600"} ${saving ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                          ×
                        </button>
                      </span>
                    ))
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </form>
  );
};

export default Settings;
