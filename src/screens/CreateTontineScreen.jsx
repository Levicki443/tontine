/**
 * ÉCRAN : CRÉATION DE TONTINE & RÈGLES AVANCÉES (CreateTontineScreen.jsx)
 * 
 * Permet de configurer le cercle, le montant fixe, la fréquence,
 * la méthode de tirage (aléatoire, ancienneté, besoin) et les pénalités de retard.
 */

import React, { useState } from 'react';
import { PlusCircle, Wallet, AlertCircle, Shuffle, ShieldCheck } from 'lucide-react';
import BoutonRetour from '../components/BoutonRetour';
import { tontineApiService } from '../services/tontineApi';

const FREQUENCES = [
  { id: 'hebdomadaire', label: 'Hebdomadaire' },
  { id: 'bimensuelle', label: 'Bimensuelle' },
  { id: 'mensuelle', label: 'Mensuelle' }
];

const METHODES_TIRAGE = [
  { id: 'aleatoire', label: 'Tirage Aléatoire', desc: 'Attribution équitable et transparente' },
  { id: 'anciennete', label: 'Ancienneté', desc: 'Selon l\'ordre d\'adhésion au groupe' },
  { id: 'besoin', label: 'Par Priorité', desc: 'Attribution selon l\'urgence validée' }
];

export const CreateTontineScreen = ({ onNavigate, onTontineCreated }) => {
  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');
  const [montantCotisation, setMontantCotisation] = useState('10000');
  const [frequence, setFrequence] = useState('mensuelle');
  const [nombreParticipantsMax, setNombreParticipantsMax] = useState('10');
  const [methodeTirage, setMethodeTirage] = useState('aleatoire');
  const [penaliteRetardActif, setPenaliteRetardActif] = useState(false);
  const [montantPenaliteParJour, setMontantPenaliteParJour] = useState('500');
  const [delaiGraceJours, setDelaiGraceJours] = useState('2');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const montantNum = Number(montantCotisation) || 0;
  const participantsNum = parseInt(nombreParticipantsMax, 10) || 0;
  const cagnotteEstimee = montantNum * participantsNum;

  const handleCreate = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    if (!titre.trim()) {
      setErrorMsg('Veuillez renseigner un nom pour votre tontine.');
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
        nombreParticipantsMax: participantsNum,
        methodeTirage,
        penaliteRetardActif,
        montantPenaliteParJour: Number(montantPenaliteParJour) || 500,
        delaiGraceJours: Number(delaiGraceJours) || 2
      });

      if (onTontineCreated) {
        onTontineCreated(response.data ? response.data.tontine : null);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Erreur lors de la création du cercle.');
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

        <h1 style={{ fontSize: '1.4rem', fontWeight: '800', textAlign: 'center', marginBottom: '0.4rem' }}>
          Créer un Cercle d&apos;Épargne
        </h1>
        <p style={{ textAlign: 'center', fontSize: '0.85rem', marginBottom: '1.5rem', color: 'var(--color-text-secondary)' }}>
          Définissez les règles du groupe, le tirage et la sécurité collective.
        </p>

        {errorMsg && (
          <div className="banner-error">
            <AlertCircle size={18} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleCreate}>
          {/* Titre & Description */}
          <div className="form-group">
            <label className="form-label">Titre du groupe</label>
            <div className="input-field-wrapper">
              <input type="text" className="input-field" placeholder="Ex : Tontine Projets 2026" value={titre} onChange={(e) => setTitre(e.target.value)} required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description / Objectif</label>
            <div className="input-field-wrapper">
              <input type="text" className="input-field" placeholder="Ex : Épargne solidaire pour investissements" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
          </div>

          {/* Montant & Participants */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div className="form-group">
              <label className="form-label">Cotisation (FCFA)</label>
              <div className="input-field-wrapper">
                <input type="number" className="input-field" value={montantCotisation} onChange={(e) => setMontantCotisation(e.target.value)} min="500" required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Participants max</label>
              <div className="input-field-wrapper">
                <input type="number" className="input-field" value={nombreParticipantsMax} onChange={(e) => setNombreParticipantsMax(e.target.value)} min="2" max="100" required />
              </div>
            </div>
          </div>

          {/* Fréquence */}
          <div className="form-group">
            <label className="form-label">Fréquence des versements</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
              {FREQUENCES.map((freq) => (
                <button
                  key={freq.id}
                  type="button"
                  onClick={() => setFrequence(freq.id)}
                  style={{
                    padding: '0.6rem 0.25rem',
                    borderRadius: 'var(--radius-md)',
                    background: frequence === freq.id ? 'var(--color-primary-subtle)' : 'var(--color-bg-input)',
                    border: `1px solid ${frequence === freq.id ? 'var(--color-primary-light)' : 'var(--color-border-light)'}`,
                    color: frequence === freq.id ? 'var(--color-text-accent)' : 'var(--color-text-secondary)',
                    fontWeight: frequence === freq.id ? '700' : '500',
                    fontSize: '0.8rem',
                    cursor: 'pointer'
                  }}
                >
                  {freq.label}
                </button>
              ))}
            </div>
          </div>

          {/* Méthode de tirage */}
          <div className="form-group">
            <label className="form-label">Ordre de tirage des bénéficiaires</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {METHODES_TIRAGE.map((m) => (
                <div
                  key={m.id}
                  onClick={() => setMethodeTirage(m.id)}
                  style={{
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    background: methodeTirage === m.id ? 'var(--color-secondary-subtle)' : 'var(--color-bg-surface)',
                    border: `1px solid ${methodeTirage === m.id ? 'var(--color-secondary-light)' : 'var(--color-border-light)'}`,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: '700', color: methodeTirage === m.id ? 'var(--color-secondary-light)' : 'var(--color-text-primary)' }}>
                      {m.label}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{m.desc}</div>
                  </div>
                  {methodeTirage === m.id && <Shuffle size={16} color="var(--color-secondary-light)" />}
                </div>
              ))}
            </div>
          </div>

          {/* Pénalités de retard */}
          <div className="form-group" style={{ background: 'var(--color-bg-surface)', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-light)' }}>
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '700' }}>
              <span>Pénalités en cas de retard</span>
              <input type="checkbox" checked={penaliteRetardActif} onChange={(e) => setPenaliteRetardActif(e.target.checked)} />
            </label>

            {penaliteRetardActif && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.75rem' }}>
                <div>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>FCFA / jour de retard</label>
                  <input type="number" className="input-field" value={montantPenaliteParJour} onChange={(e) => setMontantPenaliteParJour(e.target.value)} min="100" />
                </div>
                <div>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Délai de grâce (jours)</label>
                  <input type="number" className="input-field" value={delaiGraceJours} onChange={(e) => setDelaiGraceJours(e.target.value)} min="0" />
                </div>
              </div>
            )}
          </div>

          {/* Cagnotte */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', background: 'var(--color-bg-surface)', border: '1px solid var(--color-border-light)', borderRadius: 'var(--radius-lg)', padding: '0.85rem', margin: '1rem 0' }}>
            <Wallet size={24} color="var(--color-secondary-light)" />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Cagnotte brute estimée par tour :</div>
              <div style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--color-secondary-light)' }}>
                {cagnotteEstimee.toLocaleString('fr-FR')} FCFA
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary btn-full">
            {loading ? 'Création en cours...' : 'Lancer le cercle de tontine'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateTontineScreen;
