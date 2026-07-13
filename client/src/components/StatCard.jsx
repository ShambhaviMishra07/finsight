import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({ title, amount, trend, trendLabel, color = 'violet' }) {
  const colors = {
    violet: 'bg-violet-50 text-violet-600',
    green:  'bg-green-50  text-green-600',
    red:    'bg-red-50    text-red-600',
    blue:   'bg-blue-50   text-blue-600',
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <p className="text-sm text-gray-500 font-medium mb-1">{title}</p>
      <p className="text-2xl font-semibold text-gray-900 mb-3">
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