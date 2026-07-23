import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Legend
} from 'recharts';
import useFinanceStore from '../store/useFinanceStore';
import AddTransactionModal from '../components/AddTransactionModal';
import { SkeletonCard, SkeletonChart } from '../components/Skeleton';
import { useAuth } from '../context/AuthContext';
import {
  ArrowUpRight, ArrowDownLeft, Plus, TrendingUp,
  TrendingDown, Wallet, BarChart2, Send,
  Download, Calendar, Trash2
} from 'lucide-react';

// ─── Color tokens (matching landing page) ─────────────────────
const C = {
  forest:    '#1A3C2E',
  forestMid: '#2D5A42',
  gold:      '#C9A84C',
  goldLight: '#F0E4BC',
  base:      '#FAF8F4',
  stone:     '#E8E0D4',
};

const PIE_COLORS = ['#1A3C2E', '#2D5A42', '#C9A84C', '#5A8A6A', '#8FB5A0', '#E8C97A'];

// ─── Dummy quick-transfer contacts ───────────────────────────
const contacts = [
  { name: 'Priya',  init: 'PR', color: '#5A8A6A' },
  { name: 'Arjun',  init: 'AJ', color: '#1A3C2E' },
  { name: 'Neha',   init: 'NK', color: '#C9A84C' },
  { name: 'Rahul',  init: 'RK', color: '#8FB5A0' },
  { name: 'Sonal',  init: 'SN', color: '#2D5A42' },
];

const categoryColors = {
  Food:          '#FF9F43',
  Transport:     '#54A0FF',
  Entertainment: '#5F27CD',
  Health:        '#1DD1A1',
  Shopping:      '#FF6B9D',
  Salary:        '#1A3C2E',
  Other:         '#8395A7',
};

