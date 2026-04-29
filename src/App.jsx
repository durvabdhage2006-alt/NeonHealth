import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
  Activity, 
  Users, 
  Clock, 
  TrendingUp, 
  Stethoscope, 
  Bell, 
  ChevronRight,
  ArrowRight,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Building2,
  Phone
} from 'lucide-react';
import ThreeScene from './components/ThreeScene';
import './MedSlot.css';

// Doctor Images from Artifacts
import drEmily from './assets/dr_emily_chen_1777454324348.png';
import drMarcus from './assets/dr_marcus_wright_1777454339238.png';
import drSarah from './assets/dr_sarah_johnson_realistic_1777454357857.png';

const Navbar = () => (
  <motion.nav 
    initial={{ y: -100 }}
    animate={{ y: 0 }}
    className="navbar"
  >
    <div className="nav-logo">
      <Activity size={32} strokeWidth={3} />
      <span style={{ fontFamily: 'Poppins', letterSpacing: '-1px' }}>MedSlot</span>
    </div>
    <ul className="nav-links">
      <li><a href="#home">Home</a></li>
      <li><a href="#queue">Live Queue</a></li>
      <li><a href="#doctors">Doctors</a></li>
      <li><a href="#emergency" style={{ color: '#ff4d4d' }}>Emergency</a></li>
    </ul>
  </motion.nav>
);

const Hero = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 250]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  
  return (
    <section id="home" className="hero">
      <ThreeScene />
      <motion.div 
        style={{ y: y1, opacity }}
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1.2, cubicBezier: [0.16, 1, 0.3, 1] }}
        className="hero-content glass-panel glow-border"
      >
        <h1 className="hero-title">MedSlot</h1>
        <p className="hero-subtitle">Skip the Queue. Experience Smart Healthcare.</p>
        <div className="cta-group">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-primary"
          >
            Book Appointment
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-accent"
          >
            View Live Queue
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-secondary"
            style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}
          >
            Doctor Portal Login <ArrowRight size={20} />
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
};

const SectionHeader = ({ title, subtitle }) => (
  <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
    <h2 className="section-title">{title}</h2>
    <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginTop: '-3rem' }}>{subtitle}</p>
  </div>
);

