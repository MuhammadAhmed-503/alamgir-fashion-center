import React, { useState } from 'react'
import {toast} from 'react-toastify';
import axios from 'axios';
import { useContext, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import { useTheme } from '../context/ThemeContext';
import { useLocation, useSearchParams } from 'react-router-dom';

const Login = () => {
  const [currentState, setCurrentState] = useState('Login');
  const [authMethod, setAuthMethod] = useState('email'); // 'email' or 'phone'
  const {token, setToken, navigate, backendUrl, cartItems, setCartItems} = useContext(ShopContext);
  const { isDarkMode } = useTheme();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Phone auth states
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [otp, setOtp] = useState('');
  const [otpEmail, setOtpEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  // Sync local cart to server after login
  const syncCartToServer = async (userToken) => {
    try {
      // Get local cart from localStorage
      const localCart = JSON.parse(localStorage.getItem('cartItems') || '{}');
      
      // If there's a local cart, sync each item to server
      for (const itemId in localCart) {
        for (const size in localCart[itemId]) {
          if (localCart[itemId][size] > 0) {
            // Add each item to server cart
            for (let i = 0; i < localCart[itemId][size]; i++) {
              await axios.post(backendUrl + '/api/cart/add', {itemId, size}, {headers: {token: userToken}});
            }
          }
        }
      }
    } catch (error) {
      console.log('Error syncing cart:', error);
    }
  };

  // OAuth handlers
  const handleGoogleLogin = () => {
    window.location.href = `${backendUrl}/api/auth/google`;
  };

  const handleGithubLogin = () => {
    window.location.href = `${backendUrl}/api/auth/github`;
  };

  const handleFacebookLogin = () => {
    window.location.href = `${backendUrl}/api/auth/facebook`;
  };

  // Phone auth handlers - OTP sent via email
  const handleSendOTP = async () => {
    if (!otpEmail) {
      toast.error('Please enter your email address');
      return;
    }
    
    setOtpLoading(true);
    try {
      const response = await axios.post(`${backendUrl}/api/auth/phone/send-otp`, {
        phone,
        countryCode,
        email: otpEmail
      });
      
      if (response.data.success) {
        setOtpSent(true);
        toast.success('OTP sent to your email!');
        // In dev mode, show OTP in console
        if (response.data.devOTP) {
          console.log('Dev OTP:', response.data.devOTP);
          toast.info(`Dev OTP: ${response.data.devOTP}`, { autoClose: 10000 });
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp) {
      toast.error('Please enter the OTP');
      return;
    }
    
    try {
      const response = await axios.post(`${backendUrl}/api/auth/phone/verify-otp`, {
        phone,
        countryCode,
        otp,
        email: otpEmail,
        name: currentState === 'Sign Up' ? name : undefined
      });
      
      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem('token', response.data.token);
        await syncCartToServer(response.data.token);
        toast.success('Verified successfully!');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to verify OTP');
    }
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (currentState === 'Sign Up') {
        const response = await axios.post(backendUrl + '/api/user/register', {
          name,
          email,
          password
        });
        console.log(response.data);
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
          await syncCartToServer(response.data.token);
          toast.success('Account created successfully!');
        } else {
          toast.error(response.data.message);
        }
      } else {
        // Login logic
        const response = await axios.post(backendUrl + '/api/user/login', {
          email,
          password
        });
        console.log(response.data);
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
          await syncCartToServer(response.data.token);
          toast.success('Logged in successfully!');
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || 'An error occurred. Please try again.');
    }
  }

  // Handle OAuth callback errors
  useEffect(() => {
    const error = searchParams.get('error');
    if (error) {
      const errorMessages = {
        'google_auth_failed': 'Google authentication failed. Please try again.',
        'github_auth_failed': 'GitHub authentication failed. Please try again.',
        'facebook_auth_failed': 'Facebook authentication failed. Please try again.'
      };
      toast.error(errorMessages[error] || 'Authentication failed. Please try again.');
    }
  }, [searchParams]);

  useEffect(() => {
    if (token) {
      // Redirect to place-order if coming from cart, otherwise go to home
      const from = location.state?.from || '/';
      navigate(from);
    }
  }, [token, navigate, location]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4">
      <div className={`w-full max-w-md p-8 rounded-3xl ${isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-200 shadow-xl shadow-slate-200/50'}`}>
        {/* Header */}
        <div className="text-center mb-8">
          <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${isDarkMode ? 'bg-indigo-500/20' : 'bg-indigo-100'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-8 h-8 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </div>
          <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
            {currentState === 'Login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
            {currentState === 'Login' ? 'Sign in to continue shopping' : 'Join us for exclusive deals'}
          </p>
        </div>

        {/* Auth Method Tabs */}
        <div className={`flex rounded-xl p-1 mb-6 ${isDarkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>
          <button
            type="button"
            onClick={() => { setAuthMethod('email'); setOtpSent(false); }}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
              authMethod === 'email'
                ? isDarkMode ? 'bg-slate-600 text-white shadow' : 'bg-white text-slate-800 shadow'
                : isDarkMode ? 'text-slate-400 hover:text-slate-300' : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            Email
          </button>
          <button
            type="button"
            onClick={() => { setAuthMethod('phone'); setOtpSent(false); }}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
              authMethod === 'phone'
                ? isDarkMode ? 'bg-slate-600 text-white shadow' : 'bg-white text-slate-800 shadow'
                : isDarkMode ? 'text-slate-400 hover:text-slate-300' : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            Phone
          </button>
        </div>

        {/* Email Form */}
        {authMethod === 'email' && (
        <form onSubmit={onSubmitHandler} className="space-y-5">
          {currentState === 'Sign Up' && (
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                Full Name
              </label>
              <div className="relative">
                <div className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </div>
                <input 
                  onChange={(e)=>setName(e.target.value)} 
                  value={name} 
                  type="text" 
                  className={`w-full pl-12 pr-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                    isDarkMode 
                      ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-indigo-500' 
                      : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:bg-white'
                  }`}
                  placeholder="John Doe" 
                  required 
                />
              </div>
            </div>
          )}
          
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              Email Address
            </label>
            <div className="relative">
              <div className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>
              <input 
                onChange={(e)=>setEmail(e.target.value)} 
                value={email} 
                type="email" 
                className={`w-full pl-12 pr-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                  isDarkMode 
                    ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-indigo-500' 
                    : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:bg-white'
                }`}
                placeholder="john@example.com" 
                required 
              />
            </div>
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              Password
            </label>
            <div className="relative">
              <div className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </div>
              <input 
                onChange={(e)=>setPassword(e.target.value)} 
                value={password} 
                type={showPassword ? "text" : "password"}
                className={`w-full pl-12 pr-12 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                  isDarkMode 
                    ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-indigo-500' 
                    : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:bg-white'
                }`}
                placeholder="••••••••" 
                required 
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-4 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-slate-400 hover:text-slate-300' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Links */}
          <div className='flex justify-between text-sm'>
            <button type="button" className={`hover:underline ${isDarkMode ? 'text-slate-400 hover:text-slate-300' : 'text-slate-600 hover:text-slate-800'}`}>
              Forgot password?
            </button>
            <button 
              type="button"
              onClick={() => setCurrentState(currentState === 'Login' ? 'Sign Up' : 'Login')} 
              className={`font-medium hover:underline ${isDarkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'}`}
            >
              {currentState === 'Login' ? 'Create account' : 'Sign in instead'}
            </button>
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            className="w-full py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 transition-all duration-300 shadow-lg shadow-sky-500/25"
          >
            {currentState === 'Login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>
        )}

        {/* Phone Auth Form */}
        {authMethod === 'phone' && (
          <form onSubmit={handleVerifyOTP} className="space-y-5">
            {currentState === 'Sign Up' && !otpSent && (
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Full Name
                </label>
                <div className="relative">
                  <div className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  </div>
                  <input 
                    onChange={(e)=>setName(e.target.value)} 
                    value={name} 
                    type="text" 
                    className={`w-full pl-12 pr-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                      isDarkMode 
                        ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-indigo-500' 
                        : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:bg-white'
                    }`}
                    placeholder="John Doe" 
                    required 
                  />
                </div>
              </div>
            )}
            
            {!otpSent ? (
              <>
                {/* Email for OTP */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    Email Address <span className="text-xs font-normal opacity-70">(OTP will be sent here)</span>
                  </label>
                  <div className="relative">
                    <div className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                      </svg>
                    </div>
                    <input 
                      onChange={(e) => setOtpEmail(e.target.value)} 
                      value={otpEmail} 
                      type="email" 
                      className={`w-full pl-12 pr-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                        isDarkMode 
                          ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-indigo-500' 
                          : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:bg-white'
                      }`}
                      placeholder="john@example.com" 
                      required 
                    />
                  </div>
                </div>

                {/* Phone Number - Optional */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    Phone Number <span className="text-xs font-normal opacity-70">(optional)</span>
                  </label>
                  <div className="flex gap-2">
                    <select 
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className={`w-24 px-3 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                        isDarkMode 
                          ? 'bg-slate-700 border-slate-600 text-white focus:border-indigo-500' 
                          : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-indigo-500 focus:bg-white'
                      }`}
                    >
                      <option value="+1">+1 (US)</option>
                      <option value="+44">+44 (UK)</option>
                      <option value="+91">+91 (IN)</option>
                      <option value="+86">+86 (CN)</option>
                      <option value="+81">+81 (JP)</option>
                      <option value="+49">+49 (DE)</option>
                      <option value="+33">+33 (FR)</option>
                      <option value="+971">+971 (UAE)</option>
                      <option value="+966">+966 (SA)</option>
                      <option value="+20">+20 (EG)</option>
                    </select>
                    <div className="relative flex-1">
                      <div className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                        </svg>
                      </div>
                      <input 
                        onChange={(e) => setPhone(e.target.value)} 
                        value={phone} 
                        type="tel" 
                        className={`w-full pl-12 pr-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                          isDarkMode 
                            ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-indigo-500' 
                            : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:bg-white'
                        }`}
                        placeholder="123 456 7890" 
                      />
                    </div>
                  </div>
                </div>

                <button 
                  type="button"
                  onClick={handleSendOTP}
                  disabled={otpLoading}
                  className="w-full py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 transition-all duration-300 shadow-lg shadow-sky-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {otpLoading ? 'Sending OTP...' : 'Send OTP to Email'}
                </button>
              </>
            ) : (
              <>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    Enter OTP
                  </label>
                  <p className={`text-xs mb-3 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    Code sent to {otpEmail}
                  </p>
                  <input 
                    onChange={(e) => setOtp(e.target.value)} 
                    value={otp} 
                    type="text" 
                    maxLength={6}
                    className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-center text-2xl tracking-[0.5em] font-mono ${
                      isDarkMode 
                        ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-indigo-500' 
                        : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:bg-white'
                    }`}
                    placeholder="000000" 
                    required 
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 transition-all duration-300 shadow-lg shadow-sky-500/25"
                >
                  Verify & {currentState === 'Login' ? 'Sign In' : 'Create Account'}
                </button>

                <button 
                  type="button"
                  onClick={() => setOtpSent(false)}
                  className={`w-full text-sm ${isDarkMode ? 'text-slate-400 hover:text-slate-300' : 'text-slate-600 hover:text-slate-800'}`}
                >
                  ← Change email
                </button>
              </>
            )}

            {/* Toggle Sign Up / Login for phone */}
            <div className='flex justify-center text-sm pt-2'>
              <button 
                type="button"
                onClick={() => { setCurrentState(currentState === 'Login' ? 'Sign Up' : 'Login'); setOtpSent(false); }} 
                className={`font-medium hover:underline ${isDarkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'}`}
              >
                {currentState === 'Login' ? 'Create account' : 'Sign in instead'}
              </button>
            </div>
          </form>
        )}

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className={`flex-1 h-px ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
          <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>or continue with</span>
          <div className={`flex-1 h-px ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
        </div>

        {/* Social Login Buttons */}
        <div className="grid grid-cols-3 gap-3">
          <button 
            onClick={handleGoogleLogin}
            className={`flex items-center justify-center gap-2 py-3 rounded-xl border transition-all ${
            isDarkMode 
              ? 'border-slate-600 hover:bg-slate-700 text-slate-300' 
              : 'border-slate-200 hover:bg-slate-50 text-slate-700'
          }`}>
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span className="text-sm font-medium hidden sm:inline">Google</span>
          </button>
          <button 
            onClick={handleGithubLogin}
            className={`flex items-center justify-center gap-2 py-3 rounded-xl border transition-all ${
            isDarkMode 
              ? 'border-slate-600 hover:bg-slate-700 text-slate-300' 
              : 'border-slate-200 hover:bg-slate-50 text-slate-700'
          }`}>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.341-3.369-1.341-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
            </svg>
            <span className="text-sm font-medium hidden sm:inline">GitHub</span>
          </button>
          <button 
            onClick={handleFacebookLogin}
            className={`flex items-center justify-center gap-2 py-3 rounded-xl border transition-all ${
            isDarkMode 
              ? 'border-slate-600 hover:bg-slate-700 text-slate-300' 
              : 'border-slate-200 hover:bg-slate-50 text-slate-700'
          }`}>
            <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            <span className="text-sm font-medium hidden sm:inline">Facebook</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login
