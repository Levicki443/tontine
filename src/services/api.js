/**
 * SERVICE API HTTP CENTRALISÉ (api.js)
 * Gère les communications avec l'API Backend Express et l'injection des jetons JWT.
 */

// URL de base de l'API avec lecture dynamique depuis l'environnement Vite
const rawBaseUrl = (import.meta.env.VITE_API_URL || import.meta.env.VITE_URL || 'http://localhost:5000').trim().replace(/\/+$/, '');
const API_BASE_URL = rawBaseUrl.endsWith('/api') ? rawBaseUrl : `${rawBaseUrl}/api`;

if (import.meta.env.DEV) {
  console.info(`[Tontine API] Endpoint actif : ${API_BASE_URL}`);
}

// Récupération initiale du jeton stocké dans le navigateur
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
 * Fonction générique d'exécution des requêtes HTTP avec gestion d'erreurs sécurisée.
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
      console.error(`[Erreur Réseau] Échec de communication vers ${API_BASE_URL}${endpoint} :`, error);
      throw new Error('Impossible de joindre le serveur. Veuillez vérifier votre connexion internet ou réessayer dans quelques instants.');
    }
    throw error;
  }
};

export const apiService = {
  getAuthToken,
  setAuthToken,

  // Inscription d'un nouveau membre
  register: (userData) => {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  // Connexion via Email ou Téléphone
  login: (identifiant, password) => {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ identifiant, password })
    });
  },

  // Récupération du profil authentifié
  getProfile: () => {
    return request('/auth/me', {
      method: 'GET'
    });
  },

  // Rafraîchissement de session
  refreshToken: (refreshToken) => {
    return request('/auth/refresh-token', {
      method: 'POST',
      body: JSON.stringify({ refreshToken })
    });
  }
};

export default apiService;
