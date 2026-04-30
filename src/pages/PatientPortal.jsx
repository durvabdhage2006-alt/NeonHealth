/* eslint-disable */
import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, MapPin, Clock, Search, ChevronRight, 
  HeartPulse, FileText, Download, User, Star, Heart,
  Building, Check, ShieldAlert, X, Calendar as CalendarIcon, Info, Leaf, Coffee, Navigation, Map, Bike, Car, Footprints, CheckCircle, Filter,
  MessageSquare, Mic, Send, PhoneCall, AlertTriangle
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTranslation } from '../context/TranslationContext';

import imgReception from '../assets/hospital_reception.png';
import bgHospital from '../assets/modern_hospital_bg.png';

const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -15 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

const defaultFacilities = ["24×7 emergency support", "Ambulance service", "Digital prescription", "Online appointment booking", "Waiting area", "Parking", "Wheelchair access", "Pharmacy", "Cashless payment / insurance support"];
const defaultServices = ["OPD", "Emergency", "ICU", "Pharmacy", "Diagnostics", "Blood test", "X-ray"];

const allHospitals = [
  { id: 1, city: "Sangamner", name: "Tambe Multispeciality Hospital", distValue: 1.2, dist: "1.2 km", crowd: "Low", wait: "10-15m", rating: 4.8, color: "green", emergency: true, isMulti: true, isOpen247: true, depts: "Dental, Cardiology, General", about: "A premier healthcare facility in Sangamner offering specialized dental and cardiac care with 24/7 emergency support.", 
    services: [...defaultServices, "Cardiology", "Dentistry", "Surgery"], facilities: defaultFacilities,
    doctors: [
      { name: "Dr. Chandrakant Tambe", dept: "Dentist", status: "Available", hours: "9:00 AM - 5:00 PM" },
      { name: "Dr. Rahul Gutte", dept: "Cardiologist", status: "Busy", hours: "10:00 AM - 6:00 PM" }
  ]},
  { id: 2, city: "Sangamner", name: "Om Sai Care Clinic", distValue: 3.5, dist: "3.5 km", crowd: "Moderate", wait: "25-30m", rating: 4.5, color: "yellow", emergency: false, isMulti: false, isOpen247: false, depts: "Pediatrics, General", about: "Family friendly clinic focused on child care and general medicine.", 
    services: ["OPD", "Pharmacy", "Pediatrics"], facilities: ["Waiting area", "Online appointment booking", "Parking"],
    doctors: [
      { name: "Dr. Anjali Deshmukh", dept: "Pediatrician", status: "Available", hours: "10:00 AM - 4:00 PM" }
  ]},
  { id: 3, city: "Pune", name: "Sahyadri Super Speciality", distValue: 4.8, dist: "4.8 km", crowd: "High", wait: "45-60m", rating: 4.9, color: "red", emergency: true, isMulti: true, isOpen247: true, depts: "Neurology, Oncology, Ortho", about: "Pune's largest chain of hospitals, equipped with advanced ICU and neuro-surgical units.", 
    services: [...defaultServices, "Neurology", "Oncology", "Orthopedic"], facilities: defaultFacilities,
    doctors: [
      { name: "Dr. Milind Joshi", dept: "Neurologist", status: "Busy", hours: "11:00 AM - 8:00 PM" },
      { name: "Dr. Sneha Patil", dept: "Orthopedics", status: "Available", hours: "9:00 AM - 3:00 PM" }
  ]},
  { id: 4, city: "Pune", name: "Ruby Hall Clinic", distValue: 6.2, dist: "6.2 km", crowd: "Moderate", wait: "20-30m", rating: 4.7, color: "yellow", emergency: true, isMulti: true, isOpen247: true, depts: "Cardiology, Urology", about: "State-of-the-art medical institute known for cardiac surgeries and organ transplants.", 
    services: [...defaultServices, "Cardiology", "Urology", "Surgery"], facilities: defaultFacilities,
    doctors: [
      { name: "Dr. Amit Shah", dept: "Urologist", status: "Available", hours: "8:00 AM - 2:00 PM" }
  ]},
  { id: 5, city: "Nashik", name: "Apollo City Hospital", distValue: 2.1, dist: "2.1 km", crowd: "Low", wait: "5-10m", rating: 4.6, color: "green", emergency: true, isMulti: true, isOpen247: true, depts: "General, ENT, Eye", about: "Trusted central hospital serving Nashik with quick OPD services.", 
    services: [...defaultServices, "ENT", "Ophthalmology"], facilities: defaultFacilities,
    doctors: [
      { name: "Dr. Ramesh Wagh", dept: "General Physician", status: "Available", hours: "9:00 AM - 6:00 PM" }
  ]},
  { id: 6, city: "Mumbai", name: "Lilavati Hospital", distValue: 8.5, dist: "8.5 km", crowd: "High", wait: "60-90m", rating: 4.9, color: "red", emergency: true, isMulti: true, isOpen247: true, depts: "All Specialities", about: "Premium healthcare destination in Bandra offering world-class multi-disciplinary medical care.", 
    services: [...defaultServices, "Cardiology", "Neurology", "Oncology", "Orthopedic"], facilities: defaultFacilities,
    doctors: [
      { name: "Dr. Vikram Kadam", dept: "Oncologist", status: "Busy", hours: "12:00 PM - 6:00 PM" },
      { name: "Dr. Pooja Mehta", dept: "Dermatologist", status: "Available", hours: "10:00 AM - 4:00 PM" }
  ]},
  { id: 7, city: "Ahmednagar", name: "Noble Care Hospital", distValue: 3.0, dist: "3.0 km", crowd: "Moderate", wait: "15-25m", rating: 4.4, color: "yellow", emergency: true, isMulti: false, isOpen247: true, depts: "Orthopedics, General", about: "Dedicated trauma and orthopedic care center in Ahmednagar.", 
    services: ["OPD", "Emergency", "X-ray", "Orthopedic", "Surgery"], facilities: ["24×7 emergency support", "Ambulance service", "Parking", "Wheelchair access", "Pharmacy"],
    doctors: [
      { name: "Dr. Sanjay Kale", dept: "Orthopedics", status: "Available", hours: "9:00 AM - 5:00 PM" }
  ]},
  { id: 8, city: "Shirdi", name: "Sai Baba Super Speciality", distValue: 1.5, dist: "1.5 km", crowd: "Low", wait: "10-15m", rating: 4.8, color: "green", emergency: true, isMulti: true, isOpen247: true, depts: "General, Cardiology", about: "Charitable multispeciality hospital providing high-quality care to all.", 
    services: [...defaultServices, "Cardiology", "Maternity"], facilities: defaultFacilities,
    doctors: [
      { name: "Dr. Ravi Shinde", dept: "Cardiologist", status: "Available", hours: "8:00 AM - 4:00 PM" }
  ]},
  { id: 9, city: "Sambhajinagar", name: "MGM Medical Center", distValue: 5.4, dist: "5.4 km", crowd: "High", wait: "40-50m", rating: 4.7, color: "red", emergency: true, isMulti: true, isOpen247: true, depts: "Pediatrics, Surgery", about: "Extensive medical campus and research institute.", 
    services: [...defaultServices, "Pediatrics", "Surgery"], facilities: defaultFacilities,
    doctors: [
      { name: "Dr. Sameer Kulkarni", dept: "Surgeon", status: "Busy", hours: "9:00 AM - 5:00 PM" }
  ]}
];

