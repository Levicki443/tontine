import React, { useState } from 'react';
import { User, Mail, Phone, Lock, Eye, EyeOff, UserPlus, AlertCircle } from 'lucide-react';
import BoutonRetour from '../components/BoutonRetour';
import { apiService, setAuthToken } from '../services/api';

/**
 * ÉCRAN : INSCRIPTION (RegisterScreen.jsx)
 * Conforme à la Section 7.2 du Cahier des Charges.
 * Champs requis : Nom, Email, Téléphone, Mot de passe, Confirmation mot de passe.
 */
export const RegisterScreen = ({ onNavigate, onAuthSuccess }) => {
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleRegister = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    if (!nom.trim() || !email.trim() || !telephone.trim() || !password || !confirmPassword) {
      setErrorMsg('Veuillez remplir l\'intégralité des champs obligatoires.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Les deux mots de passe saisis ne sont pas identiques.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Le mot de passe doit comporter au moins 6 caractères.');
      return;
    }

    setLoading(true);
    try {
      const response = await apiService.register({
        nom: nom.trim(),
        email: email.trim(),
        telephone: telephone.trim(),
        password,
        confirmPassword
      });

      if (response.data && response.data.accessToken) {
        setAuthToken(response.data.accessToken);
        if (onAuthSuccess) {
          onAuthSuccess(response.data.user);
        }
      }
    } catch (err) {
      setErrorMsg(err.message || 'Échec de l\'inscription. Veuillez réessayer.');
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
            background: 'var(--color-primary-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem auto'
          }}
        >
          <UserPlus size={26} color="var(--color-primary-light)" />
        </div>

        <h1 style={{ fontSize: '1.5rem', fontWeight: '800', textAlign: 'center', marginBottom: '0.4rem' }}>
          Créer un compte
        </h1>
        <p style={{ textAlign: 'center', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
          Rejoignez la communauté de tontine collaborative en quelques secondes.
        </p>

        {errorMsg && (
          <div className="banner-error">
            <AlertCircle size={18} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleRegister}>
          {/* Nom complet */}
          <div className="form-group">
            <label className="form-label">Nom complet</label>
            <div className="input-field-wrapper">
              <User size={18} className="input-icon" />
              <input
                type="text"
                className="input-field"
                placeholder="Ex : Koffi Mensah"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label">Adresse Email</label>
            <div className="input-field-wrapper">
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                className="input-field"
                placeholder="Ex : exemple@domaine.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Téléphone */}
          <div className="form-group">
            <label className="form-label">Numéro de Téléphone</label>
            <div className="input-field-wrapper">
              <Phone size={18} className="input-icon" />
              <input
                type="tel"
                className="input-field"
                placeholder="Ex : +229 97 00 00 00"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Mot de passe */}
          <div className="form-group">
            <label className="form-label">Mot de passe</label>
            <div className="input-field-wrapper">
              <Lock size={18} className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                className="input-field"
                placeholder="Au moins 6 caractères"
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

          {/* Confirmation Mot de passe */}
          <div className="form-group">
            <label className="form-label">Confirmation du mot de passe</label>
            <div className="input-field-wrapper">
              <Lock size={18} className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                className="input-field"
                placeholder="Répétez votre mot de passe"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Bouton de soumission */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary btn-full"
            style={{ marginTop: '0.75rem' }}
          >
            {loading ? 'Création en cours...' : 'Créer mon compte'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem' }}>
          <span style={{ color: 'var(--color-text-secondary)' }}>Vous possédez déjà un compte ?</span>{' '}
          <button
            type="button"
            onClick={() => onNavigate('login')}
            style={{ background: 'transparent', border: 'none', color: 'var(--color-primary-light)', fontWeight: '700', cursor: 'pointer' }}
          >
            Se connecter
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterScreen;
