import React, { useContext, useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useLocation, useNavigate } from 'react-router-dom'
import Home from './Pages/Home'
import Collection from './Pages/Collection'
import About from './Pages/About'
import Product from './Pages/Product'
import Cart from './Pages/Cart'
import Login from './Pages/Login'
import PlaceOrder from './Pages/PlaceOrder'
import Orders from './Pages/Orders'
import Contact from './Pages/Contact'
import AuthCallback from './Pages/AuthCallback'
import Profile from './Pages/Profile'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SearchBar from './components/SearchBar'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTheme } from './context/ThemeContext'
import { ShopContext } from './context/ShopContext'
import AdminLayout from './admin/AdminLayout'


const App = () => {
  const { isDarkMode } = useTheme();
  const { logoUrl } = useContext(ShopContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken') || '');

  useEffect(() => {
    localStorage.setItem('adminToken', adminToken);
  }, [adminToken]);

  const handleAdminLogout = () => {
    setAdminToken('');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('authRole');
    navigate('/login');
  };

  const isAdminArea = location.pathname.startsWith('/admin');

  if (isAdminArea) {
    return (
      <>
        <ToastContainer
          theme={isDarkMode ? 'dark' : 'light'}
          position='top-right'
          autoClose={3000}
        />
        <AdminLayout
          adminToken={adminToken}
          onLogout={handleAdminLogout}
          logoUrl={logoUrl}
        />
      </>
    );
  }
  
  return (
    <div className={`min-h-screen transition-colors duration-300 overflow-x-hidden ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
      <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] max-w-full'>
        <ToastContainer 
          theme={isDarkMode ? 'dark' : 'light'}
          position="top-right"
          autoClose={3000}
        />
        <Navbar />
        <SearchBar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/collection' element={<Collection />} />
          <Route path='/product/:ProductId' element={<Product />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/about' element={<About />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/login' element={<Login />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/orders' element={<Orders />} />
          <Route path='/place-order' element={<PlaceOrder />} />
          <Route path='/verify' element={<Orders />} />
          <Route path='/auth/callback' element={<AuthCallback />} />
        </Routes>
        <Footer />
      </div>
    </div>
  )
}

export default App;