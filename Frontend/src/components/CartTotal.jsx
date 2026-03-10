import React from 'react'
import { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { useTheme } from '../context/ThemeContext'
import Title from './Title'

const CartTotal = () => {
  const { currency, delivery_fee, getCartAmount } = useContext(ShopContext)
  const { isDarkMode } = useTheme()

  return (
    <div className='w-full'>
      <div className='mb-4'>
        <Title text1={'CART'} text2={'TOTALS'} />
      </div>

      <div className='flex flex-col gap-4'>
        <div className='flex justify-between items-center'>
          <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>Subtotal</p>
          <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{currency}{getCartAmount().toFixed(2)}</p>
        </div>
        <div className={`h-px ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
        <div className='flex justify-between items-center'>
          <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>Shipping Fee</p>
          <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{currency}{delivery_fee.toFixed(2)}</p>
        </div>
        <div className={`h-px ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
        <div className='flex justify-between items-center'>
          <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Total</p>
          <p className='text-xl font-bold bg-gradient-to-r from-indigo-500 to-teal-600 bg-clip-text text-transparent'>
            {currency}{getCartAmount() === 0 ? '0.00' : (getCartAmount() + delivery_fee).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  )
}

export default CartTotal
