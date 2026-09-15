/**
 * TABLEAU DE BORD PRINCIPAL & TRANSPARENCE FINANCIÈRE (DashboardScreen.jsx)
 * 
 * Centralise les cercles d'épargne, les notifications réelles, les cycles,
 * l'espace litiges et la gestion de sécurité 2FA.
 */

import React, { useState, useEffect } from 'react';
import { Users, Wallet, Bell, History, LogOut, Plus, CreditCard, Calendar, ShieldCheck, ShieldAlert, CheckCircle2 } from 'lucide-react';
import NotificationCard from '../components/NotificationCard';
import CycleCalendarModal from '../components/CycleCalendarModal';
import DisputeModal from '../components/DisputeModal';
import TwoFactorModal from '../components/TwoFactorModal';
import LanguageSelector from '../components/LanguageSelector';
import { tontineApiService } from '../services/tontineApi';
import { useTranslation } from '../constants/i18n';

const TABS = [
  { id: 'tontines', labelKey: 'my_tontines', icon: Users },
  { id: 'paiements', labelKey: 'my_payments', icon: Wallet },
  { id: 'notifications', labelKey: 'notifications', icon: Bell },
  { id: 'historique', labelKey: 'history', icon: History }
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
      // Ignorer si hors-ligne
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Bienvenue,</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h1 style={{ fontSize: '1.3rem', fontWeight: '800' }}>{currentUser?.nom || 'Membre'}</h1>
            {currentUser?.role === 'administrateur' && (
              <span style={{ fontSize: '0.7rem', background: 'var(--color-primary-subtle)', color: 'var(--color-text-accent)', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-full)', fontWeight: '700' }}>
                Admin
              </span>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <LanguageSelector />
          <button
            type="button"
            onClick={() => setShowSecurityModal(true)}
            className="btn-outline"
            style={{ padding: '0.4rem 0.65rem', fontSize: '0.8rem' }}
            title="Sécurité & 2FA"
          >
            <ShieldCheck size={16} color="var(--color-status-success)" />
          </button>
          <button
            type="button"
            onClick={onLogout}
            className="btn-outline"
            style={{ borderColor: 'rgba(239,68,68,0.3)', color: 'var(--color-status-danger)', padding: '0.4rem 0.65rem' }}
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>

      {/* 2. Synthèse Financière Globale */}
      <div
        className="glass-card"
        style={{ display: 'grid', gridTemplateColumns: '1fr 1px 1fr', padding: '1rem', marginBottom: '1.25rem', alignItems: 'center', textAlign: 'center' }}
      >
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{t('active_tontines')}</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '800' }}>{myTontines.length}</div>
        </div>
        <div style={{ background: 'var(--color-border-light)', height: '75%' }} />
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{t('total_saved')}</div>
          <div style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--color-secondary-light)' }}>
            {totalCotise.toLocaleString('fr-FR')} FCFA
          </div>
        </div>
      </div>

      {/* 3. Actions Rapides */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <button type="button" onClick={() => onNavigate('create_tontine')} className="btn-primary" style={{ padding: '0.75rem 1rem' }}>
          <Plus size={16} />
          <span>{t('create_tontine')}</span>
        </button>
        <button type="button" onClick={() => onNavigate('payment')} className="btn-outline" style={{ padding: '0.75rem 1rem', color: 'var(--color-text-accent)' }}>
          <CreditCard size={16} />
          <span>{t('pay_contribution')}</span>
        </button>
      </div>

      {/* 4. Barre d'Onglets */}
      <div style={{ display: 'flex', background: 'var(--color-bg-surface)', padding: '0.3rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-light)', marginBottom: '1.25rem', gap: '0.25rem' }}>
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
                gap: '0.3rem',
                padding: '0.6rem 0.2rem',
                borderRadius: 'var(--radius-md)',
                background: isActive ? 'var(--color-bg-card)' : 'transparent',
                color: isActive ? 'var(--color-secondary-light)' : 'var(--color-text-secondary)',
                fontWeight: isActive ? '700' : '500',
                fontSize: '0.8rem',
                border: 'none',
                cursor: 'pointer',
                position: 'relative'
              }}
            >
              <Icon size={15} />
              <span>{t(tab.labelKey)}</span>
              {tab.id === 'notifications' && unreadCount > 0 && (
                <span style={{ width: '8px', height: '8px', borderRadius: 'var(--radius-full)', background: 'var(--color-status-danger)' }} />
              )}
            </button>
          );
        })}
      </div>

      {/* 5. Contenu des Onglets */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '2.5rem 0', color: 'var(--color-secondary-light)' }}>Chargement en cours...</div>
      ) : (
        <div>
          {activeTab === 'tontines' && (
            <div>
              {myTontines.length === 0 ? (
                <div className="surface-box" style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
                  <Users size={36} color="var(--color-text-muted)" style={{ margin: '0 auto 0.5rem auto' }} />
                  <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>Vous n&apos;avez aucune tontine active pour le moment.</p>
                  <button type="button" onClick={() => onNavigate('create_tontine')} className="btn-primary">Créer une tontine</button>
                </div>
              ) : (
                myTontines.map((tontine) => (
                  <div key={tontine._id} className="glass-card" style={{ marginBottom: '1rem', padding: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: '800' }}>{tontine.titre}</h3>
                      <span style={{ fontSize: '0.75rem', background: 'var(--color-primary-subtle)', color: 'var(--color-text-accent)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', fontWeight: '700' }}>
                        {tontine.statut === 'en_cours' ? `Tour #${tontine.tourActuel || 1}` : 'En attente'}
                      </span>
                    </div>

                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '0.25rem' }}>
                      Cotisation : <strong>{Number(tontine.montantCotisation).toLocaleString('fr-FR')} FCFA</strong> ({tontine.frequence})
                    </p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '0.85rem' }}>
                      Participants : {tontine.membres?.length || 1} / {tontine.nombreParticipantsMax}
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                      <button
                        type="button"
                        onClick={() => { if (onSelectTontineForPayment) onSelectTontineForPayment(tontine); onNavigate('payment'); }}
                        className="btn-secondary"
                        style={{ padding: '0.5rem', fontSize: '0.75rem' }}
                      >
                        Cotiser
                      </button>

                      <button
                        type="button"
                        onClick={() => setCalendarTontineId(tontine._id)}
                        className="btn-outline"
                        style={{ padding: '0.5rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}
                      >
                        <Calendar size={13} />
                        <span>Cycles & Tours</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDisputeTontineId(tontine._id)}
                        className="btn-outline"
                        style={{ padding: '0.5rem', fontSize: '0.75rem', borderColor: 'rgba(245,158,11,0.3)', color: 'var(--color-status-warning)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}
                      >
                        <ShieldAlert size={13} />
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
                  <p style={{ fontSize: '0.9rem' }}>Aucun versement enregistré.</p>
                </div>
              ) : (
                payments.map((p) => (
                  <div key={p._id} className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.65rem', padding: '0.85rem' }}>
                    <CheckCircle2 size={22} color="var(--color-status-success)" />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: '800' }}>{p.referenceTransaction}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        {p.operateurMobile} | Tour #{p.numeroTour || 1} - {new Date(p.createdAt).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--color-status-success)' }}>
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
                  <p style={{ fontSize: '0.9rem' }}>Aucune notification récente.</p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <NotificationCard
                    key={notif._id}
                    type={notif.type}
                    titre={notif.titre}
                    message={notif.message}
                    date={new Date(notif.createdAt).toLocaleString('fr-FR')}
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
        <TwoFactorModal
          user={currentUser}
          onClose={() => setShowSecurityModal(false)}
          onUserUpdated={(u) => setCurrentUser(u)}
        />
      )}
    </div>
  );
};

export default DashboardScreen;
