import React, { useContext, useEffect, useCallback } from "react";
import { ShopContext } from "../context/ShopContext";
import { useTheme } from "../context/ThemeContext";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Verify = () => {
  const { navigate, token, setCartItems, backendUrl } = useContext(ShopContext);
  const { isDarkMode } = useTheme();
  const [searchParams] = useSearchParams();

  const orderId = searchParams.get("orderId");
  const success = searchParams.get("success");

  const verifyPayment = useCallback(async () => {
    try {
        if (!token) {
            return null;
        }

        const response = await axios.post(backendUrl +
            '/api/order/verifyStripe',
            { orderId, success },
            { headers: { token } }
        );

        if (response.data.success) {
            setCartItems({});
            navigate('/orders');
        } else {
            navigate('/cart');
        }

    } catch (error) {
        console.log(error);
        toast.error(error.message);
    }
  }, [token, orderId, success, setCartItems, navigate, backendUrl]);

  useEffect(() => {
    verifyPayment();
  }, [verifyPayment]);

  return (
    <div className={`min-h-[60vh] flex flex-col items-center justify-center ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
      <div className="mb-6">
        <svg className="animate-spin h-12 w-12 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
      <h3 className="text-xl font-semibold mb-2">Verifying Payment</h3>
      <p className={`${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Please wait while we confirm your payment...</p>
    </div>
  );
};

export default Verify;
