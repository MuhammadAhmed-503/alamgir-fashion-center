import React, { useMemo, useEffect } from "react";
import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { useTheme } from "../context/ThemeContext";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);
  const { isDarkMode } = useTheme();
  const [showFilter, setShowFilter] = React.useState(false);
  const [category, setCategory] = React.useState([]);
  const [subCategory, setSubCategory] = React.useState([]);
  const [sortType, setSortType] = React.useState("");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setCategory((prev) => [...prev, e.target.value]);
    }
  };

  const toggleSubCategory = (e) => {
    if (subCategory.includes(e.target.value)) {
      setSubCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setSubCategory((prev) => [...prev, e.target.value]);
    }
  };

  // Use useMemo instead of useEffect to compute filtered products
  const filterProducts = useMemo(() => {
    let productsCopy = products.slice();

    if (showSearch && search) {
      productsCopy = productsCopy.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        category.includes(item.category)
      );
    }

    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        subCategory.includes(item.subCategory)
      );
    }

    if (sortType) {
      switch (sortType) {
        case "low-high":
          return [...productsCopy].sort((a, b) => a.price - b.price);
        case "high-low":
          return [...productsCopy].sort((a, b) => b.price - a.price);
        default:
          // do nothing
          break;
      }
    }

    return productsCopy;
  }, [products, showSearch, search, category, subCategory, sortType,]);

  const categories = [
    { value: "Men", label: "Men" },
    { value: "Women", label: "Women" },
    { value: "Kids", label: "Kids" }
  ];

  const subCategories = [
    { value: "Topwear", label: "Topwear" },
    { value: "Bottomwear", label: "Bottomwear" },
    { value: "Winterwear", label: "Winterwear" }
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-8 pt-10 overflow-hidden">
      {/* Filter Sidebar */}
      <div className={`lg:w-64 flex-shrink-0 min-w-0`}>
        <div className={`lg:sticky lg:top-24 p-6 rounded-2xl ${isDarkMode ? 'bg-slate-800' : 'bg-white'} border ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
          <div
            onClick={() => setShowFilter(!showFilter)}
            className="flex items-center justify-between cursor-pointer lg:cursor-default mb-6"
          >
            <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
              Filters
            </h3>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth={2} 
              stroke="currentColor" 
              className={`w-5 h-5 lg:hidden transition-transform ${showFilter ? 'rotate-180' : ''} ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </div>
          
          {/* Category Filter */}
          <div className={`${showFilter ? 'block' : 'hidden'} lg:block`}>
            <div className="mb-6">
              <h4 className={`text-sm font-semibold mb-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                CATEGORIES
              </h4>
              <div className="flex flex-col gap-2">
                {categories.map((cat) => (
                  <label 
                    key={cat.value}
                    className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all ${
                      category.includes(cat.value) 
                        ? `${isDarkMode ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}` 
                        : `${isDarkMode ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-600'}`
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded accent-indigo-500"
                      value={cat.value}
                      checked={category.includes(cat.value)}
                      onChange={toggleCategory}
                    />
                    <span className="text-sm">{cat.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Subcategory Filter */}
            <div>
              <h4 className={`text-sm font-semibold mb-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                TYPE
              </h4>
              <div className="flex flex-col gap-2">
                {subCategories.map((sub) => (
                  <label 
                    key={sub.value}
                    className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all ${
                      subCategory.includes(sub.value) 
                        ? `${isDarkMode ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}` 
                        : `${isDarkMode ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-600'}`
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded accent-indigo-500"
                      value={sub.value}
                      checked={subCategory.includes(sub.value)}
                      onChange={toggleSubCategory}
                    />
                    <span className="text-sm">{sub.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <Title text1={"ALL"} text2={"COLLECTIONS"} />
          <select
            onChange={(e) => setSortType(e.target.value)}
            className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition-all cursor-pointer ${
              isDarkMode 
                ? 'bg-slate-800 border-slate-700 text-slate-300 focus:border-indigo-500' 
                : 'bg-white border-slate-200 text-slate-700 focus:border-indigo-500'
            } focus:outline-none focus:ring-2 focus:ring-indigo-500/20`}
          >
            <option value="">Sort By: Newest</option>
            <option value="low-high">Sort By: Low to High</option>
            <option value="high-low">Sort By: High to Low</option>
          </select>
        </div>
        
        {/* Products Count */}
        <p className={`text-sm mb-6 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          Showing {filterProducts.length} products
        </p>
        
        {/* Products Grid */}
        {filterProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filterProducts.map((item, index) => (
              <div key={index} className="animate-fadeIn" style={{ animationDelay: `${index * 0.05}s` }}>
                <ProductItem
                  name={item.name}
                  id={item._id}
                  price={item.price}
                  image={item.image}
                  colors={item.colors}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className={`text-center py-20 rounded-2xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className={`w-20 h-20 mx-auto mb-6 ${isDarkMode ? 'text-slate-600' : 'text-slate-300'}`}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <p className={`text-xl font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>No products found</p>
            <p className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Collection;
