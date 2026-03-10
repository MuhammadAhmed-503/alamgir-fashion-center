import React from "react";
import { assets } from "../assets/assets";
import { NavLink, Link, } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { useTheme } from "../context/ThemeContext";

// Theme Toggle Icons
const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
  </svg>
);

const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
  </svg>
);

const Navbar = () => {
  const [visible, setVisible] = React.useState(false);
  const {setShowSearch, getCartCount, navigate, token, setToken, setCartItems} = React.useContext(ShopContext);
  const { isDarkMode, toggleTheme } = useTheme();

  const logout = () => {
    navigate('/login');
    localStorage.removeItem('token');
    setToken('');
    setCartItems({});
  }

  return (
    <>
      <div className={`flex items-center justify-between py-5 font-medium sticky top-0 z-50 backdrop-blur-md ${isDarkMode ? 'bg-slate-900/95' : 'bg-white/95'}`}>
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">F</span>
          </div>
          <span className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Alamgir Fashion Center</span>
        </Link>
        <ul className={`hidden sm:flex gap-6 text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
          <NavLink to="/" className={({ isActive }) => `flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-300 hover:${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'} ${isActive ? (isDarkMode ? 'text-sky-400 bg-slate-800' : 'text-sky-600 bg-sky-50') : ''}`}>
            <p className="font-medium">HOME</p>
          </NavLink>
          <NavLink
            to="/collection"
            className={({ isActive }) => `flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-300 hover:${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'} ${isActive ? (isDarkMode ? 'text-sky-400 bg-slate-800' : 'text-sky-600 bg-sky-50') : ''}`}
          >
            <p className="font-medium">COLLECTION</p>
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => `flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-300 hover:${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'} ${isActive ? (isDarkMode ? 'text-sky-400 bg-slate-800' : 'text-sky-600 bg-sky-50') : ''}`}>
            <p className="font-medium">ABOUT</p>
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => `flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-300 hover:${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'} ${isActive ? (isDarkMode ? 'text-sky-400 bg-slate-800' : 'text-sky-600 bg-sky-50') : ''}`}>
            <p className="font-medium">CONTACT</p>
          </NavLink>
        </ul>
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-all duration-300 ${isDarkMode ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            aria-label="Toggle theme"
          >
            {isDarkMode ? <SunIcon /> : <MoonIcon />}
          </button>
          
          {/* Search Icon */}
          <button
            onClick={() => setShowSearch(true)}
            className={`p-2 rounded-full transition-all duration-300 ${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </button>
          
          {/* Profile Dropdown */}
          <div className="group relative">
            <button 
              onClick={()=> token ? null : navigate('/login')}
              className={`p-2 rounded-full transition-all duration-300 ${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </button>
            {token &&
            <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4 z-20">
              <div className={`flex flex-col gap-1 w-44 py-3 px-4 rounded-xl shadow-xl ${isDarkMode ? 'bg-slate-800 text-slate-200' : 'bg-white text-slate-600'} border ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                <p onClick={()=>{navigate('/profile')}} className={`cursor-pointer px-3 py-2 rounded-lg transition-all ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}>My Profile</p>
                <p onClick={()=>{navigate('/orders')}} className={`cursor-pointer px-3 py-2 rounded-lg transition-all ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}>Orders</p>
                <button onClick={logout} className={`cursor-pointer px-3 py-2 rounded-lg transition-all text-left text-red-500 ${isDarkMode ? 'hover:bg-red-900/30' : 'hover:bg-red-50'}`}>Logout</button>
              </div>
            </div>
            }
          </div>
          
          {/* Cart */}
          <Link to="/cart" className="relative">
            <div className={`p-2 rounded-full transition-all duration-300 ${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
            </div>
            <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-gradient-to-r from-sky-500 to-cyan-600 text-white text-xs font-bold rounded-full">
              {getCartCount()}
            </span>
          </Link>
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setVisible(true)}
            className={`p-2 rounded-full sm:hidden transition-all duration-300 ${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
        
        {/* Mobile Menu */}
        <div
          className={`fixed inset-0 z-50 transition-all duration-300 ${
            visible ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        >
          <div className={`absolute inset-0 bg-black/50 backdrop-blur-sm`} onClick={() => setVisible(false)}></div>
          <div className={`absolute top-0 right-0 h-full w-72 ${isDarkMode ? 'bg-slate-900' : 'bg-white'} shadow-2xl transition-transform duration-300 ${visible ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="flex flex-col h-full">
              <div className={`flex items-center justify-between p-4 border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                <span className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Menu</span>
                <button
                  onClick={() => setVisible(false)}
                  className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-600'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex flex-col p-4 gap-2">
                <NavLink
                  onClick={() => setVisible(false)}
                  className={({ isActive }) => `px-4 py-3 rounded-xl font-medium transition-all ${isActive ? 'bg-gradient-to-r from-sky-500 to-cyan-600 text-white' : (isDarkMode ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100')}`}
                  to="/"
                >
                  HOME
                </NavLink>
                <NavLink
                  onClick={() => setVisible(false)}
                  className={({ isActive }) => `px-4 py-3 rounded-xl font-medium transition-all ${isActive ? 'bg-gradient-to-r from-sky-500 to-cyan-600 text-white' : (isDarkMode ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100')}`}
                  to="/collection"
                >
                  COLLECTION
                </NavLink>
                <NavLink
                  onClick={() => setVisible(false)}
                  className={({ isActive }) => `px-4 py-3 rounded-xl font-medium transition-all ${isActive ? 'bg-gradient-to-r from-sky-500 to-cyan-600 text-white' : (isDarkMode ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100')}`}
                  to="/about"
                >
                  ABOUT
                </NavLink>
                <NavLink
                  onClick={() => setVisible(false)}
                  className={({ isActive }) => `px-4 py-3 rounded-xl font-medium transition-all ${isActive ? 'bg-gradient-to-r from-sky-500 to-cyan-600 text-white' : (isDarkMode ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100')}`}
                  to="/contact"
                >
                  CONTACT
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
