import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { backendUrl, currency } from '../config'
import { toast } from 'react-toastify'
import { useTheme } from '../context/ThemeContext'

// Parcel Icon SVG Component
const ParcelIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
)

const Orders = ({ token }) => {
  const { isDarkMode } = useTheme()
  const [orders, setOrders] = useState([])

  const fetchAllOrders = async () => {
    if (!token) return null;

    try {
      const response = await axios.post(
        backendUrl + '/api/order/list',
        {},
        { headers: { token } }
      )
      if (response.data.success) {
        setOrders(response.data.orders)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong')
    }
  }

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(
        backendUrl + '/api/order/status',
        { orderId, status: event.target.value },
        { headers: { token } }
      )
      if (response.data.success) {
        await fetchAllOrders()
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || 'Failed to update status')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Order Placed': return 'from-blue-500 to-indigo-600'
      case 'Packing': return 'from-yellow-500 to-amber-600'
      case 'Shipped': return 'from-blue-500 to-cyan-600'
      case 'Out for delivery': return 'from-orange-500 to-red-600'
      case 'Delivered': return 'from-green-500 to-emerald-600'
      default: return 'from-gray-500 to-slate-600'
    }
  }

  useEffect(() => {
    fetchAllOrders();
  }, [token])

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Orders</h2>
        <span className={`text-sm px-4 py-2 rounded-full ${isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
          {orders.length} orders
        </span>
      </div>

      {/* Orders List */}
      <div className='flex flex-col gap-4'>
        {orders.length === 0 ? (
          <div className={`text-center py-16 rounded-2xl ${isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-white text-gray-500'} border ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
            <ParcelIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="font-medium">No orders yet</p>
            <p className="text-sm opacity-75 mt-1">Orders will appear here when customers place them</p>
          </div>
        ) : (
          orders.map((order, index) => (
            <div
              key={index}
              className={`rounded-2xl border overflow-hidden transition-all ${
                isDarkMode 
                  ? 'bg-slate-800 border-slate-700 hover:border-slate-600' 
                  : 'bg-white border-slate-200 hover:shadow-lg'
              }`}
            >
              {/* Order Header with Status */}
              <div className={`px-6 py-4 border-b flex items-center justify-between ${isDarkMode ? 'border-slate-700 bg-slate-850' : 'border-slate-100 bg-slate-50'}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-r ${getStatusColor(order.status)}`}>
                    <ParcelIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                      Order #{order._id?.slice(-8).toUpperCase() || index + 1}
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      {new Date(order.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
                <div className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                  {currency}{order.amount}
                </div>
              </div>

              {/* Order Content */}
              <div className='grid grid-cols-1 lg:grid-cols-[2fr_1fr_1fr] gap-6 p-6'>
                {/* Items & Address */}
                <div>
                  <p className={`text-xs font-semibold uppercase tracking-wider mb-3 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                    Order Items
                  </p>
                  <div className={`space-y-2 mb-5 p-4 rounded-xl ${isDarkMode ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
                    {order.items.map((item, idx) => (
                      <div key={idx} className={`flex justify-between text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                        <span>{item.name} {item.size && <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${isDarkMode ? 'bg-slate-600 text-slate-300' : 'bg-slate-200 text-slate-600'}`}>{item.size}</span>}</span>
                        <span className="font-medium">×{item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <p className={`text-xs font-semibold uppercase tracking-wider mb-3 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                    Shipping Address
                  </p>
                  <div className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                    <p className={`font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                      {order.address.firstName + ' ' + order.address.lastName}
                    </p>
                    <p>{order.address.street}</p>
                    <p>{order.address.city}, {order.address.state} {order.address.zipcode}</p>
                    <p>{order.address.country}</p>
                    <p className="mt-2 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {order.address.phone}
                    </p>
                  </div>
                </div>

                {/* Order Info */}
                <div>
                  <p className={`text-xs font-semibold uppercase tracking-wider mb-3 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                    Order Details
                  </p>
                  <div className={`space-y-3 text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                    <div className='flex justify-between'>
                      <span>Items</span>
                      <span className="font-medium">{order.items.length}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span>Method</span>
                      <span className={`font-medium px-2 py-0.5 rounded-full text-xs ${isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-700'}`}>
                        {order.paymentMethod}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span>Payment</span>
                      <span className={`font-medium px-2 py-0.5 rounded-full text-xs ${
                        order.payment 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                          : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}>
                        {order.payment ? '✓ Paid' : '⏳ Pending'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Update */}
                <div>
                  <p className={`text-xs font-semibold uppercase tracking-wider mb-3 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                    Update Status
                  </p>
                  <select
                    onChange={(event) => statusHandler(event, order._id)}
                    value={order.status}
                    className={`w-full px-4 py-3 rounded-xl border font-semibold text-sm transition-all cursor-pointer ${
                      isDarkMode 
                        ? 'bg-slate-700 border-slate-600 text-white focus:border-indigo-500' 
                        : 'bg-white border-slate-200 text-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                    }`}
                  >
                    <option value='Order Placed'>📦 Order Placed</option>
                    <option value='Packing'>📋 Packing</option>
                    <option value='Shipped'>🚚 Shipped</option>
                    <option value='Out for delivery'>🏃 Out for delivery</option>
                    <option value='Delivered'>✅ Delivered</option>
                  </select>
                  
                  {/* Status Badge */}
                  <div className={`mt-3 px-4 py-2 rounded-xl text-center text-sm font-semibold text-white bg-gradient-to-r ${getStatusColor(order.status)}`}>
                    {order.status}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Orders
