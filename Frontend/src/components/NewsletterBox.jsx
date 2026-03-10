import React from 'react'
import { useTheme } from '../context/ThemeContext'

const NewsletterBox = () => {
  const { isDarkMode } = useTheme();
  
  const onSubmitHandler = (e) => {
    e.preventDefault();
  }
  
  return (
    <div className={`my-16 py-16 px-8 rounded-3xl text-center relative overflow-hidden ${isDarkMode ? 'bg-gradient-to-br from-indigo-900 via-slate-900 to-teal-900' : 'bg-gradient-to-br from-indigo-600 via-teal-600 to-indigo-700'}`}>
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      
      <div className="relative z-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          </svg>
        </div>
        
        <h2 className='text-2xl sm:text-3xl font-bold text-white mb-3'>
          Get 20% Off Your First Order
        </h2>
        <p className='text-white/80 mb-8 max-w-md mx-auto'>
          Subscribe to our newsletter and be the first to know about new arrivals, exclusive offers, and style tips.
        </p>
        
        <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row items-center justify-center gap-3 max-w-lg mx-auto'>
          <div className="relative flex-1 w-full">
            <input 
              className='w-full px-5 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 outline-none focus:border-white/40 transition-all' 
              type="email" 
              placeholder='Enter your email address' 
              required 
            />
          </div>
          <button 
            className='w-full sm:w-auto px-8 py-4 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-slate-100 transition-all duration-300 hover:shadow-lg' 
            type="submit"
          >
            Subscribe
          </button>
        </form>
        
        <p className="text-white/60 text-sm mt-4">
          No spam, unsubscribe anytime.
        </p>
      </div>
    </div>
  )
}

export default NewsletterBox
