/**
 * SERVICE API HTTP CENTRALISÉ (api.js)
 * 
 * Gère les communications réseau avec le backend Express, l'injection du token JWT,
 * et les flux d'authentification 2FA.
 */

const rawBaseUrl = (import.meta.env.VITE_API_URL || import.meta.env.VITE_URL || 'http://localhost:5000').trim().replace(/\/+$/, '');
const API_BASE_URL = rawBaseUrl.endsWith('/api') ? rawBaseUrl : `${rawBaseUrl}/api`;

let userToken = typeof window !== 'undefined' ? localStorage.getItem('tontine_auth_token') : null;

export const setAuthToken = (token) => {
  userToken = token;
  if (typeof window !== 'undefined') {
    if (token) {
      localStorage.setItem('tontine_auth_token', token);
    } else {
      localStorage.removeItem('tontine_auth_token');
    }
  }
};

export const getAuthToken = () => userToken;

/**
 * Fonction générique d'exécution des requêtes HTTP avec gestion d'erreurs.
 */
export const request = async (endpoint, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...(userToken ? { Authorization: `Bearer ${userToken}` } : {}),
    ...options.headers
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Une erreur est survenue lors de la communication avec le serveur.');
    }

    return data;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      console.warn(`[Mode Hors-Ligne Détecté] Échec de communication vers ${API_BASE_URL}${endpoint}`);
      throw new Error('Connexion réseau indisponible. L\'action sera stockée localement.');
    }
    throw error;
  }
};

export const apiService = {
  getAuthToken,
  setAuthToken,

  register: (userData) => {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  login: (identifiant, password) => {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ identifiant, password })
    });
  },

  verify2FA: (userId, code) => {
    return request('/auth/verify-2fa', {
      method: 'POST',
      body: JSON.stringify({ userId, code })
    });
  },

  toggle2FA: (actif) => {
    return request('/auth/toggle-2fa', {
      method: 'PATCH',
      body: JSON.stringify({ actif })
    });
  },

  getProfile: () => {
    return request('/auth/me', {
      method: 'GET'
    });
  },

  refreshToken: (refreshToken) => {
    return request('/auth/refresh-token', {
      method: 'POST',
      body: JSON.stringify({ refreshToken })
    });
  }
};

export default apiService;
