import React from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { assets } from '../assets/assets'
import { ShopContext } from '../context/ShopContext'

const Footer = () => {
  const { isDarkMode } = useTheme();
  const { logoUrl } = React.useContext(ShopContext);
  
  return (
    <footer className={`mt-20 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
      <div className='py-16'>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12'>
          {/* Brand Section */}
          <div className='lg:col-span-1'>
            <Link to="/" className="flex items-center gap-2 mb-6">
              <img src={logoUrl || assets.logo} alt="Alamgir Fashion Center" className="w-10 h-10" />
              <span className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Alamgir Fashion Center</span>
            </Link>
            <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Discover the latest trends in fashion. We bring you quality clothing that combines style, comfort, and affordability.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="#" className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isDarkMode ? 'bg-slate-800 text-slate-400 hover:bg-indigo-500 hover:text-white' : 'bg-slate-100 text-slate-600 hover:bg-indigo-500 hover:text-white'}`}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </a>
              <a href="#" className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isDarkMode ? 'bg-slate-800 text-slate-400 hover:bg-indigo-500 hover:text-white' : 'bg-slate-100 text-slate-600 hover:bg-indigo-500 hover:text-white'}`}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="#" className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isDarkMode ? 'bg-slate-800 text-slate-400 hover:bg-indigo-500 hover:text-white' : 'bg-slate-100 text-slate-600 hover:bg-indigo-500 hover:text-white'}`}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className={`text-lg font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Quick Links</h3>
            <ul className='flex flex-col gap-3'>
              <li>
                <Link to="/" className={`text-sm transition-colors ${isDarkMode ? 'text-slate-400 hover:text-indigo-400' : 'text-slate-600 hover:text-indigo-600'}`}>Home</Link>
              </li>
              <li>
                <Link to="/collection" className={`text-sm transition-colors ${isDarkMode ? 'text-slate-400 hover:text-indigo-400' : 'text-slate-600 hover:text-indigo-600'}`}>Collection</Link>
              </li>
              <li>
                <Link to="/about" className={`text-sm transition-colors ${isDarkMode ? 'text-slate-400 hover:text-indigo-400' : 'text-slate-600 hover:text-indigo-600'}`}>About Us</Link>
              </li>
              <li>
                <Link to="/contact" className={`text-sm transition-colors ${isDarkMode ? 'text-slate-400 hover:text-indigo-400' : 'text-slate-600 hover:text-indigo-600'}`}>Contact</Link>
              </li>
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h3 className={`text-lg font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Support</h3>
            <ul className='flex flex-col gap-3'>
              <li>
                <a href="#" className={`text-sm transition-colors ${isDarkMode ? 'text-slate-400 hover:text-indigo-400' : 'text-slate-600 hover:text-indigo-600'}`}>FAQ</a>
              </li>
              <li>
                <a href="#" className={`text-sm transition-colors ${isDarkMode ? 'text-slate-400 hover:text-indigo-400' : 'text-slate-600 hover:text-indigo-600'}`}>Shipping & Returns</a>
              </li>
              <li>
                <a href="#" className={`text-sm transition-colors ${isDarkMode ? 'text-slate-400 hover:text-indigo-400' : 'text-slate-600 hover:text-indigo-600'}`}>Privacy Policy</a>
              </li>
              <li>
                <a href="#" className={`text-sm transition-colors ${isDarkMode ? 'text-slate-400 hover:text-indigo-400' : 'text-slate-600 hover:text-indigo-600'}`}>Terms of Service</a>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className={`text-lg font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Contact Us</h3>
            <ul className='flex flex-col gap-4'>
              <li className='flex items-start gap-3'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 mt-0.5 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>54709 Willms Station, Suite 350, Washington, USA</span>
              </li>
              <li className='flex items-center gap-3'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
                <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>(415) 555-0132</span>
              </li>
              <li className='flex items-center gap-3'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>support@alamgirfashion.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className={`py-6 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className='flex flex-col sm:flex-row justify-between items-center gap-4'>
          <p className={`text-sm ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
            © 2026 Alamgir Fashion Center. All rights reserved.
          </p>
          <div className='flex items-center gap-4'>
            <img src="https://cdn-icons-png.flaticon.com/128/349/349221.png" alt="Visa" className='h-6 opacity-50 hover:opacity-100 transition-opacity' />
            <img src="https://cdn-icons-png.flaticon.com/128/349/349228.png" alt="Mastercard" className='h-6 opacity-50 hover:opacity-100 transition-opacity' />
            <img src="https://cdn-icons-png.flaticon.com/128/349/349230.png" alt="PayPal" className='h-6 opacity-50 hover:opacity-100 transition-opacity' />
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
