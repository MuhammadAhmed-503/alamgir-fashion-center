import React from 'react'
import { NavLink } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

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

const Sidebar = () => {
  const { isDarkMode } = useTheme();

  const linkClass = `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium`;
  const getLinkStyle = (isActive) => {
    if (isActive) return linkClass;
    return `${linkClass} ${isDarkMode 
      ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-200' 
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'}`;
  };

  return (
    <div className={`w-[220px] min-h-screen border-r ${isDarkMode ? 'border-slate-700 bg-slate-900' : 'border-gray-200 bg-white'}`}>
      <div className='flex flex-col gap-2 pt-6 px-4'>
        <p className={`text-xs font-semibold uppercase tracking-wider mb-2 px-4 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
          Menu
        </p>
        
        <NavLink 
          className={({isActive}) => getLinkStyle(isActive)} 
          to='/add'
        >
          <AddIcon />
          <span>Add Product</span>
        </NavLink>
        
        <NavLink 
          className={({isActive}) => getLinkStyle(isActive)} 
          to='/list'
        >
          <ListIcon />
          <span>Products</span>
        </NavLink>
        
        <NavLink 
          className={({isActive}) => getLinkStyle(isActive)} 
          to='/orders'
        >
          <OrderIcon />
          <span>Orders</span>
        </NavLink>
      </div>
    </div>
  )
}

export default Sidebar
