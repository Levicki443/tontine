/**
 * POINT D'ENTRÉE & ROUTEUR PRINCIPAL PWA (App.jsx)
 * 
 * Orchestration globale de la navigation, du mode hors-ligne et des flux de l'application.
 */

import React, { useState, useEffect } from 'react';
import LandingScreen from './screens/LandingScreen';
import RegisterScreen from './screens/RegisterScreen';
import LoginScreen from './screens/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';
import CreateTontineScreen from './screens/CreateTontineScreen';
import PaymentScreen from './screens/PaymentScreen';
import NetworkStatusBanner from './components/NetworkStatusBanner';
import { setAuthToken, getAuthToken, apiService } from './services/api';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('landing');
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedTontine, setSelectedTontine] = useState(null);
  const [initializing, setInitializing] = useState(true);

  // Vérification de session active au démarrage
  useEffect(() => {
    const checkSession = async () => {
      const token = getAuthToken();
      if (token) {
        try {
          const res = await apiService.getProfile();
          if (res && res.data && res.data.user) {
            setCurrentUser(res.data.user);
            setCurrentScreen('dashboard');
          }
        } catch {
          // Jeton expiré ou serveur hors-ligne
          if (!localStorage.getItem('tontine_auth_token')) {
            setAuthToken(null);
          }
        }
      }
      setInitializing(false);
    };

    checkSession();
  }, []);

  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    setCurrentScreen('dashboard');
  };

  const handleLogout = () => {
    setAuthToken(null);
    setCurrentUser(null);
    setSelectedTontine(null);
    setCurrentScreen('landing');
  };

  if (initializing) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--color-bg)',
          color: 'var(--color-secondary-light)',
          fontSize: '1.1rem',
          fontWeight: '600'
        }}
      >
        Initialisation de Tontine Collaborative...
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Bannière de connectivité et synchronisation PWA */}
      <NetworkStatusBanner />

      {/* 1. Landing Page (Visiteurs) */}
      {currentScreen === 'landing' && (
        <LandingScreen onNavigate={(screen) => setCurrentScreen(screen)} />
      )}

      {/* 2. Inscription */}
      {currentScreen === 'register' && (
        <RegisterScreen
          onNavigate={(screen) => setCurrentScreen(screen)}
          onAuthSuccess={handleAuthSuccess}
        />
      )}

      {/* 3. Connexion (avec support 2FA) */}
      {currentScreen === 'login' && (
        <LoginScreen
          onNavigate={(screen) => setCurrentScreen(screen)}
          onAuthSuccess={handleAuthSuccess}
        />
      )}

      {/* 4. Tableau de Bord (Connecté) */}
      {currentScreen === 'dashboard' && (
        <DashboardScreen
          user={currentUser}
          onNavigate={(screen) => setCurrentScreen(screen)}
          onSelectTontineForPayment={(tontine) => setSelectedTontine(tontine)}
          onLogout={handleLogout}
        />
      )}

      {/* 5. Création de Tontine */}
      {currentScreen === 'create_tontine' && (
        <CreateTontineScreen
          onNavigate={(screen) => setCurrentScreen(screen)}
          onTontineCreated={() => setCurrentScreen('dashboard')}
        />
      )}

      {/* 6. Paiement / Cotisation */}
      {currentScreen === 'payment' && (
        <PaymentScreen
          tontine={selectedTontine}
          onNavigate={(screen) => setCurrentScreen(screen)}
          onPaymentCompleted={() => setCurrentScreen('dashboard')}
        />
      )}
    </div>
  );
}
