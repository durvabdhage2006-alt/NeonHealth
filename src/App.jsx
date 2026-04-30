import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, Users, Clock, ArrowRight, ShieldAlert, Monitor, 
  HeartPulse, Building, MapPin, Smartphone, CheckCircle, 
  Stethoscope, BarChart3, BellRing, X, Lock, Mail
} from 'lucide-react';
import { ref, onValue } from 'firebase/database';
import { db } from './firebase';
import './MedSlot.css';

// Assets
import imgReception from './assets/hospital_reception.png';
import bgHospital from './assets/modern_hospital_bg.png';

const FadeIn = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.6, delay }}
  >
    {children}
  </motion.div>
);

const Navbar = ({ setShowLogin, isLoggedIn, setIsLoggedIn }) => (
  <nav className="navbar">
    <div className="nav-logo" style={{ cursor: 'pointer' }}>
      <Activity size={28} strokeWidth={3} />
      <span>NexusHealth</span>
    </div>
    <ul className="nav-links">
      <li><a href="#home">Home</a></li>
      <li><a href="#about">About</a></li>
      <li><a href="#live-queue">Queue Status</a></li>
      <li><a href="#hospitals">Hospitals</a></li>
      <li><a href="#how-it-works">How it Works</a></li>
      <li><a href="#features">Features</a></li>
    </ul>
    {isLoggedIn ? (
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: 'var(--primary-teal)' }}>
          <div style={{ width: '36px', height: '36px', background: 'var(--primary-light)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={18} />
          </div>
          John Doe
        </div>
        <button onClick={() => setIsLoggedIn(false)} className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>Logout</button>
      </div>
    ) : (
      <button className="btn btn-secondary" onClick={() => setShowLogin(true)}>Login</button>
    )}
  </nav>
);

const LoginModal = ({ show, onClose, onLogin }) => {
  const [role, setRole] = useState('patient');
  
  if (!show) return null;
  
  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        style={{ position: 'fixed', inset: 0, zIndex: 4000, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <motion.div 
          initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
          className="card" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem', position: 'relative' }}
        >
          <button onClick={onClose} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={24} />
          </button>
          
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div className="icon-box icon-teal" style={{ margin: '0 auto 1rem' }}><Lock size={24} /></div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800 }}>Welcome Back</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Securely login to your NexusHealth account.</p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', background: 'var(--bg-main)', padding: '0.35rem', borderRadius: '8px' }}>
            <button 
              onClick={() => setRole('patient')}
              style={{ flex: 1, padding: '0.5rem', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, transition: '0.2s', background: role === 'patient' ? 'white' : 'transparent', color: role === 'patient' ? 'var(--primary-teal)' : 'var(--text-muted)', boxShadow: role === 'patient' ? 'var(--shadow-sm)' : 'none' }}
            >Patient</button>
            <button 
              onClick={() => setRole('staff')}
              style={{ flex: 1, padding: '0.5rem', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, transition: '0.2s', background: role === 'staff' ? 'white' : 'transparent', color: role === 'staff' ? 'var(--primary-teal)' : 'var(--text-muted)', boxShadow: role === 'staff' ? 'var(--shadow-sm)' : 'none' }}
            >Hospital Staff</button>
            <button 
              onClick={() => setRole('admin')}
              style={{ flex: 1, padding: '0.5rem', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, transition: '0.2s', background: role === 'admin' ? 'white' : 'transparent', color: role === 'admin' ? 'var(--primary-teal)' : 'var(--text-muted)', boxShadow: role === 'admin' ? 'var(--shadow-sm)' : 'none' }}
            >Admin</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input type="email" placeholder="name@example.com" style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '8px', border: '1px solid var(--border-light)', fontSize: '0.95rem', outline: 'none' }} />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input type="password" placeholder="••••••••" style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '8px', border: '1px solid var(--border-light)', fontSize: '0.95rem', outline: 'none' }} />
              </div>
            </div>
          </div>

          <button onClick={() => { onLogin(); onClose(); }} className="btn btn-primary" style={{ width: '100%', marginBottom: '1rem' }}>
            Sign In
          </button>
          
          <div style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Don't have an account? <a href="#" style={{ color: 'var(--primary-teal)', fontWeight: 600, textDecoration: 'none' }}>Sign up</a>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const Hero = () => (
  <section id="home" className="hero">
    <img src={bgHospital} alt="Hospital Background" className="hero-background" />
    <div className="hero-overlay"></div>
    
    <div className="hero-content">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
         <div className="status-indicator status-green" style={{ marginBottom: '1.5rem' }}>
            <span className="dot dot-green"></span> Available in 50+ Hospitals
         </div>
         <h1>Smart Hospital Queue Management System</h1>
         <p>
           Reduce waiting time, manage patient flow, and improve hospital service efficiency with our predictive AI-powered queue management SaaS.
         </p>
         <div style={{ display: 'flex', gap: '1rem' }}>
           <button className="btn btn-primary">
             Join Queue <ArrowRight size={18} />
           </button>
           <button className="btn btn-secondary">
             Book Appointment
           </button>
         </div>
      </motion.div>
    </div>
    <motion.div 
      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
      className="hero-image-container"
    >
      <img src={imgReception} alt="Hospital Reception" />
    </motion.div>
  </section>
);

