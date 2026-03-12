// import { products } from "../assets/assets";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { createContext, useEffect, useState } from "react";
import React from "react";
import { toast } from "react-toastify";

// eslint-disable-next-line react-refresh/only-export-components
export const ShopContext = createContext();
const ShopContextProvider = (props) => {
  const currency = "$";
  const delivery_fee = 10;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [search, setSearch] = React.useState("");
  const [showSearch, setShowSearch] = React.useState(false);
  const [cartItems, setCartItems] = React.useState(() => {
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : {};
  });
  const [orders, setOrders] = React.useState([]);
  const [products, setProducts] = React.useState([]);
  const [token, setToken] = useState('');
  const [heroImageUrl, setHeroImageUrl] = React.useState('');
  const [logoUrl, setLogoUrl] = React.useState('');
  const navigate = useNavigate();

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // Updated addToCart to support color
  const addToCart = async (itemId, size, color = '') => {
    if (!size) {
      toast.error("Please select a size");
      return;
    }

    // Create a unique key combining size and color
    const cartKey = color ? `${size}_${color}` : size;
    let cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      if (cartData[itemId][cartKey]) {
        cartData[itemId][cartKey] += 1;
      } else {
        cartData[itemId][cartKey] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][cartKey] = 1;
    }

    setCartItems(cartData);
    
    if (token) {
      try {
        await axios.post(backendUrl + '/api/cart/add', {itemId, size: cartKey}, {headers: {token}});
      } catch (error) {
        console.log(error);
      }
    }
    toast.success("Product added to cart");
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalCount += cartItems[items][item];
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
    return totalCount;
  };

  const updateQuantity = async (itemId, sizeKey, quantity) => {
    let cartData = structuredClone(cartItems);
    cartData[itemId][sizeKey] = quantity;
    setCartItems(cartData);

    if(token){
      try {
        await axios.post(backendUrl + '/api/cart/update', {itemId, size: sizeKey, quantity}, {headers: {token}});
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product._id === items);
      if (!itemInfo) continue;
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalAmount += itemInfo.price * cartItems[items][item];
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
    return totalAmount;
  };

  const clearCart = () => {
    setCartItems({});
  };

  // Helper function to parse size and color from cart key
  const parseSizeAndColor = (cartKey) => {
    if (cartKey.includes('_')) {
      const [size, ...colorParts] = cartKey.split('_');
      return { size, color: colorParts.join('_') };
    }
    return { size: cartKey, color: '' };
  };

  const placeOrder = (orderData) => {
    const newOrder = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      status: 'Processing',
      total: getCartAmount() + delivery_fee,
      items: [],
      deliveryInfo: orderData.deliveryInfo,
      paymentMethod: orderData.paymentMethod,
      trackingNumber: `TRK${Date.now()}`
    };

    for (const itemId in cartItems) {
      for (const cartKey in cartItems[itemId]) {
        if (cartItems[itemId][cartKey] > 0) {
          const product = products.find(p => p._id === itemId);
          const { size, color } = parseSizeAndColor(cartKey);
          newOrder.items.push({
            productId: itemId,
            productName: product.name,
            productImage: product.image[0],
            productPrice: product.price,
            quantity: cartItems[itemId][cartKey],
            size: size,
            color: color
          });
        }
      }
    }

    setOrders(prevOrders => [newOrder, ...prevOrders]);
    return newOrder.id;
  };

  const getProductsData = async ()=> {
    try {
      const response = await axios.get(backendUrl + '/api/product/list');
      if(response.data.success){
          setProducts(response.data.products);
      } else {
          toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

  const getPublicSettings = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/settings/public');
      if (response.data.success) {
        setHeroImageUrl(response.data.settings?.heroImageUrl || '');
        setLogoUrl(response.data.settings?.logoUrl || '');
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(()=>{
    getProductsData();
    getPublicSettings();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getUserCart = async (token)=> {
    try {
      const response = await axios.post(backendUrl + '/api/cart/get', {}, {headers: {token}});
      if(response.data.success){
          setCartItems(response.data.cartData || {});
      } else {
          toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

  useEffect(()=>{
    if(!token && localStorage.getItem('token')){
      setToken(localStorage.getItem('token'));
      getUserCart(localStorage.getItem('token'));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    clearCart,
    orders,
    placeOrder,
    navigate,
    backendUrl,
    token,
    setToken,
    heroImageUrl,
    logoUrl,
    setCartItems,
    parseSizeAndColor,
  };
  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  )
};

export default ShopContextProvider;
