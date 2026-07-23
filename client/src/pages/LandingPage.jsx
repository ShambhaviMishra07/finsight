// src/pages/LandingPage.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, ResponsiveContainer, Tooltip
} from 'recharts';
import {
  TrendingUp, Shield, Zap, BarChart2,
  ChevronDown, Menu, X, ArrowRight,
  Check, Star, ChevronUp
} from 'lucide-react';

// ─── Design tokens ───────────────────────────────────────────
const C = {
  base:       '#FAF8F4',
  stone:      '#E8E0D4',
  forest:     '#1A3C2E',
  forestMid:  '#2D5A42',
  gold:       '#C9A84C',
  goldLight:  '#F0E4BC',
  text:       '#1C1C1C',
  textMuted:  '#6B6560',
  border:     '#D9D1C5',
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@400;500;600&display=swap');

  .landing * { box-sizing: border-box; margin: 0; padding: 0; }

  .landing {
    font-family: 'Inter', sans-serif;
    background: ${C.base};
    color: ${C.text};
    overflow-x: hidden;
  }

  .display {
    font-family: 'DM Serif Display', serif;
    line-height: 1.1;
    letter-spacing: -0.02em;
  }

  /* Nav */
  .nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 5%;
    height: 68px;
    background: rgba(250,248,244,0.92);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid ${C.border};
    transition: box-shadow 0.2s;
  }
  .nav-logo {
    display: flex; align-items: center; gap: 9px;
    text-decoration: none;
  }
  .nav-logo-icon {
    width: 34px; height: 34px;
    background: ${C.forest};
    border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
  }
  .nav-logo-text {
    font-size: 17px; font-weight: 600;
    color: ${C.forest};
    letter-spacing: -0.01em;
  }
  .nav-links {
    display: flex; align-items: center; gap: 32px;
    list-style: none;
  }
  .nav-links a {
    font-size: 14px; font-weight: 500;
    color: ${C.textMuted};
    text-decoration: none;
    transition: color 0.15s;
  }
  .nav-links a:hover { color: ${C.forest}; }
  .nav-cta { display: flex; align-items: center; gap: 10px; }
  .btn-ghost {
    font-size: 14px; font-weight: 500;
    color: ${C.forest};
    background: none; border: none; cursor: pointer;
    padding: 8px 14px; border-radius: 8px;
    text-decoration: none;
    transition: background 0.15s;
  }
  .btn-ghost:hover { background: ${C.stone}; }
  .btn-primary {
    font-size: 14px; font-weight: 500;
    color: #fff;
    background: ${C.forest};
    border: none; cursor: pointer;
    padding: 9px 20px; border-radius: 9px;
    text-decoration: none;
    display: flex; align-items: center; gap: 6px;
    transition: background 0.15s, transform 0.1s;
  }
  .btn-primary:hover { background: ${C.forestMid}; transform: translateY(-1px); }

  /* Hero */
  .hero {
    min-height: 100vh;
    padding: 120px 5% 80px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
    align-items: center;
    background:
      radial-gradient(ellipse 70% 60% at 80% 40%, rgba(201,168,76,0.10) 0%, transparent 60%),
      radial-gradient(ellipse 50% 50% at 10% 80%, rgba(26,60,46,0.07) 0%, transparent 55%),
      ${C.base};
  }
  .hero-eyebrow {
    display: inline-flex; align-items: center; gap: 7px;
    background: ${C.goldLight};
    color: #7A5A1A;
    font-size: 12px; font-weight: 600;
    letter-spacing: 0.06em; text-transform: uppercase;
    padding: 5px 12px; border-radius: 99px;
    border: 1px solid rgba(201,168,76,0.3);
    margin-bottom: 20px;
  }
  .hero-heading {
    font-size: clamp(40px, 5vw, 62px);
    color: ${C.forest};
    margin-bottom: 22px;
  }
  .hero-heading em {
    font-style: italic;
    color: ${C.gold};
  }
  .hero-sub {
    font-size: 17px; line-height: 1.7;
    color: ${C.textMuted};
    max-width: 440px;
    margin-bottom: 36px;
  }
  .hero-actions { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
  .btn-hero-primary {
    font-size: 15px; font-weight: 500;
    color: #fff; background: ${C.forest};
    padding: 13px 26px; border-radius: 11px;
    text-decoration: none; border: none; cursor: pointer;
    display: flex; align-items: center; gap: 8px;
    transition: background 0.15s, transform 0.12s;
  }
  .btn-hero-primary:hover { background: ${C.forestMid}; transform: translateY(-2px); }
  .btn-hero-ghost {
    font-size: 15px; font-weight: 500;
    color: ${C.forest}; background: transparent;
    padding: 13px 20px; border-radius: 11px;
    text-decoration: none; border: 1.5px solid ${C.border};
    display: flex; align-items: center; gap: 8px;
    transition: border-color 0.15s, background 0.15s;
  }
  .btn-hero-ghost:hover { border-color: ${C.forest}; background: ${C.stone}; }
  .hero-trust {
    display: flex; align-items: center; gap: 20px;
    margin-top: 40px;
    padding-top: 32px;
    border-top: 1px solid ${C.border};
    flex-wrap: wrap;
  }
  .hero-trust-item {
    display: flex; align-items: center; gap: 7px;
    font-size: 13px; color: ${C.textMuted};
  }
  .trust-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: ${C.gold};
  }

  /* Hero card */
  .hero-card-wrap {
    position: relative;
    display: flex; justify-content: center; align-items: center;
  }
  .hero-card {
    background: #fff;
    border: 1px solid ${C.border};
    border-radius: 20px;
    padding: 24px;
    width: 100%; max-width: 440px;
    box-shadow:
      0 4px 6px rgba(26,60,46,0.04),
      0 20px 60px rgba(26,60,46,0.10);
  }
  .card-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 6px;
  }
  .card-label { font-size: 12px; color: ${C.textMuted}; font-weight: 500; }
  .card-badge {
    font-size: 11px; font-weight: 600;
    background: #ECFAF3; color: #1A7A46;
    padding: 3px 9px; border-radius: 99px;
  }
  .card-amount {
    font-size: 32px; font-weight: 600;
    color: ${C.forest};
    letter-spacing: -0.03em;
    margin-bottom: 20px;
  }
  .mini-stats {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 10px; margin-top: 16px;
  }
  .mini-stat {
    background: ${C.base};
    border: 1px solid ${C.stone};
    border-radius: 10px; padding: 10px 12px;
  }
  .mini-stat-label { font-size: 11px; color: ${C.textMuted}; margin-bottom: 3px; }
  .mini-stat-value { font-size: 15px; font-weight: 600; color: ${C.text}; }
  .mini-stat-value.up   { color: #1A7A46; }
  .mini-stat-value.down { color: #B91C1C; }

  /* Floating accent card */
  .float-card {
    position: absolute;
    background: ${C.forest};
    color: #fff;
    border-radius: 14px;
    padding: 12px 16px;
    font-size: 13px; font-weight: 500;
    display: flex; align-items: center; gap: 9px;
    box-shadow: 0 8px 24px rgba(26,60,46,0.25);
    white-space: nowrap;
  }
  .float-card-icon {
    width: 28px; height: 28px;
    background: rgba(255,255,255,0.15);
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
  }

  /* Mobile nav */
  .mobile-menu-btn {
    display: none;
    background: none; border: none; cursor: pointer;
    color: ${C.forest}; padding: 6px;
  }
  .mobile-nav {
    position: fixed; inset: 0; z-index: 200;
    background: ${C.base};
    display: flex; flex-direction: column;
    padding: 24px 5%;
  }
  .mobile-nav-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 32px;
  }
  .mobile-nav-links {
    list-style: none; display: flex; flex-direction: column; gap: 4px;
  }
  .mobile-nav-links a {
    display: block; padding: 12px 8px;
    font-size: 18px; font-weight: 500;
    color: ${C.text}; text-decoration: none;
    border-bottom: 1px solid ${C.stone};
  }

  @media (max-width: 900px) {
    .hero { grid-template-columns: 1fr; padding-top: 100px; }
    .hero-card-wrap { display: none; }
    .nav-links, .nav-cta { display: none; }
    .mobile-menu-btn { display: block; }
  }


  /* ── Logo strip ── */
  .logo-strip {
    padding: 28px 5%;
    border-top: 1px solid ${C.stone};
    border-bottom: 1px solid ${C.stone};
    overflow: hidden;
    background: #fff;
  }
  .logo-strip-label {
    text-align: center; font-size: 12px; font-weight: 500;
    color: ${C.textMuted}; letter-spacing: 0.08em; text-transform: uppercase;
    margin-bottom: 20px;
  }
  .logo-marquee {
    display: flex; gap: 56px; align-items: center;
    animation: marquee 20s linear infinite;
    white-space: nowrap;
  }
  @keyframes marquee {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  .logo-item {
    font-size: 14px; font-weight: 600;
    color: ${C.textMuted}; letter-spacing: 0.04em;
    opacity: 0.55; flex-shrink: 0;
  }

  /* ── Features ── */
  .section { padding: 96px 5%; }
  .section-alt { background: #fff; }
  .section-eyebrow {
    font-size: 11px; font-weight: 600; letter-spacing: 0.1em;
    text-transform: uppercase; color: ${C.gold};
    margin-bottom: 14px;
  }
  .section-heading {
    font-size: clamp(30px, 3.5vw, 46px);
    color: ${C.forest};
    max-width: 520px;
    margin-bottom: 16px;
  }
  .section-sub {
    font-size: 16px; line-height: 1.7;
    color: ${C.textMuted}; max-width: 500px;
    margin-bottom: 56px;
  }
  .features-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
  .feature-card {
    background: ${C.base};
    border: 1px solid ${C.border};
    border-radius: 16px;
    padding: 28px 24px;
    transition: border-color 0.2s, transform 0.2s;
  }
  .feature-card:hover { border-color: ${C.forestMid}; transform: translateY(-3px); }
  .feature-icon {
    width: 42px; height: 42px;
    background: ${C.goldLight};
    border-radius: 11px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 16px;
  }
  .feature-title {
    font-size: 16px; font-weight: 600;
    color: ${C.forest}; margin-bottom: 8px;
  }
  .feature-desc {
    font-size: 14px; line-height: 1.65;
    color: ${C.textMuted};
  }

  /* ── How it works ── */
  .how-grid {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 0; position: relative;
  }
  .how-step {
    padding: 36px 28px;
    border-right: 1px solid ${C.stone};
    position: relative;
  }
  .how-step:last-child { border-right: none; }
  .how-num {
    font-family: 'DM Serif Display', serif;
    font-size: 52px; color: ${C.stone};
    line-height: 1; margin-bottom: 16px;
    user-select: none;
  }
  .how-title {
    font-size: 17px; font-weight: 600;
    color: ${C.forest}; margin-bottom: 10px;
  }
  .how-desc {
    font-size: 14px; line-height: 1.65;
    color: ${C.textMuted};
  }
  .how-check {
    display: flex; align-items: center; gap: 7px;
    font-size: 13px; color: ${C.textMuted};
    margin-top: 14px;
  }
  .how-check-icon {
    width: 18px; height: 18px; border-radius: 50%;
    background: ${C.goldLight}; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
  }

  /* ── Stats strip ── */
  .stats-strip {
    background: ${C.forest};
    padding: 64px 5%;
  }
  .stats-grid {
    display: grid; grid-template-columns: repeat(4, 1fr);
    gap: 24px; max-width: 960px; margin: 0 auto;
  }
  .stat-item { text-align: center; }
  .stat-num {
    font-family: 'DM Serif Display', serif;
    font-size: 42px; color: #fff; margin-bottom: 6px;
  }
  .stat-num span { color: ${C.gold}; }
  .stat-label { font-size: 14px; color: rgba(255,255,255,0.6); }

  @media (max-width: 900px) {
    .features-grid, .how-grid { grid-template-columns: 1fr; }
    .how-step { border-right: none; border-bottom: 1px solid ${C.stone}; }
    .how-step:last-child { border-bottom: none; }
    .stats-grid { grid-template-columns: 1fr 1fr; }
  }


  /* ── Testimonials ── */
  .testimonials-grid {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 18px;
  }
  .testimonial-card {
    background: #fff;
    border: 1px solid ${C.border};
    border-radius: 16px;
    padding: 26px 22px;
  }
  .testimonial-stars {
    display: flex; gap: 3px; margin-bottom: 14px;
  }
  .testimonial-quote {
    font-size: 14px; line-height: 1.7;
    color: ${C.textMuted}; margin-bottom: 18px;
    font-style: italic;
  }
  .testimonial-author {
    display: flex; align-items: center; gap: 10px;
  }
  .testimonial-avatar {
    width: 36px; height: 36px; border-radius: 50%;
    background: ${C.stone};
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; font-weight: 600; color: ${C.forest};
    flex-shrink: 0;
  }
  .testimonial-name { font-size: 14px; font-weight: 600; color: ${C.text}; }
  .testimonial-role { font-size: 12px; color: ${C.textMuted}; }

  /* ── Pricing ── */
  .pricing-grid {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 18px; max-width: 860px; margin: 0 auto;
  }
  .pricing-card {
    border: 1.5px solid ${C.border};
    border-radius: 18px; padding: 30px 26px;
    background: #fff;
    position: relative; transition: border-color 0.2s;
  }
  .pricing-card.popular {
    border-color: ${C.forest};
    background: ${C.base};
  }
  .pricing-popular-badge {
    position: absolute; top: -13px; left: 50%; transform: translateX(-50%);
    background: ${C.forest}; color: #fff;
    font-size: 11px; font-weight: 600; letter-spacing: 0.06em;
    padding: 4px 14px; border-radius: 99px;
    white-space: nowrap;
  }
  .pricing-plan { font-size: 13px; font-weight: 600; color: ${C.textMuted}; margin-bottom: 8px; }
  .pricing-price {
    font-family: 'DM Serif Display', serif;
    font-size: 40px; color: ${C.forest};
    margin-bottom: 4px; line-height: 1;
  }
  .pricing-price sup { font-size: 18px; vertical-align: super; }
  .pricing-period { font-size: 13px; color: ${C.textMuted}; margin-bottom: 22px; }
  .pricing-divider { border: none; border-top: 1px solid ${C.stone}; margin: 20px 0; }
  .pricing-features { list-style: none; display: flex; flex-direction: column; gap: 10px; }
  .pricing-feature {
    display: flex; align-items: flex-start; gap: 9px;
    font-size: 13px; color: ${C.textMuted};
  }
  .pricing-check {
    width: 18px; height: 18px; border-radius: 50%;
    background: ${C.goldLight}; flex-shrink: 0; margin-top: 1px;
    display: flex; align-items: center; justify-content: center;
  }
  .pricing-cta {
    display: block; width: 100%; text-align: center;
    padding: 12px; border-radius: 10px;
    font-size: 14px; font-weight: 500;
    text-decoration: none; margin-top: 24px;
    transition: all 0.15s;
  }
  .pricing-cta.outline {
    border: 1.5px solid ${C.border}; color: ${C.forest};
    background: transparent;
  }
  .pricing-cta.outline:hover { border-color: ${C.forest}; background: ${C.stone}; }
  .pricing-cta.filled {
    background: ${C.forest}; color: #fff; border: none;
  }
  .pricing-cta.filled:hover { background: ${C.forestMid}; }

  /* ── FAQ ── */
  .faq-list { max-width: 680px; margin: 0 auto; }
  .faq-item {
    border-bottom: 1px solid ${C.stone};
    padding: 20px 0;
  }
  .faq-question {
    display: flex; align-items: center; justify-content: space-between;
    cursor: pointer; gap: 16px;
    font-size: 15px; font-weight: 500; color: ${C.forest};
    background: none; border: none; width: 100%; text-align: left;
  }
  .faq-answer {
    font-size: 14px; line-height: 1.7;
    color: ${C.textMuted}; margin-top: 12px;
    padding-right: 32px;
  }

  /* ── CTA banner ── */
  .cta-banner {
    background:
      radial-gradient(ellipse 60% 80% at 80% 50%, rgba(201,168,76,0.15) 0%, transparent 60%),
      ${C.forest};
    padding: 96px 5%; text-align: center;
  }
  .cta-banner h2 {
    font-size: clamp(28px, 3.5vw, 46px);
    color: #fff; margin-bottom: 16px;
  }
  .cta-banner p { font-size: 16px; color: rgba(255,255,255,0.65); margin-bottom: 36px; }
  .cta-actions { display: flex; align-items: center; justify-content: center; gap: 14px; flex-wrap: wrap; }
  .btn-cta-white {
    background: #fff; color: ${C.forest};
    padding: 13px 28px; border-radius: 11px;
    font-size: 15px; font-weight: 500;
    text-decoration: none; display: flex; align-items: center; gap: 8px;
    transition: transform 0.12s;
  }
  .btn-cta-white:hover { transform: translateY(-2px); }
  .btn-cta-ghost {
    background: rgba(255,255,255,0.1); color: #fff;
    padding: 13px 24px; border-radius: 11px;
    font-size: 15px; font-weight: 500;
    text-decoration: none; border: 1.5px solid rgba(255,255,255,0.2);
    transition: background 0.15s;
  }
  .btn-cta-ghost:hover { background: rgba(255,255,255,0.18); }

  /* ── Footer ── */
  .footer {
    background: #fff;
    border-top: 1px solid ${C.stone};
    padding: 56px 5% 32px;
  }
  .footer-top {
    display: grid; grid-template-columns: 1.8fr 1fr 1fr 1fr;
    gap: 40px; margin-bottom: 48px;
  }
  .footer-brand-desc {
    font-size: 14px; line-height: 1.7;
    color: ${C.textMuted}; margin-top: 12px; max-width: 240px;
  }
  .footer-col-title {
    font-size: 12px; font-weight: 600; letter-spacing: 0.08em;
    text-transform: uppercase; color: ${C.text};
    margin-bottom: 16px;
  }
  .footer-links { list-style: none; display: flex; flex-direction: column; gap: 10px; }
  .footer-links a {
    font-size: 14px; color: ${C.textMuted};
    text-decoration: none; transition: color 0.15s;
  }
  .footer-links a:hover { color: ${C.forest}; }
  .footer-bottom {
    display: flex; align-items: center; justify-content: space-between;
    padding-top: 24px; border-top: 1px solid ${C.stone};
    font-size: 13px; color: ${C.textMuted};
    flex-wrap: wrap; gap: 10px;
  }

  @media (max-width: 900px) {
    .testimonials-grid, .pricing-grid { grid-template-columns: 1fr; }
    .footer-top { grid-template-columns: 1fr 1fr; }
  }

  `;

// ── Dummy chart data ──────────────────────────────────────────
const chartData = [
  { m: 'Jan', v: 42000 }, { m: 'Feb', v: 38000 }, { m: 'Mar', v: 51000 },
  { m: 'Apr', v: 47000 }, { m: 'May', v: 63000 }, { m: 'Jun', v: 58000 },
  { m: 'Jul', v: 72000 },
];

// ── Navbar ────────────────────────────────────────────────────
function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <style>{styles}</style>
      <nav className="nav">
        <Link to="/home" className="nav-logo">
          <div className="nav-logo-icon">
            <TrendingUp size={17} color="#fff" />
          </div>
          <span className="nav-logo-text">Finsight</span>
        </Link>

        <ul className="nav-links">
          {['Features', 'How it works', 'Pricing', 'FAQ'].map((l) => (
            <li key={l}><a href={`#${l.toLowerCase().replace(/ /g, '-')}`}>{l}</a></li>
          ))}
        </ul>

        <div className="nav-cta">
          <Link to="/login"    className="btn-ghost">Sign in</Link>
          <Link to="/register" className="btn-primary">Get started <ArrowRight size={14} /></Link>
        </div>

        <button className="mobile-menu-btn" onClick={() => setOpen(true)}>
          <Menu size={24} />
        </button>
      </nav>

      {open && (
        <div className="mobile-nav">
          <div className="mobile-nav-header">
            <Link to="/home" className="nav-logo" onClick={() => setOpen(false)}>
              <div className="nav-logo-icon"><TrendingUp size={17} color="#fff" /></div>
              <span className="nav-logo-text">Finsight</span>
            </Link>
            <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <X size={24} color={C.forest} />
            </button>
          </div>
          <ul className="mobile-nav-links">
            {['Features', 'How it works', 'Pricing', 'FAQ'].map((l) => (
              <li key={l}>
                <a href={`#${l.toLowerCase().replace(/ /g, '-')}`} onClick={() => setOpen(false)}>{l}</a>
              </li>
            ))}
            <li style={{ marginTop: 24, display: 'flex', gap: 10 }}>
              <Link to="/login"    className="btn-ghost"   onClick={() => setOpen(false)}>Sign in</Link>
              <Link to="/register" className="btn-primary" onClick={() => setOpen(false)}>Get started</Link>
            </li>
          </ul>
        </div>
      )}
    </>
  );
}

