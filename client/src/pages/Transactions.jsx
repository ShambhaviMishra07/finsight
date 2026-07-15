import { useEffect, useState } from 'react';
import useFinanceStore from '../store/useFinanceStore';
import TransactionRow from '../components/TransactionRow';
import AddTransactionModal from '../components/AddTransactionModal';
import { Plus, Search } from 'lucide-react';

export default function Transactions() {
  const { transactions, fetchTransactions } = useFinanceStore();
  const [showModal, setShowModal] = useState(false);
  const [search,    setSearch]    = useState('');
  const [filter,    setFilter]    = useState('all');

  useEffect(() => { fetchTransactions(); }, []);

  const filtered = transactions.filter((t) => {
    const matchType   = filter === 'all' || t.type === filter;
    const matchSearch = t.description?.toLowerCase().includes(search.toLowerCase()) ||
                        t.category.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-2">
          {['all', 'income', 'expense'].map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-sm font-medium rounded-xl border transition-colors ${
                filter === f ? 'bg-violet-600 text-white border-violet-600' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
              }`}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 w-full sm:w-48"
            />
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium px-3 py-1.5 rounded-xl transition-colors"
          >
            <Plus size={14} /> Add
          </button>
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        {filtered.length > 0
          ? filtered.map((t) => <TransactionRow key={t._id} txn={t} />)
          : <p className="text-sm text-gray-400 text-center py-12">No transactions found.</p>}
      </div>

      {showModal && <AddTransactionModal onClose={() => setShowModal(false)} />}
    </div>
  );
}