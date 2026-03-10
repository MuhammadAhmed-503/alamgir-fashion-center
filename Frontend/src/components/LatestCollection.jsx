import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { useTheme } from "../context/ThemeContext";
import Title from "./Title";
import ProductItem from "./ProductItem";

const LatestCollection = () => {
  const { products } = useContext(ShopContext);
  const { isDarkMode } = useTheme();
  const [latestProducts, setLatestProducts] = React.useState([]);

  React.useEffect(() => {
    // Products are already sorted by newest first from backend
    setLatestProducts(products.slice(0, 10));
  }, [products]);
  
  return (
    <div className="my-16">
      <div className="text-center py-8">
        <Title text1={"LATEST"} text2={"COLLECTION"} />
        <p className={`w-3/4 m-auto mt-4 text-sm sm:text-base ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          Discover our newest arrivals, carefully curated to bring you the latest trends and timeless pieces for your wardrobe.
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
        {latestProducts.map((item, index) => (
          <div key={index} className="animate-fadeIn" style={{ animationDelay: `${index * 0.1}s` }}>
            <ProductItem 
              id={item._id} 
              image={item.image} 
              name={item.name} 
              price={item.price}
              colors={item.colors}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default LatestCollection;
