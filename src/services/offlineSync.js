/**
 * GESTIONNAIRE DE SYNCHRONISATION HORS-LIGNE PWA (offlineSync.js)
 * 
 * Permet d'enregistrer des cotisations et actions localement lorsque la connexion est perdue,
 * puis de les synchroniser automatiquement dès le retour du réseau internet.
 */

const QUEUE_STORAGE_KEY = 'tontine_offline_sync_queue';
const onlineListeners = new Set();

export const isOnline = () => {
  if (typeof navigator !== 'undefined' && 'onLine' in navigator) {
    return navigator.onLine;
  }
  return true;
};

export const getPendingQueue = () => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(QUEUE_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const savePendingQueue = (queue) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(queue));
  } catch (err) {
    console.error('[OfflineSync] Erreur d\'écriture locale :', err);
  }
};

/**
 * Met en file d'attente une action hors-ligne (ex: versement de cotisation).
 */
export const enqueueOfflineAction = (type, payload) => {
  const queue = getPendingQueue();
  const queueItem = {
    id: `OFFLINE_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    type,
    payload,
    timestamp: new Date().toISOString()
  };
  queue.push(queueItem);
  savePendingQueue(queue);
  return queueItem;
};

/**
 * Synchronise les actions en attente avec l'API.
 */
export const syncPendingQueue = async (apiHandler) => {
  if (!isOnline()) return { success: false, message: 'Toujours hors-ligne.' };

  const queue = getPendingQueue();
  if (queue.length === 0) return { success: true, processed: 0 };

  const failedItems = [];
  let processedCount = 0;

  for (const item of queue) {
    try {
      if (item.type === 'payment' && apiHandler && apiHandler.createPayment) {
        await apiHandler.createPayment(item.payload);
        processedCount++;
      }
    } catch (err) {
      console.error('[OfflineSync] Échec de synchronisation pour l\'élément :', item, err);
      failedItems.push(item);
    }
  }

  savePendingQueue(failedItems);

  return {
    success: failedItems.length === 0,
    processed: processedCount,
    remaining: failedItems.length
  };
};

/**
 * Souscrit aux changements de connectivité réseau.
 */
export const subscribeOnlineStatus = (callback) => {
  onlineListeners.add(callback);
  return () => onlineListeners.delete(callback);
};

// Initialisation des écouteurs globaux
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    onlineListeners.forEach((fn) => fn(true));
  });

  window.addEventListener('offline', () => {
    onlineListeners.forEach((fn) => fn(false));
  });
}

export default {
  isOnline,
  getPendingQueue,
  enqueueOfflineAction,
  syncPendingQueue,
  subscribeOnlineStatus
};
