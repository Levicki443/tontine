/**
 * COMPOSANT SÉLECTEUR DE LANGUE (LanguageSelector.jsx)
 * 
 * Permet de basculer instantanément entre Français, Anglais, Wolof, Bambara et Fon.
 */

import React, { useState } from 'react';
import { Globe, Check } from 'lucide-react';
import { LANGUAGES, useTranslation } from '../constants/i18n';

export const LanguageSelector = () => {
  const { lang, setLanguage } = useTranslation();
  const [open, setOpen] = useState(false);

  const currentLangObj = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="btn-outline"
        style={{
          padding: '0.4rem 0.75rem',
          fontSize: '0.8rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
          borderRadius: 'var(--radius-full)'
        }}
      >
        <Globe size={14} color="var(--color-text-accent)" />
        <span>{currentLangObj.flag} {currentLangObj.label}</span>
      </button>

      {open && (
        <>
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 99
            }}
            onClick={() => setOpen(false)}
          />
          <div
            className="glass-card"
            style={{
              position: 'absolute',
              right: 0,
              top: 'calc(100% + 6px)',
              zIndex: 100,
              minWidth: '170px',
              padding: '0.35rem',
              boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
              borderRadius: 'var(--radius-md)'
            }}
          >
            {LANGUAGES.map((item) => {
              const isSelected = item.code === lang;
              return (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => {
                    setLanguage(item.code);
                    setOpen(false);
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.5rem 0.75rem',
                    background: isSelected ? 'var(--color-primary-subtle)' : 'transparent',
                    color: isSelected ? 'var(--color-text-accent)' : 'var(--color-text-primary)',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.85rem',
                    fontWeight: isSelected ? '700' : '400',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <span>{item.flag} {item.label}</span>
                  {isSelected && <Check size={14} color="var(--color-text-accent)" />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSelector;
