/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, Users, Clock, ArrowRight, ShieldAlert, Monitor, 
  HeartPulse, Building, MapPin, Smartphone, CheckCircle, 
  Stethoscope, BarChart3, BellRing, Mail, Map, Phone
} from 'lucide-react';
import '../MedSlot.css';
import imgReception from '../assets/hospital_reception.png';
import bgHospital from '../assets/modern_hospital_bg.png';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase';
import { Link } from 'react-router-dom';
import { useTranslation } from '../context/TranslationContext';

const FadeIn = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.6, delay }}
  >
    {children}
  </motion.div>
);

const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.4 }}
  >
    {children}
  </motion.div>
);

const Hero = () => {
  const { t } = useTranslation();
  return (
    <section id="home" className="hero">
      <img src={bgHospital} alt="Hospital Background" className="hero-background" />
      <div className="hero-overlay"></div>
      
      <div className="hero-content">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
           <div className="status-indicator status-green" style={{ marginBottom: '1.5rem' }}>
              <span className="dot dot-green"></span> {t('availableHospitals')}
           </div>
           <h1>{t('heroTitle')}</h1>
           <p>{t('heroDesc')}</p>
           <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
             <Link to="/patient" className="btn btn-primary" style={{ textDecoration: 'none' }}>
               {t('joinQueue')} <ArrowRight size={18} />
             </Link>
             <Link to="/hospitals" className="btn btn-secondary" style={{ textDecoration: 'none' }}>
               {t('findHospitals')}
             </Link>
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
};

const AboutSection = () => {
  const { t } = useTranslation();
  return (
    <section id="about" className="section section-alt">
      <FadeIn>
        <div className="section-header">
          <h2>{t('aboutSystem')}</h2>
          <p>A complete digital transformation of OPD flow and waiting room management.</p>
        </div>
        <div className="grid-2" style={{ alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: 'var(--text-main)' }}>Revolutionizing Patient Experience</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
              MedSlot eliminates the chaos of crowded hospital waiting rooms. Our intelligent SaaS platform dynamically manages patient queues, predictive appointments, and emergency overrides in real-time.
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
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>{t('patientsServed')}</p>
               </div>
               <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                  <h4 style={{ fontSize: '2.5rem', color: 'var(--primary-teal)', marginBottom: '0.5rem' }}>15m</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>{t('avgWaitTime')}</p>
               </div>
               <div className="card" style={{ padding: '1.5rem', textAlign: 'center', gridColumn: 'span 2' }}>
                  <h4 style={{ fontSize: '2.5rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>99.9%</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>{t('systemUptime')}</p>
               </div>
             </div>
          </div>
        </div>
      </FadeIn>
    </section>
  );
};

const LiveQueueSection = () => {
  const { t } = useTranslation();
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
        const updatedDepts = defaultDepts.map(dept => data[dept.id] ? { ...dept, ...data[dept.id] } : dept);
        setDepts(updatedDepts);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <section id="live-queue" className="section">
      <FadeIn>
        <div className="section-header">
          <h2>{t('liveQueueStatus')}</h2>
          <p>{t('realTimeUpdates')}</p>
        </div>
        <div className="grid-3">
          {depts.map((d, i) => (
            <div key={i} className="card hover-lift" style={d.name === 'Emergency' ? { border: '2px solid var(--danger-red)' } : {}}>
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
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem' }}>{t('currentToken')}</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: d.name === 'Emergency' ? 'var(--danger-red)' : 'var(--text-main)' }}>{d.token}</div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                 <div style={{ color: 'var(--text-muted)' }}>
                   {t('waitTime')}: <strong style={{ color: 'var(--text-main)' }}>{d.wait}</strong>
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

const NearbyHospitalsSection = () => {
  const { t } = useTranslation();
  return (
    <section id="hospitals" className="section section-alt">
      <FadeIn>
        <div className="section-header">
          <h2>{t('nearbyHospitals')}</h2>
          <p>Find facilities near you, check their live crowds, and join the queue remotely.</p>
        </div>
        <div className="grid-3">
          {[
            { name: "Apollo City Hospital", dist: "2.4 km", crowd: "Moderate", wait: "15-20m", depts: "Cardiology, Ortho, Gen..." },
            { name: "Fortis Healthcare", dist: "5.1 km", crowd: "High", wait: "45-60m", depts: "Neurology, Pediatrics..." },
            { name: "Nexus Regional Clinic", dist: "1.2 km", crowd: "Low", wait: "5-10m", depts: "General, Dental, ENT..." }
          ].map((h, i) => (
            <div key={i} className="card hover-lift">
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{h.name}</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                <MapPin size={16} color="var(--primary-teal)" /> {h.dist} {t('away')}
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{t('crowdLevel')}</span>
                  <span style={{ fontWeight: 600 }}>{h.crowd}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{t('avgWaitTime')}</span>
                  <span style={{ fontWeight: 600 }}>{h.wait}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{t('departments')}</span>
                  <span style={{ fontWeight: 600 }}>{h.depts}</span>
                </div>
              </div>
              <Link to="/patient/hospitals" className="btn btn-outline" style={{ width: '100%', textDecoration: 'none', display: 'block', textAlign: 'center' }}>{t('explorePlatform')}</Link>
            </div>
          ))}
        </div>
      </FadeIn>
    </section>
  );
};

const HowItWorksSection = () => {
  const { t } = useTranslation();
  return (
    <section id="how-it-works" className="section">
      <FadeIn>
        <div className="section-header">
          <h2>{t('howItWorks')}</h2>
          <p>Four simple steps to a seamless healthcare experience.</p>
        </div>
        <div className="grid-4">
          <div className="card step-card hover-lift">
             <div className="step-number">1</div>
             <div className="icon-box icon-teal" style={{ margin: '0 auto 1rem' }}><Building size={24} /></div>
             <h4 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>{t('selectHospital')}</h4>
             <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Choose a nearby facility and select the required department.</p>
          </div>
          <div className="card step-card hover-lift">
             <div className="step-number">2</div>
             <div className="icon-box icon-blue" style={{ margin: '0 auto 1rem' }}><Smartphone size={24} /></div>
             <h4 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>{t('joinQueue')}</h4>
             <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Book an appointment or join the live digital walk-in queue.</p>
          </div>
          <div className="card step-card hover-lift">
             <div className="step-number">3</div>
             <div className="icon-box icon-orange" style={{ margin: '0 auto 1rem' }}><Clock size={24} /></div>
             <h4 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>{t('getToken')}</h4>
             <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Receive a digital token with an AI-predicted accurate wait time.</p>
          </div>
          <div className="card step-card hover-lift">
             <div className="step-number">4</div>
             <div className="icon-box icon-teal" style={{ margin: '0 auto 1rem' }}><Stethoscope size={24} /></div>
             <h4 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>{t('visitHospital')}</h4>
             <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Arrive just in time for your turn, eliminating waiting room crowds.</p>
          </div>
        </div>
      </FadeIn>
    </section>
  );
};

const FeaturesSection = () => {
  const { t } = useTranslation();
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
          <h2>{t('keyFeatures')}</h2>
          <p>Everything you need to run a modern, efficient hospital queue.</p>
        </div>
        <div className="grid-3">
          {features.map((f, i) => (
            <div key={i} className="card hover-lift" style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
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

const ContactSection = () => {
  const { t } = useTranslation();
  return (
    <section id="contact" className="section">
      <FadeIn>
        <div className="section-header">
          <h2>{t('getInTouch')}</h2>
          <p>We're here to help hospital administrators scale their queues.</p>
        </div>
        <div className="card" style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '3rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
             <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>{t('yourName')}</label>
                <input type="text" placeholder="John Doe" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-light)', outline: 'none' }} />
             </div>
             <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>{t('hospitalName')}</label>
                <input type="text" placeholder="City Care Clinic" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-light)', outline: 'none' }} />
             </div>
          </div>
          <div>
             <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>{t('emailAddr')}</label>
             <input type="email" placeholder="john@example.com" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-light)', outline: 'none' }} />
          </div>
          <div>
             <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>{t('message')}</label>
             <textarea rows="4" placeholder="How can we help your hospital?" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-light)', outline: 'none', resize: 'vertical' }}></textarea>
          </div>
          <button className="btn btn-primary" style={{ alignSelf: 'flex-start', padding: '0.75rem 2rem' }}>{t('sendMessage')}</button>
        </div>
      </FadeIn>
    </section>
  );
};

// ----------------------------------------
// Separated Route Pages
// ----------------------------------------

export const LandingPage = () => (
  <PageTransition>
    <div className="page-wrapper">
      <Hero />
      <AboutSection />
      <LiveQueueSection />
    </div>
  </PageTransition>
);

export const AboutPage = () => (
  <PageTransition>
    <div className="page-wrapper" style={{ paddingTop: '80px' }}>
      <AboutSection />
      <HowItWorksSection />
    </div>
  </PageTransition>
);

export const HospitalsPage = () => (
  <PageTransition>
    <div className="page-wrapper" style={{ paddingTop: '80px' }}>
      <NearbyHospitalsSection />
    </div>
  </PageTransition>
);

export const FeaturesPage = () => (
  <PageTransition>
    <div className="page-wrapper" style={{ paddingTop: '80px' }}>
      <FeaturesSection />
    </div>
  </PageTransition>
);

export const ContactPage = () => (
  <PageTransition>
    <div className="page-wrapper" style={{ paddingTop: '80px' }}>
      <ContactSection />
    </div>
  </PageTransition>
);

