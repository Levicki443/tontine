import React, { useState } from 'react';
import { LogIn, UserCheck, Lock, Eye, EyeOff, AlertCircle, X } from 'lucide-react';
import BoutonRetour from '../components/BoutonRetour';
import { apiService, setAuthToken } from '../services/api';

/**
 * ÉCRAN : CONNEXION (LoginScreen.jsx)
 * Conforme à la Section 7.3 du Cahier des Charges.
 * Champs : Email ou Téléphone, Mot de passe.
 */
export const LoginScreen = ({ onNavigate, onAuthSuccess }) => {
  const [identifiant, setIdentifiant] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    if (!identifiant.trim() || !password) {
      setErrorMsg('Veuillez renseigner votre identifiant et votre mot de passe.');
      return;
    }

    setLoading(true);
    try {
      const response = await apiService.login(identifiant.trim(), password);

      if (response.data && response.data.accessToken) {
        setAuthToken(response.data.accessToken);
        if (onAuthSuccess) {
          onAuthSuccess(response.data.user);
        }
      }
    } catch (err) {
      setErrorMsg(err.message || 'Identifiants incorrects. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper page-wrapper-narrow">
      <div style={{ marginBottom: '1.5rem' }}>
        <BoutonRetour onPress={() => onNavigate('landing')} label="Retour à l'accueil" />
      </div>

      <div className="glass-card">
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--color-secondary-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem auto'
          }}
        >
          <LogIn size={26} color="var(--color-secondary-light)" />
        </div>

        <h1 style={{ fontSize: '1.5rem', fontWeight: '800', textAlign: 'center', marginBottom: '0.4rem' }}>
          Bon retour parmi nous
        </h1>
        <p style={{ textAlign: 'center', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
          Connectez-vous pour gérer vos tontines et suivre vos cotisations.
        </p>

        {errorMsg && (
          <div className="banner-error">
            <AlertCircle size={18} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin}>
          {/* Identifiant (Email ou Téléphone) */}
          <div className="form-group">
            <label className="form-label">Email ou Numéro de téléphone</label>
            <div className="input-field-wrapper">
              <UserCheck size={18} className="input-icon" />
              <input
                type="text"
                className="input-field"
                placeholder="Ex : exemple@mail.com ou +22997000000"
                value={identifiant}
                onChange={(e) => setIdentifiant(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Mot de passe */}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label">Mot de passe</label>
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                style={{ background: 'transparent', border: 'none', color: 'var(--color-text-accent)', fontSize: '0.75rem', fontWeight: '600', cursor: 'pointer' }}
              >
                Mot de passe oublié ?
              </button>
            </div>
            <div className="input-field-wrapper" style={{ marginTop: '0.25rem' }}>
              <Lock size={18} className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                className="input-field"
                placeholder="Votre mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', display: 'flex' }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Bouton de connexion */}
          <button
            type="submit"
            disabled={loading}
            className="btn-secondary btn-full"
            style={{ marginTop: '0.75rem' }}
          >
            {loading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem' }}>
          <span style={{ color: 'var(--color-text-secondary)' }}>Pas encore membre ?</span>{' '}
          <button
            type="button"
            onClick={() => onNavigate('register')}
            style={{ background: 'transparent', border: 'none', color: 'var(--color-primary-light)', fontWeight: '700', cursor: 'pointer' }}
          >
            Créer un compte
          </button>
        </div>
      </div>

      {/* Modale Mot de passe oublié */}
      {showForgotModal && (
        <div className="modal-overlay" onClick={() => setShowForgotModal(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '700' }}>Réinitialisation du mot de passe</h3>
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>
            <p style={{ lineHeight: '1.6', marginBottom: '1.5rem', color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
              Pour des raisons de sécurité, veuillez contacter votre administrateur de groupe ou adresser une demande à support@tontinecollab.com pour réinitialiser votre accès.
            </p>
            <button
              type="button"
              onClick={() => setShowForgotModal(false)}
              className="btn-primary btn-full"
            >
              Compris
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginScreen;
