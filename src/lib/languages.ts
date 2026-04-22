export type LanguageCode = "WO" | "FR" | "EN" | "RU" |  "DE" |"AR" | "ES" | "PT" | "ZH" | "JA" |"KO" | "SW" | "HI";

export type Language = {
  code: LanguageCode;
  name: string;
  flag: string;
};

export const LANGUAGES: Language[] = [
  { code: "WO", name: "Wolof", flag: "🇸🇳" },
  { code: "FR", name: "Français", flag: "🇫🇷" },
  { code: "EN", name: "Anglais", flag: "🇬🇧" },
  { code: "RU", name: "Russe", flag: "🇷🇺" },
  { code: "DE", name: "Allemand", flag: "🇩🇪" },
  { code: "AR", name: "Arabe", flag: "🇸🇦" },
  { code: "ES", name: "Espagnol", flag: "🇪🇸" },
  { code: "PT", name: "Portugais", flag: "🇵🇹" },
  { code: "ZH", name: "Chinois", flag: "🇨🇳" },
  { code: "JA", name: "Japonais", flag: "🇯🇵" },
  { code: "KO", name: "Coréen", flag: "🇰🇷" },
  { code: "SW", name: "Swahili", flag: "🌍" },
  { code: "HI", name: "Hindi", flag: "🇮🇳" },
];

export const LANGUAGE_COUNT = LANGUAGES.length;

export function getLanguage(code: string) {
  return LANGUAGES.find((l) => l.code === code);
}

export type JOJPhraseCategory = {
  category: string;
  phrases: string[];
};

export const JOJ_PHRASES = [
  {
    category: "📍 Orientation",
    phrases: [
      "Où est le stade ?",
      "Je suis perdu",
      "Où sont les toilettes ?",
      "Où est l'hôpital ?",
      "Comment aller au village olympique ?",
      "Où est l'arrêt de bus ?",
      "Où est le parking ?",
      "Quelle est la sortie la plus proche ?",
    ],
  },
  {
    category: "🏟️ Compétition",
    phrases: [
      "À quelle heure commence l'épreuve ?",
      "Où acheter les billets ?",
      "Quelle est la zone VIP ?",
      "Où est la zone presse ?",
      "Qui a gagné ?",
      "Quel est le score ?",
      "Où est la cérémonie de remise des médailles ?",
      "À quelle heure est la finale ?",
    ],
  },
  {
    category: "🍽️ Nourriture",
    phrases: [
      "Je suis allergique aux arachides",
      "Sans viande s'il vous plaît",
      "L'addition s'il vous plaît",
      "Où est le restaurant ?",
      "De l'eau s'il vous plaît",
      "C'est délicieux !",
      "Avez-vous un menu végétarien ?",
      "Je suis allergique au gluten",
    ],
  },
  {
    category: "🚨 Urgences",
    phrases: [
      "J'ai besoin d'aide",
      "Appelez une ambulance",
      "Je suis blessé",
      "Appelez la police",
      "J'ai perdu mon passeport",
      "J'ai perdu mon téléphone",
      "J'ai besoin d'un médecin",
      "C'est une urgence",
    ],
  },
  {
    category: "🤝 Politesse",
    phrases: [
      "Bonjour",
      "Merci beaucoup",
      "S'il vous plaît",
      "Excusez-moi",
      "Je ne comprends pas",
      "Parlez-vous français ?",
      "Pouvez-vous répéter ?",
      "Bonne chance !",
    ],
  },
  {
    category: "🏨 Hébergement",
    phrases: [
      "Où est mon hôtel ?",
      "J'ai une réservation",
      "À quelle heure est le check-out ?",
      "Ma chambre n'est pas prête",
      "Où est la réception ?",
      "Avez-vous le wifi ?",
      "J'ai besoin d'une couverture supplémentaire",
      "Pouvez-vous appeler un taxi ?",
    ],
  },
];