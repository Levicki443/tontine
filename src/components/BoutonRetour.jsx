import React from 'react';
import { ArrowLeft } from 'lucide-react';

/**
 * COMPOSANT RÉUTILISABLE : BOUTON RETOUR (Web PWA)
 * Bouton de navigation avec micro-animation fluide et transition au survol.
 * 
 * @param {object} props
 * @param {Function} props.onPress - Action déclenchée au clic
 * @param {string} [props.label] - Texte affiché
 */
export const BoutonRetour = ({ onPress, label = 'Retour' }) => {
  return (
    <button
      type="button"
      onClick={onPress}
      className="btn-back-web"
      aria-label={label || 'Retourner à la page précédente'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        background: 'var(--color-bg-surface)',
        color: 'var(--color-text-primary)',
        border: '1px solid var(--color-border-light)',
        borderRadius: 'var(--radius-full)',
        padding: '0.5rem 1rem',
        fontSize: '0.875rem',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        boxShadow: 'var(--shadow-sm)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--color-border-focus)';
        e.currentTarget.style.transform = 'translateX(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--color-border-light)';
        e.currentTarget.style.transform = 'translateX(0)';
      }}
    >
      <ArrowLeft size={16} color="var(--color-text-accent)" />
      <span>{label}</span>
    </button>
  );
};

export default BoutonRetour;
