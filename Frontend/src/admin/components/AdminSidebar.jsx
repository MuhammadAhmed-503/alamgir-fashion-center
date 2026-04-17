import React from 'react'
import { NavLink } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'

// Icons
const AddIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

const ListIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
  </svg>
);

const OrderIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
  </svg>
);

const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 2.622a1.5 1.5 0 011.16 0l1.23.51a1.5 1.5 0 001.593-.327l.975-.976a1.5 1.5 0 012.121 0l.707.707a1.5 1.5 0 010 2.121l-.976.975a1.5 1.5 0 00-.327 1.593l.51 1.23a1.5 1.5 0 010 1.16l-.51 1.23a1.5 1.5 0 00.327 1.593l.976.975a1.5 1.5 0 010 2.121l-.707.707a1.5 1.5 0 01-2.121 0l-.975-.976a1.5 1.5 0 00-1.593-.327l-1.23.51a1.5 1.5 0 01-1.16 0l-1.23-.51a1.5 1.5 0 00-1.593.327l-.975.976a1.5 1.5 0 01-2.121 0l-.707-.707a1.5 1.5 0 010-2.121l.976-.975a1.5 1.5 0 00.327-1.593l-.51-1.23a1.5 1.5 0 010-1.16l.51-1.23a1.5 1.5 0 00-.327-1.593l-.976-.975a1.5 1.5 0 010-2.121l.707-.707a1.5 1.5 0 012.121 0l.975.976a1.5 1.5 0 001.593.327l1.23-.51z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

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

const Sidebar = ({ isOpen, onClose, onLogout }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  const linkClass = `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium`;
  const getLinkStyle = (isActive) => {
    if (isActive) return linkClass;
    return `${linkClass} ${isDarkMode 
      ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-200' 
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'}`;
  };

  return (
    <div
      className={`fixed left-0 top-[72px] h-[calc(100vh-72px)] overflow-y-auto z-40 w-[240px] border-r transform transition-transform duration-300 md:static md:top-auto md:h-full md:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } ${isDarkMode ? 'border-slate-700 bg-slate-900' : 'border-gray-200 bg-white'}`}
    >
      <div className='pt-6 px-4 md:hidden'>
        <div className='flex items-center justify-between'>
          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${isDarkMode ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-600'}`}>
            Admin
          </span>
          <button
            type="button"
            onClick={onClose}
            className={`p-2 rounded-xl ${isDarkMode ? 'text-slate-200 hover:bg-slate-800' : 'text-slate-700 hover:bg-slate-100'}`}
            aria-label="Close menu"
          >
            <CloseIcon />
          </button>
        </div>

        <div className='mt-4 flex items-center gap-3'>
          <button
            type="button"
            onClick={toggleTheme}
            className={`p-2.5 rounded-xl transition-all duration-300 ${isDarkMode ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            aria-label="Toggle theme"
          >
            {isDarkMode ? <SunIcon /> : <MoonIcon />}
          </button>

          <button
            type="button"
            onClick={() => {
              onClose?.();
              onLogout?.();
            }}
            className="flex-1 bg-gradient-to-r from-indigo-500 to-teal-600 hover:from-indigo-600 hover:to-teal-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 shadow-lg shadow-indigo-500/25"
          >
            Logout
          </button>
        </div>
      </div>

      <div className='flex flex-col gap-2 pt-6 px-4'>
        <p className={`hidden md:block text-xs font-semibold uppercase tracking-wider mb-2 px-4 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
          Menu
        </p>
        
        <NavLink 
          className={({isActive}) => getLinkStyle(isActive)} 
          to='/admin/add'
          onClick={onClose}
        >
          <AddIcon />
          <span>Add Product</span>
        </NavLink>
        
        <NavLink 
          className={({isActive}) => getLinkStyle(isActive)} 
          to='/admin/products'
          onClick={onClose}
        >
          <ListIcon />
          <span>Products</span>
        </NavLink>
        
        <NavLink 
          className={({isActive}) => getLinkStyle(isActive)} 
          to='/admin/orders'
          onClick={onClose}
        >
          <OrderIcon />
          <span>Orders</span>
        </NavLink>

        <NavLink
          className={({ isActive }) => getLinkStyle(isActive)}
          to="/admin/settings"
          onClick={onClose}
        >
          <SettingsIcon />
          <span>Settings</span>
        </NavLink>
      </div>
    </div>
  )
}

export default Sidebar
