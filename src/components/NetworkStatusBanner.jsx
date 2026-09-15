/**
 * BANNIÈRE D'ÉTAT DU RÉSEAU & SYNCHRONISATION (NetworkStatusBanner.jsx)
 * 
 * Affiche l'état de connexion internet et permet de déclencher la synchronisation
 * des versements différés en un clic dès le retour du réseau.
 */

import React, { useState, useEffect } from 'react';
import { WifiOff, RefreshCw, CheckCircle2 } from 'lucide-react';
import { isOnline, subscribeOnlineStatus, getPendingQueue, syncPendingQueue } from '../services/offlineSync';
import { tontineApiService } from '../services/tontineApi';
import { useTranslation } from '../constants/i18n';

export const NetworkStatusBanner = () => {
  const { t } = useTranslation();
  const [online, setOnline] = useState(isOnline());
  const [pendingCount, setPendingCount] = useState(getPendingQueue().length);
  const [syncing, setSyncing] = useState(false);
  const [syncSuccessMsg, setSyncSuccessMsg] = useState('');

  useEffect(() => {
    const unsubscribe = subscribeOnlineStatus((status) => {
      setOnline(status);
      if (status) {
        // Tentative de synchronisation automatique au retour en ligne
        handleSync();
      }
    });

    const interval = setInterval(() => {
      setPendingCount(getPendingQueue().length);
    }, 3000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  const handleSync = async () => {
    if (syncing) return;
    setSyncing(true);
    setSyncSuccessMsg('');
    try {
      const res = await syncPendingQueue(tontineApiService);
      if (res && res.processed > 0) {
        setSyncSuccessMsg(`${res.processed} opération(s) synchronisée(s) avec succès.`);
        setTimeout(() => setSyncSuccessMsg(''), 4000);
      }
      setPendingCount(getPendingQueue().length);
    } catch (err) {
      console.error('[NetworkStatusBanner] Erreur de synchronisation :', err);
    } finally {
      setSyncing(false);
    }
  };

  if (online && pendingCount === 0 && !syncSuccessMsg) {
    return null;
  }

  return (
    <div
      style={{
        background: !online ? 'var(--color-status-warning-subtle)' : 'var(--color-status-success-subtle)',
        borderBottom: `1px solid ${!online ? 'var(--color-status-warning)' : 'var(--color-status-success)'}`,
        color: !online ? 'var(--color-status-warning)' : 'var(--color-status-success)',
        padding: '0.6rem 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.825rem',
        fontWeight: '600'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {!online ? <WifiOff size={16} /> : <CheckCircle2 size={16} />}
        <span>
          {!online
            ? t('offline_alert')
            : syncSuccessMsg || `${pendingCount} opération(s) en attente de synchronisation.`}
        </span>
      </div>

      {online && pendingCount > 0 && (
        <button
          type="button"
          onClick={handleSync}
          disabled={syncing}
          className="btn-primary"
          style={{
            padding: '0.25rem 0.65rem',
            fontSize: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}
        >
          <RefreshCw size={12} className={syncing ? 'animate-spin' : ''} />
          <span>{syncing ? 'En cours...' : t('sync_now')}</span>
        </button>
      )}
    </div>
  );
};

export default NetworkStatusBanner;