const AboutSection = () => (
  <section id="about" className="section section-alt">
    <FadeIn>
      <div className="section-header">
        <h2>About Our Hospital System</h2>
        <p>A complete digital transformation of OPD flow and waiting room management.</p>
      </div>
      <div className="grid-2" style={{ alignItems: 'center' }}>
        <div>
          <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: 'var(--text-main)' }}>Revolutionizing Patient Experience</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
            NexusHealth eliminates the chaos of crowded hospital waiting rooms. Our intelligent SaaS platform dynamically manages patient queues, predictive appointments, and emergency overrides in real-time.
          </p>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
             {[
               "Reduces average patient waiting time by up to 60%.",
               "Streamlines OPD flow for doctors and receptionists.",
               "Prioritizes emergency cases automatically.",
               "Seamless appointment integration with walk-in queues."
             ].map((item, i) => (
               <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', color: 'var(--text-main)', fontWeight: 500 }}>
                 <CheckCircle size={20} color="var(--primary-teal)" style={{ flexShrink: 0, marginTop: '2px' }} />
                 {item}
               </li>
             ))}
          </ul>
        </div>
        <div className="card" style={{ background: 'var(--bg-main)', border: 'none' }}>
           <div className="grid-2" style={{ gap: '1rem' }}>
             <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                <h4 style={{ fontSize: '2.5rem', color: 'var(--primary-blue)', marginBottom: '0.5rem' }}>2M+</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>Patients Served</p>
             </div>
             <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                <h4 style={{ fontSize: '2.5rem', color: 'var(--primary-teal)', marginBottom: '0.5rem' }}>15m</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>Avg Wait Time</p>
             </div>
             <div className="card" style={{ padding: '1.5rem', textAlign: 'center', gridColumn: 'span 2' }}>
                <h4 style={{ fontSize: '2.5rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>99.9%</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>System Uptime & Reliability</p>
             </div>
           </div>
        </div>
      </div>
    </FadeIn>
  </section>
);

const LiveQueueSection = () => {
  const defaultDepts = [
    { id: 'opd', name: "General OPD", token: "G-102", wait: "5m", dr: "Dr. Smith", status: "online", icon: Users, color: "blue" },
    { id: 'cardiology', name: "Cardiology", token: "C-42", wait: "12m", dr: "Dr. Johnson", status: "online", icon: HeartPulse, color: "teal" },
    { id: 'orthopedic', name: "Orthopedic", token: "O-18", wait: "25m", dr: "Dr. Chen", status: "busy", icon: Activity, color: "orange" },
    { id: 'pediatrics', name: "Pediatrics", token: "P-89", wait: "10m", dr: "Dr. Davis", status: "online", icon: Building, color: "blue" },
    { id: 'emergency', name: "Emergency", token: "ER-04", wait: "Immediate", dr: "Duty Doctor", status: "busy", icon: ShieldAlert, color: "red" },
  ];

  const [depts, setDepts] = useState(defaultDepts);

  useEffect(() => {
    const queueRef = ref(db, 'hospital/queues');
    const unsubscribe = onValue(queueRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Map firebase data over the default layout to keep icons and colors
        const updatedDepts = defaultDepts.map(dept => {
          if (data[dept.id]) {
            return { ...dept, ...data[dept.id] };
          }
          return dept;
        });
        setDepts(updatedDepts);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <section id="live-queue" className="section">
      <FadeIn>
        <div className="section-header">
          <h2>Live Queue Status</h2>
          <p>Real-time updates from across the hospital departments.</p>
        </div>
        <div className="grid-3">
          {depts.map((d, i) => (
            <div key={i} className="card" style={d.name === 'Emergency' ? { border: '2px solid var(--danger-red)' } : {}}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 700, fontSize: '1.1rem' }}>
                  <div className={`icon-box icon-${d.color}`} style={{ width: '40px', height: '40px', marginBottom: 0 }}>
                    <d.icon size={20} />
                  </div>
                  {d.name}
                </div>
                <span className={`status-indicator status-${d.name === 'Emergency' ? 'red' : 'green'}`}>
                  <span className={`dot dot-${d.name === 'Emergency' ? 'red' : 'green'}`}></span> Active
                </span>
              </div>
              
              <div style={{ background: 'var(--bg-main)', padding: '1.5rem', borderRadius: '12px', marginBottom: '1.5rem', textAlign: 'center' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem' }}>CURRENT TOKEN</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: d.name === 'Emergency' ? 'var(--danger-red)' : 'var(--text-main)' }}>{d.token}</div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                 <div style={{ color: 'var(--text-muted)' }}>
                   Wait Time: <strong style={{ color: 'var(--text-main)' }}>{d.wait}</strong>
                 </div>
                 <div style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                   <span className={`dot dot-${d.status === 'online' ? 'green' : 'yellow'}`}></span> {d.dr}
                 </div>
              </div>
            </div>
          ))}
        </div>
      </FadeIn>
    </section>
  );
};

const NearbyHospitalsSection = () => (
  <section id="hospitals" className="section section-alt">
    <FadeIn>
      <div className="section-header">
        <h2>See Nearby Hospitals</h2>
        <p>Find facilities near you, check their live crowds, and join the queue remotely.</p>
      </div>
      <div className="grid-3">
        {[
          { name: "Apollo City Hospital", dist: "2.4 km", crowd: "Moderate", wait: "15-20m", depts: "Cardiology, Ortho, Gen..." },
          { name: "Fortis Healthcare", dist: "5.1 km", crowd: "High", wait: "45-60m", depts: "Neurology, Pediatrics..." },
          { name: "Nexus Regional Clinic", dist: "1.2 km", crowd: "Low", wait: "5-10m", depts: "General, Dental, ENT..." }
        ].map((h, i) => (
          <div key={i} className="card">
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{h.name}</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              <MapPin size={16} color="var(--primary-teal)" /> {h.dist} away
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Crowd Level</span>
                <span style={{ fontWeight: 600 }}>{h.crowd}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Avg Wait Time</span>
                <span style={{ fontWeight: 600 }}>{h.wait}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Departments</span>
                <span style={{ fontWeight: 600 }}>{h.depts}</span>
              </div>
            </div>
            <button className="btn btn-outline" style={{ width: '100%' }}>View Queue</button>
          </div>
        ))}
      </div>
    </FadeIn>
  </section>
);

const HowItWorksSection = () => (
  <section id="how-it-works" className="section">
    <FadeIn>
      <div className="section-header">
        <h2>How It Works</h2>
        <p>Four simple steps to a seamless healthcare experience.</p>
      </div>
      <div className="grid-4">
        <div className="card step-card">
           <div className="step-number">1</div>
           <div className="icon-box icon-teal" style={{ margin: '0 auto 1rem' }}><Building size={24} /></div>
           <h4 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>Select Hospital</h4>
           <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Choose a nearby facility and select the required department.</p>
        </div>
        <div className="card step-card">
           <div className="step-number">2</div>
           <div className="icon-box icon-blue" style={{ margin: '0 auto 1rem' }}><Smartphone size={24} /></div>
           <h4 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>Join Queue</h4>
           <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Book an appointment or join the live digital walk-in queue.</p>
        </div>
        <div className="card step-card">
           <div className="step-number">3</div>
           <div className="icon-box icon-orange" style={{ margin: '0 auto 1rem' }}><Clock size={24} /></div>
           <h4 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>Get Token & Time</h4>
           <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Receive a digital token with an AI-predicted accurate wait time.</p>
        </div>
        <div className="card step-card">
           <div className="step-number">4</div>
           <div className="icon-box icon-teal" style={{ margin: '0 auto 1rem' }}><Stethoscope size={24} /></div>
           <h4 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>Visit Hospital</h4>
           <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Arrive just in time for your turn, eliminating waiting room crowds.</p>
        </div>
      </div>
    </FadeIn>
  </section>
);

const FeaturesSection = () => {
  const features = [
    { title: "AI Wait Prediction", desc: "Machine learning algorithms calculate exact times based on doctor speeds.", icon: Clock, color: "blue" },
    { title: "Emergency Priority", desc: "Instantly pause normal queues when critical cases arrive at the ER.", icon: ShieldAlert, color: "red" },
    { title: "QR Check-in", desc: "Self-service kiosk and mobile check-ins via secure QR codes.", icon: Monitor, color: "teal" },
    { title: "Doctor Availability", desc: "Real-time tracking of when doctors are consulting, on rounds, or on break.", icon: Stethoscope, color: "orange" },
    { title: "SMS/WhatsApp Alerts", desc: "Patients receive automated push notifications when their turn approaches.", icon: BellRing, color: "blue" },
    { title: "Admin Analytics", desc: "Comprehensive dashboards for hospital management to track KPIs and flow.", icon: BarChart3, color: "teal" }
  ];

  return (
    <section id="features" className="section section-alt">
      <FadeIn>
        <div className="section-header">
          <h2>Key Features</h2>
          <p>Everything you need to run a modern, efficient hospital queue.</p>
        </div>
        <div className="grid-3">
          {features.map((f, i) => (
            <div key={i} className="card" style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
               <div className={`icon-box icon-${f.color}`} style={{ flexShrink: 0, width: '48px', height: '48px', marginBottom: 0 }}>
                 <f.icon size={24} />
               </div>
               <div>
                 <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{f.title}</h4>
                 <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{f.desc}</p>
               </div>
            </div>
          ))}
        </div>
      </FadeIn>
    </section>
  );
};

const Footer = () => (
  <footer className="footer">
    <div className="footer-grid">
      <div>
        <div className="nav-logo" style={{ color: 'white', marginBottom: '1.5rem' }}>
          <Activity size={24} /> NexusHealth
        </div>
        <p style={{ maxWidth: '300px' }}>
          The leading enterprise SaaS for hospital queue management and patient flow optimization.
        </p>
      </div>
      <div>
        <h4>Quick Links</h4>
        <ul>
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About System</a></li>
          <li><a href="#hospitals">Nearby Hospitals</a></li>
          <li><a href="#features">Features</a></li>
        </ul>
      </div>
      <div>
        <h4>Hospital Support</h4>
        <ul>
          <li><a href="#">Admin Portal</a></li>
          <li><a href="#">Doctor Portal</a></li>
          <li><a href="#">API Documentation</a></li>
          <li><a href="#">Help Center</a></li>
        </ul>
      </div>
      <div>
        <h4>Contact Us</h4>
        <ul>
          <li>support@nexushealth.com</li>
          <li>+1 (800) 123-4567</li>
          <li>123 Healthcare Blvd, MedCity</li>
        </ul>
      </div>
    </div>
    <div className="footer-bottom">
      &copy; {new Date().getFullYear()} NexusHealth SaaS Platform. All rights reserved. Professional Healthcare UI Design.
    </div>
  </footer>
);

export default function App() {
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>
        {loading && (
          <motion.div 
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 3000, background: 'var(--bg-main)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
          >
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}>
              <Activity size={48} color="var(--primary-teal)" />
            </motion.div>
            <h2 style={{ marginTop: '1.5rem', fontFamily: 'var(--font-heading)', fontWeight: '700', color: 'var(--text-main)' }}>NexusHealth</h2>
          </motion.div>
        )}
      </AnimatePresence>

      {!loading && (
        <div style={{ minHeight: '100vh' }}>
          <Navbar setShowLogin={setShowLogin} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
          <Hero />
          <AboutSection />
          <LiveQueueSection />
          <NearbyHospitalsSection />
          <HowItWorksSection />
          <FeaturesSection />
          <Footer />
          <LoginModal show={showLogin} onClose={() => setShowLogin(false)} onLogin={() => setIsLoggedIn(true)} />
        </div>
      )}
    </>
  );
}
