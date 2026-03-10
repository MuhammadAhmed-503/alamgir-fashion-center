import React from 'react'
import { useTheme } from '../context/ThemeContext'

const Title = ({text1, text2}) => {
  const { isDarkMode } = useTheme();
  
  return (
    <div className='inline-flex items-center gap-3'>
      <p className={`text-2xl sm:text-3xl ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
        {text1} <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{text2}</span>
      </p>
      <div className='w-12 sm:w-16 h-1 rounded-full bg-gradient-to-r from-indigo-500 to-teal-600'></div>
    </div>
  )
}

export default Title
