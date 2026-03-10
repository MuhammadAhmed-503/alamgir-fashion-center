import React from "react";
import { assets } from "../assets/assets";
import { useTheme } from "../context/ThemeContext";
import { Link } from "react-router-dom";

const Hero = () => {
  const { isDarkMode } = useTheme();
  
  return (
    <div className={`relative overflow-hidden rounded-3xl my-6 ${isDarkMode ? 'bg-gradient-to-br from-slate-800 via-slate-900 to-indigo-950' : 'bg-gradient-to-br from-indigo-50 via-white to-teal-50'}`}>
      <div className="flex flex-col lg:flex-row items-center">
        {/* Left Section */}
        <div className="w-full lg:w-1/2 flex items-center justify-center py-12 lg:py-20 px-8 lg:px-12">
          <div className="max-w-lg">
            <div className="flex items-center gap-3 mb-6">
              <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${isDarkMode ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-600'}`}>
                New Collection 2026
              </span>
            </div>
            <h1 className={`prata-regular text-4xl sm:text-5xl lg:text-6xl leading-tight mb-6 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
              Discover Your
              <span className="block bg-gradient-to-r from-indigo-500 to-teal-600 bg-clip-text text-transparent">
                Perfect Style
              </span>
            </h1>
            <p className={`text-lg mb-8 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Explore our latest arrivals featuring premium quality, timeless designs, and unbeatable comfort for every occasion.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                to="/collection"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-500 to-teal-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 hover:-translate-y-1"
              >
                Shop Now
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <Link 
                to="/about"
                className={`inline-flex items-center gap-2 px-8 py-4 font-semibold rounded-xl transition-all duration-300 ${isDarkMode ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-white text-slate-800 hover:bg-slate-50 shadow-md'}`}
              >
                Learn More
              </Link>
            </div>
            
            {/* Stats */}
            <div className="flex gap-8 mt-12">
              <div>
                <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>10K+</p>
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Happy Customers</p>
              </div>
              <div>
                <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>500+</p>
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Products</p>
              </div>
              <div>
                <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>4.9</p>
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Rating</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Section */}
        <div className="w-full lg:w-1/2 relative">
          <div className="relative">
            <img 
              className="w-full h-[400px] lg:h-[600px] object-cover lg:rounded-l-[60px]" 
              src={assets.hero_img} 
              alt="Hero" 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-teal-500/20 lg:rounded-l-[60px]"></div>
          </div>
          
          {/* Floating Card */}
          <div className={`absolute bottom-8 left-8 right-8 lg:left-auto lg:right-8 lg:bottom-12 p-6 rounded-2xl backdrop-blur-md ${isDarkMode ? 'bg-slate-900/80 border border-slate-700' : 'bg-white/80 border border-white/50'} shadow-xl`}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <div>
                <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Free Shipping</p>
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>On orders over $50</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
    </div>
  );
};

export default Hero;