const LiveQueueFlow = () => {
  const [activeStep, setActiveStep] = useState(1);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep(prev => (prev % 3) + 1);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const steps = [
    { id: 1, label: 'Waiting', icon: <Clock /> },
    { id: 2, label: 'In Progress', icon: <Activity /> },
    { id: 3, label: 'Done', icon: <CheckCircle2 /> }
  ];

  return (
    <section id="queue" className="section-container">
      <SectionHeader title="Live Queue Control" subtitle="AI tracking tokens moving from waiting area to doctor cabin" />
      <div className="glass-panel glow-border" style={{ padding: '4rem', background: 'rgba(15,23,42,0.6)' }}>
        <div className="queue-flow">
          <div className="queue-line"></div>
          <motion.div 
            className="queue-progress"
            animate={{ width: `${(activeStep - 1) * 40 + 10}%` }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
          {steps.map((step) => (
            <div key={step.id} style={{ textAlign: 'center', zIndex: 4 }}>
              <motion.div 
                className={`queue-node ${activeStep === step.id ? 'active' : ''}`}
                animate={activeStep === step.id ? { scale: [1, 1.2, 1] } : {}}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                {step.icon}
              </motion.div>
              <p style={{ marginTop: '1.5rem', fontWeight: '800', color: activeStep === step.id ? 'var(--primary-cyan)' : 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {step.label}
              </p>
            </div>
          ))}
        </div>
        <div style={{ marginTop: '4rem', textAlign: 'center' }}>
          <p style={{ fontSize: '1.5rem', color: 'var(--text-main)', fontWeight: '700' }}>
            Currently Processing: <strong style={{ color: 'var(--primary-purple)', fontSize: '2rem', textShadow: '0 0 20px rgba(181, 60, 255, 0.5)' }}>Token A2{activeStep + 2}</strong>
          </p>
        </div>
      </div>
    </section>
  );
};

const DoctorSection = () => {
  const doctors = [
    { name: 'Dr. Emily Chen', specialty: 'Cardiology Head', queue: 12, image: drEmily, status: 'Active' },
    { name: 'Dr. Marcus Wright', specialty: 'Neurology Lead', queue: 8, image: drMarcus, status: 'Active' },
    { name: 'Dr. Sarah Johnson', specialty: 'Chief Pediatrician', queue: 5, image: drSarah, status: 'Break' }
  ];

  return (
    <section id="doctors" className="section-container">
      <SectionHeader title="Smart Doctor Dashboard" subtitle="Live availability and queue status for top specialists" />
      <div className="grid-3">
        {doctors.map((dr, i) => (
          <motion.div 
            key={i}
            whileHover={{ scale: 1.05, y: -15 }}
            className="glass-panel doctor-card glow-border"
            style={{ overflow: 'hidden', padding: 0 }}
          >
            <div style={{ height: '350px', width: '100%', position: 'relative' }}>
              <img src={dr.image} alt={dr.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #0f172a, transparent)' }}></div>
              <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', right: '2rem' }}>
                 <h3 style={{ fontSize: '1.8rem', fontWeight: '900', color: 'white', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>{dr.name}</h3>
                 <p style={{ color: 'var(--primary-cyan)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.9rem' }}>{dr.specialty}</p>
              </div>
            </div>
            <div style={{ padding: '2rem', background: 'rgba(0,0,0,0.2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '1rem', color: 'var(--text-main)', fontWeight: '600' }}>Patients Waiting: <strong style={{ color: 'var(--primary-green)', fontSize: '1.2rem' }}>{dr.queue}</strong></span>
                <div className="status-pulse" style={{ background: dr.status === 'Active' ? '#00ff88' : '#ff4d4d' }}></div>
              </div>
              <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', padding: '0.8rem', fontSize: '0.9rem' }}>Join Queue <ArrowRight size={16} /></button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const PatientExperience = () => (
  <section className="section-container" style={{ position: 'relative' }}>
    <div className="glass-panel glow-border" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', padding: '5rem', gap: '5rem', background: 'var(--gradient-bg)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h2 style={{ fontSize: '3.5rem', fontWeight: '900', marginBottom: '2rem', letterSpacing: '-1.5px', background: 'linear-gradient(135deg, #ffffff 0%, #b53cff 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Patient Comfort Experience</h2>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '3rem' }}>
          Relax in the cafeteria or take a walk. MedSlot's intelligent system tracks your position and sends dynamic alerts exactly when you need to start moving toward the doctor's cabin.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {[
            { icon: <Phone size={30} />, text: 'Real-time Push Alerts' },
            { icon: <MapPin size={30} />, text: 'Indoor Navigation Guide' },
            { icon: <Clock size={30} />, text: 'Live Delay Adjustment' }
          ].map((item, i) => (
            <motion.div key={i} whileHover={{ x: 15 }} style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', fontWeight: '700', fontSize: '1.1rem', background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '20px' }}>
              <div style={{ color: 'var(--primary-cyan)', filter: 'drop-shadow(0 0 10px rgba(0,212,255,0.5))' }}>{item.icon}</div>
              <span style={{ color: 'white' }}>{item.text}</span>
            </motion.div>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        {/* Floating background elements */}
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} style={{ position: 'absolute', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(181,60,255,0.2) 0%, transparent 70%)', zIndex: 0 }} />
        
        <motion.div 
           animate={{ y: [0, -25, 0] }}
           transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
           className="glass-panel"
           style={{ width: '320px', height: '600px', background: 'rgba(15,23,42,0.8)', padding: '2rem', display: 'flex', flexDirection: 'column', zIndex: 1, border: '2px solid rgba(0,255,136,0.3)', boxShadow: '0 30px 60px rgba(0,255,136,0.2)' }}
        >
          <div style={{ width: '60px', height: '6px', background: 'rgba(255,255,255,0.2)', margin: '0 auto 2rem', borderRadius: '10px' }}></div>
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1, type: 'spring' }}
            className="glass-panel glow-border" 
            style={{ background: 'var(--gradient-vibrant)', color: '#0f172a', padding: '2rem', borderRadius: '20px', marginBottom: '2rem' }}>
             <Bell size={32} style={{ marginBottom: '1rem' }} />
             <h4 style={{ fontSize: '1.5rem', fontWeight: '900', marginBottom: '0.5rem' }}>Your Turn in 5 mins</h4>
             <p style={{ fontSize: '0.9rem', fontWeight: '600' }}>Please proceed to Room 402. Dr. Emily Chen is finishing up.</p>
          </motion.div>
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
               <Activity size={100} color="var(--primary-cyan)" />
             </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

const AIInsights = () => (
  <section id="ai" className="section-container">
    <SectionHeader title="AI Crowd Prediction" subtitle="Interactive holographic projection of hospital capacity" />
    <div className="grid-3">
      <div className="glass-panel info-card glow-border" style={{ gridColumn: 'span 2', minHeight: '400px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '2rem', fontWeight: '800', background: 'linear-gradient(90deg, #00d4ff, #b53cff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Live Traffic Heatmap</h3>
          <span style={{ padding: '0.5rem 1rem', background: 'rgba(0, 255, 136, 0.2)', color: '#00ff88', borderRadius: '20px', fontWeight: 'bold' }}>● LIVE</span>
        </div>
        <div style={{ flex: 1, position: 'relative', marginTop: '2rem' }}>
          <svg width="100%" height="100%" viewBox="0 0 800 300" style={{ filter: 'drop-shadow(0 0 20px rgba(0, 212, 255, 0.4))' }}>
            <defs>
              <linearGradient id="glowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00ff88" />
                <stop offset="50%" stopColor="#00d4ff" />
                <stop offset="100%" stopColor="#b53cff" />
              </linearGradient>
            </defs>
            <motion.path
              d="M0,250 Q150,100 300,200 T600,80 T800,150"
              fill="none"
              stroke="url(#glowGrad)"
              strokeWidth="8"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse', ease: "easeInOut" }}
            />
            {/* Animated data points */}
            {[300, 600].map((x, i) => (
              <motion.circle 
                key={i} cx={x} cy={i === 0 ? 200 : 80} r="8" fill="#fff" 
                animate={{ r: [8, 15, 8] }} transition={{ duration: 2, repeat: Infinity }} 
              />
            ))}
          </svg>
        </div>
      </div>
      <div className="glass-panel info-card" style={{ background: 'var(--gradient-vibrant)', color: '#0f172a', display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
        <div>
          <TrendingUp size={64} style={{ margin: '0 auto 1.5rem', color: '#0f172a' }} />
          <h4 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '1rem' }}>+45%</h4>
          <p style={{ fontSize: '1.2rem', fontWeight: '700' }}>Increased Efficiency</p>
          <p style={{ marginTop: '1rem', opacity: 0.8, fontWeight: '600' }}>AI dynamically routes patients to minimize waiting time.</p>
        </div>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer style={{ padding: '6rem 10%', background: '#0a0f18', color: 'white' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '4rem' }}>
      <div className="nav-logo">
        <Activity size={32} />
        <span>MedSlot</span>
      </div>
      <div style={{ display: 'flex', gap: '2rem' }}>
        <span>Privacy</span>
        <span>Terms</span>
        <span>Contact</span>
      </div>
    </div>
    <div style={{ textAlign: 'center', marginTop: '4rem', opacity: 0.5, fontSize: '0.8rem' }}>
      © 2026 MedSlot AI. Redefining the healthcare experience with immersive 3D technology.
    </div>
  </footer>
);

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ensure assets are loaded before showing the UI
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="medslot-container">
      <AnimatePresence>
        {loading && (
          <motion.div 
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 3000, background: '#0a0f18', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
          >
            <motion.div 
              animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ color: 'var(--primary-cyan)', filter: 'drop-shadow(0 0 20px rgba(0,212,255,0.5))' }}
            >
              <Activity size={100} />
            </motion.div>
            <h2 style={{ marginTop: '2rem', letterSpacing: '10px', fontWeight: '900', color: 'white', textShadow: '0 0 20px rgba(255,255,255,0.3)' }}>MEDSLOT</h2>
          </motion.div>
        )}
      </AnimatePresence>

      {!loading && (
        <>
          <Navbar />
          <Hero />
          <LiveQueueFlow />
          <DoctorSection />
          <PatientExperience />
          <AIInsights />
          <Footer />
        </>
      )}
    </div>
  );
}
