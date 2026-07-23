import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({ title, amount, trend, trendLabel, color = 'violet' }) {
  const colors = {
    violet: 'bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400',
    green:  'bg-green-50  dark:bg-green-900/30  text-green-600  dark:text-green-400',
    red:    'bg-red-50    dark:bg-red-900/30    text-red-600    dark:text-red-400',
    blue:   'bg-blue-50   dark:bg-blue-900/30   text-blue-600   dark:text-blue-400',
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">{title}</p>
      <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
        ₹{Number(amount).toLocaleString('en-IN')}
      </p>
      {trend !== undefined && (
        <div className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${colors[color]}`}>
          {trend >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {trendLabel}
        </div>
      )}
    </div>
  );
}