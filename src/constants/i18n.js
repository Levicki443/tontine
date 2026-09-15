/**
 * MODULE D'INTERNATIONALISATION & MULTILINGUE (i18n.js)
 * 
 * Supporte le Français, l'Anglais et des langues locales (Wolof, Bambara, Fon).
 * Fournit un dictionnaire centralisé et des fonctions de changement réactif.
 */

import { useState, useEffect } from 'react';

export const LANGUAGES = [
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'wo', label: 'Wolof', flag: '🇸🇳' },
  { code: 'bm', label: 'Bamanankan', flag: '🇲🇱' },
  { code: 'fon', label: 'Fɔngbe', flag: '🇧🇯' }
];

export const translations = {
  fr: {
    app_name: 'Tontine Collaborative',
    tagline: 'Épargne collective transparente et sécurisée',
    dashboard: 'Tableau de Bord',
    my_tontines: 'Mes Tontines',
    my_payments: 'Mes Versements',
    notifications: 'Notifications',
    history: 'Historique',
    disputes: 'Litiges',
    audit: 'Piste d\'Audit',
    financial_transparency: 'Transparence Financière',
    common_fund: 'Fonds Commun',
    total_saved: 'Total Cotisé',
    active_tontines: 'Tontines Actives',
    next_beneficiary: 'Prochain Bénéficiaire',
    create_tontine: 'Créer une Tontine',
    pay_contribution: 'Cotiser',
    logout: 'Déconnexion',
    login: 'Se connecter',
    register: 'Créer un compte',
    offline_alert: 'Mode Hors-Ligne actif. Vos opérations seront synchronisées automatiquement dès le retour du réseau.',
    sync_now: 'Synchroniser maintenant',
    upload_proof: 'Joindre un reçu / capture',
    draw_method: 'Méthode d\'attribution',
    draw_random: 'Tirage au sort aléatoire',
    draw_seniority: 'Ordre d\'ancienneté',
    draw_need: 'Par priorité / besoin',
    penalties_label: 'Pénalités de retard',
    treasurer_badge: 'Trésorier du groupe',
    admin_badge: 'Administrateur',
    member_badge: 'Membre',
    two_factor_auth: 'Authentification 2FA',
    enable_2fa: 'Activer la double sécurité',
    disable_2fa: 'Désactiver le 2FA',
    dispute_report: 'Signaler un litige',
    turn: 'Tour'
  },
  en: {
    app_name: 'Collaborative Tontine',
    tagline: 'Transparent and secure collective savings',
    dashboard: 'Dashboard',
    my_tontines: 'My Tontines',
    my_payments: 'My Payments',
    notifications: 'Notifications',
    history: 'History',
    disputes: 'Disputes',
    audit: 'Audit Log',
    financial_transparency: 'Financial Transparency',
    common_fund: 'Common Fund',
    total_saved: 'Total Saved',
    active_tontines: 'Active Groups',
    next_beneficiary: 'Next Beneficiary',
    create_tontine: 'Create a Tontine',
    pay_contribution: 'Contribute',
    logout: 'Logout',
    login: 'Sign In',
    register: 'Sign Up',
    offline_alert: 'Offline mode active. Your operations will sync automatically once connection returns.',
    sync_now: 'Sync now',
    upload_proof: 'Attach receipt / screenshot',
    draw_method: 'Distribution Method',
    draw_random: 'Random Lottery Draw',
    draw_seniority: 'Registration Order',
    draw_need: 'Priority / Need based',
    penalties_label: 'Late Penalties',
    treasurer_badge: 'Treasurer',
    admin_badge: 'Admin',
    member_badge: 'Member',
    two_factor_auth: '2FA Authentication',
    enable_2fa: 'Enable 2-Factor Auth',
    disable_2fa: 'Disable 2FA',
    dispute_report: 'Report a dispute',
    turn: 'Round'
  },
  wo: {
    app_name: 'Tontine Bu Booloo',
    tagline: 'Denc alal ci jub ak kaaraange gu wóor',
    dashboard: 'Tënk gu mbooloo',
    my_tontines: 'Sama Tontine yi',
    my_payments: 'Sama fay yi',
    notifications: 'Yéenekaay yi',
    history: 'Jaar-jaar yi',
    disputes: 'Lëm-lëm yi',
    audit: 'Saytu gi',
    financial_transparency: 'Lér ci xaalis bi',
    common_fund: 'Kër bu mag bi',
    total_saved: 'Mbooleem li fayu',
    active_tontines: 'Tontine yiy dox',
    next_beneficiary: 'Ki ci topp',
    create_tontine: 'Sos tontine',
    pay_contribution: 'Fay sa wàll',
    logout: 'Génn',
    login: 'Dugg',
    register: 'Bindu',
    offline_alert: 'Reso bi doxul. Boo amee reso loolu lépp dina yéeg.',
    sync_now: 'Yékkati leegi',
    upload_proof: 'Wone kayitu fay gi',
    draw_method: 'Naka lay teeroo',
    draw_random: 'Tirage al-quraa',
    draw_seniority: 'Ki jëkka bindu',
    draw_need: 'Ki ëpp a soxla',
    penalties_label: 'Mbugal ci yéex gi',
    treasurer_badge: 'Kiy saytu xaalis',
    admin_badge: 'Njiit li',
    member_badge: 'Bokk',
    two_factor_auth: 'Kaaraange 2FA',
    enable_2fa: 'Takk kaaraange 2FA',
    disable_2fa: 'Dindi kaaraange 2FA',
    dispute_report: 'Yégle jafe-jafe',
    turn: 'Tuur'
  },
  bm: {
    app_name: 'Pari Kɛra Kelennasira',
    tagline: 'Wari marali kɛlɛkɛlɛ walasa ka bɛɛ jigi da a kan',
    dashboard: 'Kunnafoni Ba',
    my_tontines: 'Ne ka Pariw',
    my_payments: 'Ne ka Saraliw',
    notifications: 'Laseliw',
    history: 'Kɔrɔw',
    disputes: 'Kɛlɛ ni sɔsɔli',
    audit: 'Jate ladonni',
    financial_transparency: 'Wari jate gansan',
    common_fund: 'Wari marayɔrɔ',
    total_saved: 'Wari sara bɛɛ lajɛlen',
    active_tontines: 'Pari minnu bɛ senna',
    next_beneficiary: 'Mɔgɔ nata min bɛna a ta',
    create_tontine: 'Pari kura dabɔ',
    pay_contribution: 'Sara don',
    logout: 'Bɔ a kɔnɔ',
    login: 'Don a kɔnɔ',
    register: 'I tɔgɔ sɛbɛn',
    offline_alert: 'Reso tɛ yen. Ni reso seginna, bɛɛ bɛna labɛn.',
    sync_now: 'A labɛn sisan',
    upload_proof: 'Sarasɛbɛn don',
    draw_method: 'Taali cogo',
    draw_random: 'Filen fili / Tirage',
    draw_seniority: 'Min kɔnna ka don',
    draw_need: 'Mɔgɔ min kɔrɔtɔra',
    penalties_label: 'Kɔgɔlen wari',
    treasurer_badge: 'Warikantigi',
    admin_badge: 'Kuntigi',
    member_badge: 'Mɔgɔ',
    two_factor_auth: 'Lakana 2FA',
    enable_2fa: 'A lakana da a kan',
    disable_2fa: 'A lakana bɔ a la',
    dispute_report: 'Kɛlɛ laseli',
    turn: 'Turun'
  },
  fon: {
    app_name: 'Gbɛdó Akwɛxwi',
    tagline: 'Akwɛ biba kpodo lér kpo',
    dashboard: 'Kpɔn Tɛn',
    my_tontines: 'Gbɛdó Ce Lɛ',
    my_payments: 'Akwɛ Zinzin Ce Lɛ',
    notifications: 'Wɛn Lɛ',
    history: 'Nu E Wa Lɛ',
    disputes: 'Hwɛ Lɛ',
    audit: 'Akwɛ Zunzin Kpɔnkpɔn',
    financial_transparency: 'Akwɛ Mìmì Kpɛdɛ',
    common_fund: 'Akwɛ Gbɛɖo Tɔn',
    total_saved: 'Akwɛ Bi E Zin E',
    active_tontines: 'Gbɛdó E Dò Zɔn Wɛ Lɛ',
    next_beneficiary: 'Mɛ E Na Yí Akwɛ E',
    create_tontine: 'Gbɛdó Yɔyɔ Dó',
    pay_contribution: 'Zin Akwɛ',
    logout: 'Tɔ́n',
    login: 'Byɔ Mɛ',
    register: 'Wlan Nyikɔ',
    offline_alert: 'Reso ɖe a. E reso wa ɔ, e na sɔ bi do gbeji.',
    sync_now: 'Sɔ do gbeji din',
    upload_proof: 'Wema e ɖe akwɛ zinzin xlɛ e',
    draw_method: 'Ali e na zán e',
    draw_random: 'Tirage al-quran',
    draw_seniority: 'Mɛ e jɛ nukɔn e',
    draw_need: 'Mɛ e ɖo hudo hugan e',
    penalties_label: 'Akwɛ dodo',
    treasurer_badge: 'Akwɛkpɔntɔ',
    admin_badge: 'Gán',
    member_badge: 'Mɛɖopo',
    two_factor_auth: 'Likan 2FA',
    enable_2fa: 'Hɛn likan lidǒ',
    disable_2fa: 'Dè likan sín mɛ',
    dispute_report: 'Dɔn nǔ hwɛ',
    turn: 'Hwenu'
  }
};

let currentLang = 'fr';
const listeners = new Set();

export const getLanguage = () => currentLang;

export const setLanguage = (lang) => {
  if (translations[lang]) {
    currentLang = lang;
    if (typeof window !== 'undefined') {
      localStorage.setItem('tontine_lang', lang);
    }
    listeners.forEach((fn) => fn(lang));
  }
};

export const useTranslation = () => {
  const [lang, setLangState] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('tontine_lang') || 'fr';
    }
    return 'fr';
  });

  useEffect(() => {
    const handler = (newLang) => setLangState(newLang);
    listeners.add(handler);
    return () => listeners.delete(handler);
  }, []);

  const t = (key) => {
    return (translations[lang] && translations[lang][key]) || translations.fr[key] || key;
  };

  return { t, lang, setLanguage };
};

export default useTranslation;
