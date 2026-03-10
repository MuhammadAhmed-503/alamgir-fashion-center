import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { useTheme } from "../context/ThemeContext";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { toast } from "react-toastify";

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, token, navigate, parseSizeAndColor } =
    useContext(ShopContext);
  const { isDarkMode } = useTheme();
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      const tempData = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const { size, color } = parseSizeAndColor(item);
            tempData.push({
              _id: items,
              sizeKey: item,
              size: size,
              color: color,
              quantity: cartItems[items][item],
            });
          }
        }
      }
      setCartData(tempData);
    }
  }, [cartItems, products, parseSizeAndColor]);

  const handleCheckout = () => {
    if (!token) {
      toast.info('Please login to proceed to checkout');
      navigate('/login', { state: { from: '/place-order' } });
    } else {
      navigate('/place-order');
    }
  };

  return (
    <div className="pt-14">
      <div className="mb-8">
        <Title text1={"YOUR"} text2={"CART"} />
      </div>

      {cartData.length === 0 ? (
        <div className={`text-center py-20 rounded-2xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className={`w-20 h-20 mx-auto mb-6 ${isDarkMode ? 'text-slate-600' : 'text-slate-300'}`}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
          <p className={`text-xl font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Your cart is empty</p>
          <p className={`mb-6 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Looks like you haven't added anything to your cart yet.</p>
          <button
            onClick={() => navigate('/collection')}
            className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-teal-600 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 transition-all"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {cartData.map((item, index) => {
              const productData = products.find(
                (product) => product._id === item._id,
              );

              return (
                <div
                  key={index}
                  className={`p-4 sm:p-6 rounded-2xl ${isDarkMode ? 'bg-slate-800' : 'bg-white'} border ${isDarkMode ? 'border-slate-700' : 'border-slate-200'} transition-all duration-300`}
                >
                  <div className="flex items-center gap-4 sm:gap-6">
                    {/* Product Image */}
                    <div className={`w-20 h-20 sm:w-28 sm:h-28 rounded-xl overflow-hidden flex-shrink-0 ${isDarkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>
                      <img
                        className="w-full h-full object-cover"
                        src={productData.image[0]}
                        alt={productData.name}
                      />
                    </div>
                    
                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold text-sm sm:text-lg mb-2 truncate ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                        {productData.name}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                        <p className="text-lg font-bold bg-gradient-to-r from-indigo-500 to-teal-600 bg-clip-text text-transparent">
                          {currency}{productData.price}
                        </p>
                        <span className={`px-3 py-1 rounded-lg text-sm font-medium ${isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-700'}`}>
                          Size: {item.size}
                        </span>
                        {item.color && (
                          <span className={`px-3 py-1 rounded-lg text-sm font-medium flex items-center gap-2 ${isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-700'}`}>
                            Color: {item.color}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3">
                      <div className={`flex items-center rounded-xl overflow-hidden ${isDarkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>
                        <button
                          onClick={() => item.quantity > 1 && updateQuantity(item._id, item.sizeKey, item.quantity - 1)}
                          className={`w-10 h-10 flex items-center justify-center transition-colors ${isDarkMode ? 'hover:bg-slate-600 text-slate-300' : 'hover:bg-slate-200 text-slate-600'}`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                          </svg>
                        </button>
                        <span className={`w-12 text-center font-medium ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item._id, item.sizeKey, item.quantity + 1)}
                          className={`w-10 h-10 flex items-center justify-center transition-colors ${isDarkMode ? 'hover:bg-slate-600 text-slate-300' : 'hover:bg-slate-200 text-slate-600'}`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                          </svg>
                        </button>
                      </div>
                      
                      {/* Delete Button */}
                      <button
                        onClick={() => updateQuantity(item._id, item.sizeKey, 0)}
                        className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${isDarkMode ? 'bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white' : 'bg-red-50 text-red-500 hover:bg-red-500 hover:text-white'}`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end my-12">
            <div className={`w-full sm:w-[450px] p-6 rounded-2xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
              <CartTotal />
              <div className="w-full mt-6">
                <button
                  onClick={handleCheckout}
                  className="w-full py-4 bg-gradient-to-r from-indigo-500 to-teal-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 hover:-translate-y-1"
                >
                  PROCEED TO CHECKOUT
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