const diseaseMap = {
  "Cardiology": { disease: "Hypertension", notes: "Blood pressure is slightly elevated. Needs close monitoring.", meds: "Amlodipine 5mg (1x daily)", remedies: "Garlic water in the morning, Beetroot juice", lifestyle: "Low sodium diet, 30 mins daily brisk walk, reduce stress", specialist: "Cardiologist" },
  "Dentist": { disease: "Dental Caries", notes: "Cavity detected in lower left molar.", meds: "Amoxicillin 500mg (2x daily), Ibuprofen for pain", remedies: "Clove oil application on tooth, Salt water rinse", lifestyle: "Brush twice daily, avoid sugary and sticky foods", specialist: "Dentist" },
  "Pediatrician": { disease: "Viral Fever", notes: "Child has mild temperature. Keep hydrated.", meds: "Paracetamol Syrup (5ml SOS)", remedies: "Tulsi tea, wet cloth sponging on forehead", lifestyle: "Lots of rest, easily digestible food like Khichdi", specialist: "Pediatrician" },
  "Orthopedics": { disease: "Mild Osteoarthritis", notes: "Knee joint shows early signs of wear.", meds: "Calcium Supplements, Pain relief gel", remedies: "Turmeric milk (Haldi Doodh) at night", lifestyle: "Light stretching exercises, avoid heavy lifting", specialist: "Orthopedics" },
  "default": { disease: "Common Cold", notes: "Mild throat infection and congestion.", meds: "Cetirizine (1x daily), Cough Syrup", remedies: "Steam inhalation, Ginger and Honey tea", lifestyle: "Avoid cold water, adequate sleep to boost immunity", specialist: "General Physician" }
};

const cities = ["Sangamner", "Pune", "Nashik", "Mumbai", "Ahmednagar", "Shirdi", "Sambhajinagar"];

const trendData = [
  { time: '8 AM', crowd: 20 }, { time: '10 AM', crowd: 50 }, { time: '12 PM', crowd: 80 }, 
  { time: '2 PM', crowd: 60 }, { time: '4 PM', crowd: 40 }, { time: '6 PM', crowd: 70 }
];

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        style={{ position: 'fixed', inset: 0, zIndex: 6000, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <motion.div 
          initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
          className="card" style={{ width: '90%', maxWidth: '500px', padding: '2rem', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}
        >
          <button onClick={onClose} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={24} />
          </button>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontFamily: 'var(--font-heading)' }}>{title}</h2>
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const PageHeader = ({ title, subtitle, action }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
    <div>
      <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 800 }}>{title}</h2>
      {subtitle && <p style={{ color: 'var(--text-muted)' }}>{subtitle}</p>}
    </div>
    {action}
  </div>
);

const CitySelector = ({ selectedCity, setSelectedCity }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--bg-main)', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--border-light)', maxWidth: '300px' }}>
    <MapPin size={18} color="var(--primary-teal)" />
    <select 
      value={selectedCity} 
      onChange={(e) => setSelectedCity(e.target.value)}
      style={{ border: 'none', background: 'transparent', width: '100%', fontWeight: 600, fontSize: '1rem', outline: 'none', cursor: 'pointer' }}
    >
      {cities.map(c => <option key={c} value={c}>{c}</option>)}
    </select>
  </div>
);

