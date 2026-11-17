import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  PlusCircle,
  X,
} from 'lucide-react';

export const Sidebar = ({ isOpen, onClose, onOpenNewProject }) => {
  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Projects', path: '/projects', icon: FolderKanban },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container: Fixed and locked so mouse scrolling never shifts it */}
      <aside
        className={`fixed lg:relative inset-y-0 lg:inset-auto left-0 z-50 lg:z-10 w-64 lg:w-64 2xl:w-72 h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4 sm:p-5 flex flex-col justify-between flex-shrink-0 select-none transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Navigation Content Area (scrolls only internally if viewport height is small) */}
        <div className="space-y-6 overflow-y-auto flex-1 pr-1 overscroll-contain">
          {/* Mobile Header with Close button */}
          <div className="flex items-center justify-between lg:hidden pb-3 border-b border-slate-200 dark:border-slate-800">
            <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-slate-100">
              Tasks90 Menu
            </span>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Navigation */}
          <div>
            <p className="text-[11px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase px-3 mb-2">
              Workspace
            </p>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => {
                      if (onClose) onClose();
                    }}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                        isActive
                          ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Quick Action Button */}
          <div className="pt-1">
            <button
              onClick={() => {
                if (onClose) onClose();
                onOpenNewProject();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs tracking-wide shadow-md shadow-emerald-900/10 transition-all active:scale-[0.98]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Project</span>
            </button>
          </div>
        </div>

        {/* Legal & Compliance Footer: Strictly locked & pinned to the bottom */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-400 dark:text-slate-500 space-y-1.5 flex-shrink-0 mt-auto">
          <div className="flex items-center gap-3 px-1">
            <Link
              to="/terms"
              onClick={onClose}
              className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              Terms of Service
            </Link>
            <span>•</span>
            <Link
              to="/privacy"
              onClick={onClose}
              className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              Privacy Policy
            </Link>
          </div>
          <p className="px-1 text-[10px] text-slate-400 dark:text-slate-600">
            &copy; {new Date().getFullYear()} Tasks90
          </p>
        </div>
      </aside>
    </>
  );
};
