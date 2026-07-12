import { useAuth } from '../context/AuthContext';
import { LogOut, Bell } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const titles = {
  '/dashboard':    'Dashboard',
  '/transactions': 'Transactions',
  '/budget':       'Budget',
  '/analytics':    'Analytics',
  '/settings':     'Settings',
};

export default function Topbar() {
  const { user, logout } = useAuth();
  const { pathname }     = useLocation();

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 shrink-0">
      <h1 className="text-lg font-semibold text-gray-900">
        {titles[pathname] || 'Finsight'}
      </h1>
      <div className="flex items-center gap-3">
        <button className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-500 hover:bg-gray-50 transition-colors">
          <Bell size={18} />
        </button>
        <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center">
          <span className="text-xs font-semibold text-violet-700">
            {user?.name?.[0]?.toUpperCase()}
          </span>
        </div>
        <button
          onClick={logout}
          className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-500 hover:bg-gray-50 transition-colors"
          title="Logout"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}