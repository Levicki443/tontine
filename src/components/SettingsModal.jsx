/**
 * MODALE DES PARAMÈTRES UTILISATEUR & DU PROFIL (SettingsModal.jsx)
 * 
 * Permet à l'utilisateur de modifier son nom, email, téléphone,
 * changer son mot de passe et gérer ses préférences de compte.
 */

import React, { useState } from 'react';
import { X, User, Mail, Phone, Lock, Eye, EyeOff, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { apiService } from '../services/api';

export const SettingsModal = ({ user, onClose, onUserUpdated }) => {
  const [activeTab, setActiveTab] = useState('profile');

  // Formulaire Profil
  const [nom, setNom] = useState(user?.nom || '');
  const [email, setEmail] = useState(user?.email || '');
  const [telephone, setTelephone] = useState(user?.telephone || '');
  const [savingProfile, setSavingProfile] = useState(false);

  // Formulaire Mot de passe
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  // Messages de retour
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!nom.trim() || !email.trim() || !telephone.trim()) {
      setErrorMsg('Veuillez remplir l\'ensemble des champs du profil.');
      return;
    }

    setSavingProfile(true);
    try {
      const res = await apiService.updateProfile({
        nom: nom.trim(),
        email: email.trim(),
        telephone: telephone.trim()
      });

      if (res && res.data) {
        setSuccessMsg('Votre profil a été mis à jour avec succès.');
        if (onUserUpdated) onUserUpdated(res.data.user);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Erreur lors de la mise à jour du profil.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setErrorMsg('Veuillez renseigner tous les champs du mot de passe.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setErrorMsg('Le nouveau mot de passe et sa confirmation ne correspondent pas.');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg('Le nouveau mot de passe doit comporter au moins 6 caractères.');
      return;
    }

    setSavingPassword(true);
    try {
      await apiService.updatePassword(currentPassword, newPassword, confirmNewPassword);
      setSuccessMsg('Votre mot de passe a été modifié avec succès.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err) {
      setErrorMsg(err.message || 'Erreur lors du changement de mot de passe.');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-dialog"
        style={{ maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Entête */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={22} color="var(--color-primary-light)" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800' }}>Paramètres du Compte</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Onglets */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <button
            type="button"
            onClick={() => { setActiveTab('profile'); setErrorMsg(''); setSuccessMsg(''); }}
            className={activeTab === 'profile' ? 'btn-primary' : 'btn-outline'}
            style={{ flex: 1, padding: '0.5rem', fontSize: '0.85rem' }}
          >
            Mon Profil
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('security'); setErrorMsg(''); setSuccessMsg(''); }}
            className={activeTab === 'security' ? 'btn-primary' : 'btn-outline'}
            style={{ flex: 1, padding: '0.5rem', fontSize: '0.85rem' }}
          >
            Mot de passe
          </button>
        </div>

        {errorMsg && (
          <div className="banner-error" style={{ marginBottom: '1rem' }}>
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div
            className="banner-error"
            style={{
              background: 'var(--color-status-success-subtle)',
              borderColor: 'var(--color-status-success)',
              color: 'var(--color-status-success)',
              marginBottom: '1rem'
            }}
          >
            <CheckCircle2 size={16} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* 1. Onglet Profil */}
        {activeTab === 'profile' && (
          <form onSubmit={handleUpdateProfile}>
            <div className="form-group">
              <label className="form-label">Nom complet / Nom d&apos;utilisateur</label>
              <div className="input-field-wrapper">
                <User size={18} className="input-icon" />
                <input
                  type="text"
                  className="input-field"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Adresse Email</label>
              <div className="input-field-wrapper">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  className="input-field"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Numéro de Téléphone</label>
              <div className="input-field-wrapper">
                <Phone size={18} className="input-icon" />
                <input
                  type="tel"
                  className="input-field"
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={savingProfile}
              className="btn-primary btn-full"
              style={{ marginTop: '0.75rem' }}
            >
              {savingProfile ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </button>
          </form>
        )}

        {/* 2. Onglet Mot de passe */}
        {activeTab === 'security' && (
          <form onSubmit={handleUpdatePassword}>
            <div className="form-group">
              <label className="form-label">Mot de passe actuel</label>
              <div className="input-field-wrapper">
                <Lock size={18} className="input-icon" />
                <input
                  type={showCurrentPw ? 'text' : 'password'}
                  className="input-field"
                  placeholder="Votre mot de passe actuel"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPw(!showCurrentPw)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', display: 'flex' }}
                >
                  {showCurrentPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Nouveau mot de passe</label>
              <div className="input-field-wrapper">
                <Lock size={18} className="input-icon" />
                <input
                  type={showNewPw ? 'text' : 'password'}
                  className="input-field"
                  placeholder="Au moins 6 caractères"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPw(!showNewPw)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', display: 'flex' }}
                >
                  {showNewPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Confirmer le nouveau mot de passe</label>
              <div className="input-field-wrapper">
                <Lock size={18} className="input-icon" />
                <input
                  type={showNewPw ? 'text' : 'password'}
                  className="input-field"
                  placeholder="Répétez le nouveau mot de passe"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={savingPassword}
              className="btn-secondary btn-full"
              style={{ marginTop: '0.75rem' }}
            >
              {savingPassword ? 'Modification...' : 'Changer mon mot de passe'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SettingsModal;
