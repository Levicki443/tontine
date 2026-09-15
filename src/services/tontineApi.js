/**
 * SERVICE API TONTINES, FINANCES, NOTIFICATIONS & LITIGES (tontineApi.js)
 * 
 * Centralise les appels d'API pour toutes les opérations métier de la plateforme.
 */

import { request } from './api';

export const tontineApiService = {
  // --- Tontines & Groupes ---
  getMyTontines: () => request('/tontines/mes-tontines', { method: 'GET' }),
  getExploreTontines: () => request('/tontines', { method: 'GET' }),
  getTontineById: (id) => request(`/tontines/${id}`, { method: 'GET' }),
  createTontine: (tontineData) =>
    request('/tontines', {
      method: 'POST',
      body: JSON.stringify(tontineData)
    }),
  joinTontine: (tontineId) => request(`/tontines/${tontineId}/rejoindre`, { method: 'POST' }),
  assignTreasurer: (tontineId, tresorierUserId) =>
    request(`/tontines/${tontineId}/tresorier`, {
      method: 'PATCH',
      body: JSON.stringify({ tresorierUserId })
    }),
  getFinancialSummary: (tontineId) =>
    request(`/tontines/${tontineId}/synthese-financiere`, { method: 'GET' }),

  // --- Paiements & Cotisations ---
  getMyPayments: () => request('/payments/mes-paiements', { method: 'GET' }),
  getTontinePayments: (tontineId) => request(`/payments/tontine/${tontineId}`, { method: 'GET' }),
  createPayment: (paymentData) =>
    request('/payments', {
      method: 'POST',
      body: JSON.stringify(paymentData)
    }),
  validatePayment: (paymentId) =>
    request(`/payments/${paymentId}/valider`, { method: 'PATCH' }),

  // --- Centre de Notifications ---
  getNotifications: () => request('/notifications', { method: 'GET' }),
  markNotificationRead: (id) => request(`/notifications/${id}/lire`, { method: 'PATCH' }),
  markAllNotificationsRead: () => request('/notifications/tout-lire', { method: 'PATCH' }),
  deleteNotification: (id) => request(`/notifications/${id}`, { method: 'DELETE' }),

  // --- Gestion des Litiges (Disputes) ---
  createDispute: (disputeData) =>
    request('/disputes', {
      method: 'POST',
      body: JSON.stringify(disputeData)
    }),
  getTontineDisputes: (tontineId) =>
    request(`/disputes/tontine/${tontineId}`, { method: 'GET' }),
  resolveDispute: (disputeId, resolutionData) =>
    request(`/disputes/${disputeId}/arbitrer`, {
      method: 'PATCH',
      body: JSON.stringify(resolutionData)
    }),

  // --- Journal d'Audit & Sécurité ---
  getAuditLogs: () => request('/audit', { method: 'GET' }),
  getAuditStats: () => request('/audit/statistiques', { method: 'GET' })
};

export default tontineApiService;
