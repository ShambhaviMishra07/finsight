import { create } from 'zustand';
import api from '../api/axiosInstance';

const useFinanceStore = create((set, get) => ({
  transactions: [],
  budgets:      [],
  loading:      false,

  fetchTransactions: async () => {
    set({ loading: true });
    try {
      const { data } = await api.get('/transactions');
      set({ transactions: data });
    } finally {
      set({ loading: false });
    }
  },

  addTransaction: async (txn) => {
    const { data } = await api.post('/transactions', txn);
    set((s) => ({ transactions: [data, ...s.transactions] }));
  },

  deleteTransaction: async (id) => {
    await api.delete(`/transactions/${id}`);
    set((s) => ({ transactions: s.transactions.filter((t) => t._id !== id) }));
  },

  fetchBudgets: async () => {
    const { data } = await api.get('/budgets');
    set({ budgets: data });
  },

  saveBudget: async (budget) => {
    const { data } = await api.post('/budgets', budget);
    set((s) => {
      const exists = s.budgets.find((b) => b._id === data._id);
      return {
        budgets: exists
          ? s.budgets.map((b) => (b._id === data._id ? data : b))
          : [...s.budgets, data],
      };
    });
  },

  // Derived summaries — computed on demand
  getSummary: () => {
    const { transactions } = get();
    const income  = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expense = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    return { income, expense, balance: income - expense };
  },

  getExpenseByCategory: () => {
    const { transactions } = get();
    const map = {};
    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => { map[t.category] = (map[t.category] || 0) + t.amount; });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  },

  getMonthlyData: () => {
    const { transactions } = get();
    const map = {};
    transactions.forEach((t) => {
      const month = new Date(t.date).toLocaleString('default', { month: 'short' });
      if (!map[month]) map[month] = { month, income: 0, expense: 0 };
      map[month][t.type] += t.amount;
    });
    return Object.values(map).slice(-6);
  },
}));

export default useFinanceStore;