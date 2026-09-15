/**
 * ÉCRAN : VERSEMENT DE COTISATION & PREUVE (PaymentScreen.jsx)
 * 
 * Supporte Orange Money, Wave, MTN MoMo, Moov Money, l'upload de reçus,
 * le calcul des pénalités et la mise en file d'attente hors-ligne.
 */

import React, { useState } from 'react';
import { Wallet, Smartphone, CreditCard, CheckCircle, AlertCircle, UploadCloud, FileCheck } from 'lucide-react';
import BoutonRetour from '../components/BoutonRetour';
import { tontineApiService } from '../services/tontineApi';
import { isOnline, enqueueOfflineAction } from '../services/offlineSync';

const OPERATEURS = [
  { id: 'Wave', label: 'Wave', icon: Smartphone },
  { id: 'Orange Money', label: 'Orange Money', icon: Smartphone },
  { id: 'MTN Mobile Money', label: 'MTN MoMo', icon: Smartphone },
  { id: 'Moov Money', label: 'Moov Money', icon: Smartphone },
  { id: 'Carte Bancaire', label: 'Carte Bancaire', icon: CreditCard }
];

export const PaymentScreen = ({ tontine, onNavigate, onPaymentCompleted }) => {
  const montantDefaut = tontine ? tontine.montantCotisation.toString() : '10000';
  const [montant, setMontant] = useState(montantDefaut);
  const [selectedOperateur, setSelectedOperateur] = useState('Wave');
  const [telephonePaiement, setTelephonePaiement] = useState('');
  const [recuBase64, setRecuBase64] = useState('');
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successModal, setSuccessModal] = useState(false);
  const [transactionRef, setTransactionRef] = useState('');
  const [isOfflineSaved, setIsOfflineSaved] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setRecuBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePay = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    const parsedMontant = Number(montant);
    if (!parsedMontant || parsedMontant <= 0) {
      setErrorMsg('Veuillez spécifier un montant valide pour votre cotisation.');
      return;
    }

    const paymentPayload = {
      tontineId: tontine ? tontine._id : null,
      montant: parsedMontant,
      operateurMobile: selectedOperateur,
      numeroTelephonePaiement: telephonePaiement,
      recuPreuvePaiement: recuBase64,
      numeroTour: tontine?.tourActuel || 1
    };

    // Mode hors-ligne : stockage local sécurisé
    if (!isOnline()) {
      const offlineItem = enqueueOfflineAction('payment', paymentPayload);
      setTransactionRef(offlineItem.id);
      setIsOfflineSaved(true);
      setSuccessModal(true);
      return;
    }

    setLoading(true);
    try {
      const response = await tontineApiService.createPayment(paymentPayload);
      const ref = response.data?.payment?.referenceTransaction || `TON-${Date.now().toString().slice(-6)}`;
      setTransactionRef(ref);
      setIsOfflineSaved(false);
      setSuccessModal(true);
    } catch (err) {
      if (err.message.includes('hors-ligne') || err.message.includes('indisponible')) {
        const offlineItem = enqueueOfflineAction('payment', paymentPayload);
        setTransactionRef(offlineItem.id);
        setIsOfflineSaved(true);
        setSuccessModal(true);
      } else {
        setErrorMsg(err.message || 'Erreur lors de la validation du versement.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper page-wrapper-narrow">
      <div style={{ marginBottom: '1.5rem' }}>
        <BoutonRetour onPress={() => onNavigate('dashboard')} label="Retour au tableau de bord" />
      </div>

      <div className="glass-card">
        <div style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-full)', background: 'var(--color-secondary-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto' }}>
          <Wallet size={28} color="var(--color-secondary-light)" />
        </div>

        <h1 style={{ fontSize: '1.4rem', fontWeight: '800', textAlign: 'center', marginBottom: '0.3rem' }}>
          Effectuer une Cotisation
        </h1>
        <p style={{ textAlign: 'center', fontSize: '0.85rem', marginBottom: '1.5rem', color: 'var(--color-text-secondary)' }}>
          {tontine ? `Cercle : ${tontine.titre} (Tour #${tontine.tourActuel || 1})` : 'Paiement sécurisé'}
        </p>

        {errorMsg && <div className="banner-error"><AlertCircle size={18} /><span>{errorMsg}</span></div>}

        <form onSubmit={handlePay}>
          {/* Montant */}
          <div className="form-group">
            <label className="form-label">Montant à verser (FCFA)</label>
            <div className="input-field-wrapper">
              <input type="number" className="input-field" value={montant} onChange={(e) => setMontant(e.target.value)} min="100" required />
            </div>
          </div>

          {/* Opérateurs Mobile Money */}
          <div className="form-group">
            <label className="form-label">Opérateur Mobile Money / Paiement</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
              {OPERATEURS.map((op) => {
                const Icon = op.icon;
                const isSelected = selectedOperateur === op.id;
                return (
                  <button
                    key={op.id}
                    type="button"
                    onClick={() => setSelectedOperateur(op.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem',
                      padding: '0.65rem 0.5rem',
                      borderRadius: 'var(--radius-md)',
                      background: isSelected ? 'var(--color-primary-subtle)' : 'var(--color-bg-input)',
                      border: `1px solid ${isSelected ? 'var(--color-primary-light)' : 'var(--color-border-light)'}`,
                      color: isSelected ? 'var(--color-text-accent)' : 'var(--color-text-secondary)',
                      fontWeight: isSelected ? '700' : '500',
                      fontSize: '0.8rem',
                      cursor: 'pointer'
                    }}
                  >
                    <Icon size={16} />
                    <span>{op.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Numéro */}
          {selectedOperateur !== 'Carte Bancaire' && (
            <div className="form-group">
              <label className="form-label">Numéro Mobile Money débité</label>
              <div className="input-field-wrapper">
                <input type="tel" className="input-field" placeholder="Ex : +221 77 000 00 00" value={telephonePaiement} onChange={(e) => setTelephonePaiement(e.target.value)} required />
              </div>
            </div>
          )}

          {/* Upload de Preuve / Reçu */}
          <div className="form-group">
            <label className="form-label">Preuve de paiement / Reçu (optionnel)</label>
            <label
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem',
                padding: '1rem',
                border: '1px dashed var(--color-border-medium)',
                borderRadius: 'var(--radius-md)',
                background: 'var(--color-bg-surface)',
                cursor: 'pointer'
              }}
            >
              <input type="file" accept="image/*,.pdf" onChange={handleFileUpload} style={{ display: 'none' }} />
              {fileName ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-status-success)', fontSize: '0.85rem' }}>
                  <FileCheck size={18} />
                  <span>{fileName}</span>
                </div>
              ) : (
                <>
                  <UploadCloud size={22} color="var(--color-text-muted)" />
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                    Cliquez pour joindre une capture ou reçu
                  </span>
                </>
              )}
            </label>
          </div>

          <button type="submit" disabled={loading} className="btn-secondary btn-full" style={{ marginTop: '0.5rem' }}>
            {loading ? 'Validation en cours...' : `Confirmer le versement (${Number(montant || 0).toLocaleString('fr-FR')} FCFA)`}
          </button>
        </form>
      </div>

      {/* Modale Succès */}
      {successModal && (
        <div className="modal-overlay">
          <div className="modal-dialog" style={{ textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: 'var(--radius-full)', background: 'var(--color-status-success-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
              <CheckCircle size={32} color="var(--color-status-success)" />
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.25rem' }}>
              {isOfflineSaved ? 'Enregistré Hors-Ligne !' : 'Cotisation Validée !'}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '1.25rem' }}>
              {isOfflineSaved ? 'Votre versement sera synchronisé dès le retour du réseau internet.' : 'Votre cotisation a été enregistrée avec succès.'}
            </p>

            <div style={{ background: 'var(--color-bg-surface)', border: '1px solid var(--color-border-light)', borderRadius: 'var(--radius-md)', padding: '0.875rem', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Référence :</div>
              <div style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--color-secondary-light)' }}>{transactionRef}</div>
            </div>

            <button type="button" onClick={() => { setSuccessModal(false); if (onPaymentCompleted) onPaymentCompleted(); onNavigate('dashboard'); }} className="btn-primary btn-full">
              Retourner au tableau de bord
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentScreen;
