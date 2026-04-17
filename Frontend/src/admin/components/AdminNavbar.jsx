import React from 'react'
import { useTheme } from '../../context/ThemeContext'
import { assets } from '../../assets/assets'

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

const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
  </svg>
);

const NavBar = ({ onLogout, onMenuClick, logoUrl }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div className={`flex items-center py-4 px-[4%] justify-between sticky top-0 z-50 backdrop-blur-md ${isDarkMode ? 'bg-slate-900/95' : 'bg-white/95'}`}>
      {/* Logo */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onMenuClick}
          className={`md:hidden p-2.5 rounded-xl transition-all duration-300 ${isDarkMode ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
          aria-label="Open menu"
        >
          <MenuIcon />
        </button>
        <img src={logoUrl || assets.logo} alt="Alamgir Fashion Center" className="w-10 h-10" />
        <div className="min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <span className={`text-xs sm:text-base md:text-xl font-bold leading-tight whitespace-normal ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
              Alamgir Fashion Center
            </span>
            <span className={`hidden md:inline-flex shrink-0 text-xs px-2 py-0.5 rounded-full ${isDarkMode ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-600'}`}>Admin</span>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="hidden md:flex items-center gap-3">
        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className={`p-2.5 rounded-xl transition-all duration-300 ${isDarkMode ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          aria-label="Toggle theme"
        >
          {isDarkMode ? <SunIcon /> : <MoonIcon />}
        </button>

        {/* Logout Button */}
        <button 
          onClick={onLogout}
          className='bg-gradient-to-r from-indigo-500 to-teal-600 hover:from-indigo-600 hover:to-teal-700 text-white px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 shadow-lg shadow-indigo-500/25'
        >
          Logout
        </button>
      </div>
    </div>
  )
}

export default NavBar
