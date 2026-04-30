import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Users, Lock, Mail, X, BellRing, Globe } from 'lucide-react';
import { useTranslation } from '../context/TranslationContext';
import '../MedSlot.css';

export const Navbar = ({ isLoggedIn, setIsLoggedIn, userRole, setUserRole }) => {
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { lang, setLang, t } = useTranslation();

  const handleLogin = (role) => {
    setIsLoggedIn(true);
    setUserRole(role);
    setShowLogin(false);
    navigate(role === 'patient' ? '/patient' : `/${role}-dashboard`);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="navbar">
        <div className="nav-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <Activity size={28} strokeWidth={3} />
          <span>MedSlot</span>
        </div>
        <ul className="nav-links">
          <li><Link to="/" style={{ color: isActive('/') ? 'var(--primary-teal)' : '' }}>{t('home')}</Link></li>
          <li><Link to="/about" style={{ color: isActive('/about') ? 'var(--primary-teal)' : '' }}>{t('about')}</Link></li>
          <li><Link to="/hospitals" style={{ color: isActive('/hospitals') ? 'var(--primary-teal)' : '' }}>{t('hospitals')}</Link></li>
          <li><Link to="/features" style={{ color: isActive('/features') ? 'var(--primary-teal)' : '' }}>{t('features')}</Link></li>
          <li><Link to="/patient/emergency" style={{ color: isActive('/patient/emergency') ? 'var(--danger-red)' : 'var(--danger-red)', fontWeight: 'bold' }}>{t('emergencyTab') || 'Emergency'}</Link></li>
          <li><Link to="/contact" style={{ color: isActive('/contact') ? 'var(--primary-teal)' : '' }}>{t('contact')}</Link></li>
        </ul>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={() => setLang(lang === 'EN' ? 'MR' : lang === 'MR' ? 'HI' : 'EN')} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
            <Globe size={16}/> {lang}
          </button>
          
          {isLoggedIn ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button className="btn btn-outline" style={{ border: 'none', padding: '0.5rem' }}><BellRing size={20}/></button>
              <Link to={userRole === 'patient' ? '/patient' : `/${userRole}-dashboard`} style={{ textDecoration: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: 'var(--primary-teal)', cursor: 'pointer' }}>
                  <div style={{ width: '36px', height: '36px', background: 'var(--primary-light)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Users size={18} />
                  </div>
                  {userRole === 'patient' ? 'John Doe' : userRole === 'doctor' ? 'Dr. Sarah' : 'Staff / Admin'}
                </div>
              </Link>
              <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>{t('logout')}</button>
            </div>
          ) : (
            <button className="btn btn-secondary" onClick={() => setShowLogin(true)}>{t('login')}</button>
          )}
        </div>
      </nav>
      <LoginModal show={showLogin} onClose={() => setShowLogin(false)} onLogin={handleLogin} />
    </>
  );
};

export const LoginModal = ({ show, onClose, onLogin }) => {
  const [role, setRole] = useState('patient');
  const [loginMethod, setLoginMethod] = useState('email');
  const { t } = useTranslation();
  
  if (!show) return null;
  
  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        style={{ position: 'fixed', inset: 0, zIndex: 4000, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <motion.div 
          initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
          className="card" style={{ width: '100%', maxWidth: '450px', padding: '2.5rem', position: 'relative' }}
        >
          <button onClick={onClose} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={24} />
          </button>
          
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div className="icon-box icon-teal" style={{ margin: '0 auto 1rem' }}><Lock size={24} /></div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800 }}>{t('welcomeBack')}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{t('secureLogin')}</p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', background: 'var(--bg-main)', padding: '0.35rem', borderRadius: '8px' }}>
            {['patient', 'doctor', 'staff', 'admin'].map(r => (
               <button 
                  key={r}
                  onClick={() => setRole(r)}
                  style={{ flex: 1, padding: '0.5rem', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem', transition: '0.2s', background: role === r ? 'white' : 'transparent', color: role === r ? 'var(--primary-teal)' : 'var(--text-muted)', boxShadow: role === r ? 'var(--shadow-sm)' : 'none', textTransform: 'capitalize' }}
                >{r}</button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem' }}>
            <button onClick={() => setLoginMethod('email')} style={{ flex: 1, background: 'none', border: 'none', fontWeight: 600, color: loginMethod === 'email' ? 'var(--primary-teal)' : 'var(--text-muted)', cursor: 'pointer' }}>{t('emailLogin')}</button>
            <button onClick={() => setLoginMethod('otp')} style={{ flex: 1, background: 'none', border: 'none', fontWeight: 600, color: loginMethod === 'otp' ? 'var(--primary-teal)' : 'var(--text-muted)', cursor: 'pointer' }}>{t('otpLogin')}</button>
          </div>

          {loginMethod === 'email' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{t('emailAddr')}</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input type="email" placeholder="name@example.com" style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '8px', border: '1px solid var(--border-light)', fontSize: '0.95rem', outline: 'none' }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{t('password')}</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input type="password" placeholder="••••••••" style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '8px', border: '1px solid var(--border-light)', fontSize: '0.95rem', outline: 'none' }} />
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{t('mobileNum')}</label>
                <div style={{ position: 'relative', display: 'flex', gap: '0.5rem' }}>
                  <input type="text" placeholder="+1 (555) 000-0000" style={{ flex: 1, padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border-light)', fontSize: '0.95rem', outline: 'none' }} />
                  <button className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>{t('sendOtp')}</button>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{t('enterOtp')}</label>
                <input type="text" placeholder="123456" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border-light)', fontSize: '0.95rem', outline: 'none', letterSpacing: '4px', textAlign: 'center' }} />
              </div>
            </div>
          )}

          <button onClick={() => onLogin(role)} className="btn btn-primary" style={{ width: '100%', marginBottom: '1rem' }}>
            {t('signIn')}
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <div className="nav-logo" style={{ color: 'white', marginBottom: '1.5rem' }}>
            <Activity size={24} /> MedSlot
          </div>
          <p style={{ maxWidth: '300px' }}>
            {t('heroDesc')}
          </p>
        </div>
        <div>
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">{t('home')}</Link></li>
            <li><Link to="/about">{t('aboutSystem')}</Link></li>
            <li><Link to="/hospitals">{t('nearbyHospitals')}</Link></li>
            <li><Link to="/features">{t('features')}</Link></li>
          </ul>
        </div>
        <div>
          <h4>Hospital Support</h4>
          <ul>
            <li><Link to="/admin-dashboard">Admin Portal</Link></li>
            <li><Link to="/doctor-dashboard">Doctor Portal</Link></li>
            <li><Link to="/staff-dashboard">Staff Portal</Link></li>
            <li><Link to="/contact">{t('contact')}</Link></li>
          </ul>
        </div>
        <div>
          <h4>Contact Info</h4>
          <ul>
            <li>support@medslot.com</li>
            <li>+1 (800) 123-4567</li>
            <li>123 Healthcare Blvd, MedCity</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} MedSlot SaaS Platform. All rights reserved. Professional Healthcare UI Design.
      </div>
    </footer>
  );
};
