/* eslint-disable */
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Activity, Mic, Send, PhoneCall, Navigation, ShieldAlert, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from '../context/TranslationContext';

export default function MedSlotAssistant() {
  const { lang } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [chatLang, setChatLang] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const chatEndRef = useRef(null);
  const navigate = useNavigate();

  const supportedLangs = ['English', 'Hindi', 'Marathi', 'Gujarati', 'Bengali', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Punjabi', 'Odia', 'Assamese', 'Urdu'];

  // Initialize Language based on Context Lang
  useEffect(() => {
    if (isOpen && !chatLang) {
       let defaultL = 'English';
       if (lang === 'MR') defaultL = 'Marathi';
       if (lang === 'HI') defaultL = 'Hindi';
       
       setMessages([
         { sender: 'bot', text: 'Namaste! I am MedSlot Assistant. Please select your preferred language:' },
         { sender: 'bot', type: 'langSelect' }
       ]);
    }
  }, [isOpen, lang, chatLang]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const selectLanguage = (selectedL) => {
    setChatLang(selectedL);
    setMessages(prev => [...prev, { sender: 'user', text: selectedL }]);
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const greeting = selectedL === 'Marathi' ? 'नमस्कार! मी तुम्हाला कशी मदत करू शकतो?' 
                     : selectedL === 'Hindi' ? 'नमस्ते! मैं आपकी कैसे मदद कर सकता हूँ?' 
                     : 'Hello! How can I assist you with your health today?';
      setMessages(prev => [...prev, 
        { sender: 'bot', text: greeting },
        { sender: 'bot', type: 'disclaimer', text: 'MedSlot Assistant provides basic guidance only. In serious conditions, contact a doctor or emergency service immediately.' }
      ]);
    }, 800);
  };

  const processBotResponse = (userInput) => {
    setIsTyping(true);
    const lowerInput = userInput.toLowerCase();
    
    setTimeout(() => {
      setIsTyping(false);
      let response = { sender: 'bot', text: '' };

      const emergencyKeywords = ['chest pain', 'breathing', 'accident', 'unconscious', 'bleeding', 'stroke', 'heart attack'];
      const isEmergency = emergencyKeywords.some(kw => lowerInput.includes(kw));

      if (isEmergency) {
        response.text = '⚠️ This may need urgent medical attention. Please head to the nearest Emergency Room immediately.';
        response.type = 'emergencyCard';
      } else if (lowerInput.includes('fever') || lowerInput.includes('cold') || lowerInput.includes('cough')) {
        response.text = 'It sounds like you might be experiencing a viral infection. I suggest consulting a General Physician. Drink plenty of warm fluids.';
        response.type = 'bookingCard';
        response.data = { dept: 'General Physician' };
      } else if (lowerInput.includes('hospital') || lowerInput.includes('book')) {
        response.text = 'I can help you find a hospital. Would you like to view the list of nearby facilities?';
        response.type = 'linkCard';
        response.data = { link: '/patient/hospitals', label: 'Find Hospitals' };
      } else {
        response.text = 'I am your virtual assistant. I can help you find hospitals, check queue status, or suggest basic medical directions based on symptoms.';
      }

      setMessages(prev => [...prev, response]);
    }, 1200);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { sender: 'user', text: input }]);
    processBotResponse(input);
    setInput('');
  };

  const handleMic = () => {
    if (isListening) return;
    setIsListening(true);
    let dots = 0;
    const interval = setInterval(() => {
       dots = (dots + 1) % 4;
       setInput('Listening' + '.'.repeat(dots));
    }, 400);
    
    setTimeout(() => {
       clearInterval(interval);
       setIsListening(false);
       setInput('I have chest pain');
    }, 2500);
  };

  const executeEmergencyAction = () => {
    setIsOpen(false);
    navigate('/patient/emergency');
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{ position: 'fixed', bottom: '2rem', left: '2rem', width: '60px', height: '60px', borderRadius: '50%', background: 'var(--primary-teal)', color: 'white', border: 'none', boxShadow: 'var(--shadow-lg)', cursor: 'pointer', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        {isOpen ? <X size={28}/> : <MessageSquare size={28}/>}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            style={{ position: 'fixed', bottom: '6rem', left: '2rem', width: '380px', height: '600px', maxHeight: '80vh', background: 'white', borderRadius: '16px', boxShadow: 'var(--shadow-lg)', zIndex: 99998, display: 'flex', flexDirection: 'column', border: '1px solid var(--border-light)', overflow: 'hidden' }}
          >
            {/* Chat Header */}
            <div style={{ background: 'var(--primary-teal)', color: 'white', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
               <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <Activity size={24}/>
               </div>
               <div>
                 <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>MedSlot Assistant</h3>
                 <span style={{ fontSize: '0.8rem', opacity: 0.8, display: 'flex', alignItems: 'center', gap: '0.25rem' }}><span className="dot dot-green"></span> Online</span>
               </div>
            </div>

            {/* Chat Messages Body */}
            <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', background: 'var(--bg-main)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
               {messages.map((m, i) => (
                 <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: m.sender === 'user' ? 'flex-end' : 'flex-start', gap: '0.5rem' }}>
                    {m.text && (
                      <div style={{ background: m.sender === 'user' ? 'var(--primary-teal)' : 'white', color: m.sender === 'user' ? 'white' : 'var(--text-main)', padding: '0.75rem 1.25rem', borderRadius: m.sender === 'user' ? '16px 16px 0 16px' : '16px 16px 16px 0', border: m.sender === 'bot' ? '1px solid var(--border-light)' : 'none', maxWidth: '85%', fontSize: '0.95rem', lineHeight: 1.5, boxShadow: m.sender === 'bot' ? 'var(--shadow-sm)' : 'none' }}>
                         {m.text}
                      </div>
                    )}

                    {m.type === 'langSelect' && !chatLang && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', maxWidth: '95%' }}>
                        {supportedLangs.map(l => (
                          <button key={l} onClick={() => selectLanguage(l)} className="btn btn-outline" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', background: 'white' }}>{l}</button>
                        ))}
                      </div>
                    )}

                    {m.type === 'disclaimer' && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'transparent', padding: '0 0.5rem', fontStyle: 'italic', maxWidth: '90%' }}>
                         {m.text}
                      </div>
                    )}

                    {m.type === 'emergencyCard' && (
                      <div className="card" style={{ padding: '1rem', border: '2px solid var(--danger-red)', background: '#fef2f2', maxWidth: '90%' }}>
                        <h4 style={{ color: 'var(--danger-red)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}><ShieldAlert size={18}/> Emergency Detected</h4>
                        <button onClick={executeEmergencyAction} className="btn btn-primary" style={{ background: 'var(--danger-red)', width: '100%', marginBottom: '0.5rem', padding: '0.5rem' }}><PhoneCall size={16}/> Call Ambulance</button>
                        <button onClick={executeEmergencyAction} className="btn btn-outline" style={{ width: '100%', padding: '0.5rem', background: 'white', borderColor: 'var(--danger-red)', color: 'var(--danger-red)' }}><Navigation size={16}/> Route to Nearest ER</button>
                      </div>
                    )}

                    {m.type === 'bookingCard' && (
                      <div className="card" style={{ padding: '1rem', maxWidth: '90%' }}>
                        <h4 style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>Suggested Department: {m.data.dept}</h4>
                        <Link to="/patient/hospitals" onClick={() => setIsOpen(false)} className="btn btn-primary" style={{ width: '100%', padding: '0.5rem', textDecoration: 'none', textAlign: 'center', fontSize: '0.85rem' }}>Find {m.data.dept} Nearby</Link>
                      </div>
                    )}

                    {m.type === 'linkCard' && (
                      <Link to={m.data.link} onClick={() => setIsOpen(false)} className="btn btn-outline" style={{ background: 'white', padding: '0.5rem 1rem', textDecoration: 'none', fontSize: '0.85rem' }}>{m.data.label} <ChevronRight size={14}/></Link>
                    )}
                 </div>
               ))}
               
               {isTyping && (
                 <div style={{ background: 'white', padding: '0.75rem 1.25rem', borderRadius: '16px 16px 16px 0', border: '1px solid var(--border-light)', maxWidth: '50%', color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>
                    Processing...
                 </div>
               )}
               <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <div style={{ padding: '1rem', background: 'white', borderTop: '1px solid var(--border-light)', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
               <input 
                 type="text" 
                 disabled={!chatLang || isListening}
                 placeholder={isListening ? "Listening..." : "Type your symptoms..."} 
                 value={input}
                 onChange={e => setInput(e.target.value)}
                 onKeyDown={e => e.key === 'Enter' && handleSend()}
                 style={{ flex: 1, padding: '0.75rem 1rem', borderRadius: '24px', border: '1px solid var(--border-light)', outline: 'none', fontSize: '0.95rem', background: isListening ? '#f1f5f9' : 'white', color: isListening ? 'var(--primary-teal)' : 'var(--text-main)', transition: '0.3s' }}
               />
               <button 
                 onClick={handleMic} 
                 disabled={!chatLang}
                 className="btn btn-outline" 
                 style={{ width: '45px', height: '45px', borderRadius: '50%', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderColor: isListening ? 'var(--danger-red)' : 'var(--border-light)', color: isListening ? 'var(--danger-red)' : 'var(--text-muted)' }}
                 title="Voice Input"
               >
                 {isListening ? <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity }}><Mic size={20}/></motion.div> : <Mic size={20}/>}
               </button>
               <button 
                 onClick={handleSend} 
                 disabled={!input.trim()}
                 className="btn btn-primary" 
                 style={{ width: '45px', height: '45px', borderRadius: '50%', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: input.trim() ? 1 : 0.5 }}
               >
                 <Send size={18}/>
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

