/**
 * MODALE DE GESTION & SIGNALEMENT DES LITIGES (DisputeModal.jsx)
 * 
 * Permet aux membres de soumettre une contestation et aux administrateurs / trésoriers
 * de documenter l'arbitrage et la résolution du litige.
 */

import React, { useState, useEffect } from 'react';
import { X, AlertCircle, ShieldAlert, CheckCircle2, MessageSquare } from 'lucide-react';
import { tontineApiService } from '../services/tontineApi';

const MOTIFS = [
  { id: 'paiement_non_recu', label: 'Paiement non reçu / non comptabilisé' },
  { id: 'retard_excessif', label: 'Retard de cotisation abusif' },
  { id: 'non_respect_ordre_tour', label: 'Non-respect de l\'ordre de tour' },
  { id: 'fraude_suspectee', label: 'Suspicion d\'irrégularité ou de fraude' },
  { id: 'autre', label: 'Autre motif' }
];

export const DisputeModal = ({ tontineId, user, onClose }) => {
  const [tab, setTab] = useState('list');
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Formulaire
  const [motif, setMotif] = useState('paiement_non_recu');
  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Résolution
  const [arbitratingId, setArbitratingId] = useState(null);
  const [decisionText, setDecisionText] = useState('');

  const loadDisputes = async () => {
    setLoading(true);
    try {
      const res = await tontineApiService.getTontineDisputes(tontineId);
      if (res && res.data) {
        setDisputes(res.data.disputes || []);
      }
    } catch {
      // Ignorer
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tontineId) loadDisputes();
  }, [tontineId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    if (!titre.trim() || !description.trim()) {
      setErrorMsg('Veuillez remplir le titre et la description.');
      return;
    }

    setSubmitting(true);
    try {
      await tontineApiService.createDispute({
        tontineId,
        motif,
        titre: titre.trim(),
        description: description.trim()
      });
      setSuccessMsg('Votre litige a été déposé et sera analysé par l\'administration.');
      setTitre('');
      setDescription('');
      loadDisputes();
      setTimeout(() => setTab('list'), 1200);
    } catch (err) {
      setErrorMsg(err.message || 'Erreur lors de l\'enregistrement.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResolve = async (disputeId, statut) => {
    if (!decisionText.trim()) return;
    try {
      await tontineApiService.resolveDispute(disputeId, {
        decisionResolution: decisionText.trim(),
        statut
      });
      setArbitratingId(null);
      setDecisionText('');
      loadDisputes();
    } catch (err) {
      setErrorMsg(err.message || 'Erreur lors de l\'arbitrage.');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" style={{ maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldAlert size={22} color="var(--color-status-warning)" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800' }}>Espace Litiges & Arbitrage</h3>
          </div>
          <button type="button" onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Navigation Onglets */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <button
            type="button"
            onClick={() => setTab('list')}
            className={tab === 'list' ? 'btn-primary' : 'btn-outline'}
            style={{ flex: 1, padding: '0.5rem' }}
          >
            Litiges du Groupe ({disputes.length})
          </button>
          <button
            type="button"
            onClick={() => setTab('new')}
            className={tab === 'new' ? 'btn-primary' : 'btn-outline'}
            style={{ flex: 1, padding: '0.5rem' }}
          >
            Signaler un Litige
          </button>
        </div>

        {errorMsg && <div className="banner-error" style={{ marginBottom: '1rem' }}><AlertCircle size={16} /><span>{errorMsg}</span></div>}
        {successMsg && <div className="banner-error" style={{ background: 'var(--color-status-success-subtle)', borderColor: 'var(--color-status-success)', color: 'var(--color-status-success)', marginBottom: '1rem' }}><CheckCircle2 size={16} /><span>{successMsg}</span></div>}

        {tab === 'new' && (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Motif du litige</label>
              <div className="input-field-wrapper">
                <select className="input-field" value={motif} onChange={(e) => setMotif(e.target.value)}>
                  {MOTIFS.map((m) => (
                    <option key={m.id} value={m.id}>{m.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Titre concis du problème</label>
              <div className="input-field-wrapper">
                <input type="text" className="input-field" placeholder="Ex : Retard versement Tour 2" value={titre} onChange={(e) => setTitre(e.target.value)} required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description détaillée des faits</label>
              <div className="input-field-wrapper">
                <textarea className="input-field" rows={4} placeholder="Détaillez les dates, montants et faits..." value={description} onChange={(e) => setDescription(e.target.value)} required />
              </div>
            </div>

            <button type="submit" disabled={submitting} className="btn-secondary btn-full" style={{ marginTop: '0.75rem' }}>
              {submitting ? 'Envoi en cours...' : 'Soumettre le litige'}
            </button>
          </form>
        )}

        {tab === 'list' && (
          <div>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>Chargement des litiges...</div>
            ) : disputes.length === 0 ? (
              <div className="surface-box" style={{ textAlign: 'center', padding: '2rem' }}>
                <CheckCircle2 size={32} color="var(--color-status-success)" style={{ margin: '0 auto 0.5rem auto' }} />
                <p style={{ fontSize: '0.9rem' }}>Aucun litige signalé dans ce groupe.</p>
              </div>
            ) : (
              disputes.map((d) => (
                <div key={d._id} className="glass-card" style={{ marginBottom: '0.85rem', padding: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <div style={{ fontSize: '0.95rem', fontWeight: '800' }}>{d.titre}</div>
                    <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-full)', background: d.statut === 'resolu' ? 'var(--color-status-success-subtle)' : 'var(--color-status-warning-subtle)', color: d.statut === 'resolu' ? 'var(--color-status-success)' : 'var(--color-status-warning)' }}>
                      {d.statut}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.825rem', color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>{d.description}</p>
                  <div style={{ fontSize: '0.725rem', color: 'var(--color-text-muted)' }}>
                    Réf : {d.referenceLitige} | Par : {d.declarant ? d.declarant.nom : 'Membre'} - {new Date(d.createdAt).toLocaleDateString('fr-FR')}
                  </div>

                  {d.decisionResolution && (
                    <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: 'var(--color-bg-surface)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem' }}>
                      <strong>Décision arbitrale :</strong> {d.decisionResolution}
                    </div>
                  )}

                  {d.statut === 'ouvert' && (user?.role === 'administrateur' || user?.role === 'tresorier') && (
                    <div style={{ marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid var(--color-border-light)' }}>
                      {arbitratingId === d._id ? (
                        <div>
                          <input type="text" className="input-field" placeholder="Motivation de la décision..." value={decisionText} onChange={(e) => setDecisionText(e.target.value)} style={{ marginBottom: '0.5rem' }} />
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button type="button" onClick={() => handleResolve(d._id, 'resolu')} className="btn-primary" style={{ flex: 1, padding: '0.35rem' }}>Résoudre</button>
                            <button type="button" onClick={() => handleResolve(d._id, 'rejete')} className="btn-outline" style={{ flex: 1, padding: '0.35rem' }}>Rejeter</button>
                          </div>
                        </div>
                      ) : (
                        <button type="button" onClick={() => setArbitratingId(d._id)} className="btn-outline" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}>
                          Arbitrer ce litige
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DisputeModal;
