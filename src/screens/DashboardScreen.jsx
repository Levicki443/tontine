/**
 * TABLEAU DE BORD PRINCIPAL & TRANSPARENCE FINANCIÈRE (DashboardScreen.jsx)
 * 
 * Interface 100% responsive avec navigation par onglets 4 colonnes,
 * actions équilibrées et liste des versements optimisée pour mobile.
 */

import React, { useState, useEffect } from 'react';
import { Users, Wallet, Bell, History, LogOut, Plus, CreditCard, Calendar, ShieldCheck, ShieldAlert, CheckCircle2, Settings } from 'lucide-react';
import NotificationCard from '../components/NotificationCard';
import CycleCalendarModal from '../components/CycleCalendarModal';
import DisputeModal from '../components/DisputeModal';
import TwoFactorModal from '../components/TwoFactorModal';
import SettingsModal from '../components/SettingsModal';
import LanguageSelector from '../components/LanguageSelector';
import { tontineApiService } from '../services/tontineApi';
import { useTranslation } from '../constants/i18n';

const TABS = [
  { id: 'tontines', label: 'Tontines', icon: Users },
  { id: 'paiements', label: 'Versements', icon: Wallet },
  { id: 'notifications', label: 'Notifs', icon: Bell },
  { id: 'historique', label: 'Historique', icon: History }
];