const SimulatedMapCard = ({ title, showDetails = true, t, customHospitalLabel }) => (
  <div style={{ background: '#e2e8f0', height: showDetails ? '300px' : '200px', borderRadius: '12px', position: 'relative', overflow: 'hidden', border: '1px solid var(--border-light)' }}>
    <div style={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: 'radial-gradient(var(--text-muted) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
    
    <div style={{ position: 'absolute', top: '20%', left: '20%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
       <div style={{ background: 'var(--primary-teal)', color: 'white', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', marginBottom: '0.25rem', fontWeight: 600, boxShadow: 'var(--shadow-sm)' }}>{t('yourLocation')}</div>
       <MapPin size={28} color="var(--primary-teal)" fill="white"/>
    </div>
    
    <div style={{ position: 'absolute', top: '65%', left: '75%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
       <div style={{ background: 'var(--danger-red)', color: 'white', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', marginBottom: '0.25rem', fontWeight: 600, boxShadow: 'var(--shadow-sm)' }}>{customHospitalLabel || t('destination')}</div>
       <MapPin size={32} color="var(--danger-red)" fill="white"/>
    </div>

    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
       <path d="M 22% 28% Q 50% 10% 77% 65%" fill="none" stroke="var(--primary-teal)" strokeWidth="4" strokeDasharray="8,8" />
    </svg>
    
    {title && <div style={{ position: 'absolute', top: '1rem', left: '1rem', background: 'white', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 600, boxShadow: 'var(--shadow-sm)' }}>{title}</div>}
  </div>
);

const DashboardHome = ({ activeQueue, setActiveQueue, simulateProgress, completeConsultation, selectedCity, setSelectedCity, localHospitals }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showReschedule, setShowReschedule] = useState(false);
  const { t } = useTranslation();
  
  const handleCancel = () => {
    if (window.confirm("Are you sure you want to cancel your appointment?")) {
      setActiveQueue(null);
      alert("Appointment Cancelled Successfully.");
    }
  };

  const handleReschedule = (e) => {
    e.preventDefault();
    setShowReschedule(false);
    alert("Appointment successfully rescheduled!");
  };

  const sortedHospitals = [...localHospitals].sort((a, b) => a.distValue - b.distValue);

  return (
    <PageTransition>
      <PageHeader title={t('welcomeBackUser')} subtitle={t('healthOverview')} action={<CitySelector selectedCity={selectedCity} setSelectedCity={setSelectedCity} />} />
      
      <div className="grid-2" style={{ marginBottom: '2rem' }}>
        <div className="card" style={{ background: 'var(--primary-light)', border: '1px solid var(--primary-teal)' }}>
          <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-teal)', marginBottom: '1rem' }}>{t('upcomingAppt')}</h3>
          {activeQueue ? (
            <>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div style={{ background: 'white', padding: '1rem', borderRadius: '12px', textAlign: 'center', width: '80px', flexShrink: 0 }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>TODAY</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-teal)' }}>Soon</div>
                </div>
                <div>
                  <h4 style={{ fontSize: '1.1rem' }}>{activeQueue.doctor}</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{activeQueue.dept} • {activeQueue.hospital}</p>
                  <div className="status-indicator status-green"><span className="dot dot-green"></span> Confirmed</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                 <button onClick={() => setShowDetails(true)} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', flex: 1 }}><Info size={14}/> {t('details')}</button>
                 <button onClick={() => setShowReschedule(true)} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', flex: 1 }}><CalendarIcon size={14}/> {t('reschedule')}</button>
                 <button onClick={handleCancel} className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', color: 'var(--danger-red)', borderColor: 'var(--danger-red)', flex: 1 }}><X size={14}/> {t('cancel')}</button>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100px', flexDirection: 'column', gap: '0.5rem' }}>
              <p style={{ color: 'var(--primary-teal)', fontWeight: 600 }}>{t('noAppts')}</p>
              <Link to="/patient/hospitals" className="btn btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', textDecoration: 'none' }}>{t('bookNow')}</Link>
            </div>
          )}
        </div>

        <div className="card queue-board">
          <div className="queue-board-header" style={{ padding: '1rem 1.5rem', background: activeQueue ? 'var(--primary-teal)' : 'var(--text-muted)' }}>
             <div>
               <span style={{ opacity: 0.8, fontSize: '0.8rem', fontWeight: 600 }}>{t('yourLiveToken')}</span>
               <div style={{ fontSize: '2rem', fontWeight: 800 }}>{activeQueue ? activeQueue.token : '--'}</div>
             </div>
             <div style={{ textAlign: 'right' }}>
               <span style={{ opacity: 0.8, fontSize: '0.8rem', fontWeight: 600 }}>{t('currentToken')}</span>
               <div style={{ fontSize: '2rem', fontWeight: 800 }}>{activeQueue ? activeQueue.currentToken : '--'}</div>
             </div>
          </div>
          <div style={{ padding: '1.5rem' }}>
             {activeQueue ? (
               <>
                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.9rem' }}>
                   <span>{t('estWaitTime')}: {activeQueue.waitTime}</span>
                   <span style={{ color: 'var(--primary-teal)' }}>{activeQueue.ahead} {t('patientsAhead')}</span>
                 </div>
                 <div className="progress-bar-container" style={{ marginBottom: '1.5rem' }}>
                    <div className="progress-bar-fill" style={{ width: `${activeQueue.progress}%` }}></div>
                 </div>
                 <div style={{ display: 'flex', gap: '0.5rem' }}>
                   <button onClick={simulateProgress} className="btn btn-outline" style={{ flex: 1, padding: '0.4rem', fontSize: '0.8rem' }}>{t('fastForward')}</button>
                   {activeQueue.ahead === 0 && (
                     <button onClick={completeConsultation} className="btn btn-secondary" style={{ flex: 1, padding: '0.4rem', fontSize: '0.8rem' }}><Check size={14}/> {t('finishConsult')}</button>
                   )}
                 </div>
               </>
             ) : (
               <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '1rem 0' }}>
                 You are not currently in any queue.
               </div>
             )}
          </div>
        </div>
      </div>

      <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>{t('nearbyHospIn')} {selectedCity}</h3>
      <div className="grid-3">
        {sortedHospitals.length > 0 ? sortedHospitals.map((h, index) => (
          <div key={h.id} className="card hover-lift" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {h.name}
                {index === 0 && <span className="status-indicator status-green" style={{ fontSize: '0.65rem', padding: '0.1rem 0.3rem' }}>{t('nearest')}</span>}
              </h3>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <MapPin size={14}/> {h.dist} {t('away')}
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <span className={`status-indicator status-${h.color}`} style={{ fontSize: '0.75rem' }}><span className={`dot dot-${h.color}`}></span> {h.crowd} {t('crowd')}</span>
              <span className="status-indicator status-green" style={{ fontSize: '0.75rem', background: 'var(--bg-main)' }}><Star size={12} fill="currentColor"/> {h.rating}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: 'auto' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Link to={`/patient/hospitals/${h.id}`} className="btn btn-outline" style={{ flex: 1, textDecoration: 'none', padding: '0.5rem' }}>{t('details')}</Link>
                <Link to={`/patient/book?hospital=${h.name}&doctor=Any Available`} className="btn btn-primary" style={{ flex: 1, textDecoration: 'none', padding: '0.5rem' }}>{t('book')}</Link>
              </div>
              <Link to={`/patient/hospitals/${h.id}/route`} className="btn btn-secondary" style={{ width: '100%', textDecoration: 'none', padding: '0.5rem' }}><Map size={16}/> {t('viewRoute')}</Link>
            </div>
          </div>
        )) : (
          <p style={{ color: 'var(--text-muted)' }}>No hospitals found in this area.</p>
        )}
      </div>

      <Modal isOpen={showDetails} onClose={() => setShowDetails(false)} title="Appointment Details">
         {activeQueue && (
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>
               <span style={{ color: 'var(--text-muted)' }}>Appointment ID</span>
               <span style={{ fontWeight: 600 }}>{activeQueue.id}</span>
             </div>
             <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>
               <span style={{ color: 'var(--text-muted)' }}>Hospital</span>
               <span style={{ fontWeight: 600 }}>{activeQueue.hospital}</span>
             </div>
             <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>
               <span style={{ color: 'var(--text-muted)' }}>Doctor</span>
               <span style={{ fontWeight: 600 }}>{activeQueue.doctor} ({activeQueue.dept})</span>
             </div>
             <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>
               <span style={{ color: 'var(--text-muted)' }}>Token</span>
               <span style={{ fontWeight: 600, color: 'var(--primary-teal)' }}>{activeQueue.token}</span>
             </div>
             <div style={{ display: 'flex', justifyContent: 'space-between' }}>
               <span style={{ color: 'var(--text-muted)' }}>Status</span>
               <span className="status-indicator status-green"><span className="dot dot-green"></span> In Queue</span>
             </div>
           </div>
         )}
      </Modal>

      <Modal isOpen={showReschedule} onClose={() => setShowReschedule(false)} title="Reschedule Appointment">
         <form onSubmit={handleReschedule} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>Select New Date</label>
              <input type="date" required style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-light)' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>Select Time Slot</label>
              <select required style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                <option>Morning (10:00 AM - 12:00 PM)</option>
                <option>Afternoon (1:00 PM - 4:00 PM)</option>
                <option>Evening (5:00 PM - 8:00 PM)</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>Confirm Reschedule</button>
         </form>
      </Modal>

    </PageTransition>
  );
};

const HospitalSearch = ({ selectedCity, setSelectedCity, localHospitals }) => {
  const [filter, setFilter] = useState('All');
  const { t } = useTranslation();
  
  let displayHospitals = [...localHospitals];
  if (filter === 'Emergency') displayHospitals = displayHospitals.filter(h => h.emergency);
  if (filter === 'Low Crowd') displayHospitals = displayHospitals.filter(h => h.crowd === 'Low');
  if (filter === 'Nearest') displayHospitals = displayHospitals.sort((a, b) => a.distValue - b.distValue);
  if (filter === 'Multispeciality') displayHospitals = displayHospitals.filter(h => h.isMulti);
  if (filter === '24×7 Open') displayHospitals = displayHospitals.filter(h => h.isOpen247);

  return (
    <PageTransition>
      <PageHeader title={t('findHospitals')} subtitle="Search and book appointments at top-rated facilities." action={<CitySelector selectedCity={selectedCity} setSelectedCity={setSelectedCity} />} />
      
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem', padding: '1rem' }}>
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input type="text" placeholder={t('searchHospital')} style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '8px', border: '1px solid var(--border-light)', outline: 'none' }} />
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
           {['All', 'Emergency', 'Low Crowd', 'Nearest', 'Multispeciality', '24×7 Open'].map(f => {
             const mapping = {
               'All': t('all'),
               'Emergency': t('emergency'),
               'Low Crowd': t('lowCrowd'),
               'Nearest': t('nearest'),
               'Multispeciality': t('multispeciality'),
               '24×7 Open': t('open247')
             };
             return (
               <button 
                  key={f} 
                  onClick={() => setFilter(f)}
                  className={`btn ${filter === f ? 'btn-primary' : 'btn-outline'}`}
                  style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
               >
                  {mapping[f] || f}
               </button>
             );
           })}
        </div>
      </div>

      <div className="grid-3">
        {displayHospitals.length > 0 ? displayHospitals.map(h => (
          <div key={h.id} className="card hover-lift" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
               <h3 style={{ fontSize: '1.25rem' }}>{h.name}</h3>
               {h.emergency && <ShieldAlert size={20} color="var(--danger-red)" title="24/7 Emergency Support"/>}
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              <MapPin size={16} color="var(--primary-teal)" /> {h.city} • {h.dist} {t('away')}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>{t('crowdLevel')}</span>
                <span className={`status-indicator status-${h.color}`} style={{ padding: '0.1rem 0.5rem', fontSize: '0.75rem' }}>{h.crowd}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>{t('waitTime')}</span>
                <span style={{ fontWeight: 600 }}>{h.wait}</span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: 'auto' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Link to={`/patient/hospitals/${h.id}`} className="btn btn-outline" style={{ flex: 1, padding: '0.5rem', textDecoration: 'none' }}>{t('details')}</Link>
                <Link to={`/patient/book?hospital=${h.name}&doctor=Any Available`} className="btn btn-primary" style={{ flex: 1, padding: '0.5rem', textDecoration: 'none' }}>{t('book')}</Link>
              </div>
              <Link to={`/patient/hospitals/${h.id}/route`} className="btn btn-secondary" style={{ width: '100%', textDecoration: 'none', padding: '0.5rem' }}><Map size={16}/> {t('viewRoute')}</Link>
            </div>
          </div>
        )) : (
          <p style={{ color: 'var(--text-muted)' }}>No hospitals match this filter in {selectedCity}.</p>
        )}
      </div>
    </PageTransition>
  );
};

