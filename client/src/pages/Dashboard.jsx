// import { useAuth } from '../context/AuthContext';

// export default function Dashboard() {
//   const { user, logout } = useAuth();

//   return (
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//       <div className="text-center">
//         <h1 className="text-3xl font-semibold text-gray-900">
//           Welcome, {user?.name}!
//         </h1>
//         <p className="text-gray-500 mt-2">Phase 1 complete. Dashboard coming in Phase 2.</p>
//         <button
//           onClick={logout}
//           className="mt-6 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 text-sm"
//         >
//           Logout
//         </button>
//       </div>
//     </div>
//   );
// }


import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import useFinanceStore from '../store/useFinanceStore';
import StatCard from '../components/StatCard';
import TransactionRow from '../components/TransactionRow';
import AddTransactionModal from '../components/AddTransactionModal';
import { Plus } from 'lucide-react';

const PIE_COLORS = ['#7C3AED', '#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#EC4899'];

export default function Dashboard() {
  const { fetchTransactions, transactions, getSummary, getExpenseByCategory, getMonthlyData } = useFinanceStore();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => { fetchTransactions(); }, []);

  const { income, expense, balance } = getSummary();
  const pieData     = getExpenseByCategory();
  const monthlyData = getMonthlyData();
  const recent      = transactions.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Total balance"  amount={balance} color="violet" trendLabel="This month" trend={1} />
        <StatCard title="Total income"   amount={income}  color="green"  trendLabel="All time"   trend={1} />
        <StatCard title="Total expenses" amount={expense} color="red"    trendLabel="All time"   trend={-1} />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Area chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-sm font-semibold text-gray-800 mb-4">Income vs expenses</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="inc" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#7C3AED" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#7C3AED" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="exp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#EF4444" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} width={50}
                tickFormatter={(v) => `₹${v >= 1000 ? (v/1000)+'k' : v}`} />
              <Tooltip formatter={(v) => `₹${v.toLocaleString('en-IN')}`} />
              <Area type="monotone" dataKey="income"  stroke="#7C3AED" fill="url(#inc)" strokeWidth={2} />
              <Area type="monotone" dataKey="expense" stroke="#EF4444" fill="url(#exp)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-sm font-semibold text-gray-800 mb-4">Spending by category</p>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                  {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => `₹${v.toLocaleString('en-IN')}`} />
                <Legend iconType="circle" iconSize={8} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-48 text-sm text-gray-400">No data yet</div>
          )}
        </div>
      </div>

      {/* Recent transactions */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold text-gray-800">Recent transactions</p>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-medium px-3 py-1.5 rounded-xl transition-colors"
          >
            <Plus size={14} /> Add
          </button>
        </div>
        {recent.length > 0
          ? recent.map((t) => <TransactionRow key={t._id} txn={t} />)
          : <p className="text-sm text-gray-400 text-center py-8">No transactions yet. Add one!</p>}
      </div>

      {showModal && <AddTransactionModal onClose={() => setShowModal(false)} />}
    </div>
  );
}