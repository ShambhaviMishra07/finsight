import { Trash2 } from 'lucide-react';
import useFinanceStore from '../store/useFinanceStore';

const categoryColors = {
  Food:          'bg-orange-100 text-orange-700',
  Transport:     'bg-blue-100   text-blue-700',
  Entertainment: 'bg-purple-100 text-purple-700',
  Health:        'bg-green-100  text-green-700',
  Shopping:      'bg-pink-100   text-pink-700',
  Salary:        'bg-teal-100   text-teal-700',
  Other:         'bg-gray-100   text-gray-700',
};

export default function TransactionRow({ txn }) {
  const deleteTransaction = useFinanceStore((s) => s.deleteTransaction);

  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
      <div className="flex items-center gap-3">
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${categoryColors[txn.category] || 'bg-gray-100 text-gray-600'}`}>
          {txn.category}
        </span>
        <div>
          <p className="text-sm font-medium text-gray-800">{txn.description || txn.category}</p>
          <p className="text-xs text-gray-400">{new Date(txn.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className={`text-sm font-semibold ${txn.type === 'income' ? 'text-green-600' : 'text-red-500'}`}>
          {txn.type === 'income' ? '+' : '-'}₹{Number(txn.amount).toLocaleString('en-IN')}
        </span>
        <button
          onClick={() => deleteTransaction(txn._id)}
          className="text-gray-300 hover:text-red-400 transition-colors"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}