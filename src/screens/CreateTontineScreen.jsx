import React, { useState } from 'react';
import { PlusCircle, Wallet, AlertCircle } from 'lucide-react';
import BoutonRetour from '../components/BoutonRetour';
import { tontineApiService } from '../services/tontineApi';

const FREQUENCES = [
  { id: 'hebdomadaire', label: 'Hebdomadaire' },
  { id: 'bimensuelle', label: 'Bimensuelle' },
  { id: 'mensuelle', label: 'Mensuelle' }
];

export const CreateTontineScreen = ({ onNavigate, onTontineCreated }) => {
  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');
  const [montantCotisation, setMontantCotisation] = useState('10000');
  const [frequence, setFrequence] = useState('mensuelle');
  const [nombreParticipantsMax, setNombreParticipantsMax] = useState('10');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const montantNum = Number(montantCotisation) || 0;
  const participantsNum = parseInt(nombreParticipantsMax, 10) || 0;
  const cagnotteEstimee = montantNum * participantsNum;

  const handleCreate = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    if (!titre.trim()) {
      setErrorMsg('Veuillez renseigner un titre pour votre tontine.');
      return;
    }

    if (montantNum < 500) {
      setErrorMsg('Le montant de cotisation doit être d\'au moins 500 FCFA.');
      return;
    }

    if (participantsNum < 2 || participantsNum > 100) {
      setErrorMsg('Le nombre de participants doit être compris entre 2 et 100.');
      return;
    }

    setLoading(true);
    try {
      const response = await tontineApiService.createTontine({
        titre: titre.trim(),
        description: description.trim(),
        montantCotisation: montantNum,
        frequence,
        nombreParticipantsMax: participantsNum
      });

      if (onTontineCreated) {
        onTontineCreated(response.data ? response.data.tontine : null);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Erreur lors de la création du cercle d\'épargne.');
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
          <PlusCircle size={28} color="var(--color-secondary-light)" />
        </div>

        <h1 style={{ fontSize: '1.5rem', fontWeight: '800', textAlign: 'center', marginBottom: '0.4rem' }}>
          Créer une Nouvelle Tontine
        </h1>
        <p style={{ textAlign: 'center', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
          Configurez votre cercle d&apos;épargne et invitez vos proches ou collègues.
        </p>

        {errorMsg && (
          <div className="banner-error">
            <AlertCircle size={18} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleCreate}>
          {/* Titre */}
          <div className="form-group">
            <label className="form-label">Nom ou Titre du groupe</label>
            <div className="input-field-wrapper">
              <input
                type="text"
                className="input-field"
                placeholder="Ex : Tontine Projets 2026"
                value={titre}
                onChange={(e) => setTitre(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Description / Objectif (optionnel)</label>
            <div className="input-field-wrapper">
              <input
                type="text"
                className="input-field"
                placeholder="Ex : Financement de matériel professionnel"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          {/* Montant de cotisation */}
          <div className="form-group">
            <label className="form-label">Montant de la cotisation (FCFA)</label>
            <div className="input-field-wrapper">
              <input
                type="number"
                className="input-field"
                placeholder="Ex : 10000"
                value={montantCotisation}
                onChange={(e) => setMontantCotisation(e.target.value)}
                min="500"
                required
              />
            </div>
          </div>

          {/* Fréquence */}
          <div className="form-group">
            <label className="form-label">Fréquence des versements</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
              {FREQUENCES.map((freq) => {
                const isSelected = frequence === freq.id;
                return (
                  <button
                    key={freq.id}
                    type="button"
                    onClick={() => setFrequence(freq.id)}
                    style={{
                      padding: '0.65rem 0.25rem',
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
                    {freq.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Nombre de participants */}
          <div className="form-group">
            <label className="form-label">Nombre de participants maximum</label>
            <div className="input-field-wrapper">
              <input
                type="number"
                className="input-field"
                placeholder="Ex : 10"
                value={nombreParticipantsMax}
                onChange={(e) => setNombreParticipantsMax(e.target.value)}
                min="2"
                max="100"
                required
              />
            </div>
          </div>

          {/* Aperçu de la cagnotte */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              background: 'var(--color-bg-surface)',
              border: '1px solid var(--color-border-light)',
              borderRadius: 'var(--radius-lg)',
              padding: '1rem',
              margin: '1.25rem 0'
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--color-secondary-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Wallet size={22} color="var(--color-secondary-light)" />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Cagnotte estimée par cycle :</div>
              <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--color-secondary-light)' }}>
                {cagnotteEstimee.toLocaleString('fr-FR')} FCFA
              </div>
            </div>
          </div>

          {/* Bouton de validation */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary btn-full"
          >
            {loading ? 'Création en cours...' : 'Lancer la tontine'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateTontineScreen;
