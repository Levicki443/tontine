/**
 * MODALE CALENDRIER DES CYCLES & TRANSPARENCE FINANCIÈRE (CycleCalendarModal.jsx)
 * 
 * Affiche le détail des tours, les échéances calculées, les bénéficiaires prévus,
 * le solde du fonds commun et les contributions cumulées par membre.
 */

import React, { useState, useEffect } from 'react';
import { X, Calendar, ShieldCheck, CheckCircle, Clock, AlertTriangle, UserCheck } from 'lucide-react';
import { tontineApiService } from '../services/tontineApi';

export const CycleCalendarModal = ({ tontineId, onClose }) => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await tontineApiService.getFinancialSummary(tontineId);
        if (res && res.data) {
          setSummary(res.data);
        }
      } catch (err) {
        console.error('[CycleCalendarModal] Erreur chargement :', err);
      } finally {
        setLoading(false);
      }
    };

    if (tontineId) fetchSummary();
  }, [tontineId]);

  if (!tontineId) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-dialog"
        style={{ maxWidth: '650px', maxHeight: '90vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Entête */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={22} color="var(--color-secondary-light)" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800' }}>Calendrier des Cycles & Transparence</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--color-secondary-light)' }}>
            Calcul de la synthèse financière en temps réel...
          </div>
        ) : summary ? (
          <div>
            {/* 1. Résumé du Fonds Commun */}
            <div
              className="glass-card"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                padding: '1rem',
                gap: '0.75rem',
                marginBottom: '1.25rem',
                textAlign: 'center'
              }}
            >
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Fonds Commun</div>
                <div style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--color-status-success)' }}>
                  {summary.soldeFondsCommun.toLocaleString('fr-FR')} FCFA
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Pénalités perçues</div>
                <div style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--color-status-warning)' }}>
                  {summary.totalPenalites.toLocaleString('fr-FR')} FCFA
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Méthode de Tirage</div>
                <div style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--color-text-accent)' }}>
                  {summary.tontine.methodeTirage === 'aleatoire' ? 'Aléatoire' : 'Ancienneté'}
                </div>
              </div>
            </div>

            {/* 2. Calendrier des Tours */}
            <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '0.75rem' }}>
              Échéancier des Tours & Bénéficiaires
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.5rem' }}>
              {(summary.tontine.calendrierTours || []).length === 0 ? (
                <div className="surface-box" style={{ textAlign: 'center', padding: '1.5rem' }}>
                  Le calendrier sera généré dès que le groupe sera complet.
                </div>
              ) : (
                summary.tontine.calendrierTours.map((tour) => {
                  const isCurrent = tour.numeroTour === summary.tontine.tourActuel;
                  return (
                    <div
                      key={tour.numeroTour}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.75rem 1rem',
                        background: isCurrent ? 'var(--color-primary-subtle)' : 'var(--color-bg-surface)',
                        border: `1px solid ${isCurrent ? 'var(--color-primary-light)' : 'var(--color-border-light)'}`,
                        borderRadius: 'var(--radius-md)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: 'var(--radius-full)',
                            background: isCurrent ? 'var(--color-primary-light)' : 'var(--color-bg-card)',
                            color: 'var(--color-text-primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.8rem',
                            fontWeight: '800'
                          }}
                        >
                          {tour.numeroTour}
                        </div>
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: '700' }}>
                            {tour.beneficiairePrevu ? tour.beneficiairePrevu.nom : 'En attente'}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                            Échéance : {new Date(tour.dateEcheance).toLocaleDateString('fr-FR')}
                          </div>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--color-secondary-light)' }}>
                          {tour.montantCagnotte.toLocaleString('fr-FR')} FCFA
                        </div>
                        <span
                          style={{
                            fontSize: '0.7rem',
                            color: tour.estTermine ? 'var(--color-status-success)' : isCurrent ? 'var(--color-text-accent)' : 'var(--color-text-muted)'
                          }}
                        >
                          {tour.estTermine ? 'Terminé' : isCurrent ? 'Tour en cours' : 'À venir'}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* 3. Suivi individuel des cotisations */}
            <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '0.75rem' }}>
              Statut des Versements par Membre
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {(summary.contributionsParMembre || []).map((m, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.65rem 0.85rem',
                    background: 'var(--color-bg-card)',
                    border: '1px solid var(--color-border-light)',
                    borderRadius: 'var(--radius-md)'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span>{m.user ? m.user.nom : 'Membre'}</span>
                      {m.roleDansGroupe === 'administrateur' && (
                        <span style={{ fontSize: '0.65rem', background: 'var(--color-primary-subtle)', color: 'var(--color-text-accent)', padding: '0.1rem 0.4rem', borderRadius: 'var(--radius-sm)' }}>
                          Admin
                        </span>
                      )}
                      {m.roleDansGroupe === 'tresorier' && (
                        <span style={{ fontSize: '0.65rem', background: 'var(--color-secondary-subtle)', color: 'var(--color-secondary-light)', padding: '0.1rem 0.4rem', borderRadius: 'var(--radius-sm)' }}>
                          Trésorier
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                      Ordre du tour : #{m.ordreTour} | {m.nombreVersements} versement(s)
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: '800' }}>
                      {m.montantPaye.toLocaleString('fr-FR')} FCFA
                    </div>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: '700',
                        color: m.estAJour ? 'var(--color-status-success)' : 'var(--color-status-danger)'
                      }}
                    >
                      {m.estAJour ? 'À jour' : 'En attente'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem' }}>Informations indisponibles.</div>
        )}
      </div>
    </div>
  );
};

export default CycleCalendarModal;
