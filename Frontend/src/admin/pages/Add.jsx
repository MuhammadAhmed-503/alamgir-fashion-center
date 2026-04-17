import React, { useState, useEffect } from 'react'
import { assets } from '../../assets/assets';
import axios from 'axios';
import { backendUrl } from '../config'
import { toast } from 'react-toastify';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const Add = ({token}) => {
  const { isDarkMode } = useTheme();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const editId = searchParams.get('edit');
  const isEditMode = !!editId;

  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);
  
  // Store existing image URLs for edit mode
  const [existingImages, setExistingImages] = useState([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Men")
  const [subCategory, setSubCategory] = useState("Topwear")
  const [bestSeller, setBestSeller] = useState(false)
  const [sizes, setSizes] = useState([])
  const [categoriesData, setCategoriesData] = useState([]);
  
  // Color management
  const [colors, setColors] = useState([]);
  const [newColorName, setNewColorName] = useState("");
  const [newColorHex, setNewColorHex] = useState("#000000");

  // Predefined colors for easy selection
  const predefinedColors = [
    { name: "Black", hex: "#000000" },
    { name: "White", hex: "#FFFFFF" },
    { name: "Red", hex: "#DC2626" },
    { name: "Blue", hex: "#2563EB" },
    { name: "Navy", hex: "#1E3A8A" },
    { name: "Green", hex: "#16A34A" },
    { name: "Yellow", hex: "#EAB308" },
    { name: "Pink", hex: "#EC4899" },
    { name: "Gray", hex: "#6B7280" },
    { name: "Brown", hex: "#92400E" },
    { name: "Orange", hex: "#EA580C" },
    { name: "Beige", hex: "#D4A574" },
  ];

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await axios.get(backendUrl + '/api/category/public');
        if (response.data?.success) {
          const items = response.data.categories || [];
          setCategoriesData(items);
          if (!isEditMode && items.length > 0) {
            const exists = items.some((c) => c.name === category);
            const firstCategoryName = items[0]?.name || "";
            const nextCategory = exists ? category : firstCategoryName;
            setCategory(nextCategory);
            const subList =
              items.find((c) => c.name === nextCategory)?.subCategories || [];
            if (subList.length > 0) {
              setSubCategory((prev) => (subList.includes(prev) ? prev : subList[0]));
            }
          }
        }
      } catch (error) {
        void error;
      }
    };
    loadCategories();
  }, []);

  // Fetch product data when in edit mode
  useEffect(() => {
    if (isEditMode && token) {
      fetchProductData();
    }
  }, [editId, token]);

  const fetchProductData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(backendUrl + '/api/product/list', { headers: { token } });
      if (response.data.success) {
        const product = response.data.products.find(p => p._id === editId);
        if (product) {
          setName(product.name);
          setDescription(product.description);
          setPrice(product.price.toString());
          setCategory(product.category);
          setSubCategory(product.subCategory);
          setBestSeller(product.bestSeller);
          setSizes(product.sizes || []);
          setColors(product.colors || []);
          setExistingImages(product.image || []);
        } else {
          toast.error('Product not found');
          navigate('/admin/products');
        }
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to load product data');
    } finally {
      setLoading(false);
    }
  };

  const subCategoriesForSelected =
    categoriesData.find((c) => c.name === category)?.subCategories || [];

  const addColor = () => {
    if (newColorName.trim()) {
      setColors([...colors, { name: newColorName.trim(), hex: newColorHex }]);
      setNewColorName("");
      setNewColorHex("#000000");
    }
  };

  const togglePredefinedColor = (color) => {
    const exists = colors.some(c => c.hex === color.hex);
    if (exists) {
      setColors(colors.filter(c => c.hex !== color.hex));
    } else {
      setColors([...colors, color]);
    }
  };

  const isColorSelected = (colorHex) => {
    return colors.some(c => c.hex === colorHex);
  };

  const removeColor = (index) => {
    setColors(colors.filter((_, i) => i !== index));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();

      console.log("BestSeller state before submit:", bestSeller);
      
      formData.append("name", name)
      formData.append("description", description)
      formData.append("price", price)
      formData.append("category", category)
      formData.append("subCategory", subCategory)
      formData.append("bestSeller", bestSeller ? "true" : "false")
      formData.append("sizes", JSON.stringify(sizes))
      formData.append("colors", JSON.stringify(colors))

      image1 && formData.append("image1", image1)
      image2 && formData.append("image2", image2)
      image3 && formData.append("image3", image3)
      image4 && formData.append("image4", image4)

      let response;
      if (isEditMode) {
        formData.append("id", editId);
        // Keep existing images if no new ones uploaded
        formData.append("existingImages", JSON.stringify(existingImages));
        response = await axios.post(backendUrl + "/api/product/update", formData, {headers: {token}})
      } else {
        response = await axios.post(backendUrl + "/api/product/add", formData, {headers: {token}})
      }

      if(response.data.success){
        toast.success(response.data.message)
        if (isEditMode) {
          navigate('/admin/products');
        } else {
          // Reset form for add mode
          setName('')
          setDescription('')
          setImage1(false)
          setImage2(false)
          setImage3(false)
          setImage4(false)
          setPrice('')
          setColors([])
          setSizes([])
          setBestSeller(false)
        }
      }
      else{
        toast.error(response.data.message)
      }
    }
    catch (error){
      console.log(error);
      toast.error(error.message)
    } finally {
      setLoading(false);
    }
  }

  const getImageSrc = (imageState, index) => {
    if (imageState) {
      return URL.createObjectURL(imageState);
    }
    if (existingImages[index]) {
      return existingImages[index];
    }
    return assets.upload_area;
  };

  if (loading && isEditMode) {
    return (
      <div className={`flex items-center justify-center py-10 ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-500 border-t-transparent mr-3"></div>
        Loading product data...
      </div>
    );
  }

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-4 max-w-4xl'>
      {/* Header */}
      <div className="flex items-center justify-between w-full mb-2">
        <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
          {isEditMode ? 'Edit Product' : 'Add New Product'}
        </h2>
        {isEditMode && (
          <button 
            type="button" 
            onClick={() => navigate('/admin/products')}
            className={`text-sm ${isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-gray-500 hover:text-gray-700'}`}
          >
            ← Back to List
          </button>
        )}
      </div>

      {/* Image Upload Section */}
      <div className={`w-full p-6 rounded-2xl ${isDarkMode ? 'bg-slate-800' : 'bg-white'} border ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
        <p className={`mb-3 font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Product Images</p>
        <div className='flex gap-3 flex-wrap'>
          <label htmlFor="image1" className="cursor-pointer">
            <div className={`w-24 h-24 rounded-xl border-2 border-dashed flex items-center justify-center overflow-hidden ${isDarkMode ? 'border-slate-600 hover:border-indigo-500' : 'border-slate-300 hover:border-indigo-500'} transition-colors`}>
              <img className='w-full h-full object-cover' src={getImageSrc(image1, 0)} alt="" />
            </div>
            <input onChange={(e)=> setImage1(e.target.files[0])} type="file" id='image1' hidden/>
          </label>
          <label htmlFor="image2" className="cursor-pointer">
            <div className={`w-24 h-24 rounded-xl border-2 border-dashed flex items-center justify-center overflow-hidden ${isDarkMode ? 'border-slate-600 hover:border-indigo-500' : 'border-slate-300 hover:border-indigo-500'} transition-colors`}>
              <img className='w-full h-full object-cover' src={getImageSrc(image2, 1)} alt="" />
            </div>
            <input onChange={(e)=> setImage2(e.target.files[0])} type="file" id='image2' hidden/>
          </label>
          <label htmlFor="image3" className="cursor-pointer">
            <div className={`w-24 h-24 rounded-xl border-2 border-dashed flex items-center justify-center overflow-hidden ${isDarkMode ? 'border-slate-600 hover:border-indigo-500' : 'border-slate-300 hover:border-indigo-500'} transition-colors`}>
              <img className='w-full h-full object-cover' src={getImageSrc(image3, 2)} alt="" />
            </div>
            <input onChange={(e)=> setImage3(e.target.files[0])} type="file" id='image3' hidden/>
          </label>
          <label htmlFor="image4" className="cursor-pointer">
            <div className={`w-24 h-24 rounded-xl border-2 border-dashed flex items-center justify-center overflow-hidden ${isDarkMode ? 'border-slate-600 hover:border-indigo-500' : 'border-slate-300 hover:border-indigo-500'} transition-colors`}>
              <img className='w-full h-full object-cover' src={getImageSrc(image4, 3)} alt="" />
            </div>
            <input onChange={(e)=> setImage4(e.target.files[0])} type="file" id='image4' hidden/>
          </label>
        </div>
        {isEditMode && <p className={`text-xs mt-2 ${isDarkMode ? 'text-slate-500' : 'text-gray-500'}`}>Click to replace existing images</p>}
      </div>

      {/* Basic Info */}
      <div className={`w-full p-6 rounded-2xl ${isDarkMode ? 'bg-slate-800' : 'bg-white'} border ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
        <p className={`mb-4 font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Basic Information</p>
        
        <div className='space-y-4'>
          <div>
            <label className={`block text-sm mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Product Name</label>
            <input 
              onChange={(e)=> setName(e.target.value)} 
              value={name} 
              className={`w-full px-4 py-3 rounded-xl border ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-50 border-slate-200'}`}
              type="text" 
              placeholder='Enter product name' 
              required
            />
          </div>

          <div>
            <label className={`block text-sm mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Description</label>
            <textarea 
              onChange={(e)=> setDescription(e.target.value)} 
              value={description} 
              className={`w-full px-4 py-3 rounded-xl border min-h-[100px] ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-50 border-slate-200'}`}
              placeholder='Write product description' 
              required
            />
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
            <div>
              <label className={`block text-sm mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Category</label>
              <select 
                value={category} 
                onChange={(e)=> {
                  const next = e.target.value;
                  setCategory(next);
                  const subs = categoriesData.find((c) => c.name === next)?.subCategories || [];
                  if (subs.length > 0) setSubCategory(subs[0]);
                }} 
                className={`w-full px-4 py-3 rounded-xl border ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-50 border-slate-200'}`}
              >
                {categoriesData.length > 0 ? (
                  categoriesData.map((c) => (
                    <option key={c._id} value={c.name}>
                      {c.name}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Kids">Kids</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className={`block text-sm mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Sub Category</label>
              <select 
                value={subCategory} 
                onChange={(e)=> setSubCategory(e.target.value)} 
                className={`w-full px-4 py-3 rounded-xl border ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-50 border-slate-200'}`}
              >
                {subCategoriesForSelected.length > 0 ? (
                  subCategoriesForSelected.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="Topwear">Topwear</option>
                    <option value="Bottomwear">Bottomwear</option>
                    <option value="Winterwear">Winterwear</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className={`block text-sm mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Price ($)</label>
              <input 
                onChange={(e)=> setPrice(e.target.value)} 
                value={price} 
                className={`w-full px-4 py-3 rounded-xl border ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-50 border-slate-200'}`}
                type="number" 
                placeholder="25" 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sizes Section */}
      <div className={`w-full p-6 rounded-2xl ${isDarkMode ? 'bg-slate-800' : 'bg-white'} border ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
        <p className={`mb-4 font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Available Sizes</p>
        <div className='flex gap-3 flex-wrap'>
          {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
            <div 
              key={size}
              onClick={()=>setSizes(prev => prev.includes(size) ? prev.filter(item => item !== size) : [...prev, size])}
              className={`px-5 py-2.5 rounded-xl cursor-pointer font-medium transition-all ${
                sizes.includes(size) 
                  ? 'bg-gradient-to-r from-indigo-500 to-teal-600 text-white' 
                  : isDarkMode ? 'bg-slate-700 text-slate-400 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {size}
            </div>
          ))}
        </div>
      </div>

      {/* Color Management Section */}
      <div className={`w-full p-6 rounded-2xl ${isDarkMode ? 'bg-slate-800' : 'bg-white'} border ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
        <p className={`mb-4 font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Product Colors</p>
        
        {/* Predefined Colors with Checkboxes */}
        <div className='mb-6'>
          <label className={`text-sm mb-3 block ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Quick Select Colors</label>
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3'>
            {predefinedColors.map((color) => (
              <label 
                key={color.hex}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer border-2 transition-all ${
                  isColorSelected(color.hex)
                    ? isDarkMode 
                      ? 'border-indigo-500 bg-indigo-900/30' 
                      : 'border-indigo-500 bg-indigo-50'
                    : isDarkMode 
                      ? 'border-slate-600 hover:border-slate-500' 
                      : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input 
                  type="checkbox"
                  checked={isColorSelected(color.hex)}
                  onChange={() => togglePredefinedColor(color)}
                  className='w-4 h-4 rounded accent-indigo-500'
                />
                <div 
                  className='w-6 h-6 rounded-full border-2 shadow-sm flex-shrink-0'
                  style={{ 
                    backgroundColor: color.hex,
                    borderColor: color.hex === '#FFFFFF' ? '#e5e7eb' : color.hex
                  }}
                />
                <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  {color.name}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Custom Color Section */}
        <div className={`pt-6 border-t ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
          <label className={`text-sm mb-3 block ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Add Custom Color</label>
          <div className='flex gap-3 items-end flex-wrap'>
            <div className='flex-1 min-w-[150px]'>
              <label className={`text-xs mb-1 block ${isDarkMode ? 'text-slate-500' : 'text-gray-500'}`}>Color Name</label>
              <input 
                type="text" 
                value={newColorName}
                onChange={(e) => setNewColorName(e.target.value)}
                placeholder="e.g., Maroon" 
                className={`w-full px-4 py-2.5 rounded-xl border ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-50 border-slate-200'}`}
              />
            </div>
            <div>
              <label className={`text-xs mb-1 block ${isDarkMode ? 'text-slate-500' : 'text-gray-500'}`}>Pick Color</label>
              <div className='flex items-center gap-2'>
                <input 
                  type="color" 
                  value={newColorHex}
                  onChange={(e) => setNewColorHex(e.target.value)}
                  className='w-12 h-10 rounded-lg cursor-pointer border-0'
                />
                <input 
                  type="text" 
                  value={newColorHex}
                  onChange={(e) => setNewColorHex(e.target.value)}
                  className={`w-24 px-3 py-2.5 rounded-xl border text-sm ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-50 border-slate-200'}`}
                  placeholder='#000000'
                />
              </div>
            </div>
            <button 
              type="button"
              onClick={addColor}
              className='px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-teal-600 text-white rounded-xl hover:from-indigo-600 hover:to-teal-700 text-sm font-medium transition-all'
            >
              Add Custom
            </button>
          </div>
        </div>

        {/* Selected Colors Display */}
        {colors.length > 0 && (
          <div className={`mt-6 pt-6 border-t ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
            <label className={`text-sm mb-3 block ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Selected Colors ({colors.length})
            </label>
            <div className='flex flex-wrap gap-2'>
              {colors.map((color, index) => (
                <div 
                  key={index} 
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-slate-100 border-slate-200'}`}
                >
                  <div 
                    className='w-5 h-5 rounded-full border-2 shadow-sm'
                    style={{ 
                      backgroundColor: color.hex,
                      borderColor: color.hex === '#FFFFFF' ? '#e5e7eb' : '#fff'
                    }}
                  />
                  <span className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{color.name}</span>
                  <button 
                    type="button"
                    onClick={() => removeColor(index)}
                    className={`ml-1 text-lg leading-none ${isDarkMode ? 'text-slate-500 hover:text-red-400' : 'text-gray-400 hover:text-red-500'}`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Best Seller */}
      <div className={`w-full p-6 rounded-2xl ${isDarkMode ? 'bg-slate-800' : 'bg-white'} border ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
        <label className='flex items-center gap-3 cursor-pointer'>
          <input 
            onChange={() => setBestSeller(prev => !prev)} 
            checked={bestSeller} 
            type="checkbox" 
            className='w-5 h-5 rounded accent-indigo-500'
          />
          <span className={`font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Mark as Best Seller</span>
        </label>
      </div>

      {/* Submit Buttons */}
      <div className="flex gap-3 mt-2">
        <button 
          type='submit' 
          disabled={loading}
          className='px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-teal-600 hover:from-indigo-700 hover:to-teal-700 text-white rounded-xl font-semibold disabled:opacity-50 shadow-lg shadow-indigo-500/25 transition-all'
        >
          {loading ? 'Processing...' : (isEditMode ? 'Update Product' : 'Add Product')}
        </button>
        {isEditMode && (
          <button 
            type='button'
            onClick={() => navigate('/admin/products')}
            className={`px-8 py-3.5 rounded-xl font-semibold transition-all ${isDarkMode ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}

export default Add
