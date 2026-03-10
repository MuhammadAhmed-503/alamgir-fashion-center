import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import { useTheme } from '../context/ThemeContext'

const ProductItem = ({ id, image, name, price, colors }) => {
  const { currency } = useContext(ShopContext);
  const { isDarkMode } = useTheme();
  
  return (
    <div className={`product-card group rounded-2xl overflow-hidden transition-all duration-300 ${isDarkMode ? 'bg-slate-800 hover:bg-slate-750' : 'bg-white hover:shadow-xl'} border ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
      <Link className='block' to={`/product/${id}`}>
        <div className='relative overflow-hidden aspect-[3/4]'>
          <img 
            className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110' 
            src={image[0]} 
            alt={name} 
          />
          {/* Quick View Badge */}
          <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
            <div className='absolute bottom-4 left-4 right-4'>
              <span className='inline-flex items-center gap-2 px-4 py-2 bg-white text-slate-800 text-sm font-medium rounded-full'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.64 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.64 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Quick View
              </span>
            </div>
          </div>
        </div>
        <div className='p-4'>
          <p className={`text-sm font-medium mb-2 line-clamp-2 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{name}</p>
          
          {/* Color Swatches Preview */}
          {colors && colors.length > 0 && (
            <div className='flex gap-1 mb-2'>
              {colors.slice(0, 4).map((color, index) => (
                <span 
                  key={index} 
                  className='w-4 h-4 rounded-full border border-slate-300'
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
              {colors.length > 4 && (
                <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>+{colors.length - 4}</span>
              )}
            </div>
          )}
          
          <div className='flex items-center justify-between'>
            <p className='text-lg font-bold bg-gradient-to-r from-indigo-500 to-teal-600 bg-clip-text text-transparent'>
              {currency}{price}
            </p>
            <span className={`p-2 rounded-full transition-colors ${isDarkMode ? 'bg-slate-700 hover:bg-indigo-500' : 'bg-slate-100 hover:bg-indigo-500'} group-hover:bg-indigo-500`}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-4 h-4 transition-colors ${isDarkMode ? 'text-slate-300' : 'text-slate-600'} group-hover:text-white`}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
            </span>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default ProductItem
