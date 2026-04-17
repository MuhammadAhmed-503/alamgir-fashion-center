import React, { useEffect, useRef, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
import { backendUrl } from './config';
import AdminNavbar from './components/AdminNavbar';
import AdminSidebar from './components/AdminSidebar';
import Add from './pages/Add';
import List from './pages/List';
import Orders from './pages/Orders';
import Settings from './pages/Settings';

const ADMIN_IDLE_TIMEOUT_MS = 15 * 60 * 1000;

const AdminLayout = ({ adminToken, onLogout, logoUrl: initialLogoUrl = '' }) => {
  const { isDarkMode } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState(initialLogoUrl);
  const idleTimeoutRef = useRef(null);

  useEffect(() => {
    if (initialLogoUrl) {
      setLogoUrl(initialLogoUrl);
    }
  }, [initialLogoUrl]);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await axios.get(backendUrl + '/api/settings/public');
        if (response.data?.success) {
          setLogoUrl(response.data.settings?.logoUrl || '');
        }
      } catch (error) {
        void error;
      }
    };

    loadSettings();
  }, []);

  useEffect(() => {
    if (!adminToken) return;

    const startIdleTimer = () => {
      if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current);
      }

      idleTimeoutRef.current = setTimeout(() => {
        onLogout?.();
      }, ADMIN_IDLE_TIMEOUT_MS);
    };

    const activityEvents = ['click', 'mousemove', 'keydown', 'scroll', 'touchstart'];

    activityEvents.forEach((eventName) => {
      window.addEventListener(eventName, startIdleTimer);
    });

    startIdleTimer();

    return () => {
      if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current);
      }

      activityEvents.forEach((eventName) => {
        window.removeEventListener(eventName, startIdleTimer);
      });
    };
  }, [adminToken, onLogout]);

  if (!adminToken) {
    return <Navigate to='/login' replace />;
  }

  return (
    <div className={`h-screen flex flex-col overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
      <AdminNavbar
        onLogout={onLogout}
        onMenuClick={() => setIsSidebarOpen((prev) => !prev)}
        logoUrl={logoUrl}
      />
      <div className={`border-b ${isDarkMode ? 'border-slate-700' : 'border-gray-200'}`}></div>
      <div className='flex flex-1 w-full relative overflow-hidden'>
        {isSidebarOpen && (
          <div
            className='fixed inset-x-0 bottom-0 top-[72px] z-30 bg-black/50 md:hidden'
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <AdminSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onLogout={onLogout}
        />

        <div className={`flex-1 min-w-0 w-full overflow-y-auto px-4 sm:px-6 md:px-8 lg:px-10 py-6 md:py-8 text-base ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
          <Routes>
            <Route path='/admin' element={<Navigate to='/admin/orders' replace />} />
            <Route path='/admin/add' element={<Add token={adminToken} />} />
            <Route path='/admin/products' element={<List token={adminToken} />} />
            <Route path='/admin/orders' element={<Orders token={adminToken} />} />
            <Route path='/admin/settings' element={<Settings token={adminToken} />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