// ─── Styles ───────────────────────────────────────────────────
const styles = `
  .dash-root {
    font-family: 'Inter', sans-serif;
    background: #F0F4F8;
    min-height: 100vh;
    color: #1C1C1C;
  }
  .dark .dash-root { background: #0F1A14; }

  /* Glass card */
  .glass {
    background: rgba(255,255,255,0.72);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(255,255,255,0.55);
    border-radius: 20px;
    box-shadow: 0 4px 24px rgba(26,60,46,0.07);
  }
  .dark .glass {
    background: rgba(26,48,36,0.55);
    border-color: rgba(255,255,255,0.08);
    box-shadow: 0 4px 24px rgba(0,0,0,0.3);
  }

  /* Welcome bar */
  .dash-welcome {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
    flex-wrap: wrap;
    gap: 12px;
  }
  .dash-welcome h1 {
    font-size: 22px;
    font-weight: 600;
    color: #1C1C1C;
  }
  .dark .dash-welcome h1 { color: #F0F4F0; }
  .dash-welcome-sub {
    font-size: 13px;
    color: #6B7280;
    margin-top: 2px;
  }
  .dark .dash-welcome-sub { color: #9CA3AF; }
  .dash-welcome-actions {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .dash-date-chip {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: #6B7280;
    background: rgba(255,255,255,0.8);
    border: 1px solid #E5E7EB;
    padding: 7px 14px;
    border-radius: 10px;
  }
  .dark .dash-date-chip {
    background: rgba(26,60,46,0.4);
    border-color: rgba(255,255,255,0.1);
    color: #9CA3AF;
  }
  .dash-export-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    background: #1A3C2E;
    color: #fff;
    font-size: 13px;
    font-weight: 500;
    padding: 8px 16px;
    border-radius: 10px;
    border: none;
    cursor: pointer;
    transition: background 0.15s;
  }
  .dash-export-btn:hover { background: #2D5A42; }

  /* Stat cards row */
  .stat-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-bottom: 20px;
  }
  .stat-card {
    padding: 22px 24px;
    position: relative;
    overflow: hidden;
  }
  .stat-card-label {
    font-size: 12px;
    font-weight: 500;
    color: #6B7280;
    letter-spacing: 0.04em;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .dark .stat-card-label { color: #9CA3AF; }
  .stat-card-amount {
    font-size: 28px;
    font-weight: 700;
    color: #1C1C1C;
    letter-spacing: -0.03em;
    margin-bottom: 10px;
  }
  .dark .stat-card-amount { color: #F0F4F0; }
  .stat-card-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 12px;
    font-weight: 600;
    padding: 4px 10px;
    border-radius: 99px;
  }
  .badge-up   { background: #ECFAF3; color: #1A7A46; }
  .badge-down { background: #FEF2F2; color: #B91C1C; }
  .badge-neutral { background: #EEF2FF; color: #4338CA; }
  .dark .badge-up   { background: rgba(26,122,70,0.2);  color: #4ADE80; }
  .dark .badge-down { background: rgba(185,28,28,0.2); color: #F87171; }
  .stat-card-blob {
    position: absolute;
    right: -20px;
    top: -20px;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    opacity: 0.08;
  }
  .stat-card-icon {
    position: absolute;
    right: 20px;
    top: 22px;
    width: 40px;
    height: 40px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Quick transfer */
  .quick-transfer {
    padding: 20px 22px;
    margin-bottom: 20px;
  }
  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
  }
  .section-title {
    font-size: 14px;
    font-weight: 600;
    color: #1C1C1C;
  }
  .dark .section-title { color: #F0F4F0; }
  .section-sub-link {
    font-size: 12px;
    color: #1A3C2E;
    font-weight: 500;
    cursor: pointer;
    text-decoration: none;
    background: none;
    border: none;
  }
  .dark .section-sub-link { color: #4ADE80; }
  .contacts-row {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .contact-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    cursor: pointer;
  }
  .contact-avatar {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 600;
    color: #fff;
    border: 2.5px solid rgba(255,255,255,0.8);
    box-shadow: 0 2px 8px rgba(0,0,0,0.12);
    transition: transform 0.15s;
  }
  .contact-avatar:hover { transform: translateY(-2px); }
  .contact-name {
    font-size: 11px;
    color: #6B7280;
  }
  .dark .contact-name { color: #9CA3AF; }
  .contact-add {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: rgba(26,60,46,0.08);
    border: 2px dashed #1A3C2E;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.15s;
  }
  .dark .contact-add {
    background: rgba(255,255,255,0.05);
    border-color: rgba(255,255,255,0.2);
  }
  .contact-add:hover { background: rgba(26,60,46,0.15); }

  /* Charts grid */
  .charts-grid {
    display: grid;
    grid-template-columns: 1.6fr 1fr;
    gap: 16px;
    margin-bottom: 20px;
  }
  .chart-card {
    padding: 20px 22px;
  }
  .chart-title {
    font-size: 14px;
    font-weight: 600;
    color: #1C1C1C;
    margin-bottom: 4px;
  }
  .dark .chart-title { color: #F0F4F0; }
  .chart-subtitle {
    font-size: 12px;
    color: #6B7280;
    margin-bottom: 16px;
  }
  .dark .chart-subtitle { color: #9CA3AF; }
  .chart-big-num {
    font-size: 24px;
    font-weight: 700;
    color: #1C1C1C;
    letter-spacing: -0.02em;
    margin-bottom: 2px;
  }
  .dark .chart-big-num { color: #F0F4F0; }

  /* Bottom grid */
  .bottom-grid {
    display: grid;
    grid-template-columns: 1.4fr 1fr;
    gap: 16px;
    margin-bottom: 20px;
  }

  /* Transactions table */
  .txn-table { width: 100%; }
  .txn-table-header {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 0.4fr;
    padding: 0 4px 10px;
    border-bottom: 1px solid rgba(0,0,0,0.06);
    font-size: 11px;
    font-weight: 600;
    color: #9CA3AF;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }
  .dark .txn-table-header { border-color: rgba(255,255,255,0.08); }
  .txn-row {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 0.4fr;
    align-items: center;
    padding: 12px 4px;
    border-bottom: 1px solid rgba(0,0,0,0.04);
    transition: background 0.1s;
    border-radius: 8px;
  }
  .txn-row:last-child { border-bottom: none; }
  .txn-row:hover { background: rgba(26,60,46,0.04); }
  .dark .txn-row:hover { background: rgba(255,255,255,0.04); }
  .dark .txn-row { border-color: rgba(255,255,255,0.05); }
  .txn-icon {
    width: 34px;
    height: 34px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 700;
    flex-shrink: 0;
  }
  .txn-name { font-size: 13px; font-weight: 500; color: #1C1C1C; }
  .dark .txn-name { color: #F0F4F0; }
  .txn-cat  { font-size: 11px; color: #9CA3AF; margin-top: 2px; }
  .txn-date { font-size: 12px; color: #9CA3AF; }
  .txn-amount { font-size: 13px; font-weight: 600; }
  .amount-up   { color: #1A7A46; }
  .amount-down { color: #B91C1C; }
  .dark .amount-up   { color: #4ADE80; }
  .dark .amount-down { color: #F87171; }
  .txn-delete {
    background: none; border: none; cursor: pointer;
    color: #D1D5DB; padding: 4px;
    transition: color 0.15s; border-radius: 6px;
    display: flex; align-items: center; justify-content: center;
  }
  .txn-delete:hover { color: #EF4444; }

  /* Savings/budget goals */
  .goals-card { padding: 20px 22px; }
  .goal-item { margin-bottom: 18px; }
  .goal-item:last-child { margin-bottom: 0; }
  .goal-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 7px;
  }
  .goal-name { font-size: 13px; font-weight: 500; color: #1C1C1C; }
  .dark .goal-name { color: #F0F4F0; }
  .goal-meta { font-size: 11px; color: #9CA3AF; }
  .goal-amounts { font-size: 12px; font-weight: 500; }
  .goal-bar-bg {
    width: 100%;
    height: 7px;
    background: rgba(0,0,0,0.07);
    border-radius: 99px;
    overflow: hidden;
  }
  .dark .goal-bar-bg { background: rgba(255,255,255,0.08); }
  .goal-bar-fill {
    height: 100%;
    border-radius: 99px;
    transition: width 0.8s ease;
  }

  /* Second charts row */
  .charts-grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 20px;
  }

  /* Add transaction fab */
  .fab {
    position: fixed;
    bottom: 28px;
    right: 28px;
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background: #1A3C2E;
    color: #fff;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 6px 24px rgba(26,60,46,0.35);
    transition: transform 0.15s, background 0.15s;
    z-index: 50;
  }
  .fab:hover { background: #2D5A42; transform: scale(1.08); }

  /* Empty state */
  .empty-state {
    text-align: center;
    padding: 32px 16px;
    color: #9CA3AF;
    font-size: 13px;
  }

  @media (max-width: 1024px) {
    .charts-grid, .charts-grid-2, .bottom-grid { grid-template-columns: 1fr; }
    .stat-row { grid-template-columns: 1fr; }
  }
`;