// ── Hero ──────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="hero">
      {/* Left copy */}
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
        <div className="hero-eyebrow">
          <span>✦</span> Personal Finance Intelligence
        </div>
        <h1 className="display hero-heading">
          Your money,<br />finally <em>clear.</em>
        </h1>
        <p className="hero-sub">
          Finsight brings all your income, spending, and budgets into one beautiful dashboard — so you always know exactly where you stand.
        </p>
        <div className="hero-actions">
          <Link to="/register" className="btn-hero-primary">
            Start for free <ArrowRight size={16} />
          </Link>
          <a href="#how-it-works" className="btn-hero-ghost">
            See how it works
          </a>
        </div>
        <div className="hero-trust">
          {['No credit card needed', 'Set up in 2 minutes', 'Bank-level security'].map((t) => (
            <div key={t} className="hero-trust-item">
              <span className="trust-dot" /> {t}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Right — live mini dashboard card */}
      <motion.div
        className="hero-card-wrap"
        initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.15 }}
      >
        {/* Main card */}
        <div className="hero-card">
          <div className="card-header">
            <span className="card-label">Total balance</span>
            <span className="card-badge">↑ +12.4%</span>
          </div>
          <div className="card-amount">₹1,24,580</div>

          {/* Live area chart */}
          <ResponsiveContainer width="100%" height={110}>
            <AreaChart data={chartData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="heroGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={C.forestMid} stopOpacity={0.18} />
                  <stop offset="95%" stopColor={C.forestMid} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Tooltip
                contentStyle={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 12 }}
                formatter={(v) => [`₹${v.toLocaleString('en-IN')}`, 'Balance']}
              />
              <Area type="monotone" dataKey="v" stroke={C.forestMid} strokeWidth={2.5} fill="url(#heroGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>

          {/* Mini stats */}
          <div className="mini-stats">
            <div className="mini-stat">
              <div className="mini-stat-label">Income</div>
              <div className="mini-stat-value up">+₹42,000</div>
            </div>
            <div className="mini-stat">
              <div className="mini-stat-label">Expenses</div>
              <div className="mini-stat-value down">-₹17,420</div>
            </div>
            <div className="mini-stat">
              <div className="mini-stat-label">Savings rate</div>
              <div className="mini-stat-value">58.5%</div>
            </div>
            <div className="mini-stat">
              <div className="mini-stat-label">Budgets on track</div>
              <div className="mini-stat-value up">4 / 5</div>
            </div>
          </div>
        </div>

        {/* Floating accent: security badge */}
        <motion.div
          className="float-card"
          style={{ bottom: -18, left: -28 }}
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
        >
          <div className="float-card-icon"><Shield size={14} /></div>
          Bank-level encryption
        </motion.div>

        {/* Floating accent: insight */}
        <motion.div
          className="float-card"
          style={{ top: -18, right: -18, background: C.gold, color: C.forest }}
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
        >
          <div className="float-card-icon" style={{ background: 'rgba(26,60,46,0.15)' }}>
            <Zap size={14} color={C.forest} />
          </div>
          Smart savings insight
        </motion.div>
      </motion.div>
    </section>
  );
}

