import React from 'react';
import { Clock, CheckCircle, UserPlus, AlertCircle, Bell } from 'lucide-react';

/**
 * COMPOSANT : CARTE DE NOTIFICATION (Web PWA)
 * Affiche les notifications métier avec icônes dynamiques et badges de statut.
 */
export const NotificationCard = ({ type, titre, message, date }) => {
  const getConfig = () => {
    switch (type) {
      case 'rappel_cotisation':
        return {
          icon: <Clock size={20} color="var(--color-status-warning)" />,
          bgColor: 'var(--color-status-warning-subtle)',
          badgeColor: 'var(--color-status-warning)',
          badgeLabel: 'Rappel'
        };
      case 'validation_paiement':
        return {
          icon: <CheckCircle size={20} color="var(--color-status-success)" />,
          bgColor: 'var(--color-status-success-subtle)',
          badgeColor: 'var(--color-status-success)',
          badgeLabel: 'Paiement Validé'
        };
      case 'nouveau_membre':
        return {
          icon: <UserPlus size={20} color="var(--color-primary-light)" />,
          bgColor: 'var(--color-primary-subtle)',
          badgeColor: 'var(--color-primary-light)',
          badgeLabel: 'Nouveau Membre'
        };
      case 'retard_paiement':
        return {
          icon: <AlertCircle size={20} color="var(--color-status-danger)" />,
          bgColor: 'var(--color-status-danger-subtle)',
          badgeColor: 'var(--color-status-danger)',
          badgeLabel: 'Retard'
        };
      default:
        return {
          icon: <Bell size={20} color="var(--color-text-accent)" />,
          bgColor: 'var(--color-primary-subtle)',
          badgeColor: 'var(--color-text-accent)',
          badgeLabel: 'Information'
        };
    }
  };

  const config = getConfig();

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.875rem',
        background: 'var(--color-bg-card)',
        border: '1px solid var(--color-border-light)',
        borderRadius: 'var(--radius-lg)',
        padding: '1rem',
        marginBottom: '0.75rem',
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      <div
        style={{
          width: '38px',
          height: '38px',
          borderRadius: 'var(--radius-full)',
          background: config.bgColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}
      >
        {config.icon}
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem', gap: '0.5rem', flexWrap: 'wrap' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--color-text-primary)' }}>
            {titre}
          </h4>
          <span
            style={{
              fontSize: '0.7rem',
              fontWeight: '700',
              color: config.badgeColor,
              background: config.bgColor,
              padding: '0.15rem 0.5rem',
              borderRadius: 'var(--radius-xs)'
            }}
          >
            {config.badgeLabel}
          </span>
        </div>

        <p style={{ fontSize: '0.825rem', color: 'var(--color-text-secondary)', lineHeight: '1.4', marginBottom: '0.25rem' }}>
          {message}
        </p>

        {date && (
          <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
            {date}
          </span>
        )}
      </div>
    </div>
  );
};

export default NotificationCard;
