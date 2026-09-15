/**
 * MODALE DE SÉCURITÉ & DOUBLE AUTHENTIFICATION 2FA (TwoFactorModal.jsx)
 * 
 * Permet d'activer/désactiver le 2FA, de saisir un code de vérification,
 * et de visualiser le journal d'audit de sécurité des transactions.
 */

import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, KeyRound, History, AlertCircle, CheckCircle2 } from 'lucide-react';
import { apiService } from '../services/api';
import { tontineApiService } from '../services/tontineApi';

export const TwoFactorModal = ({ user, onClose, onUserUpdated }) => {
  const [activeTab, setActiveTab] = useState('config');
  const [is2FAEnabled, setIs2FAEnabled] = useState(user?.deuxFacteursActif || false);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const loadLogs = async () => {
    try {
      const res = await tontineApiService.getAuditLogs();
      if (res && res.data) {
        setLogs(res.data.logs || []);
      }
    } catch {
      // Ignorer
    }
  };

  useEffect(() => {
    if (activeTab === 'audit') {
      loadLogs();
    }
  }, [activeTab]);

  const handleToggle = async () => {
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const nextState = !is2FAEnabled;
      const res = await apiService.toggle2FA(nextState);
      if (res && res.data) {
        setIs2FAEnabled(res.data.deuxFacteursActif);
        setSuccessMsg(`Double authentification ${res.data.deuxFacteursActif ? 'activée' : 'désactivée'}.`);
        if (onUserUpdated) {
          onUserUpdated({ ...user, deuxFacteursActif: res.data.deuxFacteursActif });
        }
      }
    } catch (err) {
      setErrorMsg(err.message || 'Erreur lors de la mise à jour de sécurité.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" style={{ maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={22} color="var(--color-primary-light)" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800' }}>Centre de Sécurité & 2FA</h3>
          </div>
          <button type="button" onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Onglets */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <button
            type="button"
            onClick={() => setActiveTab('config')}
            className={activeTab === 'config' ? 'btn-primary' : 'btn-outline'}
            style={{ flex: 1, padding: '0.5rem' }}
          >
            Authentification 2FA
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('audit')}
            className={activeTab === 'audit' ? 'btn-primary' : 'btn-outline'}
            style={{ flex: 1, padding: '0.5rem' }}
          >
            Pistes d&apos;Audit
          </button>
        </div>

        {errorMsg && <div className="banner-error" style={{ marginBottom: '1rem' }}><AlertCircle size={16} /><span>{errorMsg}</span></div>}
        {successMsg && <div className="banner-error" style={{ background: 'var(--color-status-success-subtle)', borderColor: 'var(--color-status-success)', color: 'var(--color-status-success)', marginBottom: '1rem' }}><CheckCircle2 size={16} /><span>{successMsg}</span></div>}

        {activeTab === 'config' && (
          <div>
            <div className="surface-box" style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <KeyRound size={24} color="var(--color-secondary-light)" />
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: '700' }}>Double Authentification (2FA)</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                    Exige la validation d&apos;un code OTP à chaque connexion sensible.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>
                  Statut : {is2FAEnabled ? <span style={{ color: 'var(--color-status-success)' }}>Activé</span> : <span style={{ color: 'var(--color-text-muted)' }}>Désactivé</span>}
                </span>

                <button
                  type="button"
                  onClick={handleToggle}
                  disabled={loading}
                  className={is2FAEnabled ? 'btn-outline' : 'btn-primary'}
                  style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
                >
                  {loading ? 'Mise à jour...' : is2FAEnabled ? 'Désactiver le 2FA' : 'Activer le 2FA'}
                </button>
              </div>
            </div>

            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', lineHeight: '1.5' }}>
              ℹ️ Le chiffrement AES-256-GCM protège l&apos;intégralité de vos coordonnées et transactions stockées en base de données conformément aux standards bancaires.
            </div>
          </div>
        )}

        {activeTab === 'audit' && (
          <div>
            {logs.length === 0 ? (
              <div className="surface-box" style={{ textAlign: 'center', padding: '2rem' }}>
                Aucune entrée d&apos;audit récente.
              </div>
            ) : (
              logs.map((log) => (
                <div key={log._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 0.85rem', background: 'var(--color-bg-surface)', border: '1px solid var(--color-border-light)', borderRadius: 'var(--radius-md)', marginBottom: '0.5rem', fontSize: '0.8rem' }}>
                  <div>
                    <div style={{ fontWeight: '700', color: 'var(--color-text-primary)' }}>{log.action}</div>
                    <div style={{ fontSize: '0.725rem', color: 'var(--color-text-muted)' }}>
                      {new Date(log.createdAt).toLocaleString('fr-FR')} - {log.entiteCible}
                    </div>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: log.statutOperation === 'SUCCES' ? 'var(--color-status-success)' : 'var(--color-status-danger)', fontWeight: '700' }}>
                    {log.statutOperation}
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TwoFactorModal;
