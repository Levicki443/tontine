import React, { useState } from 'react';
import { Users, ShieldCheck, ArrowRight, Lock, Smartphone, Bell, X } from 'lucide-react';

/**
 * ÉCRAN : PAGE D'ACCUEIL (LandingScreen.jsx)
 * Conforme à la Section 7.1 du Cahier des Charges.
 * Présentation du projet, vision, piliers d'épargne solidaire et modales d'information.
 */
export const LandingScreen = ({ onNavigate }) => {
  const [modalType, setModalType] = useState(null); // 'about' | 'contact' | null

  return (
    <div className="page-wrapper">
      {/* 1. Header & Navigation Supérieure */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0.75rem 0',
          marginBottom: '2.5rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--color-bg-surface)',
              border: '1px solid var(--color-border-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Users size={20} color="var(--color-secondary-light)" />
          </div>
          <span style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--color-text-primary)' }}>
            Tontine Collab
          </span>
        </div>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={() => setModalType('about')}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--color-text-secondary)',
              fontSize: '0.9rem',
              fontWeight: '500',
              cursor: 'pointer',
              padding: '0.5rem 0.75rem',
              transition: 'color 0.2s ease'
            }}
          >
            À propos
          </button>

          <button
            type="button"
            onClick={() => setModalType('contact')}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--color-text-secondary)',
              fontSize: '0.9rem',
              fontWeight: '500',
              cursor: 'pointer',
              padding: '0.5rem 0.75rem',
              transition: 'color 0.2s ease'
            }}
          >
            Nous contacter
          </button>

          <button
            type="button"
            onClick={() => onNavigate('login')}
            className="btn-outline"
            style={{ padding: '0.5rem 1.25rem' }}
          >
            Connexion
          </button>
        </nav>
      </header>

      {/* 2. Section Hero Immersive */}
      <section
        className="glass-card"
        style={{
          textAlign: 'center',
          padding: '3.5rem 1.5rem',
          marginBottom: '2.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'var(--color-secondary-subtle)',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            padding: '0.35rem 1rem',
            borderRadius: 'var(--radius-full)',
            marginBottom: '1.25rem'
          }}
        >
          <ShieldCheck size={16} color="var(--color-secondary-light)" />
          <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--color-secondary-light)' }}>
            Épargne Solidaire & Sécurisée
          </span>
        </div>

        <h1
          style={{
            fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
            fontWeight: '800',
            maxWidth: '780px',
            marginBottom: '1.25rem',
            lineHeight: '1.2'
          }}
        >
          L&apos;union financière qui propulse vos ambitions
        </h1>

        <p
          style={{
            fontSize: '1.05rem',
            color: 'var(--color-text-secondary)',
            maxWidth: '680px',
            lineHeight: '1.6',
            marginBottom: '2rem'
          }}
        >
          Digitalisez la tradition de la tontine avec une sécurité de niveau bancaire.
          Créez ou rejoignez des cercles d&apos;épargne de confiance, suivez vos versements
          en temps réel et atteignez vos objectifs sereinement.
        </p>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            type="button"
            onClick={() => onNavigate('register')}
            className="btn-primary"
            style={{ padding: '0.875rem 2rem' }}
          >
            <span>Rejoindre la communauté</span>
            <ArrowRight size={18} />
          </button>

          <button
            type="button"
            onClick={() => onNavigate('login')}
            className="btn-outline"
            style={{ padding: '0.875rem 1.75rem' }}
          >
            Déjà membre ? Se connecter
          </button>
        </div>
      </section>

      {/* 3. Section Présentation & Origine de l'Idée */}
      <section className="surface-box" style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '1rem' }}>
          Origine de l&apos;Idée & Vision
        </h2>
        <p style={{ lineHeight: '1.6', marginBottom: '1rem' }}>
          La tontine est un puissant levier d&apos;entraide et de solidarité financière ancré
          dans nos cultures depuis des générations. Cependant, la gestion manuelle expose souvent
          à des risques de retards, d&apos;oublis ou de contestations.
        </p>
        <p style={{ lineHeight: '1.6', marginBottom: '1.75rem' }}>
          Notre plateforme PWA modernise cette pratique séculaire en offrant une traçabilité intégrale,
          des rappels automatisés et une protection stricte des données pour chaque participant.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.25rem'
          }}
        >
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ marginBottom: '0.75rem' }}>
              <Lock size={26} color="var(--color-status-success)" />
            </div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '0.4rem' }}>
              Confiance & Sécurité
            </h3>
            <p style={{ fontSize: '0.875rem', lineHeight: '1.5' }}>
              Chaque transaction est validée et historisée de façon transparente et infalsifiable.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ marginBottom: '0.75rem' }}>
              <Smartphone size={26} color="var(--color-secondary-light)" />
            </div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '0.4rem' }}>
              Progressive Web App
            </h3>
            <p style={{ fontSize: '0.875rem', lineHeight: '1.5' }}>
              Accessible et installable sur tous vos écrans : ordinateur, smartphone et tablette, sans passer par un store.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ marginBottom: '0.75rem' }}>
              <Bell size={26} color="var(--color-text-accent)" />
            </div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '0.4rem' }}>
              Rappels Intelligents
            </h3>
            <p style={{ fontSize: '0.875rem', lineHeight: '1.5' }}>
              Notifications automatiques pour ne jamais manquer une échéance de cotisation.
            </p>
          </div>
        </div>
      </section>

      {/* Modale d'Informations */}
      {modalType && (
        <div className="modal-overlay" onClick={() => setModalType(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>
                {modalType === 'about' ? 'À propos de notre mission' : 'Nous contacter'}
              </h3>
              <button
                type="button"
                onClick={() => setModalType(null)}
                style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>
            <p style={{ lineHeight: '1.6', marginBottom: '1.5rem', color: 'var(--color-text-secondary)' }}>
              {modalType === 'about'
                ? 'Tontine Collaborative est une initiative visant à démocratiser l\'accès à l\'épargne collective par des solutions technologiques robustes, inclusives et sécurisées.'
                : 'Notre équipe est à votre écoute pour toute question ou assistance technique à l\'adresse email : support@tontinecollab.com.'}
            </p>
            <button
              type="button"
              onClick={() => setModalType(null)}
              className="btn-outline btn-full"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingScreen;
