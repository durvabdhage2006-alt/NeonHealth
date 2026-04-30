import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../translations';
import { AnimatePresence, motion } from 'framer-motion';

const TranslationContext = createContext();

export const useTranslation = () => useContext(TranslationContext);

export const TranslationProvider = ({ children }) => {
  const [lang, setLangState] = useState('EN');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const savedLang = localStorage.getItem('nexus_lang');
    if (savedLang && translations[savedLang]) {
      setLangState(savedLang);
    }
  }, []);

  const setLang = (newLang) => {
    setLangState(newLang);
    localStorage.setItem('nexus_lang', newLang);
    
    // Show toast
    setToast(translations[newLang].langChanged || "Language changed successfully");
    setTimeout(() => setToast(null), 3000);
  };

  const t = (key) => {
    return translations[lang][key] || translations['EN'][key] || key;
  };

  return (
    <TranslationContext.Provider value={{ lang, setLang, t }}>
      {children}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            style={{
              position: 'fixed',
              bottom: '2rem',
              left: '50%',
              background: 'var(--text-main)',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              zIndex: 9999,
              fontWeight: 600,
              boxShadow: 'var(--shadow-md)'
            }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </TranslationContext.Provider>
  );
};
