import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import useFinanceStore from '../store/useFinanceStore';
import TransactionRow  from '../components/TransactionRow';
import AddTransactionModal from '../components/AddTransactionModal';
import PageWrapper     from '../components/PageWrapper';
import { SkeletonRow } from '../components/Skeleton';
import { Plus, Search } from 'lucide-react';

export default function Transactions() {
  const { transactions, fetchTransactions, loading } = useFinanceStore();
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
    <PageWrapper>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex gap-2">
            {['all', 'income', 'expense'].map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1.5 text-sm font-medium rounded-xl border transition-colors ${
                  filter === f
                    ? 'bg-violet-600 text-white border-violet-600'
                    : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-gray-300'
                }`}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..."
                className="pl-8 pr-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 w-full sm:w-48"
              />
            </div>
            <button onClick={() => setShowModal(true)}
              className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium px-3 py-1.5 rounded-xl transition-colors">
              <Plus size={14} /> Add
            </button>
          </div>
        </div>

        <motion.div
          className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5"
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        >
          {loading
            ? [0,1,2,3,4,5].map((i) => <SkeletonRow key={i} />)
            : filtered.length > 0
              ? filtered.map((t, i) => (
                  <motion.div key={t._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}>
                    <TransactionRow txn={t} />
                  </motion.div>
                ))
              : <p className="text-sm text-gray-400 text-center py-12">No transactions found.</p>
          }
        </motion.div>
      </div>
      {showModal && <AddTransactionModal onClose={() => setShowModal(false)} />}
    </PageWrapper>
  );
}