const HospitalRouteMap = () => {
  const { pathname } = useLocation();
  const idStr = pathname.split('/')[3];
  const hospital = allHospitals.find(h => h.id === parseInt(idStr)) || allHospitals[0];
  const { t } = useTranslation();

  const bikeTime = Math.round(hospital.distValue * 3);
  const carTime = Math.round(hospital.distValue * 4);
  const walkTime = Math.round(hospital.distValue * 12);

  return (
    <PageTransition>
      <div style={{ marginBottom: '2rem' }}>
        <Link to="/patient/hospitals" style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.9rem' }}>
          <ChevronRight size={14} style={{ transform: 'rotate(180deg)' }}/> {t('backToSearch')}
        </Link>
      </div>
      
      <PageHeader title={`${hospital.name} Navigation`} subtitle={`Located in ${hospital.city}`} />

      <div className="grid-2">
         <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <SimulatedMapCard showDetails={true} t={t} />
            <div style={{ padding: '1.5rem', display: 'flex', gap: '1rem' }}>
               <button className="btn btn-primary" style={{ flex: 1 }}><Navigation size={18}/> {t('startNavigation')}</button>
               <button className="btn btn-outline" style={{ flex: 1 }}><Map size={18}/> {t('openGmap')}</button>
            </div>
         </div>

         <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="card">
               <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin color="var(--primary-teal)"/> {t('locDetails')}</h3>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>{t('yourLocation')}</span>
                    <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>Current Location</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>{t('destination')}</span>
                    <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>{hospital.name}</div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Main Healthcare Area, {hospital.city}</p>
                  </div>
                  <div style={{ background: 'var(--primary-light)', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid var(--primary-teal)' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>{t('totalDistance')}</span>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-teal)' }}>{hospital.dist}</div>
                  </div>
               </div>
            </div>

            <div className="card">
               <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>{t('estTravelTime')}</h3>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-light)' }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}><Bike size={18} color="var(--primary-teal)"/> {t('byBike')}</div>
                     <div style={{ fontWeight: 700 }}>{bikeTime} min</div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-light)' }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}><Car size={18} color="var(--primary-teal)"/> {t('byCar')}</div>
                     <div style={{ fontWeight: 700 }}>{carTime} min</div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}><Footprints size={18} color="var(--primary-teal)"/> {t('walking')}</div>
                     <div style={{ fontWeight: 700 }}>{walkTime} min</div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </PageTransition>
  );
};

