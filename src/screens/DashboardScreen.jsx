import React, { useState, useEffect } from 'react';
import { Users, Wallet, Bell, History, LogOut, Plus, CreditCard, CheckCircle, ArrowRight } from 'lucide-react';
import NotificationCard from '../components/NotificationCard';
import { tontineApiService } from '../services/tontineApi';

const TABS = [
  { id: 'tontines', label: 'Mes Tontines', icon: Users },
  { id: 'paiements', label: 'Mes Paiements', icon: Wallet },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'historique', label: 'Historique', icon: History }
];

export const DashboardScreen = ({ user, onNavigate, onSelectTontineForPayment, onLogout }) => {
  const [activeTab, setActiveTab] = useState('tontines');
  const [myTontines, setMyTontines] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);

  const sampleNotifications = [
    {
      id: '1',
      type: 'rappel_cotisation',
      titre: 'Échéance de cotisation proche',
      message: 'Votre versement de 10 000 FCFA pour la Tontine Famille arrive à échéance dans 48h.',
      date: 'Aujourd\'hui à 09:15'
    },
    {
      id: '2',
      type: 'validation_paiement',
      titre: 'Cotisation confirmée',
      message: 'Votre cotisation de 10 000 FCFA via MTN MoMo a été enregistrée avec succès.',
      date: 'Hier à 16:30'
    },
    {
      id: '3',
      type: 'nouveau_membre',
      titre: 'Nouvelle adhésion',
      message: 'Amina Diallo a rejoint votre groupe "Tontine Entreprise".',
      date: 'Il y a 2 jours'
    }
  ];

  const loadData = async () => {
    setLoading(true);
    try {
      const resTontines = await tontineApiService.getMyTontines();
      if (resTontines && resTontines.data) {
        setMyTontines(resTontines.data.tontines || []);
      }
      const resPayments = await tontineApiService.getMyPayments();
      if (resPayments && resPayments.data) {
        setPayments(resPayments.data.payments || []);
      }
    } catch {
      // Données par défaut si le backend est hors ligne
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalCotise = payments.reduce((acc, p) => acc + (p.montant || 0), 0);

  return (
    <div className="page-wrapper page-wrapper-medium">
      {/* 1. Entête Utilisateur & Déconnexion */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Bonjour,</span>
          <h1 style={{ fontSize: '1.4rem', fontWeight: '800' }}>{user ? user.nom : 'Membre'}</h1>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="btn-outline"
          style={{ borderColor: 'rgba(239, 68, 68, 0.3)', color: 'var(--color-status-danger)', padding: '0.4rem 0.85rem' }}
        >
          <LogOut size={16} />
          <span>Déconnexion</span>
        </button>
      </div>

      {/* 2. Carte Statistique */}
      <div
        className="glass-card"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1px 1fr',
          padding: '1.25rem',
          marginBottom: '1.5rem',
          alignItems: 'center',
          textAlign: 'center'
        }}
      >
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '0.25rem' }}>
            Tontines Actives
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800' }}>{myTontines.length}</div>
        </div>
        <div style={{ background: 'var(--color-border-light)', height: '80%' }} />
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '0.25rem' }}>
            Total Cotisé
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--color-secondary-light)' }}>
            {totalCotise.toLocaleString('fr-FR')} FCFA
          </div>
        </div>
      </div>

      {/* 3. Actions Rapides */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem', marginBottom: '1.75rem' }}>
        <button
          type="button"
          onClick={() => onNavigate('create_tontine')}
          className="btn-primary"
          style={{ width: '100%', borderRadius: 'var(--radius-lg)', padding: '0.875rem 1rem' }}
        >
          <Plus size={18} />
          <span>Créer une tontine</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('payment')}
          className="btn-outline"
          style={{ width: '100%', borderRadius: 'var(--radius-lg)', padding: '0.875rem 1rem', color: 'var(--color-text-accent)' }}
        >
          <CreditCard size={18} />
          <span>Faire une cotisation</span>
        </button>
      </div>

      {/* 4. Barre d'onglets */}
      <div
        style={{
          display: 'flex',
          background: 'var(--color-bg-surface)',
          padding: '0.35rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border-light)',
          marginBottom: '1.5rem',
          gap: '0.25rem'
        }}
      >
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem',
                padding: '0.65rem 0.25rem',
                borderRadius: 'var(--radius-md)',
                background: isActive ? 'var(--color-bg-card)' : 'transparent',
                color: isActive ? 'var(--color-secondary-light)' : 'var(--color-text-secondary)',
                fontWeight: isActive ? '700' : '500',
                fontSize: '0.8rem',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Icon size={16} />
              <span className="tab-label">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 5. Contenu selon onglet */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--color-secondary-light)' }}>
          Chargement en cours...
        </div>
      ) : (
        <div>
          {/* Onglet : Mes Tontines */}
          {activeTab === 'tontines' && (
            <div>
              {myTontines.length === 0 ? (
                <div className="surface-box" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
                  <Users size={40} color="var(--color-text-muted)" style={{ margin: '0 auto 0.75rem auto' }} />
                  <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.35rem' }}>Aucune tontine active</h3>
                  <p style={{ fontSize: '0.825rem', marginBottom: '1.25rem' }}>
                    Créez votre premier cercle ou rejoignez un groupe existant.
                  </p>
                  <button type="button" onClick={() => onNavigate('create_tontine')} className="btn-primary">
                    Créer ma première tontine
                  </button>
                </div>
              ) : (
                myTontines.map((tontine) => (
                  <div key={tontine._id || tontine.titre} className="glass-card" style={{ marginBottom: '1rem', padding: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: '700' }}>{tontine.titre}</h3>
                      <span style={{ fontSize: '0.75rem', background: 'var(--color-primary-subtle)', color: 'var(--color-text-accent)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)' }}>
                        {tontine.statut === 'en_cours' ? 'En cours' : 'En attente'}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '0.25rem' }}>
                      Cotisation : <strong>{Number(tontine.montantCotisation).toLocaleString('fr-FR')} FCFA</strong> ({tontine.frequence})
                    </p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
                      Participants : {tontine.membres ? tontine.membres.length : 1} / {tontine.nombreParticipantsMax}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        if (onSelectTontineForPayment) onSelectTontineForPayment(tontine);
                        onNavigate('payment');
                      }}
                      className="btn-secondary"
                      style={{ width: '100%', padding: '0.65rem 1rem', fontSize: '0.85rem' }}
                    >
                      Cotiser maintenant
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Onglet : Paiements & Historique */}
          {(activeTab === 'paiements' || activeTab === 'historique') && (
            <div>
              {payments.length === 0 ? (
                <div className="surface-box" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
                  <Wallet size={40} color="var(--color-text-muted)" style={{ margin: '0 auto 0.75rem auto' }} />
                  <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.35rem' }}>Aucun versement enregistré</h3>
                  <p style={{ fontSize: '0.825rem' }}>Vos reçus de paiement et cotisations apparaîtront ici.</p>
                </div>
              ) : (
                payments.map((p) => (
                  <div
                    key={p._id || p.referenceTransaction}
                    className="glass-card"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '0.75rem', padding: '1rem' }}
                  >
                    <CheckCircle size={24} color="var(--color-status-success)" />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: '700' }}>{p.referenceTransaction}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        {p.operateurMobile || 'Mobile Money'} - {new Date(p.createdAt || Date.now()).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                    <div style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--color-status-success)' }}>
                      +{Number(p.montant).toLocaleString('fr-FR')} FCFA
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Onglet : Notifications */}
          {activeTab === 'notifications' && (
            <div>
              {sampleNotifications.map((notif) => (
                <NotificationCard key={notif.id} type={notif.type} titre={notif.titre} message={notif.message} date={notif.date} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardScreen;
