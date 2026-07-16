import { useEffect, useState } from 'react';
import useFinanceStore from '../store/useFinanceStore';
import BudgetCard from '../components/BudgetCard';
import { Plus, X } from 'lucide-react';

const CATEGORIES = ['Food', 'Transport', 'Entertainment', 'Health', 'Shopping', 'Other'];

export default function Budget() {
  const { budgets, transactions, fetchBudgets, fetchTransactions, saveBudget } = useFinanceStore();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ category: 'Food', limit: '', month: new Date().toISOString().slice(0, 7) });

  useEffect(() => { fetchBudgets(); fetchTransactions(); }, []);

  const currentMonth = new Date().toISOString().slice(0, 7);

  const getSpent = (category) =>
    transactions
      .filter((t) => t.type === 'expense' && t.category === category &&
        new Date(t.date).toISOString().slice(0, 7) === currentMonth)
      .reduce((s, t) => s + t.amount, 0);

  const handleSave = async (e) => {
    e.preventDefault();
    await saveBudget({ ...form, limit: Number(form.limit) });
    setShowForm(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">Budgets for {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium px-3 py-1.5 rounded-xl transition-colors"
        >
          <Plus size={14} /> Set budget
        </button>
      </div>

      {budgets.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {budgets.map((b) => (
            <BudgetCard key={b._id} category={b.category} limit={b.limit} spent={getSpent(b.category)} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <p className="text-gray-400 text-sm">No budgets set yet. Create one to track your spending!</p>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Set budget</h2>
              <button onClick={() => setShowForm(false)}><X size={18} className="text-gray-400" /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-3">
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500">
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
              <input type="number" required placeholder="Monthly limit (₹)" value={form.limit}
                onChange={(e) => setForm({ ...form, limit: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
              <button type="submit" className="w-full bg-violet-600 text-white py-2 rounded-xl text-sm font-medium hover:bg-violet-700">
                Save budget
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}