const HospitalDetails = () => {
  const { pathname } = useLocation();
  const idStr = pathname.split('/').pop();
  const hospital = allHospitals.find(h => h.id === parseInt(idStr)) || allHospitals[0];
  const { t } = useTranslation();

  return (
    <PageTransition>
      <div style={{ marginBottom: '2rem' }}>
        <Link to="/patient/hospitals" style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.9rem' }}>
          <ChevronRight size={14} style={{ transform: 'rotate(180deg)' }}/> {t('backToSearch')}
        </Link>
      </div>
      
      <div className="card" style={{ marginBottom: '2rem', padding: '3rem 2rem', background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--primary-light) 100%)', position: 'relative', overflow: 'hidden' }}>
        <img src={bgHospital} alt="Hospital BG" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.1 }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-heading)', fontWeight: 800, marginBottom: '0.5rem' }}>{hospital.name}</h1>
          <p style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <MapPin size={18}/> {hospital.city} • {hospital.dist} {t('away')}
          </p>
          <p style={{ marginBottom: '1.5rem', maxWidth: '600px', lineHeight: 1.6 }}>{hospital.about}</p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <span className={`status-indicator status-${hospital.color}`}><span className={`dot dot-${hospital.color}`}></span> {hospital.crowd} {t('crowd')}</span>
            {hospital.emergency && <span className="status-indicator status-red"><ShieldAlert size={14}/> 24/7 {t('emergency')}</span>}
          </div>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: '2rem' }}>
         <div className="card">
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>{t('hospitalGallery')}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
               <img src={imgReception} alt="Reception" style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px' }} />
               <div style={{ background: 'var(--bg-main)', height: '120px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontWeight: 600 }}>{t('wardIcu')}</div>
               <div style={{ background: 'var(--bg-main)', height: '120px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontWeight: 600 }}>{t('opdArea')}</div>
               <div style={{ background: 'var(--bg-main)', height: '120px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontWeight: 600 }}>{t('bldgExt')}</div>
            </div>
         </div>

         <div className="card">
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>{t('hospServices')}</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
               {hospital.services.map(s => (
                 <span key={s} className="status-indicator status-green" style={{ background: 'var(--primary-light)', color: 'var(--primary-teal)', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                    {s}
                 </span>
               ))}
            </div>
         </div>
      </div>

      <div className="grid-2" style={{ marginBottom: '2rem' }}>
         <div className="card">
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>{t('facilities')}</h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', margin: 0, padding: 0 }}>
               {hospital.facilities.map(f => (
                 <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem' }}>
                   <CheckCircle size={16} color="var(--primary-teal)" /> {f}
                 </li>
               ))}
            </ul>
         </div>

         <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>{t('hospMap')}</h3>
            <SimulatedMapCard showDetails={false} title={hospital.name} t={t} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', padding: '1rem', background: 'var(--bg-main)', borderRadius: '8px' }}>
               <div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Distance</div>
                  <div style={{ fontWeight: 700 }}>{hospital.dist} from you</div>
               </div>
               <Link to={`/patient/hospitals/${hospital.id}/route`} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', textDecoration: 'none' }}><Navigation size={16}/> {t('viewRoute')}</Link>
            </div>
         </div>
      </div>

      <div className="grid-2">
        <div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>{t('liveCrowdTrend')}</h3>
          <div className="card" style={{ height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-light)"/>
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }}/>
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }}/>
                <Tooltip />
                <Line type="monotone" dataKey="crowd" stroke={hospital.color === 'red' ? 'var(--danger-red)' : 'var(--primary-teal)'} strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>{t('availableDoctors')}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {hospital.doctors.map((d, i) => (
              <div key={i} className="card hover-lift" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {d.name} {d.status === 'Busy' && <span className="status-indicator status-yellow" style={{ fontSize: '0.6rem', padding: '0.1rem 0.3rem' }}>{t('busy')}</span>}
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{d.dept} • {d.hours}</p>
                </div>
                <Link 
                  to={`/patient/book?hospital=${encodeURIComponent(hospital.name)}&doctor=${encodeURIComponent(d.name)}&dept=${encodeURIComponent(d.dept)}`} 
                  className="btn btn-secondary" 
                  style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', textDecoration: 'none' }}
                >
                  {t('book')}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

const BookingFlow = ({ setActiveQueue }) => {
  const navigate = useNavigate();
  const [location] = useState(useLocation());
  const params = new URLSearchParams(location.search);
  const hospital = params.get('hospital') || "Tambe Multispeciality Hospital";
  const doctor = params.get('doctor') || "Dr. Chandrakant Tambe";
  const dept = params.get('dept') || "Dentist";
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const appointmentId = `APT-${Math.floor(100000 + Math.random() * 900000)}`;

  const handleBooking = () => {
    setLoading(true);
    setTimeout(() => {
      setActiveQueue({
        token: 'C-45',
        currentToken: 'C-41',
        ahead: 4,
        waitTime: '30m',
        progress: 25,
        hospital: hospital,
        doctor: doctor,
        dept: dept,
        id: appointmentId
      });
      setLoading(false);
      alert(`Booking confirmed! Your Token is C-45. Estimate Wait: 30 mins.`);
      navigate('/patient');
    }, 800);
  };

  return (
    <PageTransition>
      <div className="card" style={{ maxWidth: '600px', margin: '0 auto', padding: '3rem' }}>
        <PageHeader title={t('bookAppt')} subtitle="Review your details to join the live digital queue." />
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
           <div style={{ background: 'var(--bg-main)', padding: '1.5rem', borderRadius: '12px', borderLeft: '4px solid var(--primary-teal)' }}>
             <h4 style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>HOSPITAL</h4>
             <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{hospital}</div>
           </div>
           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
             <div style={{ background: 'var(--bg-main)', padding: '1.5rem', borderRadius: '12px' }}>
               <h4 style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>DOCTOR</h4>
               <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>{doctor}</div>
             </div>
             <div style={{ background: 'var(--bg-main)', padding: '1.5rem', borderRadius: '12px' }}>
               <h4 style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>DEPARTMENT</h4>
               <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>{dept}</div>
             </div>
           </div>
        </div>
        
        <button onClick={handleBooking} className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }} disabled={loading}>
          {loading ? 'Processing...' : 'Generate Live Token'}
        </button>
      </div>
    </PageTransition>
  );
};

const PatientHistory = ({ medicalHistory }) => {
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterHospital, setFilterHospital] = useState('All');
  const { t } = useTranslation();

  const displayHistory = medicalHistory.filter(p => {
    if (filterHospital !== 'All' && p.hospital !== filterHospital) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      if (!p.doc.toLowerCase().includes(term) && !p.data?.disease.toLowerCase().includes(term)) return false;
    }
    return true;
  });

  const uniqueHospitals = ['All', ...new Set(medicalHistory.map(h => h.hospital))];

  return (
    <PageTransition>
      <PageHeader title={t('patientHistory')} subtitle="View past appointments, diagnosis, and prescriptions." />
      
      <div className="card" style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', padding: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '250px', position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
             type="text" 
             placeholder={t('searchHistory')} 
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '8px', border: '1px solid var(--border-light)', outline: 'none' }} 
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-main)', padding: '0.5rem 1rem', borderRadius: '8px' }}>
          <Filter size={18} color="var(--text-muted)"/>
          <select 
             value={filterHospital} 
             onChange={(e) => setFilterHospital(e.target.value)}
             style={{ background: 'transparent', border: 'none', outline: 'none', fontWeight: 600, color: 'var(--text-main)' }}
          >
             {uniqueHospitals.map(h => <option key={h} value={h}>{h === 'All' ? t('all') : h}</option>)}
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {displayHistory.length > 0 ? displayHistory.map((p, i) => (
          <div key={i} className="card hover-lift" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div className="icon-box icon-teal" style={{ marginBottom: 0, width: '48px', height: '48px' }}><FileText size={20}/></div>
              <div>
                <h4 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {p.doc} {i === 0 && p.isNew && <span className="status-indicator status-green" style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem' }}>NEW</span>}
                </h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>{p.data?.disease || "Consultation"} • {p.date}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', fontWeight: 600 }}>
                   <Building size={14}/> {p.hospital}
                   <span className={`status-indicator status-${p.status === 'Completed' ? 'green' : 'red'}`} style={{ padding: '0.1rem 0.4rem' }}>{p.status}</span>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
               <button onClick={() => setSelectedPrescription(p)} className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}><Info size={16}/> {t('viewDetails')}</button>
               <button className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}><Download size={18}/> {t('prescription')}</button>
            </div>
          </div>
        )) : (
          <p style={{ color: 'var(--text-muted)' }}>No records match your search.</p>
        )}
      </div>

      <Modal isOpen={!!selectedPrescription} onClose={() => setSelectedPrescription(null)} title={t('consultDetails')}>
         {selectedPrescription && selectedPrescription.data ? (
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
             <div style={{ background: 'var(--primary-light)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--primary-teal)' }}>
                <h4 style={{ color: 'var(--primary-teal)', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.25rem' }}>{t('diagnosis')}</h4>
                <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{selectedPrescription.data.disease}</div>
             </div>
             
             <div>
                <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FileText size={16}/> {t('docNotes')}</h4>
                <p style={{ background: 'var(--bg-main)', padding: '1rem', borderRadius: '8px', fontSize: '0.95rem' }}>{selectedPrescription.data.notes}</p>
             </div>

             <div>
                <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>{t('prescribedMeds')}</h4>
                <ul style={{ background: 'var(--bg-main)', padding: '1rem 1rem 1rem 2.5rem', borderRadius: '8px', fontSize: '0.95rem', margin: 0 }}>
                   {selectedPrescription.data.meds.split(',').map((m, i) => <li key={i} style={{ marginBottom: '0.25rem' }}>{m.trim()}</li>)}
                </ul>
             </div>

             <div>
                <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Leaf size={16} color="var(--success-green)"/> {t('naturalRemedies')}</h4>
                <p style={{ background: '#f0fdf4', color: '#166534', padding: '1rem', borderRadius: '8px', fontSize: '0.95rem', border: '1px solid #bbf7d0' }}>
                   {selectedPrescription.data.remedies}
                </p>
             </div>

             <div>
                <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Coffee size={16}/> {t('lifestyleSug')}</h4>
                <p style={{ background: 'var(--bg-main)', padding: '1rem', borderRadius: '8px', fontSize: '0.95rem' }}>{selectedPrescription.data.lifestyle}</p>
             </div>

             <div style={{ marginTop: '1rem', padding: '1rem', borderTop: '1px solid var(--border-light)' }}>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{t('followUp')}</h4>
                <Link to="/patient/hospitals" onClick={() => setSelectedPrescription(null)} className="btn btn-outline" style={{ width: '100%', textDecoration: 'none', justifyContent: 'center' }}>
                   Find a {selectedPrescription.data.specialist} Nearby <ChevronRight size={16}/>
                </Link>
             </div>
           </div>
         ) : (
           <p style={{ color: 'var(--text-muted)' }}>Details not available for this historic record.</p>
         )}
      </Modal>
    </PageTransition>
  );
};

const PatientProfile = () => {
  const { t } = useTranslation();
  return (
    <PageTransition>
      <PageHeader title={t('profileSettings')} subtitle="Manage your personal information and preferences." />
      <div className="grid-2">
        <div className="card">
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>{t('personalInfo')}</h3>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>{t('yourName')}</label>
              <input type="text" defaultValue="John Doe" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-light)' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>{t('mobileNum')}</label>
              <input type="text" defaultValue="+1 (555) 123-4567" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-light)' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Date of Birth</label>
              <input type="date" defaultValue="1980-05-15" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-light)' }} />
            </div>
            <button className="btn btn-primary" style={{ marginTop: '1rem' }}>{t('saveChanges')}</button>
          </div>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="card">
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>{t('medHistoryOverview')}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>Hypertension, Allergic to Penicillin.</p>
            <Link to="/patient/history" className="btn btn-secondary" style={{ width: '100%', textDecoration: 'none', textAlign: 'center' }}>{t('viewFullHistory')}</Link>
          </div>
          <div className="card">
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>{t('preferences')}</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid var(--border-light)' }}>
              <span style={{ fontWeight: 500 }}>{t('smsNotif')}</span>
              <input type="checkbox" defaultChecked style={{ transform: 'scale(1.2)' }}/>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0' }}>
              <span style={{ fontWeight: 500 }}>{t('language')}</span>
              <select style={{ padding: '0.25rem', borderRadius: '4px', border: '1px solid var(--border-light)' }}>
                <option>English</option>
                <option>Marathi</option>
                <option>Hindi</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

const EmergencyDashboard = ({ selectedCity, setSelectedCity, localHospitals }) => {
  const { t } = useTranslation();
  
  // Strict emergency filter & sorting by exact distance
  const emergencyHospitals = localHospitals
    .filter(h => h.emergency)
    .sort((a, b) => a.distValue - b.distValue);

  const nearestER = emergencyHospitals.length > 0 ? emergencyHospitals[0] : null;

  return (
    <PageTransition>
      <div style={{ background: 'var(--danger-red)', margin: '-2rem -2rem 2rem -2rem', padding: '2rem 2rem 3rem 2rem', color: 'white', borderRadius: '12px 12px 0 0' }}>
        <PageHeader 
          title={<span style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '0.75rem' }}><ShieldAlert size={32} /> Emergency Response</span>} 
          subtitle={<span style={{ color: 'rgba(255,255,255,0.8)' }}>Immediate trauma and critical care assistance.</span>} 
          action={<CitySelector selectedCity={selectedCity} setSelectedCity={setSelectedCity} />} 
        />
        
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
           <button className="btn btn-outline" style={{ background: 'white', color: 'var(--danger-red)', borderColor: 'white' }}><PhoneCall size={18}/> Call 108 Ambulance</button>
           <button className="btn btn-outline" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.4)' }}><MapPin size={18}/> Use Current Location</button>
        </div>
      </div>

      <div style={{ marginTop: '-4rem', position: 'relative', zIndex: 10, marginBottom: '2rem' }}>
         <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-light)' }}>
               <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.2rem', color: 'var(--danger-red)' }}>
                 <MapPin size={20}/> Nearest Active Emergency Room
               </h3>
               {nearestER && <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>{nearestER.name} • {nearestER.dist} away</p>}
            </div>
            {nearestER ? (
              <SimulatedMapCard showDetails={true} t={t} customHospitalLabel="Emergency Room" />
            ) : (
               <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>No emergency hospitals available in selected city.</div>
            )}
         </div>
      </div>

      <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>24x7 Emergency Hospitals in {selectedCity}</h3>
      <div className="grid-2">
        {emergencyHospitals.map(h => {
          const driveTime = Math.round(h.distValue * 3);
          return (
            <div key={h.id} className="card hover-lift" style={{ borderLeft: '4px solid var(--danger-red)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>{h.name}</h3>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MapPin size={14}/> {h.dist} away • Est. {driveTime} mins drive
                  </div>
                </div>
                <span className="status-indicator status-red" style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}>EMERGENCY ACTIVE</span>
              </div>
              
              <div style={{ background: 'var(--bg-main)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                 <div style={{ flex: 1 }}>
                   <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>CROWD STATUS</div>
                   <div style={{ fontWeight: 600, color: h.color === 'red' ? 'var(--danger-red)' : 'var(--success-green)' }}>{h.crowd} Load</div>
                 </div>
                 <div style={{ flex: 1 }}>
                   <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>AMBULANCE</div>
                   <div style={{ fontWeight: 600, color: 'var(--primary-teal)' }}>Available</div>
                 </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-secondary" style={{ flex: 1, color: 'var(--danger-red)', borderColor: 'var(--danger-red)', background: '#fef2f2' }}><PhoneCall size={16}/> Call ER</button>
                <Link to={`/patient/hospitals/${h.id}/route`} className="btn btn-primary" style={{ flex: 1, textDecoration: 'none', textAlign: 'center' }}><Navigation size={16}/> View Route</Link>
              </div>
            </div>
          );
        })}
      </div>
    </PageTransition>
  );
};

export default function PatientPortal() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Shared State
  const [selectedCity, setSelectedCity] = useState("Sangamner");
  const [activeQueue, setActiveQueue] = useState(null);
  const [medicalHistory, setMedicalHistory] = useState([
    { date: 'Oct 15, 2026', doc: 'Dr. Rahul Gutte', type: 'Prescription', file: 'RX-8492.pdf', isNew: false, hospital: 'Tambe Multispeciality Hospital', data: diseaseMap["Cardiology"], status: 'Completed' },
    { date: 'Sep 02, 2026', doc: 'Dr. Chandrakant Tambe', type: 'Prescription', file: 'RX-9921.pdf', isNew: false, hospital: 'Tambe Multispeciality Hospital', data: diseaseMap["Dentist"], status: 'Completed' }
  ]);

  const localHospitals = allHospitals.filter(h => h.city === selectedCity);

  const simulateProgress = () => {
    if (activeQueue && activeQueue.ahead > 0) {
      setActiveQueue({
        ...activeQueue,
        ahead: activeQueue.ahead - 1,
        currentToken: `C-${parseInt(activeQueue.currentToken.split('-')[1]) + 1}`,
        progress: activeQueue.progress + 20,
        waitTime: `${Math.max(0, parseInt(activeQueue.waitTime) - 8)}m`
      });
    }
  };

  const completeConsultation = () => {
    const illnessData = diseaseMap[activeQueue.dept] || diseaseMap["default"];

    const newRecord = {
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      doc: activeQueue.doctor,
      type: `Prescription (${activeQueue.dept})`,
      file: `RX-${Math.floor(Math.random() * 10000)}.pdf`,
      isNew: true,
      hospital: activeQueue.hospital,
      status: 'Completed',
      data: illnessData
    };
    
    setMedicalHistory([newRecord, ...medicalHistory]);
    setActiveQueue(null);
    alert(`Consultation Complete at ${activeQueue.hospital}! Your prescription has been securely saved.`);
    navigate('/patient/history');
  };

  const tabs = [
    { path: '/patient', name: t('dashboard'), icon: Activity },
    { path: '/patient/emergency', name: t('emergencyTab'), icon: ShieldAlert },
    { path: '/patient/hospitals', name: t('findHospitals'), icon: Building },
    { path: '/patient/queue', name: t('liveQueue'), icon: Clock },
    { path: '/patient/history', name: t('patientHistory'), icon: FileText },
    { path: '/patient/profile', name: t('profileSettings'), icon: User }
  ];

  return (
    <div className="page-wrapper section" style={{ paddingTop: '100px', display: 'flex', gap: '2rem', maxWidth: '1400px', margin: '0 auto', flexWrap: 'wrap', position: 'relative' }}>
      
      <aside style={{ width: '250px', flexShrink: 0, flexGrow: 1, minWidth: '200px' }}>
        <div className="card" style={{ padding: '1rem', position: 'sticky', top: '100px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {tabs.map(t => {
              const active = location.pathname === t.path || (t.path !== '/patient' && location.pathname.startsWith(t.path));
              return (
                <Link key={t.path} to={t.path} style={{ 
                  display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', 
                  borderRadius: '8px', textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem',
                  background: active ? (t.name === 'Emergency' || t.name === 'आपत्कालीन' || t.name === 'आपातकालीन' ? '#fef2f2' : 'var(--primary-light)') : 'transparent',
                  color: active ? (t.name === 'Emergency' || t.name === 'आपत्कालीन' || t.name === 'आपातकालीन' ? 'var(--danger-red)' : 'var(--primary-teal)') : 'var(--text-muted)',
                  transition: '0.2s ease',
                  borderLeft: active ? `4px solid ${t.name === 'Emergency' || t.name === 'आपत्कालीन' || t.name === 'आपातकालीन' ? 'var(--danger-red)' : 'var(--primary-teal)'}` : '4px solid transparent'
                }}>
                  <t.icon size={18} color={active && (t.name === 'Emergency' || t.name === 'आपत्कालीन' || t.name === 'आपातकालीन') ? 'var(--danger-red)' : 'currentColor'}/> {t.name}
                </Link>
              );
            })}
          </div>
        </div>
      </aside>

      <main style={{ flex: 1, minWidth: '300px' }}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<DashboardHome activeQueue={activeQueue} setActiveQueue={setActiveQueue} simulateProgress={simulateProgress} completeConsultation={completeConsultation} selectedCity={selectedCity} setSelectedCity={setSelectedCity} localHospitals={localHospitals} />} />
            <Route path="/emergency" element={<EmergencyDashboard selectedCity={selectedCity} setSelectedCity={setSelectedCity} localHospitals={localHospitals} />} />
            <Route path="/hospitals" element={<HospitalSearch selectedCity={selectedCity} setSelectedCity={setSelectedCity} localHospitals={localHospitals} />} />
            <Route path="/hospitals/:id" element={<HospitalDetails />} />
            <Route path="/hospitals/:id/route" element={<HospitalRouteMap />} />
            <Route path="/queue" element={<DashboardHome activeQueue={activeQueue} setActiveQueue={setActiveQueue} simulateProgress={simulateProgress} completeConsultation={completeConsultation} selectedCity={selectedCity} setSelectedCity={setSelectedCity} localHospitals={localHospitals} />} />
            <Route path="/history" element={<PatientHistory medicalHistory={medicalHistory} />} />
            <Route path="/profile" element={<PatientProfile />} />
            <Route path="/book" element={<BookingFlow setActiveQueue={setActiveQueue} />} />
          </Routes>
        </AnimatePresence>
      </main>

    </div>
  );
}

