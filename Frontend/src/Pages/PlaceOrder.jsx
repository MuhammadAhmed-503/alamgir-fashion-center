import React, { useContext, useState, useEffect } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { ShopContext } from '../context/ShopContext'
import { useTheme } from '../context/ThemeContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'

const pakistanStates = [
  'Punjab',
  'Sindh',
  'Khyber Pakhtunkhwa',
  'Balochistan',
  'Islamabad Capital Territory',
  'Gilgit-Baltistan',
  'Azad Jammu and Kashmir'
]

const PlaceOrder = () => {
  const [method, setMethod] = useState('cod')
  const { getCartAmount, clearCart, placeOrder } = useContext(ShopContext)
  const { isDarkMode } = useTheme()
  const navigate = useNavigate()
  const {backendUrl, token, cartItems, setCartItems, delivery_fee, products} = useContext(ShopContext)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: 'Punjab',
    zipcode: '',
    country: 'Pakistan',
    phone: '',
  })

  const onChangeHandler = (event) => {
    const name = event.target.name
    const value = event.target.value
    setFormData(data => ({...data, [name]: value}))
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault()

    try {
      let orderItems = []
      
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(products.find(prod => prod._id === items))
            if (itemInfo) {
              itemInfo.size = item;
              itemInfo.quantity = cartItems[items][item];
              orderItems.push(itemInfo);
            }
          }
        }
      }

      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee,
      }

      switch (method) {
        case 'cod': {
          const response = await axios.post(backendUrl + '/api/order/place', orderData, {headers: {token}})
          if (response.data.success) {
            setCartItems({})
            navigate('/orders')
          } else {
            toast.error(response.data.message)
          }
          break;
        }

        case 'stripe': {
          const response = await axios.post(backendUrl + '/api/order/stripe', orderData, {headers: {token}})
          if (response.data.success) {
            const {url} = response.data;
            window.location.replace(url);
          } else {
            toast.error(response.data.message)
          }
          break;
        }

        default:
          toast.error('Invalid payment method');  
      }

    } catch (error) {
      console.log(error);
      toast.error({success:false, message: error.message});
    }
    
    if (getCartAmount() === 0) {
      toast.error('Your cart is empty!')
      return
    }

    const requiredFields = ['firstName', 'lastName', 'email', 'street', 'city', 'state', 'zipcode', 'country', 'phone']
    for (let field of requiredFields) {
      if (!formData[field].trim()) {
        toast.error(`Please fill in all required fields`)
        return
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address')
      return
    }

    const pakistanPostalCodeRegex = /^\d{5}$/
    if (!pakistanPostalCodeRegex.test(formData.zipcode.trim())) {
      toast.error('Please enter a valid Pakistani postal code (5 digits)')
      return
    }

    const pakistanPhoneRegex = /^(\+92|0)3\d{9}$/
    const normalizedPhone = formData.phone.replace(/[\s-]/g, '')
    if (!pakistanPhoneRegex.test(normalizedPhone)) {
      toast.error('Please enter a valid Pakistani mobile number (e.g. +923001234567 or 03001234567)')
      return
    }

    const orderDataLocal = {
      deliveryInfo: formData,
      paymentMethod: method
    };
    
    const orderId = placeOrder(orderDataLocal);
    toast.success(`Order #${orderId} placed successfully!`)
    
    clearCart()
    
    setTimeout(() => {
      navigate('/orders')
    }, 2000)
  }

  const inputClasses = `w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
    isDarkMode 
      ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-indigo-500' 
      : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:border-indigo-500'
  }`

  return (
    <form onSubmit={onSubmitHandler} className='py-10'>
      <div className='grid lg:grid-cols-2 gap-8'>
        {/* Delivery Information */}
        <div className={`p-6 lg:p-8 rounded-3xl ${isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-200'}`}>
          <div className='mb-6'>
            <Title text1={'DELIVERY'} text2={'INFORMATION'} />
          </div>
          
          <div className='space-y-4'>
            <div className='grid sm:grid-cols-2 gap-4'>
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  First Name
                </label>
                <input 
                  required
                  onChange={onChangeHandler}
                  name='firstName'
                  value={formData.firstName}
                  className={inputClasses}
                  type="text" 
                  placeholder='John' 
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Last Name
                </label>
                <input 
                  required
                  onChange={onChangeHandler}
                  name='lastName'
                  value={formData.lastName}
                  className={inputClasses}
                  type="text" 
                  placeholder='Doe' 
                />
              </div>
            </div>
            
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                Email Address
              </label>
              <input 
                required
                onChange={onChangeHandler}
                name='email'
                value={formData.email}
                className={inputClasses}
                type="email" 
                placeholder='john@example.com' 
              />
            </div>
            
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                Street Address
              </label>
              <input 
                required
                onChange={onChangeHandler}
                name='street'
                value={formData.street}
                className={inputClasses}
                type="text" 
                placeholder='123 Main Street' 
              />
            </div>
            
            <div className='grid sm:grid-cols-2 gap-4'>
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  City
                </label>
                <input 
                  required
                  onChange={onChangeHandler}
                  name='city'
                  value={formData.city}
                  className={inputClasses}
                  type="text" 
                  placeholder='Lahore' 
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Province / Territory
                </label>
                <select
                  required
                  onChange={onChangeHandler}
                  name='state'
                  value={formData.state}
                  className={inputClasses}
                >
                  {pakistanStates.map((stateName) => (
                    <option key={stateName} value={stateName}>{stateName}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className='grid sm:grid-cols-2 gap-4'>
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Postal Code
                </label>
                <input 
                  required
                  onChange={onChangeHandler}
                  name='zipcode'
                  value={formData.zipcode}
                  className={inputClasses}
                  type="text"
                  inputMode="numeric"
                  pattern="\d{5}"
                  maxLength={5}
                  placeholder='54000' 
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Country
                </label>
                <input 
                  required
                  onChange={onChangeHandler}
                  name='country'
                  value={formData.country}
                  className={inputClasses}
                  type="text" 
                  placeholder='Pakistan'
                  readOnly
                />
              </div>
            </div>
            
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                Phone Number
              </label>
              <input 
                required
                onChange={onChangeHandler}
                name='phone'
                value={formData.phone}
                className={inputClasses}
                type="tel" 
                placeholder='+923001234567' 
              />
            </div>
          </div>
        </div>

        {/* Order Summary & Payment */}
        <div className='space-y-6'>
          {/* Cart Total */}
          <div className={`p-6 lg:p-8 rounded-3xl ${isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-200'}`}>
            <CartTotal />
          </div>

          {/* Payment Method */}
          <div className={`p-6 lg:p-8 rounded-3xl ${isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-200'}`}>
            <div className='mb-6'>
              <Title text1={'PAYMENT'} text2={'METHOD'} />
            </div>
            
            <div className='space-y-3'>
              {/* Stripe Option */}
              <div 
                onClick={() => setMethod('stripe')} 
                className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer border-2 transition-all ${
                  method === 'stripe' 
                    ? `${isDarkMode ? 'border-indigo-500 bg-indigo-500/10' : 'border-indigo-500 bg-indigo-50'}` 
                    : `${isDarkMode ? 'border-slate-600 hover:border-slate-500' : 'border-slate-200 hover:border-slate-300'}`
                }`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  method === 'stripe' 
                    ? 'border-indigo-500' 
                    : `${isDarkMode ? 'border-slate-500' : 'border-slate-300'}`
                }`}>
                  {method === 'stripe' && (
                    <div className='w-3 h-3 rounded-full bg-indigo-500'></div>
                  )}
                </div>
                <div className='flex items-center gap-3'>
                  <svg viewBox="0 0 60 25" className="h-6" xmlns="http://www.w3.org/2000/svg">
                    <path d="M59.64 14.28h-8.06c.19 1.93 1.6 2.55 3.2 2.55 1.64 0 2.96-.37 4.05-.95v3.32a13.1 13.1 0 0 1-4.56.83c-4.14 0-6.9-2.25-6.9-6.64 0-3.6 2.34-6.83 6.28-6.83 3.94 0 5.99 3.08 5.99 6.72v1zm-8.06-2.55h4.38c0-1.1-.8-2.36-2.19-2.36-1.35 0-2.12 1.15-2.19 2.36zM40.95 20.3c-1.44 0-2.32-.56-2.9-1.18l-.02 5.15-4.2.9V7.08h3.63l.19 1.02c.63-.67 1.72-1.27 3.2-1.27 2.78 0 5.22 2.62 5.22 6.64-.02 4.27-2.42 6.83-5.12 6.83zm-.86-10.07c-.93 0-1.44.32-1.86.8l.04 5.03c.4.44.91.76 1.82.76 1.4 0 2.34-1.54 2.34-3.28 0-1.78-.94-3.3-2.34-3.3zM28.24 5.07l-4.2.9v14.16h4.2V5.07zm-4.22 14.58L22.3 20.3h-.9c-.94 0-1.48-.43-1.48-1.48V10.4h2.7V7.08h-2.7l-.02-3.8-4.14.9-.02 2.9H13.4v3.32h2.34v7.65c0 2.58 1.56 4.03 4.12 4.03 1 0 2.02-.19 2.76-.45l.02-.02-.62-3.96zm-11.65-9.18c0 1.31.87 1.65 2.12 1.65.83 0 1.73-.15 2.58-.4v3.7a9.48 9.48 0 0 1-3.65.61c-3.53 0-5.22-1.44-5.22-4.7V.26L12.37 0v10.47zM8.98 7.08c-1.83-.02-3.39.87-4.22 2.3l-.19-2.05H.98v12.5H5.2v-6.83c0-1.78 1.02-2.74 2.17-2.74.46 0 .94.08 1.44.24L9.02 7.1l-.04-.02z" fill="#6772E5"/>
                  </svg>
                  <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-700'}`}>Credit Card</span>
                </div>
              </div>

              {/* COD Option */}
              <div 
                onClick={() => setMethod('cod')} 
                className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer border-2 transition-all ${
                  method === 'cod' 
                    ? `${isDarkMode ? 'border-indigo-500 bg-indigo-500/10' : 'border-indigo-500 bg-indigo-50'}` 
                    : `${isDarkMode ? 'border-slate-600 hover:border-slate-500' : 'border-slate-200 hover:border-slate-300'}`
                }`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  method === 'cod' 
                    ? 'border-indigo-500' 
                    : `${isDarkMode ? 'border-slate-500' : 'border-slate-300'}`
                }`}>
                  {method === 'cod' && (
                    <div className='w-3 h-3 rounded-full bg-indigo-500'></div>
                  )}
                </div>
                <div className='flex items-center gap-3'>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                  </svg>
                  <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-700'}`}>Cash on Delivery</span>
                </div>
              </div>
            </div>

            {/* Place Order Button */}
            <button 
              type='submit' 
              className='w-full mt-6 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 transition-all duration-300 shadow-lg shadow-sky-500/25'
            >
              Place Order
            </button>
          </div>

          {/* Security Note */}
          <div className={`flex items-center gap-3 p-4 rounded-xl ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            <div>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Secure Checkout</p>
              <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Your payment information is encrypted and secure</p>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder
