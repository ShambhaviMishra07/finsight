import { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Legend
} from 'recharts';
import useFinanceStore from '../store/useFinanceStore';
import PageWrapper     from '../components/PageWrapper';
import { SkeletonChart } from '../components/Skeleton';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function Analytics() {
  const { fetchTransactions, transactions, loading, getMonthlyData, getExpenseByCategory, getSummary } = useFinanceStore();

  useEffect(() => { fetchTransactions(); }, []);

  const monthlyData = getMonthlyData();
  const categoryData = getExpenseByCategory().sort((a, b) => b.value - a.value).slice(0, 5);
  const { income, expense, balance } = getSummary();
  const savingsRate = income > 0 ? Math.round(((income - expense) / income) * 100) : 0;

  const savingsColor = savingsRate > 20 ? 'text-green-500' : savingsRate > 0 ? 'text-amber-500' : 'text-red-500';
  const SavingsIcon  = savingsRate > 20 ? TrendingUp : savingsRate > 0 ? Minus : TrendingDown;

  const summaryStats = [
    { label: 'Total income',   value: `₹${income.toLocaleString('en-IN')}`,   color: 'text-green-500'  },
    { label: 'Total expenses', value: `₹${expense.toLocaleString('en-IN')}`,  color: 'text-red-500'    },
    { label: 'Net balance',    value: `₹${balance.toLocaleString('en-IN')}`,  color: 'text-violet-600' },
    { label: 'Savings rate',   value: `${savingsRate}%`,                        color: savingsColor       },
  ];

  return (
    <PageWrapper>
      <div className="space-y-6">

        {/* Summary strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {summaryStats.map((s, i) => (
            <motion.div key={s.label}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4"
            >
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{s.label}</p>
              <p className={`text-xl font-semibold ${s.color}`}>{s.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Bar chart */}
        {loading ? <SkeletonChart /> : (
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5"
          >
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-4">Monthly income vs expenses</p>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={monthlyData} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} width={50}
                  tickFormatter={(v) => `₹${v >= 1000 ? (v/1000)+'k' : v}`} />
                <Tooltip formatter={(v) => `₹${v.toLocaleString('en-IN')}`}
                  contentStyle={{ borderRadius: 12, border: 'none', fontSize: 12 }} />
                <Legend iconType="circle" iconSize={8} />
                <Bar dataKey="income"  fill="#7C3AED" radius={[6,6,0,0]} />
                <Bar dataKey="expense" fill="#EF4444" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {/* Line chart + Category breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {loading ? (
            <><SkeletonChart /><SkeletonChart /></>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}
                className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5"
              >
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-4">Balance trend</p>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={monthlyData.map((m) => ({ ...m, balance: m.income - m.expense }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} width={50}
                      tickFormatter={(v) => `₹${v >= 1000 ? (v/1000)+'k' : v}`} />
                    <Tooltip formatter={(v) => `₹${v.toLocaleString('en-IN')}`}
                      contentStyle={{ borderRadius: 12, border: 'none', fontSize: 12 }} />
                    <Line type="monotone" dataKey="balance" stroke="#10B981" strokeWidth={2.5} dot={{ r: 4, fill: '#10B981' }} />
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.34 }}
                className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5"
              >
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-4">Top spending categories</p>
                {categoryData.length > 0 ? (
                  <div className="space-y-3">
                    {categoryData.map((cat, i) => {
                      const pct = expense > 0 ? Math.round((cat.value / expense) * 100) : 0;
                      const colors = ['#7C3AED','#10B981','#F59E0B','#EF4444','#3B82F6'];
                      return (
                        <div key={cat.name}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-700 dark:text-gray-300">{cat.name}</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              ₹{cat.value.toLocaleString('en-IN')} · {pct}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                            <motion.div
                              className="h-2 rounded-full"
                              style={{ background: colors[i] }}
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ delay: 0.4 + i * 0.08, duration: 0.5 }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-40 text-sm text-gray-400">
                    No expense data yet
                  </div>
                )}
              </motion.div>
            </>
          )}
        </div>

        {/* Savings insight card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="bg-violet-50 dark:bg-violet-900/20 rounded-2xl border border-violet-100 dark:border-violet-800 p-5 flex items-center gap-4"
        >
          <div className="w-12 h-12 bg-violet-100 dark:bg-violet-800 rounded-xl flex items-center justify-center shrink-0">
            <SavingsIcon size={22} className={savingsColor} />
          </div>
          <div>
            <p className="text-sm font-semibold text-violet-900 dark:text-violet-100">
              Savings insight
            </p>
            <p className="text-sm text-violet-700 dark:text-violet-300 mt-0.5">
              {savingsRate > 20
                ? `Great job! You're saving ${savingsRate}% of your income. Keep it up.`
                : savingsRate > 0
                ? `You're saving ${savingsRate}% of your income. Aim for 20% or more.`
                : `You're spending more than you earn. Review your expenses on the Budget page.`}
            </p>
          </div>
        </motion.div>

      </div>
    </PageWrapper>
  );
}