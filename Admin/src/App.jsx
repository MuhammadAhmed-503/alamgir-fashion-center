import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Routes, Route } from "react-router-dom";
import Add from "./pages/Add";
import List from "./pages/List";
import Orders from "./pages/Orders";
import Login from "./components/Login";
import { ToastContainer } from 'react-toastify';
import { useTheme } from './context/ThemeContext';

const App = () => {
  const { isDarkMode } = useTheme();
  const [token, setToken] = useState(localStorage.getItem("token") ? localStorage.getItem("token") : "");
  
  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
      <ToastContainer theme={isDarkMode ? 'dark' : 'light'} />
      {token === ""
      ? <Login setToken={setToken} /> 
      : <>
        <Navbar setToken={setToken} />
        <div className={`border-b ${isDarkMode ? 'border-slate-700' : 'border-gray-200'}`}></div>
        <div className="flex w-full">
          <Sidebar />
          <div className={`flex-1 mx-auto ml-[max(5vw,25px)] my-8 text-base ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
            <Routes>
              <Route path="/add" element={<Add token={token}/>} />
              <Route path="/list" element={<List token={token}/>} />
              <Route path="/orders" element={<Orders token={token}/>} />
            </Routes>
          </div>
        </div>
      </>}
      
    </div>
  );
};

export default App;
