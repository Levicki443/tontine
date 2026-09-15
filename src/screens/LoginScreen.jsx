/**
 * ÉCRAN : CONNEXION & AUTHENTIFICATION 2FA (LoginScreen.jsx)
 * 
 * Permet la connexion avec Email/Téléphone et gère l'étape de vérification OTP 2FA.
 */

import React, { useState } from 'react';
import { LogIn, UserCheck, Lock, Eye, EyeOff, AlertCircle, KeyRound, ArrowRight } from 'lucide-react';
import BoutonRetour from '../components/BoutonRetour';
import { apiService, setAuthToken } from '../services/api';

export const LoginScreen = ({ onNavigate, onAuthSuccess }) => {
  const [identifiant, setIdentifiant] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // État 2FA
  const [require2FA, setRequire2FA] = useState(false);
  const [userId2FA, setUserId2FA] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [demoCode, setDemoCode] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

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

      if (response.require2FA) {
        setRequire2FA(true);
        setUserId2FA(response.userId);
        if (response.demoOtpCode) {
          setDemoCode(response.demoOtpCode);
        }
        return;
      }

      if (response.data && response.data.accessToken) {
        setAuthToken(response.data.accessToken);
        if (onAuthSuccess) onAuthSuccess(response.data.user);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Identifiants incorrects. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify2FA = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    if (!otpCode.trim() || otpCode.length < 6) {
      setErrorMsg('Veuillez saisir un code 2FA à 6 chiffres valide.');
      return;
    }

    setLoading(true);
    try {
      const res = await apiService.verify2FA(userId2FA, otpCode.trim());
      if (res.data && res.data.accessToken) {
        setAuthToken(res.data.accessToken);
        if (onAuthSuccess) onAuthSuccess(res.data.user);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Code 2FA invalide ou expiré.');
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
        <div style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-full)', background: 'var(--color-secondary-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto' }}>
          {require2FA ? <KeyRound size={26} color="var(--color-secondary-light)" /> : <LogIn size={26} color="var(--color-secondary-light)" />}
        </div>

        <h1 style={{ fontSize: '1.4rem', fontWeight: '800', textAlign: 'center', marginBottom: '0.3rem' }}>
          {require2FA ? 'Vérification de Sécurité 2FA' : 'Connexion Sécurisée'}
        </h1>
        <p style={{ textAlign: 'center', fontSize: '0.85rem', marginBottom: '1.5rem', color: 'var(--color-text-secondary)' }}>
          {require2FA ? 'Saisissez le code à 6 chiffres pour valider votre session.' : 'Accédez à vos cercles de tontine et suivez vos cotisations.'}
        </p>

        {errorMsg && <div className="banner-error"><AlertCircle size={18} /><span>{errorMsg}</span></div>}

        {require2FA ? (
          <form onSubmit={handleVerify2FA}>
            {demoCode && (
              <div style={{ padding: '0.65rem', background: 'var(--color-primary-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-primary-light)', marginBottom: '1rem', fontSize: '0.8rem', textAlign: 'center', color: 'var(--color-text-accent)' }}>
                Code de sécurité : <strong>{demoCode}</strong>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Code de confirmation (6 chiffres)</label>
              <div className="input-field-wrapper">
                <input
                  type="text"
                  maxLength={6}
                  className="input-field"
                  placeholder="Ex : 123456"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  style={{ textAlign: 'center', fontSize: '1.3rem', letterSpacing: '6px', fontWeight: '800' }}
                  required
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-secondary btn-full" style={{ marginTop: '0.75rem' }}>
              {loading ? 'Vérification...' : 'Valider la connexion'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Email ou Téléphone</label>
              <div className="input-field-wrapper">
                <UserCheck size={18} className="input-icon" />
                <input type="text" className="input-field" placeholder="exemple@mail.com ou +229..." value={identifiant} onChange={(e) => setIdentifiant(e.target.value)} required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Mot de passe</label>
              <div className="input-field-wrapper">
                <Lock size={18} className="input-icon" />
                <input type={showPassword ? 'text' : 'password'} className="input-field" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', display: 'flex' }}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-secondary btn-full" style={{ marginTop: '0.75rem' }}>
              {loading ? 'Connexion en cours...' : 'Se connecter'}
            </button>
          </form>
        )}

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem' }}>
          <span style={{ color: 'var(--color-text-secondary)' }}>Pas encore de compte ?</span>{' '}
          <button type="button" onClick={() => onNavigate('register')} style={{ background: 'transparent', border: 'none', color: 'var(--color-primary-light)', fontWeight: '700', cursor: 'pointer' }}>
            Créer un compte
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
