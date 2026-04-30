import React, { useState } from 'react';
import { 
  Users, Clock, ShieldAlert, Monitor, Activity, Settings, 
  MapPin, HeartPulse, FileText, ChevronRight, BarChart3, Plus
} from 'lucide-react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import '../MedSlot.css';

const data = [
  { name: 'Mon', patients: 120 }, { name: 'Tue', patients: 150 },
  { name: 'Wed', patients: 180 }, { name: 'Thu', patients: 140 },
  { name: 'Fri', patients: 200 }, { name: 'Sat', patients: 250 },
  { name: 'Sun', patients: 90 },
];

export const PatientDashboard = () => {
  return (
    <div className="page-wrapper section" style={{ paddingTop: '120px' }}>
      <div className="section-header" style={{ textAlign: 'left', marginInline: '0', display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <h2>Patient Dashboard</h2>
          <p>Manage your appointments, track your tokens, and find nearby hospitals.</p>
        </div>
        <select className="btn btn-outline" style={{ background: 'white' }}>
           <option>New York City</option>
           <option>Los Angeles</option>
           <option>Chicago</option>
        </select>
      </div>

      <div className="grid-3" style={{ marginBottom: '3rem' }}>
        <div className="card queue-board" style={{ gridColumn: 'span 2' }}>
            <div className="queue-board-header">
               <div>
                 <span style={{ opacity: 0.8, fontSize: '0.9rem', fontWeight: 600 }}>CURRENT TOKEN</span>
                 <div className="queue-token">C-42</div>
               </div>
               <div style={{ textAlign: 'right' }}>
                 <span style={{ opacity: 0.8, fontSize: '0.9rem', fontWeight: 600 }}>DEPARTMENT</span>
                 <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>Cardiology</div>
               </div>
            </div>
            <div style={{ padding: '2rem' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                  <div>
                    <h4 style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Estimated Wait Time</h4>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)' }}>12 mins</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <h4 style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Patients Ahead</h4>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary-blue)' }}>3</div>
                  </div>
               </div>

               <div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.9rem' }}>
                   <span>Queue Progress</span>
                   <span style={{ color: 'var(--primary-teal)' }}>60%</span>
                 </div>
                 <div className="progress-bar-container">
                    <div className="progress-bar-fill" style={{ width: `60%` }}></div>
                 </div>
               </div>
            </div>
         </div>

         <div className="card">
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>Quick Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
               <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'flex-start' }}><Plus size={18}/> Book Appointment</button>
               <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'flex-start' }}><Activity size={18}/> Join Live Queue</button>
               <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'flex-start' }}><FileText size={18}/> View Medical History</button>
               <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'flex-start' }}><Settings size={18}/> Profile Settings</button>
            </div>
         </div>
      </div>

      <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Nearby Hospitals</h3>
      <div className="grid-3">
        {[
          { name: "Apollo City Hospital", dist: "2.4 km", crowd: "Moderate", wait: "15-20m" },
          { name: "Fortis Healthcare", dist: "5.1 km", crowd: "High", wait: "45-60m" },
          { name: "Nexus Regional Clinic", dist: "1.2 km", crowd: "Low", wait: "5-10m" }
        ].map((h, i) => (
          <div key={i} className="card">
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{h.name}</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              <MapPin size={16} color="var(--primary-teal)" /> {h.dist} away
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Crowd Level</span>
              <span style={{ fontWeight: 600 }}>{h.crowd}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Wait Time</span>
              <span style={{ fontWeight: 600 }}>{h.wait}</span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-primary" style={{ flex: 1, padding: '0.5rem' }}>Join Queue</button>
              <button className="btn btn-secondary" style={{ flex: 1, padding: '0.5rem' }}>Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const DoctorDashboard = () => {
  return (
    <div className="page-wrapper section" style={{ paddingTop: '120px' }}>
      <div className="section-header" style={{ textAlign: 'left', marginInline: '0', display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <h2>Doctor Dashboard</h2>
          <p>Welcome back, Dr. Sarah. Here is your schedule for today.</p>
        </div>
        <div className="status-indicator status-green" style={{ padding: '0.5rem 1rem' }}>
           <span className="dot dot-green"></span> Consulting Online
        </div>
      </div>

      <div className="grid-3">
        <div className="card" style={{ gridColumn: 'span 2' }}>
           <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.5rem' }}>Today's Queue</h3>
           <div className="table-container">
             <table className="data-table">
                <thead>
                   <tr>
                      <th>Token</th>
                      <th>Patient Name</th>
                      <th>Time</th>
                      <th>Status</th>
                      <th>Action</th>
                   </tr>
                </thead>
                <tbody>
                   <tr>
                      <td><span className="badge badge-success">C-42</span></td>
                      <td style={{ fontWeight: 600 }}>John Doe</td>
                      <td>10:30 AM</td>
                      <td><span className="status-dot status-online"></span> In Progress</td>
                      <td><button className="btn btn-secondary" style={{ padding: '0.4rem 1rem' }}>Open File</button></td>
                   </tr>
                   <tr>
                      <td><span className="badge badge-normal">C-43</span></td>
                      <td style={{ fontWeight: 600 }}>Alice Smith</td>
                      <td>10:45 AM</td>
                      <td>Waiting</td>
                      <td><button className="btn btn-outline" style={{ padding: '0.4rem 1rem' }}>Next</button></td>
                   </tr>
                   <tr style={{ background: 'var(--danger-light)' }}>
                      <td><span className="badge badge-urgent">ER-01</span></td>
                      <td style={{ fontWeight: 600, color: 'var(--danger-red)' }}>Unknown</td>
                      <td>Immediate</td>
                      <td><span className="status-dot status-busy"></span> Critical</td>
                      <td><button className="btn btn-danger" style={{ padding: '0.4rem 1rem' }}>Accept ER</button></td>
                   </tr>
                </tbody>
             </table>
           </div>
        </div>

        <div className="card">
           <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.5rem' }}>Active Patient</h3>
           <div style={{ background: 'var(--bg-main)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>TOKEN C-42</div>
              <h4 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>John Doe</h4>
              <p style={{ fontSize: '0.9rem' }}>Male, 45 yrs. History of Hypertension.</p>
           </div>
           
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <button className="btn btn-primary" style={{ width: '100%' }}>Add Prescription</button>
              <button className="btn btn-outline" style={{ width: '100%' }}>Order Lab Tests</button>
              <button className="btn btn-secondary" style={{ width: '100%' }}>Complete Consultation</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export const StaffDashboard = () => {
  return (
    <div className="page-wrapper section" style={{ paddingTop: '120px' }}>
      <div className="section-header" style={{ textAlign: 'left', marginInline: '0' }}>
        <h2>Hospital Staff Dashboard</h2>
        <p>Manage walk-ins, queues, and doctor availability.</p>
      </div>

      <div className="grid-3" style={{ marginBottom: '3rem' }}>
          <div className="card metric-card">
             <div className="metric-icon metric-teal"><Users size={32} /></div>
             <div className="metric-content">
                <h3>142</h3>
                <p>Waiting Patients</p>
             </div>
          </div>
          <div className="card metric-card">
             <div className="metric-icon metric-blue"><Clock size={32} /></div>
             <div className="metric-content">
                <h3>12m</h3>
                <p>Avg Wait Time</p>
             </div>
          </div>
          <div className="card metric-card">
             <div className="metric-icon metric-orange"><Activity size={32} /></div>
             <div className="metric-content">
                <h3>18</h3>
                <p>Active Doctors</p>
             </div>
          </div>
       </div>

       <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Department Queues</h3>
            <button className="btn btn-primary"><Plus size={18}/> Issue Token</button>
          </div>
          <div className="table-container">
             <table className="data-table">
                <thead>
                   <tr>
                      <th>Department</th>
                      <th>Active Doctor</th>
                      <th>Current Token</th>
                      <th>Waiting</th>
                      <th>Status</th>
                      <th>Action</th>
                   </tr>
                </thead>
                <tbody>
                   <tr>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                          <HeartPulse size={18} color="var(--primary-teal)"/> Cardiology
                        </div>
                      </td>
                      <td>Dr. Sarah Johnson</td>
                      <td><span className="badge badge-normal">C-42</span></td>
                      <td>12 Patients</td>
                      <td><span className="status-dot status-online"></span> Smooth</td>
                      <td><button className="btn btn-secondary" style={{ padding: '0.4rem 1rem' }}>Manage</button></td>
                   </tr>
                   <tr>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                          <Activity size={18} color="var(--primary-blue)"/> Orthopedics
                        </div>
                      </td>
                      <td>Dr. Michael Chen</td>
                      <td><span className="badge badge-normal">O-18</span></td>
                      <td>25 Patients</td>
                      <td><span className="status-dot status-busy"></span> Delayed</td>
                      <td><button className="btn btn-secondary" style={{ padding: '0.4rem 1rem' }}>Manage</button></td>
                   </tr>
                   <tr style={{ background: 'var(--danger-light)' }}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: 'var(--danger-red)' }}>
                          <ShieldAlert size={18} /> Emergency (ER)
                        </div>
                      </td>
                      <td>Dr. Emily Davis</td>
                      <td><span className="badge badge-urgent">ER-02</span></td>
                      <td style={{ color: 'var(--danger-red)', fontWeight: 600 }}>2 Critical</td>
                      <td><span className="status-dot status-busy"></span> Over Capacity</td>
                      <td><button className="btn btn-danger" style={{ padding: '0.4rem 1rem' }}>Override</button></td>
                   </tr>
                </tbody>
             </table>
          </div>
       </div>
    </div>
  );
};

export const AdminDashboard = () => {
  return (
    <div className="page-wrapper section" style={{ paddingTop: '120px' }}>
      <div className="section-header" style={{ textAlign: 'left', marginInline: '0', display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <h2>System Admin Panel</h2>
          <p>Global analytics, user management, and hospital settings.</p>
        </div>
        <button className="btn btn-danger"><ShieldAlert size={18}/> Emergency Broadcast</button>
      </div>

      <div className="grid-2" style={{ marginBottom: '3rem' }}>
        <div className="card">
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>Patient Inflow (Weekly)</h3>
          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-light)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{ stroke: 'var(--border-light)', strokeWidth: 2 }} />
                <Line type="monotone" dataKey="patients" stroke="var(--primary-teal)" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>System Management</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
             <div style={{ padding: '1.5rem', border: '1px solid var(--border-light)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <div>
                 <h4 style={{ fontSize: '1.1rem' }}>Manage Hospitals</h4>
                 <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Add/remove branches and modify capacities.</p>
               </div>
               <button className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>View <ChevronRight size={18}/></button>
             </div>
             <div style={{ padding: '1.5rem', border: '1px solid var(--border-light)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <div>
                 <h4 style={{ fontSize: '1.1rem' }}>Staff & Doctors</h4>
                 <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Manage user roles and credentials.</p>
               </div>
               <button className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>View <ChevronRight size={18}/></button>
             </div>
             <div style={{ padding: '1.5rem', border: '1px solid var(--border-light)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <div>
                 <h4 style={{ fontSize: '1.1rem' }}>Global Analytics Report</h4>
                 <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Export KPI data and queue efficiency metrics.</p>
               </div>
               <button className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>Export <FileText size={18}/></button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
