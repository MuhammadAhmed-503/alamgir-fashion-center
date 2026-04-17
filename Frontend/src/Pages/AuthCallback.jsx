import React, { useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const { setToken, navigate, backendUrl } = useContext(ShopContext);

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get('token');
      const provider = searchParams.get('provider');
      const error = searchParams.get('error');

      if (error) {
        toast.error(`${provider || 'Social'} authentication failed`);
        navigate('/login');
        return;
      }

      if (token) {
        // Store token
        setToken(token);
        localStorage.setItem('token', token);
        localStorage.removeItem('adminToken');
        localStorage.setItem('authRole', 'user');

        // Sync any local cart items to server
        try {
          const localCart = JSON.parse(localStorage.getItem('cartItems') || '{}');
          for (const itemId in localCart) {
            for (const size in localCart[itemId]) {
              if (localCart[itemId][size] > 0) {
                for (let i = 0; i < localCart[itemId][size]; i++) {
                  await axios.post(backendUrl + '/api/cart/add', { itemId, size }, { headers: { token } });
                }
              }
            }
          }
        } catch (err) {
          console.log('Error syncing cart:', err);
        }

        toast.success(`Logged in with ${provider || 'social account'} successfully!`);
        navigate('/');
      } else {
        toast.error('Authentication failed. No token received.');
        navigate('/login');
      }
    };

    handleCallback();
  }, [searchParams, setToken, navigate, backendUrl]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent mx-auto mb-4"></div>
        <p className="text-lg text-gray-600 dark:text-gray-300">Completing sign in...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
