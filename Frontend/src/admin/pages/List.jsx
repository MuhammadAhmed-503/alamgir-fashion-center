import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { backendUrl, currency } from '../config'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'

const List = ({token}) => {
  const { isDarkMode } = useTheme()
  const [list, setList] = useState([])
  const navigate = useNavigate()

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/product/list', { headers: { token } })
      if (response.data.success) {
        setList(response.data.products)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.error(error)
      toast.error(error.message)
    }
  }

  const removeProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }
    
    try {
      const response = await axios.post(
        backendUrl + '/api/product/remove',
        { id },
        { headers: { token } }
      )

      if (response.data.success) {
        toast.success(response.data.message)
        await fetchList()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.message || error.message)
    }
  }

  const editProduct = (id) => {
    navigate(`/admin/add?edit=${id}`)
  }

  useEffect(() => {
    if (token) {
      fetchList()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>All Products</h2>
        <span className={`text-sm px-4 py-2 rounded-full ${isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
          {list.length} products
        </span>
      </div>

      <div className='flex flex-col gap-3'>
        {/* List Table Title */}
        <div className={`hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] items-center py-4 px-5 text-sm font-semibold rounded-xl ${isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
          <span>Image</span>
          <span>Name</span>
          <span>Category</span>
          <span>Price</span>
          <span>Colors</span>
          <span className='text-center'>Actions</span>
        </div>

        {/* Product List */}
        {list.length === 0 ? (
          <div className={`text-center py-16 rounded-2xl ${isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-white text-gray-500'} border ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
            <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <p className="font-medium">No products found</p>
            <p className="text-sm opacity-75 mt-1">Add your first product to get started!</p>
          </div>
        ) : (
          list.map((item, index) => (
            <div 
              className={`grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] items-center gap-3 py-4 px-5 text-sm rounded-xl transition-all border ${
                isDarkMode 
                  ? 'bg-slate-800 border-slate-700 hover:bg-slate-750' 
                  : 'bg-white border-slate-200 hover:shadow-md'
              }`} 
              key={index}
            >
              <img className='w-14 h-14 object-cover rounded-xl' src={item.image[0]} alt={item.name} />
              <div>
                <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{item.name}</p>
                {item.bestSeller && (
                  <span className='text-xs bg-gradient-to-r from-amber-400 to-orange-500 text-white px-2.5 py-0.5 rounded-full font-medium'>
                    Best Seller
                  </span>
                )}
              </div>
              <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>{item.category}</p>
              <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{currency}{item.price}</p>
              <div className='flex gap-1 flex-wrap'>
                {item.colors && item.colors.length > 0 ? (
                  item.colors.slice(0, 3).map((color, idx) => (
                    <div 
                      key={idx}
                      className='w-6 h-6 rounded-full border-2 border-white shadow-sm'
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))
                ) : (
                  <span className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}>None</span>
                )}
                {item.colors && item.colors.length > 3 && (
                  <span className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>+{item.colors.length - 3}</span>
                )}
              </div>
              <div className='flex justify-center gap-2'>
                <button 
                  onClick={() => editProduct(item._id)} 
                  className='px-4 py-2 bg-gradient-to-r from-indigo-500 to-teal-600 text-white rounded-lg hover:from-indigo-600 hover:to-teal-700 text-xs font-semibold transition-all shadow-sm'
                >
                  Edit
                </button>
                <button 
                  onClick={() => removeProduct(item._id)} 
                  className='px-4 py-2 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-lg hover:from-red-600 hover:to-rose-700 text-xs font-semibold transition-all shadow-sm'
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  )
}

export default List
