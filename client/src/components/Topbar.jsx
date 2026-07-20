import { useAuth }  from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LogOut, Bell, Sun, Moon, Menu } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const titles = {
  '/dashboard':    'Dashboard',
  '/transactions': 'Transactions',
  '/budget':       'Budget',
  '/analytics':    'Analytics',
  '/settings':     'Settings',
};

export default function Topbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const { pathname }     = useLocation();

  return (
    <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {titles[pathname] || 'Finsight'}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggle}
          className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          title={dark ? 'Light mode' : 'Dark mode'}
        >
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <Bell size={18} />
        </button>
        <div className="w-8 h-8 bg-violet-100 dark:bg-violet-900 rounded-full flex items-center justify-center">
          <span className="text-xs font-semibold text-violet-700 dark:text-violet-300">
            {user?.name?.[0]?.toUpperCase()}
          </span>
        </div>
        <button
          onClick={logout}
          className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          title="Logout"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}