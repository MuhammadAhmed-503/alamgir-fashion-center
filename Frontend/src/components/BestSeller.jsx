import React from "react";
import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { useTheme } from "../context/ThemeContext";
import Title from "./Title";
import ProductItem from "./ProductItem";

const BestSeller = () => {
  const { products } = useContext(ShopContext);
  const { isDarkMode } = useTheme();
  const [bestSeller, setBestSeller] = React.useState([]);

  React.useEffect(() => {
    const bestProduct = products.filter((item) => item.bestSeller);
    setBestSeller(bestProduct.slice(0, 5));
  }, [products]);
  
  return (
    <div className={`my-16 py-16 px-6 rounded-3xl ${isDarkMode ? 'bg-slate-800/50' : 'bg-gradient-to-br from-indigo-50 to-teal-50'}`}>
      <div className="text-center py-4">
        <Title text1={"BEST"} text2={"SELLERS"} />
        <p className={`w-3/4 m-auto mt-4 text-sm sm:text-base ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          Our most loved pieces that customers keep coming back for. Shop the favorites that have earned their spot at the top.
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 mt-8">
        {bestSeller.map((item, index) => (
          <div key={index} className="animate-fadeIn" style={{ animationDelay: `${index * 0.1}s` }}>
            <ProductItem
              id={item._id}
              name={item.name}
              image={item.image}
              price={item.price}
              colors={item.colors}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BestSeller;
