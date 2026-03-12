import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Routes, Route } from "react-router-dom";
import Add from "./pages/Add";
import List from "./pages/List";
import Orders from "./pages/Orders";
import Settings from "./pages/Settings";
import Login from "./components/Login";
import { ToastContainer } from 'react-toastify';
import { useTheme } from './context/ThemeContext';
import { backendUrl } from "./config";

const App = () => {
  const { isDarkMode } = useTheme();
  const [token, setToken] = useState(localStorage.getItem("token") ? localStorage.getItem("token") : "");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState("");
  
  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await axios.get(backendUrl + "/api/settings/public");
        if (response.data?.success) {
          setLogoUrl(response.data.settings?.logoUrl || "");
        }
      } catch (err) {
        void err;
      }
    };
    loadSettings();
  }, []);

  return (
    <div className={`h-screen flex flex-col overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
      <ToastContainer theme={isDarkMode ? 'dark' : 'light'} />
      {token === ""
      ? <Login setToken={setToken} logoUrl={logoUrl} /> 
      : <>
        <Navbar setToken={setToken} onMenuClick={() => setIsSidebarOpen((prev) => !prev)} logoUrl={logoUrl} />
        <div className={`border-b ${isDarkMode ? 'border-slate-700' : 'border-gray-200'}`}></div>
        <div className="flex flex-1 w-full relative overflow-hidden">
          {isSidebarOpen && (
            <div
              className="fixed inset-x-0 bottom-0 top-[72px] z-30 bg-black/50 md:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            onLogout={() => setToken('')}
          />
          <div className={`flex-1 min-w-0 w-full overflow-y-auto px-4 sm:px-6 md:px-8 lg:px-10 py-6 md:py-8 text-base ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
            <Routes>
              <Route path="/add" element={<Add token={token}/>} />
              <Route path="/list" element={<List token={token}/>} />
              <Route path="/orders" element={<Orders token={token}/>} />
              <Route path="/settings" element={<Settings token={token}/>} />
            </Routes>
          </div>
        </div>
      </>}
      
    </div>
  );
};

export default App;
