import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LogOut, Sparkles, Shield, Sun, Moon, Menu } from 'lucide-react';

export const Navbar = ({ onToggleMobileMenu }) => {
  const { user, logout } = useAuth();
  const { isDark, setLight, setDark } = useTheme();

  return (
    <header className="h-16 flex-shrink-0 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 sm:px-6 2xl:px-8 flex items-center justify-between z-30 transition-colors">
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Menu Toggle */}
        <button
          onClick={onToggleMobileMenu}
          aria-label="Open navigation menu"
          className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Brand Icon & Name */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-bold shadow-md shadow-emerald-500/20">
            <Sparkles className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <span className="font-black text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white">
              Tasks90
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-semibold tracking-wide">
              WORKSPACE
            </span>
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Dual Light & Dark Mode Segmented Switch */}
        <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60">
          <button
            type="button"
            onClick={setLight}
            aria-label="Activate Light Mode"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              !isDark
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <Sun className={`w-3.5 h-3.5 ${!isDark ? 'text-amber-500' : ''}`} />
            <span className="hidden sm:inline">Light</span>
          </button>

          <button
            type="button"
            onClick={setDark}
            aria-label="Activate Dark Mode"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              isDark
                ? 'bg-slate-900 text-slate-100 shadow-sm border border-slate-700/80'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <Moon className={`w-3.5 h-3.5 ${isDark ? 'text-indigo-400' : ''}`} />
            <span className="hidden sm:inline">Dark</span>
          </button>
        </div>

        {/* Role badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-300">
          <Shield className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
          <span className="capitalize">{user?.role || 'member'}</span>
        </div>

        {/* User profile info & logout */}
        <div className="flex items-center gap-2 sm:gap-3 pl-2 border-l border-slate-200 dark:border-slate-800">
          <img
            src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'alex'}`}
            alt={user?.name}
            className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 object-cover"
          />
          <div className="hidden md:block text-left text-xs leading-tight">
            <p className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[120px]">{user?.name}</p>
            <p className="text-slate-400 text-[10px] truncate max-w-[120px]">{user?.title || 'Engineer'}</p>
          </div>
          <button
            onClick={logout}
            title="Log Out"
            className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:text-rose-400 dark:hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
