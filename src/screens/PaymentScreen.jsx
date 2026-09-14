import React, { useState } from 'react';
import { Wallet, Smartphone, CreditCard, CheckCircle, AlertCircle } from 'lucide-react';
import BoutonRetour from '../components/BoutonRetour';
import { tontineApiService } from '../services/tontineApi';

const OPERATEURS = [
  { id: 'MTN Mobile Money', label: 'MTN MoMo', icon: Smartphone },
  { id: 'Moov Money', label: 'Moov Money', icon: Smartphone },
  { id: 'Orange Money / Wave', label: 'Wave / Orange', icon: Smartphone },
  { id: 'Carte Bancaire', label: 'Carte Bancaire', icon: CreditCard }
];

export const PaymentScreen = ({ tontine, onNavigate, onPaymentCompleted }) => {
  const montantDefaut = tontine ? tontine.montantCotisation.toString() : '10000';
  const [montant, setMontant] = useState(montantDefaut);
  const [selectedOperateur, setSelectedOperateur] = useState('MTN Mobile Money');
  const [telephonePaiement, setTelephonePaiement] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successModal, setSuccessModal] = useState(false);
  const [transactionRef, setTransactionRef] = useState('');

  const handlePay = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    const parsedMontant = Number(montant);
    if (!parsedMontant || parsedMontant <= 0) {
      setErrorMsg('Veuillez spécifier un montant valide pour votre cotisation.');
      return;
    }

    setLoading(true);
    try {
      const response = await tontineApiService.createPayment({
        tontineId: tontine ? tontine._id : null,
        montant: parsedMontant,
        operateurMobile: selectedOperateur,
        numeroTelephonePaiement: telephonePaiement
      });

      const ref = response.data && response.data.payment
        ? response.data.payment.referenceTransaction
        : `TON-${Date.now().toString().slice(-6)}`;

      setTransactionRef(ref);
      setSuccessModal(true);
    } catch (err) {
      setErrorMsg(err.message || 'Erreur lors de la validation du paiement.');
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
          <Wallet size={28} color="var(--color-secondary-light)" />
        </div>

        <h1 style={{ fontSize: '1.5rem', fontWeight: '800', textAlign: 'center', marginBottom: '0.4rem' }}>
          Effectuer une Cotisation
        </h1>
        <p style={{ textAlign: 'center', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
          {tontine ? `Tontine : ${tontine.titre}` : 'Versement sécurisé de votre part'}
        </p>

        {errorMsg && (
          <div className="banner-error">
            <AlertCircle size={18} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handlePay}>
          {/* Montant */}
          <div className="form-group">
            <label className="form-label">Montant à verser (FCFA)</label>
            <div className="input-field-wrapper">
              <input
                type="number"
                className="input-field"
                placeholder="Ex : 10000"
                value={montant}
                onChange={(e) => setMontant(e.target.value)}
                min="100"
                required
              />
            </div>
          </div>

          {/* Moyen de Paiement */}
          <div className="form-group">
            <label className="form-label">Moyen de paiement</label>
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
                      padding: '0.75rem 0.5rem',
                      borderRadius: 'var(--radius-md)',
                      background: isSelected ? 'var(--color-primary-subtle)' : 'var(--color-bg-input)',
                      border: `1px solid ${isSelected ? 'var(--color-primary-light)' : 'var(--color-border-light)'}`,
                      color: isSelected ? 'var(--color-text-accent)' : 'var(--color-text-secondary)',
                      fontWeight: isSelected ? '700' : '500',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <Icon size={16} />
                    <span>{op.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Numéro Mobile Money */}
          {selectedOperateur !== 'Carte Bancaire' && (
            <div className="form-group">
              <label className="form-label">Numéro de compte Mobile Money</label>
              <div className="input-field-wrapper">
                <input
                  type="tel"
                  className="input-field"
                  placeholder="Ex : +229 97 00 00 00"
                  value={telephonePaiement}
                  onChange={(e) => setTelephonePaiement(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          {/* Bouton de confirmation */}
          <button
            type="submit"
            disabled={loading}
            className="btn-secondary btn-full"
            style={{ marginTop: '1rem' }}
          >
            {loading ? 'Validation en cours...' : `Confirmer le versement de ${Number(montant || 0).toLocaleString('fr-FR')} FCFA`}
          </button>
        </form>
      </div>

      {/* Modale de Succès */}
      {successModal && (
        <div className="modal-overlay">
          <div className="modal-dialog" style={{ textAlign: 'center' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--color-status-success-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem auto'
              }}
            >
              <CheckCircle size={32} color="var(--color-status-success)" />
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.25rem' }}>
              Cotisation Validée !
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '1.25rem' }}>
              Votre versement a été enregistré avec succès.
            </p>

            <div
              style={{
                background: 'var(--color-bg-surface)',
                border: '1px solid var(--color-border-light)',
                borderRadius: 'var(--radius-md)',
                padding: '0.875rem',
                marginBottom: '1.5rem'
              }}
            >
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>
                Référence de transaction :
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--color-secondary-light)', letterSpacing: '0.5px' }}>
                {transactionRef}
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setSuccessModal(false);
                if (onPaymentCompleted) onPaymentCompleted();
                onNavigate('dashboard');
              }}
              className="btn-primary btn-full"
            >
              Retourner au tableau de bord
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentScreen;