// ── Logo strip ────────────────────────────────────────────────
const logos = ['Savings', 'Investments', 'Budgets', 'Analytics', 'Transactions', 'Reports', 'Insights', 'Goals'];

function LogoStrip() {
  const doubled = [...logos, ...logos];
  return (
    <div className="logo-strip">
      <div className="logo-strip-label">Everything your finances need, in one place</div>
      <div style={{ overflow: 'hidden' }}>
        <div className="logo-marquee">
          {doubled.map((l, i) => (
            <span key={i} className="logo-item">✦ {l}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Features ──────────────────────────────────────────────────
const features = [
  {
    icon: <BarChart2 size={20} color="#7A5A1A" />,
    title: 'Visual dashboard',
    desc:  'See your income, expenses, and balance in beautiful charts that update the moment you add a transaction.',
  },
  {
    icon: <TrendingUp size={20} color="#7A5A1A" />,
    title: 'Smart budgets',
    desc:  'Set monthly limits per category. Finsight tracks your spending and warns you before you go over.',
  },
  {
    icon: <Zap size={20} color="#7A5A1A" />,
    title: 'Instant insights',
    desc:  'Your savings rate, top spending categories, and balance trends — calculated live, no waiting.',
  },
  {
    icon: <Shield size={20} color="#7A5A1A" />,
    title: 'Secure by default',
    desc:  'JWT authentication and encrypted storage. Your financial data never leaves your account.',
  },
  {
    icon: <BarChart2 size={20} color="#7A5A1A" />,
    title: 'Analytics page',
    desc:  'Monthly bar charts, a balance trend line, and category breakdowns that reveal your money habits.',
  },
  {
    icon: <TrendingUp size={20} color="#7A5A1A" />,
    title: 'Dark mode',
    desc:  'Switch between warm light and deep dark themes. Your preference is saved across sessions.',
  },
];

function Features() {
  return (
    <section className="section section-alt" id="features">
      <div className="section-eyebrow">Core features</div>
      <h2 className="display section-heading">Built for how you actually spend</h2>
      <p className="section-sub">
        Not another spreadsheet. Finsight is a real app that tracks every rupee and shows you patterns you never noticed.
      </p>
      <div className="features-grid">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            className="feature-card"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.3 }}
            viewport={{ once: true }}
          >
            <div className="feature-icon">{f.icon}</div>
            <div className="feature-title">{f.title}</div>
            <div className="feature-desc">{f.desc}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ── How it works ──────────────────────────────────────────────
const steps = [
  {
    num: '01',
    title: 'Create your account',
    desc:  'Sign up in under a minute. No credit card, no forms. Just your name and email.',
    checks: ['Free forever tier', 'Instant access'],
  },
  {
    num: '02',
    title: 'Add your transactions',
    desc:  'Log income and expenses by category. Takes seconds per entry, builds a complete picture over time.',
    checks: ['7 categories', 'Filter and search'],
  },
  {
    num: '03',
    title: 'Watch the insights appear',
    desc:  'Your dashboard, charts, and savings insights update live. Set a budget and track it in real time.',
    checks: ['Live charts', 'Budget alerts'],
  },
];

function HowItWorks() {
  return (
    <section className="section" id="how-it-works">
      <div className="section-eyebrow">How it works</div>
      <h2 className="display section-heading">Up and running in minutes</h2>
      <p className="section-sub">No complicated setup. No integrations to configure. Just start.</p>

      <motion.div
        className="how-grid"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
      >
        {steps.map((s) => (
          <motion.div
            key={s.num}
            className="how-step"
            variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
          >
            <div className="how-num">{s.num}</div>
            <div className="how-title">{s.title}</div>
            <div className="how-desc">{s.desc}</div>
            {s.checks.map((c) => (
              <div key={c} className="how-check">
                <div className="how-check-icon">
                  <Check size={11} color="#7A5A1A" strokeWidth={2.5} />
                </div>
                {c}
              </div>
            ))}
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

// ── Stats strip ───────────────────────────────────────────────
const stats = [
  { num: '100+', suffix: '+', label: 'Transactions tracked' },
  { num: '20+', suffix: '', label: 'Categories supported' },
  { num: '99', suffix: '%', label: 'Dashboard accuracy' },
  { num: '4.3', suffix: '★', label: 'User experience rating' },
];

function StatsStrip() {
  return (
    <div className="stats-strip">
      <div className="stats-grid">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            className="stat-item"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            viewport={{ once: true }}
          >
            <div className="stat-num">{s.num}<span>{s.suffix}</span></div>
            <div className="stat-label">{s.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}


// ── Testimonials ─────────────────────────────────────────────
const testimonials = [
  {
    quote: "I never knew where my money was going until Finsight. Now I can see every pattern at a glance. My savings rate went from 10% to 34% in three months.",
    name:  'Priya Sharma',
    role:  'Software engineer, Bengaluru',
    init:  'PS',
  },
  {
    quote: "The budget tracker is exactly what I needed. The progress bars turn red before you overspend — I caught myself before going over on food twice this month.",
    name:  'Arjun Mehta',
    role:  'Freelancer, Mumbai',
    init:  'AM',
  },
  {
    quote: "Clean, fast, and the dark mode is gorgeous. I check my Finsight dashboard every morning like I used to check Instagram. Better habit honestly.",
    name:  'Neha Kapoor',
    role:  'Product designer, Delhi',
    init:  'NK',
  },
];

function Testimonials() {
  return (
    <section className="section section-alt" id="testimonials">
      <div className="section-eyebrow">What users say</div>
      <h2 className="display section-heading">Real people, real results</h2>
      <p className="section-sub" style={{ marginBottom: 40 }}>
        Join thousands of people who finally feel in control of their money.
      </p>
      <div className="testimonials-grid">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            className="testimonial-card"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
          >
            <div className="testimonial-stars">
              {[...Array(5)].map((_, j) => <Star key={j} size={14} fill="#C9A84C" color="#C9A84C" />)}
            </div>
            <p className="testimonial-quote">"{t.quote}"</p>
            <div className="testimonial-author">
              <div className="testimonial-avatar">{t.init}</div>
              <div>
                <div className="testimonial-name">{t.name}</div>
                <div className="testimonial-role">{t.role}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ── Pricing ───────────────────────────────────────────────────
const plans = [
  {
    name:    'Free',
    price:   '0',
    period:  'Forever free',
    popular: false,
    features: [
      'Dashboard & charts',
      'Up to 50 transactions / month',
      '3 budget categories',
      'Light & dark mode',
    ],
    cta:   'Get started',
    style: 'outline',
  },
  {
    name:    'Pro',
    price:   '199',
    period:  'per month',
    popular: true,
    features: [
      'Everything in Free',
      'Unlimited transactions',
      'Unlimited budget categories',
      'Analytics page',
      'Export to CSV',
      'Priority support',
    ],
    cta:   'Start free trial',
    style: 'filled',
  },
  {
    name:    'Team',
    price:   '499',
    period:  'per month',
    popular: false,
    features: [
      'Everything in Pro',
      'Up to 5 members',
      'Shared budgets',
      'Admin controls',
      'Audit log',
    ],
    cta:   'Contact us',
    style: 'outline',
  },
];

function Pricing() {
  return (
    <section className="section" id="pricing">
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <div className="section-eyebrow" style={{ justifyContent: 'center', display: 'flex' }}>Pricing</div>
        <h2 className="display section-heading" style={{ margin: '14px auto 12px', textAlign: 'center' }}>
          Simple, honest pricing
        </h2>
        <p className="section-sub" style={{ margin: '0 auto', textAlign: 'center' }}>
          Start free. Upgrade only when you need more. No hidden fees.
        </p>
      </div>
      <div className="pricing-grid">
        {plans.map((p, i) => (
          <motion.div
            key={p.name}
            className={`pricing-card ${p.popular ? 'popular' : ''}`}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
          >
            {p.popular && <div className="pricing-popular-badge">Most popular</div>}
            <div className="pricing-plan">{p.name}</div>
            <div className="pricing-price">
              <sup>₹</sup>{p.price}
            </div>
            <div className="pricing-period">{p.period}</div>
            <hr className="pricing-divider" />
            <ul className="pricing-features">
              {p.features.map((f) => (
                <li key={f} className="pricing-feature">
                  <div className="pricing-check">
                    <Check size={11} color="#7A5A1A" strokeWidth={2.5} />
                  </div>
                  {f}
                </li>
              ))}
            </ul>
            <Link to="/register" className={`pricing-cta ${p.style}`}>{p.cta}</Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ── FAQ ───────────────────────────────────────────────────────
const faqs = [
  { q: 'Is Finsight really free?',                   a: 'Yes — the free tier is free forever with no credit card required. You get the full dashboard, charts, and budget tracking up to 50 transactions a month.' },
  { q: 'How is my data stored?',                      a: 'Your data is stored in a MongoDB database secured with JWT authentication. Passwords are bcrypt-hashed and never stored in plain text.' },
  { q: 'Can I export my transactions?',               a: 'CSV export is available on the Pro plan. Free users can view and filter all their data inside the app.' },
  { q: 'Does Finsight connect to my bank account?',   a: 'Not yet — you add transactions manually, which keeps your banking credentials completely out of the picture. Bank sync is on the roadmap.' },
 {
  q: 'What happens if I go over my budget?',
  a: "The budget card turns amber at 75% and red when you exceed the limit. You'll see exactly how much you're over and can adjust accordingly."
},
];

function FAQ() {
  const [open, setOpen] = useState(null);
  return (
    <section className="section section-alt" id="faq">
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <div className="section-eyebrow" style={{ display: 'flex', justifyContent: 'center' }}>FAQ</div>
        <h2 className="display section-heading" style={{ margin: '14px auto', textAlign: 'center' }}>
          Common questions
        </h2>
      </div>
      <div className="faq-list">
        {faqs.map((f, i) => (
          <div key={i} className="faq-item">
            <button className="faq-question" onClick={() => setOpen(open === i ? null : i)}>
              {f.q}
              {open === i ? <ChevronUp size={18} color={C.gold} /> : <ChevronDown size={18} color={C.textMuted} />}
            </button>
            {open === i && (
              <motion.p
                className="faq-answer"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.18 }}
              >
                {f.a}
              </motion.p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

// ── CTA Banner ────────────────────────────────────────────────
function CTABanner() {
  return (
    <div className="cta-banner">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="display">Ready to see where your money goes?</h2>
        <p>Join thousands of people who track smarter with Finsight. Free to start, forever.</p>
        <div className="cta-actions">
          <Link to="/register" className="btn-cta-white">
            Create free account <ArrowRight size={16} />
          </Link>
          <Link to="/login" className="btn-cta-ghost">Sign in</Link>
        </div>
      </motion.div>
    </div>
  );
}

// ── Footer ────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div>
          <Link to="/home" className="nav-logo" style={{ display: 'inline-flex' }}>
            <div className="nav-logo-icon"><TrendingUp size={17} color="#fff" /></div>
            <span className="nav-logo-text">Finsight</span>
          </Link>
          <p className="footer-brand-desc">
            A personal finance dashboard that makes your money make sense. Built with React, Node, and MongoDB.
          </p>
        </div>
        <div>
          <div className="footer-col-title">Product</div>
          <ul className="footer-links">
            {['Dashboard', 'Transactions', 'Budget', 'Analytics'].map((l) => (
              <li key={l}><Link to="/dashboard">{l}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <div className="footer-col-title">Company</div>
          <ul className="footer-links">
            {['About', 'Blog', 'Careers', 'Press'].map((l) => (
              <li key={l}><a href="#">{l}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <div className="footer-col-title">Legal</div>
          <ul className="footer-links">
            {['Privacy policy', 'Terms of service', 'Cookie policy'].map((l) => (
              <li key={l}><a href="#">{l}</a></li>
            ))}
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Finsight. All rights reserved.</span>
        <span>Built by Shambhavi · MERN Stack</span>
      </div>
    </footer>
  );
}

// ══════════════════════════════════════════════════════════════
// PHASE 1 EXPORT — paste Phase 2 code below Hero before export
// ══════════════════════════════════════════════════════════════
export default function LandingPage() {
  return (
    <div className="landing">
      <Navbar />
      <Hero />
       <LogoStrip />
      <Features />
      <HowItWorks />
      <StatsStrip />
      <Testimonials />
      <Pricing />
      <FAQ />
      <CTABanner />
      <Footer />
      
    </div>
  );
}