// ─── Custom tooltip ───────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'rgba(255,255,255,0.95)',
      border: '1px solid #E5E7EB',
      borderRadius: 10,
      padding: '8px 14px',
      fontSize: 12,
      boxShadow: '0 4px 16px rgba(0,0,0,0.08)'
    }}>
      <div style={{ fontWeight: 600, marginBottom: 4, color: '#1C1C1C' }}>{label}</div>
      {payload.map((p) => (
        <div key={p.dataKey} style={{ color: p.color }}>
          {p.name}: ₹{Number(p.value).toLocaleString('en-IN')}
        </div>
      ))}
    </div>
  );
};

// ─── Dashboard ────────────────────────────────────────────────
export default function Dashboard() {
  const {
    fetchTransactions, transactions, loading,
    fetchBudgets, budgets,
    deleteTransaction,
    getSummary, getExpenseByCategory, getMonthlyData,
  } = useFinanceStore();
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchTransactions();
    fetchBudgets();
  }, []);

  const { income, expense, balance } = getSummary();
  const pieData     = getExpenseByCategory();
  const monthlyData = getMonthlyData();
  const recent      = transactions.slice(0, 8);

  // Monthly expense for current month
  const currentMonth  = new Date().toLocaleString('default', { month: 'short' });
  const currentMonthData = monthlyData.find(m => m.month === currentMonth);
  const monthlySpent  = currentMonthData?.expense || 0;
  const monthlyIncome = currentMonthData?.income  || 0;

  // Balance trend for line chart
  const balanceTrend = monthlyData.map((m, i, arr) => {
    const cumIncome  = arr.slice(0, i + 1).reduce((s, x) => s + (x.income  || 0), 0);
    const cumExpense = arr.slice(0, i + 1).reduce((s, x) => s + (x.expense || 0), 0);
    return { month: m.month, balance: cumIncome - cumExpense };
  });

  // Budget goals — match transactions
  const currentMonthStr = new Date().toISOString().slice(0, 7);
  const getSpent = (category) =>
    transactions
      .filter(t => t.type === 'expense' && t.category === category &&
        new Date(t.date).toISOString().slice(0, 7) === currentMonthStr)
      .reduce((s, t) => s + t.amount, 0);

  const today = new Date().toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  return (
    <>
      <style>{styles}</style>
      <div className="dash-root">

        {/* ── Welcome bar ────────────────────────────────── */}
        <div className="dash-welcome">
          <div>
            <h1>Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
            <div className="dash-welcome-sub">Here's what's happening with your money today.</div>
          </div>
          <div className="dash-welcome-actions">
            <div className="dash-date-chip">
              <Calendar size={13} />
              {today}
            </div>
            <button className="dash-export-btn">
              <Download size={13} /> Export
            </button>
          </div>
        </div>

        {/* ── Stat cards ─────────────────────────────────── */}
        <div className="stat-row">
          {loading ? (
            [0,1,2].map(i => <SkeletonCard key={i} />)
          ) : (
            <>
              {/* Total balance */}
              <motion.div
                className="glass stat-card"
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}
              >
                <div className="stat-card-blob" style={{ background: C.forest }} />
                <div className="stat-card-icon" style={{ background: 'rgba(26,60,46,0.1)' }}>
                  <Wallet size={18} color={C.forest} />
                </div>
                <div className="stat-card-label"><Wallet size={12} color="#9CA3AF" /> Total Balance</div>
                <div className="stat-card-amount">₹{balance.toLocaleString('en-IN')}</div>
                <span className={`stat-card-badge ${balance >= 0 ? 'badge-up' : 'badge-down'}`}>
                  {balance >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                  {balance >= 0 ? 'Positive' : 'Negative'}
                </span>
              </motion.div>

              {/* Monthly spent */}
              <motion.div
                className="glass stat-card"
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
              >
                <div className="stat-card-blob" style={{ background: '#EF4444' }} />
                <div className="stat-card-icon" style={{ background: 'rgba(239,68,68,0.1)' }}>
                  <ArrowUpRight size={18} color="#EF4444" />
                </div>
                <div className="stat-card-label"><ArrowUpRight size={12} color="#9CA3AF" /> Monthly Spent</div>
                <div className="stat-card-amount">₹{monthlySpent.toLocaleString('en-IN')}</div>
                <span className="stat-card-badge badge-down">
                  <TrendingDown size={11} /> This month
                </span>
              </motion.div>

              {/* Monthly income */}
              <motion.div
                className="glass stat-card"
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}
              >
                <div className="stat-card-blob" style={{ background: '#10B981' }} />
                <div className="stat-card-icon" style={{ background: 'rgba(16,185,129,0.1)' }}>
                  <ArrowDownLeft size={18} color="#10B981" />
                </div>
                <div className="stat-card-label"><ArrowDownLeft size={12} color="#9CA3AF" /> Monthly Income</div>
                <div className="stat-card-amount">₹{monthlyIncome.toLocaleString('en-IN')}</div>
                <span className="stat-card-badge badge-up">
                  <TrendingUp size={11} /> This month
                </span>
              </motion.div>
            </>
          )}
        </div>

        {/* ── Quick transfer ──────────────────────────────── */}
        <motion.div
          className="glass quick-transfer"
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        >
          <div className="section-header">
            <div className="section-title">Quick Transfer</div>
            <button className="section-sub-link">See all</button>
          </div>
          <div className="contacts-row">
            <div className="contact-item">
              <div className="contact-add" onClick={() => setShowModal(true)}>
                <Plus size={16} color={C.forest} />
              </div>
              <span className="contact-name">Add</span>
            </div>
            {contacts.map((c) => (
              <div key={c.name} className="contact-item">
                <div className="contact-avatar" style={{ background: c.color }}>
                  {c.init}
                </div>
                <span className="contact-name">{c.name}</span>
              </div>
            ))}
            <button
              onClick={() => setShowModal(true)}
              style={{
                marginLeft: 'auto',
                display: 'flex', alignItems: 'center', gap: 6,
                background: C.forest, color: '#fff',
                border: 'none', cursor: 'pointer',
                padding: '9px 18px', borderRadius: 10,
                fontSize: 13, fontWeight: 500,
              }}
            >
              <Send size={13} /> Send money
            </button>
          </div>
        </motion.div>

        {/* ── Charts row 1: Cashflow + Pie ───────────────── */}
        <div className="charts-grid">
          {loading ? (
            <><SkeletonChart /><SkeletonChart /></>
          ) : (
            <>
              {/* Cashflow area chart */}
              <motion.div
                className="glass chart-card"
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }}
              >
                <div className="section-header">
                  <div>
                    <div className="chart-title">Cashflow</div>
                    <div className="chart-subtitle">Income vs expenses over time</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="chart-big-num">₹{balance.toLocaleString('en-IN')}</div>
                    <div style={{ fontSize: 11, color: '#9CA3AF' }}>Total balance</div>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={monthlyData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                    <defs>
                      <linearGradient id="gInc" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#1A3C2E" stopOpacity={0.18} />
                        <stop offset="95%" stopColor="#1A3C2E" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gExp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#EF4444" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} width={48}
                      tickFormatter={v => `₹${v >= 1000 ? (v/1000).toFixed(0)+'k' : v}`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                    <Area type="monotone" dataKey="income"  name="Income"  stroke="#1A3C2E" fill="url(#gInc)" strokeWidth={2.5} dot={false} />
                    <Area type="monotone" dataKey="expense" name="Expense" stroke="#EF4444" fill="url(#gExp)" strokeWidth={2.5} dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Spending pie */}
              <motion.div
                className="glass chart-card"
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              >
                <div className="chart-title">Spending by Category</div>
                <div className="chart-subtitle">Where your money goes</div>
                {pieData.length > 0 ? (
                  <>
                    <ResponsiveContainer width="100%" height={160}>
                      <PieChart>
                        <Pie data={pieData} cx="50%" cy="50%" innerRadius={46} outerRadius={72} paddingAngle={3} dataKey="value">
                          {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                        </Pie>
                        <Tooltip formatter={v => [`₹${Number(v).toLocaleString('en-IN')}`, '']} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>
                      {pieData.slice(0, 4).map((d, i) => (
                        <div key={d.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: PIE_COLORS[i % PIE_COLORS.length], flexShrink: 0 }} />
                            <span style={{ fontSize: 12, color: '#6B7280' }}>{d.name}</span>
                          </div>
                          <span style={{ fontSize: 12, fontWeight: 600, color: '#1C1C1C' }}>
                            ₹{Number(d.value).toLocaleString('en-IN')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="empty-state">Add expenses to see category breakdown</div>
                )}
              </motion.div>
            </>
          )}
        </div>

        {/* ── Charts row 2: Bar + Line ────────────────────── */}
        <div className="charts-grid-2">
          {loading ? (
            <><SkeletonChart /><SkeletonChart /></>
          ) : (
            <>
              {/* Monthly bar chart */}
              <motion.div
                className="glass chart-card"
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.34 }}
              >
                <div className="chart-title">Monthly Overview</div>
                <div className="chart-subtitle">Income vs expenses per month</div>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={monthlyData} barCategoryGap="32%" margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} width={44}
                      tickFormatter={v => `₹${v >= 1000 ? (v/1000).toFixed(0)+'k' : v}`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                    <Bar dataKey="income"  name="Income"  fill="#1A3C2E" radius={[5,5,0,0]} />
                    <Bar dataKey="expense" name="Expense" fill="#C9A84C" radius={[5,5,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Balance trend line chart */}
              <motion.div
                className="glass chart-card"
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              >
                <div className="chart-title">Balance Trend</div>
                <div className="chart-subtitle">Cumulative balance over time</div>
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={balanceTrend} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} width={44}
                      tickFormatter={v => `₹${v >= 1000 ? (v/1000).toFixed(0)+'k' : v}`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="balance" name="Balance" stroke="#C9A84C" strokeWidth={2.5}
                      dot={{ r: 4, fill: '#C9A84C', strokeWidth: 2, stroke: '#fff' }}
                      activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>
            </>
          )}
        </div>

        {/* ── Bottom: Transactions table + Budget goals ───── */}
        <div className="bottom-grid">
          {/* Recent activity */}
          <motion.div
            className="glass chart-card"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.44 }}
          >
            <div className="section-header">
              <div>
                <div className="section-title">Recent Activity</div>
                <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>
                  {transactions.length} transactions total
                </div>
              </div>
              <button className="section-sub-link" onClick={() => setShowModal(true)}>+ Add new</button>
            </div>

            {loading ? (
              [0,1,2,3].map(i => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: '#F3F4F6', flexShrink: 0 }} className="animate-pulse" />
                  <div style={{ flex: 1 }}>
                    <div style={{ height: 12, width: '60%', background: '#F3F4F6', borderRadius: 6, marginBottom: 6 }} className="animate-pulse" />
                    <div style={{ height: 10, width: '40%', background: '#F3F4F6', borderRadius: 6 }} className="animate-pulse" />
                  </div>
                  <div style={{ height: 12, width: 60, background: '#F3F4F6', borderRadius: 6 }} className="animate-pulse" />
                </div>
              ))
            ) : recent.length > 0 ? (
              <>
                <div className="txn-table-header">
                  <span>Name</span>
                  <span>Date</span>
                  <span>Amount</span>
                  <span></span>
                </div>
                {recent.map((t, i) => {
                  const bg = categoryColors[t.category] || '#8395A7';
                  return (
                    <motion.div
                      key={t._id}
                      className="txn-row"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      {/* Name + category */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className="txn-icon" style={{ background: bg + '20', color: bg }}>
                          {t.category[0]}
                        </div>
                        <div>
                          <div className="txn-name">{t.description || t.category}</div>
                          <div className="txn-cat">{t.category}</div>
                        </div>
                      </div>
                      {/* Date */}
                      <div className="txn-date">
                        {new Date(t.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </div>
                      {/* Amount */}
                      <div className={`txn-amount ${t.type === 'income' ? 'amount-up' : 'amount-down'}`}>
                        {t.type === 'income' ? '+' : '-'}₹{Number(t.amount).toLocaleString('en-IN')}
                      </div>
                      {/* Delete */}
                      <button className="txn-delete" onClick={() => deleteTransaction(t._id)}>
                        <Trash2 size={13} />
                      </button>
                    </motion.div>
                  );
                })}
              </>
            ) : (
              <div className="empty-state">
                No transactions yet.<br />
                <button onClick={() => setShowModal(true)} style={{ color: C.forest, fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', marginTop: 8 }}>
                  Add your first one →
                </button>
              </div>
            )}
          </motion.div>

          {/* Budget goals */}
          <motion.div
            className="glass goals-card"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.48 }}
          >
            <div className="section-header">
              <div>
                <div className="section-title">Budget Goals</div>
                <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>
                  {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
                </div>
              </div>
              <BarChart2 size={16} color="#9CA3AF" />
            </div>

            {budgets.length > 0 ? (
              budgets.map((b, i) => {
                const spent  = getSpent(b.category);
                const pct    = Math.min((spent / b.limit) * 100, 100);
                const over   = spent > b.limit;
                const fillColor = over ? '#EF4444' : pct > 75 ? C.gold : C.forest;
                return (
                  <motion.div
                    key={b._id}
                    className="goal-item"
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.07 }}
                  >
                    <div className="goal-row">
                      <div>
                        <div className="goal-name">{b.category}</div>
                        <div className="goal-meta">{over ? '⚠ Over budget' : `${Math.round(pct)}% used`}</div>
                      </div>
                      <div className="goal-amounts" style={{ color: over ? '#EF4444' : '#1C1C1C', textAlign: 'right' }}>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>₹{spent.toLocaleString('en-IN')}</div>
                        <div style={{ fontSize: 11, color: '#9CA3AF' }}>of ₹{b.limit.toLocaleString('en-IN')}</div>
                      </div>
                    </div>
                    <div className="goal-bar-bg">
                      <motion.div
                        className="goal-bar-fill"
                        style={{ background: fillColor }}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ delay: 0.55 + i * 0.07, duration: 0.6 }}
                      />
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="empty-state">
                No budgets set.<br />
                <a href="/budget" style={{ color: C.forest, fontWeight: 500 }}>Set one on Budget page →</a>
              </div>
            )}

            {/* Savings rate summary */}
            {income > 0 && (
              <div style={{
                marginTop: 20, padding: '14px 16px',
                background: `linear-gradient(135deg, ${C.forest}15, ${C.gold}15)`,
                borderRadius: 12, border: `1px solid ${C.stone}`
              }}>
                <div style={{ fontSize: 11, color: '#6B7280', marginBottom: 4 }}>Overall savings rate</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: C.forest, letterSpacing: '-0.02em' }}>
                  {Math.max(0, Math.round(((income - expense) / income) * 100))}%
                </div>
                <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>
                  ₹{Math.max(0, income - expense).toLocaleString('en-IN')} saved of ₹{income.toLocaleString('en-IN')} earned
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* FAB */}
        <button className="fab" onClick={() => setShowModal(true)} title="Add transaction">
          <Plus size={22} />
        </button>

        {showModal && <AddTransactionModal onClose={() => setShowModal(false)} />}
      </div>
    </>
  );
}