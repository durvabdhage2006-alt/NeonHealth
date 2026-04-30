import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Activity } from 'lucide-react';
import './MedSlot.css';

import { Navbar, Footer } from './components/Layout';
import { LandingPage, AboutPage, HospitalsPage, FeaturesPage, ContactPage } from './pages/LandingPage';
import { DoctorDashboard, StaffDashboard, AdminDashboard } from './pages/Dashboards';
import PatientPortal from './pages/PatientPortal';
import { TranslationProvider } from './context/TranslationContext';
import MedSlotAssistant from './components/MedSlotAssistant';

// Component to handle AnimatePresence logic dynamically based on location
const AnimatedRoutes = ({ isLoggedIn, userRole }) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes key={location.pathname} location={location}>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/hospitals" element={<HospitalsPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/contact" element={<ContactPage />} />
        
        {/* Protected Routes */}
        <Route 
          path="/patient/*" 
          element={isLoggedIn && userRole === 'patient' ? <PatientPortal /> : <Navigate to="/" />} 
        />
        <Route 
          path="/doctor-dashboard" 
          element={isLoggedIn && userRole === 'doctor' ? <DoctorDashboard /> : <Navigate to="/" />} 
        />
        <Route 
          path="/staff-dashboard" 
          element={isLoggedIn && userRole === 'staff' ? <StaffDashboard /> : <Navigate to="/" />} 
        />
        <Route 
          path="/admin-dashboard" 
          element={isLoggedIn && userRole === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} 
        />
        
        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AnimatePresence>
  );
};

export default function App() {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null); // 'patient', 'doctor', 'staff', 'admin'

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <TranslationProvider>
      <BrowserRouter>
        <AnimatePresence>
          {loading && (
            <motion.div 
              exit={{ opacity: 0 }}
              style={{ position: 'fixed', inset: 0, zIndex: 5000, background: 'var(--bg-main)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
            >
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}>
                <Activity size={48} color="var(--primary-teal)" />
              </motion.div>
              <h2 style={{ marginTop: '1.5rem', fontFamily: 'var(--font-heading)', fontWeight: '700', color: 'var(--text-main)' }}>MedSlot</h2>
            </motion.div>
          )}
        </AnimatePresence>

      {!loading && (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Navbar 
            isLoggedIn={isLoggedIn} 
            setIsLoggedIn={setIsLoggedIn} 
            userRole={userRole} 
            setUserRole={setUserRole} 
          />
          
          <div style={{ flex: 1 }}>
             <AnimatedRoutes isLoggedIn={isLoggedIn} userRole={userRole} />
          </div>
          
          <Footer />
        </div>
      )}

        <MedSlotAssistant />
      </BrowserRouter>
    </TranslationProvider>
  );
}
