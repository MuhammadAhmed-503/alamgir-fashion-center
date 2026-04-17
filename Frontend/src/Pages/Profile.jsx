import React, { useContext, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Cropper from 'react-easy-crop';
import { toast } from 'react-toastify';
import Title from '../components/Title';
import { ShopContext } from '../context/ShopContext';
import { useTheme } from '../context/ThemeContext';

const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', reject);
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

const getCroppedImage = async (imageSrc, pixelCrop) => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('Unable to create canvas context');
  }

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  context.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Failed to crop image'));
        return;
      }
      resolve(blob);
    }, 'image/jpeg', 0.92);
  });
};

const Profile = () => {
  const { token, navigate, backendUrl } = useContext(ShopContext);
  const { isDarkMode } = useTheme();
  const [userData, setUserData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [isAvatarViewerOpen, setIsAvatarViewerOpen] = useState(false);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [avatarSource, setAvatarSource] = useState('');
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const avatarInputRef = useRef(null);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    fetchUserData();
    fetchOrders();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [token]);

  useEffect(() => {
    return () => {
      if (avatarSource) {
        URL.revokeObjectURL(avatarSource);
      }
    };
  }, [avatarSource]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(backendUrl + '/api/user/profile', {
        headers: { token }
      });

      if (response.data.success) {
        setUserData(response.data.user);
        setFormData({
          name: response.data.user.name || '',
          email: response.data.user.email || '',
          phone: response.data.user.phone || ''
        });
      } else {
        const message = response.data.message || 'Failed to load profile';
        setError(message);
        toast.error(message);
      }
    } catch (requestError) {
      const message = requestError.response?.data?.message || requestError.message || 'Failed to load profile';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.post(
        backendUrl + '/api/order/userorders',
        {},
        { headers: { token } }
      );

      if (response.data.success) {
        setOrders(response.data.orders.reverse());
      }
    } catch (requestError) {
      console.log(requestError);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (avatarSource) {
      URL.revokeObjectURL(avatarSource);
    }

    const previewUrl = URL.createObjectURL(file);
    setAvatarSource(previewUrl);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    setIsAvatarViewerOpen(false);
    setIsCropperOpen(true);
    e.target.value = '';
  };

  const onCropComplete = (_, pixelCrop) => {
    setCroppedAreaPixels(pixelCrop);
  };

  const handleAvatarUpload = async () => {
    if (!avatarSource || !croppedAreaPixels) return;

    try {
      setIsUploadingAvatar(true);

      const croppedBlob = await getCroppedImage(avatarSource, croppedAreaPixels);
      const croppedFile = new File([croppedBlob], 'profile-photo.jpg', { type: 'image/jpeg' });
      const payload = new FormData();
      payload.append('image', croppedFile);

      const response = await axios.post(backendUrl + '/api/user/avatar', payload, {
        headers: { token }
      });

      if (response.data.success) {
        setUserData((prev) => ({ ...prev, avatar: response.data.avatar }));
        toast.success(response.data.message || 'Profile photo updated');
      } else {
        toast.error(response.data.message || 'Failed to update profile photo');
      }
    } catch (uploadError) {
      toast.error(uploadError.response?.data?.message || 'Failed to update profile photo');
    } finally {
      setIsUploadingAvatar(false);
      setIsCropperOpen(false);
      setAvatarSource('');
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(backendUrl + '/api/user/update', formData, {
        headers: { token }
      });

      if (response.data.success) {
        setUserData({ ...userData, ...formData });
        setIsEditing(false);
        toast.success('Profile updated successfully');
      } else {
        toast.error(response.data.message || 'Failed to update profile');
      }
    } catch (requestError) {
      toast.error(requestError.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-teal-600"></div>
          <p className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error && !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className={`max-w-md p-8 rounded-2xl text-center ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
            Failed to Load Profile
          </h3>
          <p className={`mb-6 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{error}</p>
          <button
            onClick={() => {
              fetchUserData();
              fetchOrders();
            }}
            className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-teal-600 text-white rounded-xl hover:from-indigo-600 hover:to-teal-700 transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-teal-600"></div>
          <p className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-10 pb-20">
      <div className="text-2xl mb-8">
        <Title text1={'MY'} text2={'PROFILE'} />
      </div>

      <div className={`rounded-2xl p-8 mb-8 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsAvatarViewerOpen(true)}
              className="relative block"
              aria-label="Open profile photo"
            >
              {userData.avatar ? (
                <img
                  src={userData.avatar}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover ring-2 ring-white dark:ring-slate-800"
                />
              ) : (
                <div className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold text-white bg-gradient-to-r from-indigo-500 to-teal-600 ring-2 ring-white dark:ring-slate-800">
                  {userData.name ? userData.name.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
              <span className="absolute inset-0 rounded-full bg-black/0 hover:bg-black/10 transition-colors" />
            </button>

            <button
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              className="absolute top-0 right-0 w-9 h-9 rounded-full bg-slate-900 text-white shadow-lg flex items-center justify-center hover:bg-slate-800 transition-colors ring-4 ring-white dark:ring-slate-800"
              aria-label="Change profile photo"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487a2.375 2.375 0 113.35 3.35L7.5 20.55 3 21l.45-4.5L16.862 4.487z" />
              </svg>
            </button>

            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarFileChange}
              className="hidden"
            />

            <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-4 border-white dark:border-slate-800"></div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
              {userData.name || 'User'}
            </h2>
            <p className={`text-sm mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              {userData.email}
            </p>
            {userData.phone && (
              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                {userData.phone}
              </p>
            )}
          </div>

          <div className="flex gap-6">
            <div className="text-center">
              <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                {orders.length}
              </div>
              <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Orders
              </div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                {userData.createdAt ? new Date(userData.createdAt).getFullYear() : ''}
              </div>
              <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Member Since
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-6 py-3 rounded-xl font-medium transition-all ${
            activeTab === 'profile'
              ? 'bg-gradient-to-r from-sky-500 to-cyan-600 text-white shadow-lg shadow-sky-500/30'
              : `${isDarkMode ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-600 hover:text-slate-800'}`
          }`}
        >
          Profile Details
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-6 py-3 rounded-xl font-medium transition-all ${
            activeTab === 'orders'
              ? 'bg-gradient-to-r from-sky-500 to-cyan-600 text-white shadow-lg shadow-sky-500/30'
              : `${isDarkMode ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-600 hover:text-slate-800'}`
          }`}
        >
          Order History
        </button>
      </div>

      {activeTab === 'profile' ? (
        <div className={`rounded-2xl p-8 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
              Personal Information
            </h3>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  isDarkMode ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-white text-slate-700 hover:bg-slate-100'
                }`}
              >
                Edit Profile
              </button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-xl border ${isDarkMode ? 'bg-slate-700 text-white border-slate-600' : 'bg-white text-slate-800 border-slate-200'} focus:outline-none focus:ring-2 focus:ring-sky-500`}
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-xl border ${isDarkMode ? 'bg-slate-700 text-white border-slate-600' : 'bg-white text-slate-800 border-slate-200'} focus:outline-none focus:ring-2 focus:ring-sky-500`}
                  required
                  disabled
                />
                <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Email cannot be changed
                </p>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-xl border ${isDarkMode ? 'bg-slate-700 text-white border-slate-600' : 'bg-white text-slate-800 border-slate-200'} focus:outline-none focus:ring-2 focus:ring-sky-500`}
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-sky-500 to-cyan-600 hover:shadow-lg hover:shadow-sky-500/30 transition-all duration-300"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      name: userData.name || '',
                      email: userData.email || '',
                      phone: userData.phone || ''
                    });
                  }}
                  className={`flex-1 py-3 rounded-xl font-semibold transition-all ${isDarkMode ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-slate-200 text-slate-800 hover:bg-slate-300'}`}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Full Name
                </label>
                <p className={`text-lg ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                  {userData.name || 'Not provided'}
                </p>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Email Address
                </label>
                <p className={`text-lg ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                  {userData.email}
                </p>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Phone Number
                </label>
                <p className={`text-lg ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                  {userData.phone || 'Not provided'}
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className={`rounded-2xl p-12 text-center ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>No Orders Yet</h3>
              <p className={`mb-6 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Start shopping to see your orders here</p>
              <button
                onClick={() => navigate('/collection')}
                className="px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-sky-500 to-cyan-600 hover:shadow-lg hover:shadow-sky-500/30 transition-all duration-300"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            orders.map((order, index) => (
              <div key={index} className={`rounded-2xl p-6 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      Order ID: <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>{order._id}</span>
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      Date: {new Date(order.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="mt-2 md:mt-0">
                    <span className={`inline-block px-4 py-1 rounded-full text-xs font-medium ${order.status === 'Delivered' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : order.status === 'Shipped' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex gap-4">
                      <img src={item.image[0]} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                      <div className="flex-1">
                        <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{item.name}</p>
                        <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                          Size: {item.size} | Qty: {item.quantity}
                        </p>
                      </div>
                      <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                        ${item.price}
                      </div>
                    </div>
                  ))}
                </div>

                <div className={`mt-4 pt-4 border-t ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                  <div className="flex justify-between">
                    <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Total Amount:</span>
                    <span className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>${order.amount}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {isAvatarViewerOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl">
            <button
              type="button"
              onClick={() => setIsAvatarViewerOpen(false)}
              className="absolute -top-3 -right-3 w-11 h-11 rounded-full bg-white text-slate-900 shadow-xl flex items-center justify-center hover:bg-slate-100 transition-colors z-10"
              aria-label="Close profile photo"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <button
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              className="absolute top-4 right-4 z-10 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/95 text-slate-900 shadow-lg hover:bg-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487a2.375 2.375 0 113.35 3.35L7.5 20.55 3 21l.45-4.5L16.862 4.487z" />
              </svg>
              Edit
            </button>

            <div className="overflow-hidden rounded-[2rem] bg-slate-950 shadow-2xl border border-white/10">
              {userData.avatar ? (
                <img src={userData.avatar} alt="Profile full size" className="w-full max-h-[80vh] object-contain" />
              ) : (
                <div className="w-full min-h-[50vh] flex items-center justify-center text-white text-lg">
                  No profile photo yet
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {isCropperOpen && avatarSource && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-2xl rounded-[2rem] overflow-hidden ${isDarkMode ? 'bg-slate-900' : 'bg-white'} shadow-2xl`}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <div>
                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Adjust Profile Photo</h3>
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Drag to reposition and zoom to crop.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsCropperOpen(false);
                  setAvatarSource('');
                }}
                className={`w-10 h-10 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="relative h-[420px] bg-black">
              <Cropper
                image={avatarSource}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>

            <div className={`px-6 py-5 border-t ${isDarkMode ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-slate-50'}`}>
              <label className={`block text-sm font-medium mb-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                Zoom
              </label>
              <input
                type="range"
                min={1}
                max={3}
                step={0.01}
                value={zoom}
                onChange={(event) => setZoom(Number(event.target.value))}
                className="w-full"
              />

              <div className="mt-5 flex flex-col sm:flex-row gap-3 sm:justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setIsCropperOpen(false);
                    setAvatarSource('');
                  }}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all ${isDarkMode ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-slate-200 text-slate-800 hover:bg-slate-300'}`}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAvatarUpload}
                  disabled={isUploadingAvatar}
                  className="px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-sky-500 to-cyan-600 hover:shadow-lg hover:shadow-sky-500/30 transition-all disabled:opacity-60"
                >
                  {isUploadingAvatar ? 'Saving...' : 'Save Photo'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