export const DashboardScreen = ({ user, onNavigate, onSelectTontineForPayment, onLogout }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('tontines');
  const [myTontines, setMyTontines] = useState([]);
  const [payments, setPayments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modales
  const [calendarTontineId, setCalendarTontineId] = useState(null);
  const [disputeTontineId, setDisputeTontineId] = useState(null);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(user);

  const loadData = async () => {
    setLoading(true);
    try {
      const [resTontines, resPayments, resNotifs] = await Promise.allSettled([
        tontineApiService.getMyTontines(),
        tontineApiService.getMyPayments(),
        tontineApiService.getNotifications()
      ]);

      if (resTontines.status === 'fulfilled' && resTontines.value?.data) {
        setMyTontines(resTontines.value.data.tontines || []);
      }
      if (resPayments.status === 'fulfilled' && resPayments.value?.data) {
        setPayments(resPayments.value.data.payments || []);
      }
      if (resNotifs.status === 'fulfilled' && resNotifs.value?.data) {
        setNotifications(resNotifs.value.data.notifications || []);
      }
    } catch {
      // Données par défaut si hors-ligne
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalCotise = payments.reduce((acc, p) => acc + (p.montant || 0), 0);
  const unreadCount = notifications.filter((n) => !n.estLu).length;

  return (
    <div className="page-wrapper page-wrapper-medium">
      {/* 1. En-tête Utilisateur & Contrôles */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.15rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Bienvenue,</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: '1.25rem', fontWeight: '800' }}>{currentUser?.nom || 'Membre'}</h1>
            {currentUser?.role === 'administrateur' && (
              <span style={{ fontSize: '0.65rem', background: 'var(--color-primary-subtle)', color: 'var(--color-text-accent)', padding: '0.1rem 0.45rem', borderRadius: 'var(--radius-full)', fontWeight: '700' }}>
                Admin
              </span>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <LanguageSelector />
          <button type="button" onClick={() => setShowSettingsModal(true)} className="btn-outline" style={{ padding: '0.4rem 0.55rem', minHeight: '38px' }} title="Paramètres">
            <Settings size={15} color="var(--color-secondary-light)" />
          </button>
          <button type="button" onClick={() => setShowSecurityModal(true)} className="btn-outline" style={{ padding: '0.4rem 0.55rem', minHeight: '38px' }} title="Sécurité 2FA">
            <ShieldCheck size={15} color="var(--color-status-success)" />
          </button>
          <button type="button" onClick={onLogout} className="btn-outline" style={{ borderColor: 'rgba(239,68,68,0.3)', color: 'var(--color-status-danger)', padding: '0.4rem 0.55rem', minHeight: '38px' }}>
            <LogOut size={15} />
          </button>
        </div>
      </div>

      {/* 2. Synthèse Financière Globale */}
      <div className="glass-card" style={{ display: 'grid', gridTemplateColumns: '1fr 1px 1fr', padding: '1rem 0.75rem', marginBottom: '1.15rem', alignItems: 'center', textAlign: 'center' }}>
        <div>
          <div style={{ fontSize: '0.725rem', color: 'var(--color-text-secondary)' }}>{t('active_tontines')}</div>
          <div style={{ fontSize: '1.4rem', fontWeight: '800' }}>{myTontines.length}</div>
        </div>
        <div style={{ background: 'var(--color-border-light)', height: '70%' }} />
        <div>
          <div style={{ fontSize: '0.725rem', color: 'var(--color-text-secondary)' }}>{t('total_saved')}</div>
          <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--color-secondary-light)' }}>
            {totalCotise.toLocaleString('fr-FR')} FCFA
          </div>
        </div>
      </div>

      {/* 3. Actions Rapides Équilibrées */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem', marginBottom: '1.15rem' }}>
        <button
          type="button"
          onClick={() => onNavigate('create_tontine')}
          className="btn-primary"
          style={{ minHeight: '48px', padding: '0.65rem 0.5rem', fontSize: '0.85rem', fontWeight: '700', borderRadius: 'var(--radius-lg)' }}
        >
          <Plus size={16} />
          <span>Créer une tontine</span>
        </button>
        <button
          type="button"
          onClick={() => onNavigate('payment')}
          className="btn-outline"
          style={{ minHeight: '48px', padding: '0.65rem 0.5rem', fontSize: '0.85rem', fontWeight: '700', borderRadius: 'var(--radius-lg)', color: 'var(--color-text-accent)' }}
        >
          <CreditCard size={16} />
          <span>Cotiser</span>
        </button>
      </div>

      {/* 4. Barre d'Onglets Mobile Native 4 Colonnes */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '4px',
          background: 'var(--color-bg-surface)',
          padding: '4px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border-light)',
          marginBottom: '1.15rem'
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
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '3px',
                padding: '0.55rem 0.2rem',
                borderRadius: 'var(--radius-md)',
                background: isActive ? 'var(--color-bg-card)' : 'transparent',
                color: isActive ? 'var(--color-secondary-light)' : 'var(--color-text-secondary)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                position: 'relative'
              }}
            >
              <Icon size={16} />
              <span style={{ fontSize: '0.725rem', fontWeight: isActive ? '700' : '500' }}>{tab.label}</span>
              {tab.id === 'notifications' && unreadCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '5px',
                    right: 'calc(50% - 12px)',
                    width: '6px',
                    height: '6px',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--color-status-danger)'
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* 5. Contenu des Onglets */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '2.5rem 0', color: 'var(--color-secondary-light)' }}>Chargement...</div>
      ) : (
        <div>
          {activeTab === 'tontines' && (
            <div>
              {myTontines.length === 0 ? (
                <div className="surface-box" style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
                  <Users size={36} color="var(--color-text-muted)" style={{ margin: '0 auto 0.5rem auto' }} />
                  <p style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>Aucun cercle de tontine pour le moment.</p>
                  <button type="button" onClick={() => onNavigate('create_tontine')} className="btn-primary">Créer une tontine</button>
                </div>
              ) : (
                myTontines.map((tontine) => (
                  <div key={tontine._id} className="glass-card" style={{ marginBottom: '0.85rem', padding: '1.15rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', gap: '0.5rem' }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: '800' }}>{tontine.titre}</h3>
                      <span style={{ fontSize: '0.7rem', background: 'var(--color-primary-subtle)', color: 'var(--color-text-accent)', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-full)', fontWeight: '700', whiteSpace: 'nowrap' }}>
                        {tontine.statut === 'en_cours' ? `Tour #${tontine.tourActuel || 1}` : 'En attente'}
                      </span>
                    </div>

                    <p style={{ fontSize: '0.825rem', color: 'var(--color-text-secondary)', marginBottom: '0.2rem' }}>
                      Cotisation : <strong>{Number(tontine.montantCotisation).toLocaleString('fr-FR')} FCFA</strong> ({tontine.frequence})
                    </p>
                    <p style={{ fontSize: '0.825rem', color: 'var(--color-text-secondary)', marginBottom: '0.85rem' }}>
                      Participants : {tontine.membres?.length || 1} / {tontine.nombreParticipantsMax}
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.4rem' }}>
                      <button
                        type="button"
                        onClick={() => { if (onSelectTontineForPayment) onSelectTontineForPayment(tontine); onNavigate('payment'); }}
                        className="btn-secondary"
                        style={{ padding: '0.45rem', fontSize: '0.75rem' }}
                      >
                        Cotiser
                      </button>
                      <button
                        type="button"
                        onClick={() => setCalendarTontineId(tontine._id)}
                        className="btn-outline"
                        style={{ padding: '0.45rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.2rem' }}
                      >
                        <Calendar size={12} />
                        <span>Cycles</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setDisputeTontineId(tontine._id)}
                        className="btn-outline"
                        style={{ padding: '0.45rem', fontSize: '0.75rem', borderColor: 'rgba(245,158,11,0.3)', color: 'var(--color-status-warning)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.2rem' }}
                      >
                        <ShieldAlert size={12} />
                        <span>Litiges</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {(activeTab === 'paiements' || activeTab === 'historique') && (
            <div>
              {payments.length === 0 ? (
                <div className="surface-box" style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
                  <Wallet size={36} color="var(--color-text-muted)" style={{ margin: '0 auto 0.5rem auto' }} />
                  <p style={{ fontSize: '0.85rem' }}>Aucun versement enregistré.</p>
                </div>
              ) : (
                payments.map((p) => (
                  <div
                    key={p._id}
                    className="glass-card"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.75rem',
                      marginBottom: '0.65rem',
                      padding: '0.85rem 1rem'
                    }}
                  >
                    <CheckCircle2 size={22} color="var(--color-status-success)" style={{ flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: '800', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {p.referenceTransaction}
                      </div>
                      <div style={{ fontSize: '0.725rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                        {p.operateurMobile} | Tour #{p.numeroTour || 1} - {new Date(p.createdAt).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--color-status-success)', whiteSpace: 'nowrap', flexShrink: 0 }}>
                      +{Number(p.montant).toLocaleString('fr-FR')} FCFA
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'notifications' && (
            <div>
              {notifications.length === 0 ? (
                <div className="surface-box" style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
                  <Bell size={36} color="var(--color-text-muted)" style={{ margin: '0 auto 0.5rem auto' }} />
                  <p style={{ fontSize: '0.85rem' }}>Aucune notification récente.</p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <NotificationCard
                    key={notif._id}
                    type={notif.type}
                    titre={notif.titre}
                    message={notif.message}
                    date={new Date(notif.createdAt).toLocaleDateString('fr-FR')}
                  />
                ))
              )}
            </div>
          )}
        </div>
      )}

      {/* Modales */}
      {calendarTontineId && (
        <CycleCalendarModal tontineId={calendarTontineId} onClose={() => setCalendarTontineId(null)} />
      )}
      {disputeTontineId && (
        <DisputeModal tontineId={disputeTontineId} user={currentUser} onClose={() => setDisputeTontineId(null)} />
      )}
      {showSecurityModal && (
        <TwoFactorModal user={currentUser} onClose={() => setShowSecurityModal(false)} onUserUpdated={(u) => setCurrentUser(u)} />
      )}
      {showSettingsModal && (
        <SettingsModal user={currentUser} onClose={() => setShowSettingsModal(false)} onUserUpdated={(u) => setCurrentUser(u)} />
      )}
    </div>
  );
};

export default DashboardScreen;
