import { translateBatch } from "./translate";

export interface UIStrings {
  // Tabs
  tabTranslate: string;
  tabPhrases: string;
  tabConversation: string;
  tabMap: string;
  tabAssistant: string;
  // Translate tab
  outputPlaceholder: string;
  clearBtn: string;
  speakBtn: string;
  listeningBtn: string;
  listenBtn: string;
  playingBtn: string;
  translatingLabel: string;
  historyTitle: string;
  charsLabel: string;
  swapTitle: string;
  // Phrases tab
  phrasesTitle: string;
  phrasesSubtitle: string;
  translationToLabel: string;
  // Conversation
  personA: string;
  personB: string;
  micBtn: string;
  listeningMic: string;
  sendBtn: string;
  clearConvBtn: string;
  convSpeakHere: string;
  // Map
  mapSportsTitle: string;
  mapTransportTitle: string;
  mapPhrasesTitle: string;
  openMapsBtn: string;
  yangoBtn: string;
  mapBackLabel: string;
  mapSelectZone: string;
  mapSitesLabel: string;
  mapGpsLabel: string;
  // Assistant chatbot
  assistantTitle: string;
  assistantSubtitle: string;
  quickQuestionsLabel: string;
  newConvBtn: string;
  chatTipText: string;
  chatTipTab: string;
  chatInputPlaceholder: string;
  // FABs
  fabAssistant: string;
  fabGuide: string;
}

export const FR_UI: UIStrings = {
  tabTranslate: "Traduction",
  tabPhrases: "Phrases JOJ",
  tabConversation: "Conversation",
  tabMap: "Carte JOJ",
  tabAssistant: "Assistant JOJ",
  outputPlaceholder: "La traduction apparaîtra ici",
  clearBtn: "Effacer",
  speakBtn: "Parler",
  listeningBtn: "Écoute...",
  listenBtn: "Écouter",
  playingBtn: "Lecture...",
  translatingLabel: "Traduction...",
  historyTitle: "Récent",
  charsLabel: "caractères",
  swapTitle: "Inverser les langues",
  phrasesTitle: "Phrases essentielles JOJ",
  phrasesSubtitle: "Touchez une phrase pour traduction instantanée",
  translationToLabel: "Traduire vers",
  personA: "Personne A",
  personB: "Personne B",
  micBtn: "Micro",
  listeningMic: "Écoute...",
  sendBtn: "Envoyer",
  clearConvBtn: "Effacer la conversation",
  convSpeakHere: "Parlez ici...",
  mapSportsTitle: "Sports et épreuves",
  mapTransportTitle: "Comment y aller",
  mapPhrasesTitle: "Phrases transport utiles",
  openMapsBtn: "Ouvrir dans Google Maps",
  yangoBtn: "Commander un taxi",
  mapBackLabel: "Retour",
  mapSelectZone: "Sélectionnez une zone pour voir les sites",
  mapSitesLabel: "sites",
  mapGpsLabel: "Coordonnées GPS",
  assistantTitle: "Assistant JOJ Dakar 2026",
  assistantSubtitle: "Transport · Restaurants · SIM · Urgences · Culture",
  quickQuestionsLabel: "Questions fréquentes",
  newConvBtn: "Nouvelle conversation",
  chatTipText: "Besoin de traduire une phrase précise ? Utilisez l'onglet",
  chatTipTab: "Traduction",
  chatInputPlaceholder: "Posez votre question...",
  fabAssistant: "Assistant JOJ",
  fabGuide: "Guide d'utilisation",
};

const CACHE_KEY = (lang: string) => `degg_ui_${lang}`;

export async function getUIStrings(lang: string): Promise<UIStrings> {
  if (lang === "FR") return FR_UI;

  try {
    const cached = localStorage.getItem(CACHE_KEY(lang));
    if (cached) {
      const parsed = JSON.parse(cached) as Partial<UIStrings>;
      return { ...FR_UI, ...parsed };
    }
  } catch { /* ignore */ }

  const keys = Object.keys(FR_UI) as (keyof UIStrings)[];
  const values = keys.map((k) => FR_UI[k]);
  const translated = await translateBatch(values, "FR", lang);

  const result: UIStrings = { ...FR_UI };
  keys.forEach((k, i) => {
    if (translated[i] && translated[i] !== values[i]) {
      (result as unknown as Record<string, string>)[k] = translated[i];
    }
  });

  try {
    localStorage.setItem(CACHE_KEY(lang), JSON.stringify(result));
  } catch { /* ignore */ }

  return result;
}

export function clearUICache(lang: string) {
  try { localStorage.removeItem(CACHE_KEY(lang)); } catch { /* ignore */ }
}
