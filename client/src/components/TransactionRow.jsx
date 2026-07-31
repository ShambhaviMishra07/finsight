import { Trash2 } from 'lucide-react';
import useFinanceStore from '../store/useFinanceStore';

const categoryColors = {
  'Food & Dining':    '#FF9F43',
  'Groceries':        '#F7B731',
  'Transport':        '#54A0FF',
  'Fuel':             '#48DBFB',
  'Shopping':         '#FF6B9D',
  'Entertainment':    '#5F27CD',
  'Health & Medical': '#1DD1A1',
  'Fitness':          '#00D2D3',
  'Education':        '#3B82F6',
  'Bills & Utilities':'#778CA3',
  'Rent':             '#4B6584',
  'Travel':           '#26de81',
  'Personal Care':    '#fd9644',
  'Subscriptions':    '#A55EEA',
  'Salary':           '#1A3C2E',
  'Freelance':        '#2D5A42',
  'Investment':       '#C9A84C',
  'Gift':             '#E84393',
  'Other':            '#8395A7',
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