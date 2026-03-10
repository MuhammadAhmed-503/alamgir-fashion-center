import React, { useContext, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import { useTheme } from '../context/ThemeContext'
import Title from '../components/Title'
import axios from 'axios'
import { toast } from 'react-toastify'

const Orders = () => {
  const { backendUrl, token, currency, parseSizeAndColor } = useContext(ShopContext);
  const { isDarkMode } = useTheme();

  const [orderData, setOrderData] = React.useState([]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const loadOrderData = async () => {
    try {
      if(!token) {
        return null;
      }
      const response = await axios.post(backendUrl + '/api/order/userorders', {}, {headers: {token}});
      if(response.data.success){
        let allOrdersItem = [];
        response.data.orders.map((order) => {
          order.items.map((item) => {
            item['status'] = order.status;
            item['payment'] = order.payment;
            item['paymentMethod'] = order.paymentMethod;
            item['date'] = order.date;
            allOrdersItem.push(item);
          })
        })
        setOrderData(allOrdersItem.reverse());
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

  React.useEffect(() => {
    loadOrderData();
  }, [token]);

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'delivered':
        return isDarkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700';
      case 'shipped':
        return isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700';
      case 'processing':
        return isDarkMode ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-100 text-yellow-700';
      case 'cancelled':
        return isDarkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-700';
      default:
        return isDarkMode ? 'bg-slate-500/20 text-slate-400' : 'bg-slate-100 text-slate-700';
    }
  };

  const getStatusDot = (status) => {
    switch(status?.toLowerCase()) {
      case 'delivered':
        return 'bg-green-500';
      case 'shipped':
        return 'bg-blue-500';
      case 'processing':
        return 'bg-yellow-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-slate-500';
    }
  };

  return (
    <div className='py-10'>
      <div className='mb-8'>
        <Title text1={'MY'} text2={'ORDERS'} />
        <p className={`mt-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          Track and manage your orders
        </p>
      </div>

      {orderData.length === 0 ? (
        <div className={`text-center py-20 rounded-3xl ${isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-200'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className={`w-20 h-20 mx-auto mb-6 ${isDarkMode ? 'text-slate-600' : 'text-slate-300'}`}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
          <p className={`text-xl font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>No orders yet</p>
          <p className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Start shopping to see your orders here</p>
        </div>
      ) : (
        <div className='space-y-4'>
          {orderData.map((item, index) => {
            const { size, color } = parseSizeAndColor ? parseSizeAndColor(item.size) : { size: item.size, color: null };
            
            return (
              <div 
                key={index} 
                className={`p-6 rounded-2xl transition-all ${
                  isDarkMode 
                    ? 'bg-slate-800 border border-slate-700 hover:border-slate-600' 
                    : 'bg-white border border-slate-200 hover:border-slate-300 hover:shadow-md'
                }`}
              >
                <div className='flex flex-col md:flex-row md:items-center gap-6'>
                  {/* Product Image */}
                  <div className={`w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 ${isDarkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>
                    <img className='w-full h-full object-cover' src={item.image[0]} alt={item.name} />
                  </div>
                  
                  {/* Product Details */}
                  <div className='flex-1'>
                    <h3 className={`font-semibold text-lg mb-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                      {item.name}
                    </h3>
                    <div className='flex flex-wrap items-center gap-4 text-sm'>
                      <span className={`font-bold text-lg ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
                        {currency}{item.price}
                      </span>
                      <span className={`px-3 py-1 rounded-lg ${isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-700'}`}>
                        Qty: {item.quantity}
                      </span>
                      <span className={`px-3 py-1 rounded-lg ${isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-700'}`}>
                        Size: {size}
                      </span>
                      {color && (
                        <span className={`px-3 py-1 rounded-lg flex items-center gap-2 ${isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-700'}`}>
                          Color: {color}
                        </span>
                      )}
                    </div>
                    <div className={`mt-3 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      <span>Ordered on {new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      <span className='mx-2'>•</span>
                      <span>Payment: {item.paymentMethod?.toUpperCase() || 'N/A'}</span>
                    </div>
                  </div>
                  
                  {/* Status & Action */}
                  <div className='flex flex-col sm:flex-row md:flex-col items-start sm:items-center md:items-end gap-3'>
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(item.status)}`}>
                      <span className={`w-2 h-2 rounded-full ${getStatusDot(item.status)}`}></span>
                      {item.status}
                    </div>
                    <button 
                      onClick={loadOrderData} 
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        isDarkMode 
                          ? 'bg-slate-700 text-white hover:bg-slate-600' 
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      Track Order
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  )
}

export default Orders
