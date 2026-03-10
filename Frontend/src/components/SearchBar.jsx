import React from "react";
import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { useTheme } from "../context/ThemeContext";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const SearchBar = () => {
  const { showSearch, setShowSearch, search, setSearch } =
    useContext(ShopContext);
  const { isDarkMode } = useTheme();
  const [visible, setVisible] = React.useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.includes("/collection")) {
      setVisible(true);
    } else {
      setVisible(false);
      setSearch(''); // Clear search when leaving collection page
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return showSearch && visible ? (
    <div className={`py-4 ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
      <div className="max-w-2xl mx-auto px-4">
        <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl border transition-all ${
          isDarkMode 
            ? 'bg-slate-800 border-slate-700 focus-within:border-indigo-500' 
            : 'bg-white border-slate-200 focus-within:border-indigo-500 shadow-sm'
        }`}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-5 h-5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            placeholder="Search for products..."
            className={`flex-1 outline-none bg-transparent text-sm ${isDarkMode ? 'text-white placeholder-slate-400' : 'text-slate-800 placeholder-slate-400'}`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button 
              onClick={() => setSearch('')}
              className={`p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          <button
            onClick={() => {
              setShowSearch(false);
              setSearch('');
            }}
            className={`p-2 rounded-xl transition-colors ${
              isDarkMode 
                ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default SearchBar;
