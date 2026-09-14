/**
 * SERVICE API TONTINES & PAIEMENTS (tontineApi.js)
 * Communique avec les endpoints /api/tontines et /api/payments.
 */

import { request } from './api';

export const tontineApiService = {
  // Récupère les tontines de l'utilisateur connecté
  getMyTontines: () => {
    return request('/tontines/mes-tontines', { method: 'GET' });
  },

  // Récupère les tontines publiques ouvertes aux adhésions
  getExploreTontines: () => {
    return request('/tontines', { method: 'GET' });
  },

  // Création d'une nouvelle tontine
  createTontine: (tontineData) => {
    return request('/tontines', {
      method: 'POST',
      body: JSON.stringify(tontineData)
    });
  },

  // Rejoint une tontine existante
  joinTontine: (tontineId) => {
    return request(`/tontines/${tontineId}/rejoindre`, { method: 'POST' });
  },

  // Récupère l'historique des cotisations de l'utilisateur
  getMyPayments: () => {
    return request('/payments/mes-paiements', { method: 'GET' });
  },

  // Effectue un versement de cotisation
  createPayment: (paymentData) => {
    return request('/payments', {
      method: 'POST',
      body: JSON.stringify(paymentData)
    });
  }
};

export default tontineApiService;
