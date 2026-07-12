import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, ArrowLeftRight, Wallet,
  BarChart2, Settings, TrendingUp
} from 'lucide-react';

const links = [
  { to: '/dashboard',    icon: LayoutDashboard, label: 'Dashboard'    },
  { to: '/transactions', icon: ArrowLeftRight,  label: 'Transactions' },
  { to: '/budget',       icon: Wallet,          label: 'Budget'       },
  { to: '/analytics',    icon: BarChart2,        label: 'Analytics'    },
  { to: '/settings',     icon: Settings,        label: 'Settings'     },
];

export default function Sidebar() {
  return (
    <aside className="w-60 bg-white border-r border-gray-100 flex flex-col py-6 px-4 shrink-0">
      <div className="flex items-center gap-2 px-2 mb-8">
        <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center">
          <TrendingUp size={16} className="text-white" />
        </div>
        <span className="text-lg font-semibold text-gray-900">Finsight</span>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to} to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-violet-50 text-violet-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-2 text-xs text-gray-400">v1.0.0 · Finsight</div>
    </aside>
  );
}