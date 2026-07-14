export default function BudgetCard({ category, limit, spent }) {
  const pct     = Math.min((spent / limit) * 100, 100);
  const over    = spent > limit;
  const barColor = over ? 'bg-red-500' : pct > 75 ? 'bg-amber-400' : 'bg-violet-500';

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-gray-800">{category}</p>
        <span className={`text-xs font-medium ${over ? 'text-red-500' : 'text-gray-500'}`}>
          ₹{Number(spent).toLocaleString('en-IN')} / ₹{Number(limit).toLocaleString('en-IN')}
        </span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2">
        <div className={`h-2 rounded-full transition-all ${barColor}`} style={{ width: `${pct}%` }} />
      </div>
      <p className="text-xs text-gray-400 mt-2">
        {over ? `Over by ₹${(spent - limit).toLocaleString('en-IN')}` : `₹${(limit - spent).toLocaleString('en-IN')} remaining`}
      </p>
    </div>
  );
}