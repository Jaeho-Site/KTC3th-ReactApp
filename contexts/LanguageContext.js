// src/contexts/LanguageContext.js
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import i18n from '../i18n';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(i18n.language);

  const loadLanguageAsync = useCallback(async (lang) => {
    const translations = await import(`../locales/${lang}.json`);
    i18n.addResourceBundle(lang, 'translation', translations.default, true, true);
  }, []);

  const changeLanguage = useCallback(async (lang) => {
    await loadLanguageAsync(lang);
    i18n.changeLanguage(lang);
    setLanguage(lang);
    localStorage.setItem('language', lang);
  }, [loadLanguageAsync]);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      changeLanguage(savedLanguage);
    } else {
      const browserLang = navigator.language.split('-')[0];
      const supportedLangs = ['en', 'es', 'ko'];
      const detectedLang = supportedLangs.includes(browserLang) ? browserLang : 'en';
      changeLanguage(detectedLang);
    }
  }, [changeLanguage]);

  const toggleLanguage = useCallback(() => {
    const languageOrder = ['en', 'es', 'ko'];
    const currentIndex = languageOrder.indexOf(language);
    const nextIndex = (currentIndex + 1) % languageOrder.length;
    const newLang = languageOrder[nextIndex];
    changeLanguage(newLang);
  }, [language, changeLanguage]);

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};