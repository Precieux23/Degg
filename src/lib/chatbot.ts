export interface ChatAction {
  label: string;
  url: string;
}

export interface ChatIntent {
  id: string;
  keywords: string[];
  title: string;
  response: string;
  actions: ChatAction[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "bot";
  text: string;
  intent?: ChatIntent;
  isLoading?: boolean;
}

export const QUICK_QUESTIONS: { label: string }[] = [
  { label: "Commander un taxi" },
  { label: "Prendre le TER vers Diamniadio" },
  { label: "Aller au stade Abdoulaye Wade" },
  { label: "Trouver un restaurant" },
  { label: "Acheter une carte SIM" },
  { label: "Venir depuis l'aéroport AIBD" },
  { label: "Numéros d'urgence" },
  { label: "Changer de l'argent" },
];

export const INTENTS: ChatIntent[] = [
  // ── TRANSPORT ──────────────────────────────────────────────────
  {
    id: "yango_taxi",
    keywords: ["yango", "taxi", "vtc", "commander", "voiture", "chauffeur", "uber", "bolt", "conduire", "ride", "moto"],
    title: "Taxi / Yango",
    response:
      "Pour vous déplacer à Dakar, utilisez Yango, l'application VTC la plus répandue au Sénégal, disponible 24h/24. Le prix est affiché avant la course.\n\nTéléchargez l'application, créez un compte et commandez en quelques secondes. Disponible depuis l'aéroport, Dakar, Diamniadio et Saly.\n\nConseil : réservez à l'avance pour les grandes compétitions JOJ.",
    actions: [
      { label: "Télécharger Yango (Android)", url: "https://play.google.com/store/apps/details?id=ru.yandex.taxi" },
      { label: "Télécharger Yango (iPhone)", url: "https://apps.apple.com/app/yango/id1099845963" },
    ],
  },
  {
    id: "ter_train",
    keywords: ["ter", "train", "train express", "gare", "rail", "chemin de fer", "ferroviaire", "rer"],
    title: "Train TER",
    response:
      "Le TER (Train Express Régional) est la meilleure option pour rejoindre Diamniadio.\n\nDakar vers Diamniadio : environ 45 minutes, 1 500 FCFA (2,30 euros).\nDépart : Gare de Dakar, Avenue Lamine Guèye.\nFréquence : toutes les 30 minutes.\n\nLe TER dessert aussi l'aéroport AIBD depuis Dakar en 45 minutes pour 3 000 FCFA. La gare est intégrée directement dans l'aéroport.",
    actions: [],
  },
  {
    id: "brt_bus",
    keywords: ["brt", "bus rapide", "bus express", "transport en commun", "corniche", "bus", "ligne", "arrêt"],
    title: "Bus BRT",
    response:
      "Le BRT (Bus Rapid Transit) parcourt Dakar sur des voies dédiées.\n\nLigne principale : Corniche Ouest, Plateau, Médina, Guédiawaye.\nTarif : environ 200 FCFA (0,30 euros).\nFréquence : toutes les 5 à 10 minutes.\n\nIdéal pour les sites de Dakar : Tour de l'Oeuf, Stade Iba Mar Diop, Corniche Ouest. C'est la solution la plus rapide pour circuler dans le centre de Dakar.",
    actions: [],
  },
  {
    id: "diamniadio",
    keywords: ["diamniadio", "stade abdoulaye wade", "dakar arena", "centre équestre", "centre des expositions", "stade wade", "arena"],
    title: "Zone Diamniadio",
    response:
      "Pour rejoindre Diamniadio, situé à 30 km de Dakar :\n\nTER : 45 minutes, 1 500 FCFA (recommandé).\nDakar Dem Dikk : bus express, moins cher.\nNavettes CSS JOJ : depuis les hôtels officiels, inclus pour les accrédités.\nYango taxi : environ 4 000 à 6 000 FCFA, confort maximal.\n\nLes principaux sites à Diamniadio : Stade Abdoulaye Wade (cérémonie d'ouverture), Dakar Arena, Centre des Expositions, Centre Équestre.",
    actions: [{ label: "Commander Yango", url: "https://yango.com/fr_sn/" }],
  },
  {
    id: "saly",
    keywords: ["saly", "plage saly", "saly ouest", "surf", "beach volley", "aviron", "sports nautiques", "saly-portudal", "sindia"],
    title: "Zone Saly",
    response:
      "Pour rejoindre Saly, situé à 80 km de Dakar :\n\nNavettes CSS JOJ : depuis Dakar et Diamniadio (recommandé pour les JOJ).\nDakar Dem Dikk : ligne express Saly.\nTER + correspondance : depuis Thiès.\nTaxi partagé : environ 25 000 FCFA à partager entre passagers.\n\nLes sports à Saly : Aviron de mer, Beach Volley, Surf, Sports nautiques.",
    actions: [{ label: "Commander Yango", url: "https://yango.com/fr_sn/" }],
  },
  {
    id: "dakar_sites",
    keywords: ["dakar", "tour de l'oeuf", "iba mar diop", "corniche ouest", "plateau", "médina", "dakar centre"],
    title: "Sites à Dakar",
    response:
      "Les sites JOJ à Dakar Centre :\n\nTour de l'Oeuf : Natation, Basket 3x3, Skateboard, Baseball 5, Breaking. BRT arrêt Corniche.\nStade Iba Mar Diop : Athlétisme, Boxe, Futsal, Rugby à 7. BRT arrêt Médina.\nCorniche Ouest : Cyclisme sur route, Let's Move. BRT arrêt Corniche Ouest.\n\nLe BRT est la solution la plus rapide pour circuler entre ces sites.",
    actions: [],
  },
  {
    id: "airport",
    keywords: ["aeroport", "aibd", "blaise diagne", "avion", "vol", "arriver", "terminal", "aéroport", "atterrir", "décoller"],
    title: "Aéroport AIBD",
    response:
      "L'Aéroport International Blaise Diagne (AIBD) est situé à 45 km de Dakar.\n\nDepuis l'aéroport vers Dakar :\nTER : 45 minutes, 3 000 FCFA (gare intégrée à l'aéroport).\nYango : environ 15 000 à 20 000 FCFA vers Dakar.\nDakar Dem Dikk : option économique.\n\nConseil : le TER est le plus rapide et le plus fiable. Vous trouverez aussi des comptoirs de change et des boutiques SIM directement à l'aéroport.",
    actions: [{ label: "Commander Yango depuis AIBD", url: "https://yango.com/fr_sn/" }],
  },
  {
    id: "ddd_bus",
    keywords: ["dakar dem dikk", "ddd", "bus ddd", "transport public", "car rapide"],
    title: "Dakar Dem Dikk",
    response:
      "Dakar Dem Dikk (DDD) est la compagnie de bus publique du Sénégal.\n\nElle dessert Dakar, Diamniadio et Saly avec des lignes express et régulières.\nTarif : 150 à 500 FCFA selon la distance.\nNavettes CSS : des navettes officielles JOJ opèrent depuis les hôtels partenaires vers tous les sites.\n\nLes bus DDD sont climatisés sur les lignes express.",
    actions: [],
  },
  // ── RESTAURATION ────────────────────────────────────────────────
  {
    id: "restaurant",
    keywords: ["restaurant", "manger", "nourriture", "repas", "bouffe", "faim", "dejeuner", "diner", "cuisine", "thieboudienne", "yassa", "mafe", "cafe", "thiéboudienne", "mafé", "snack", "fast food"],
    title: "Restaurants",
    response:
      "Restaurants recommandés près des sites JOJ :\n\nDakar :\nChez Loutcha : cuisine sénégalaise authentique, Plateau.\nLe Ngor Diarama : poisson frais, vue sur mer.\nOrange Baobab : rapide, climatisé, Plateau.\n\nDiamniadio :\nFood Court du Centre Commercial Diamniadio.\nSnacks officiels JOJ près des sites.\n\nPlats à goûter absolument : Thiéboudienne (riz au poisson), Yassa poulet, Mafé, Thiébou yapp (riz à la viande), Caldou (poisson sauce tomate), Bissap (jus d'hibiscus).\n\nBudget moyen : 2 000 à 5 000 FCFA pour un repas complet.",
    actions: [],
  },
  {
    id: "vegetarian",
    keywords: ["végétarien", "vegan", "végétalien", "halal", "sans viande", "allergie", "arachide", "gluten", "noix"],
    title: "Régimes alimentaires",
    response:
      "Options alimentaires spéciales au Sénégal :\n\nVégétarien : les restaurants internationaux proposent des options sans viande. La cuisine sénégalaise peut être adaptée (riz aux légumes, salades).\nHalal : la quasi-totalité des restaurants au Sénégal servent de la viande halal. Le Sénégal est un pays à majorité musulmane.\nAllergies arachides : attention, l'arachide est très utilisée dans la cuisine sénégalaise (mafé, sauce, huile). Signalez votre allergie en wolof : je suis allergique aux arachides = ma am allergie ci tiir.\nGluten : peu de restaurants proposent des options sans gluten. Préférez le riz nature et les plats à base de poisson.",
    actions: [],
  },
  // ── TELECOM & TECH ──────────────────────────────────────────────
  {
    id: "sim_card",
    keywords: ["sim", "carte sim", "telephone", "portable", "orange", "free", "expresso", "forfait", "internet", "data", "reseau", "4g", "5g", "recharge", "credit", "téléphone", "réseau", "wifi", "connexion", "appel"],
    title: "Carte SIM",
    response:
      "Pour acheter une carte SIM au Sénégal :\n\nOrange Sénégal (recommandé) : meilleure couverture nationale, disponible à l'aéroport AIBD, en ville, à Diamniadio. Forfait touriste 7 jours environ 5 000 FCFA pour 5 Go et appels.\n\nFree Sénégal : prix compétitifs, bonne couverture 4G à Dakar.\n\nExpresso : bonne couverture Saly et Thiès.\n\nDocuments requis : votre passeport. L'activation prend 15 à 20 minutes.\n\nWifi : disponible dans les hôtels, cafés et certains sites JOJ. Le wifi JOJ sera disponible dans les zones compétition.",
    actions: [
      { label: "Orange Sénégal", url: "https://www.orange.sn" },
      { label: "Free Sénégal", url: "https://www.free.sn" },
    ],
  },
  {
    id: "mobile_payment",
    keywords: ["wave", "orange money", "paiement mobile", "transfert", "recharge", "mobile money", "carte bancaire", "paiement"],
    title: "Paiements mobiles",
    response:
      "Le Sénégal est très avancé dans les paiements mobiles :\n\nWave : application la plus utilisée, envoyer et recevoir de l'argent, payer dans les commerces. Téléchargez Wave et créez un compte avec votre numéro sénégalais.\n\nOrange Money : service de l'opérateur Orange, très répandu.\n\nLes cartes Visa et Mastercard sont acceptées dans les hôtels, grands restaurants et supermarchés. Pour les petits commerces, le cash est préférable.\n\nATM : disponibles chez Ecobank, BNP Paribas, Société Générale dans toutes les grandes zones.",
    actions: [{ label: "Télécharger Wave", url: "https://wave.com/fr" }],
  },
  {
    id: "apps",
    keywords: ["application", "app", "google maps", "waze", "navigation", "gps", "carte", "uber", "telecharger", "télécharger"],
    title: "Applications utiles",
    response:
      "Applications recommandées pour les JOJ Dakar 2026 :\n\nTransport : Yango (taxi), Dakar Dem Dikk (bus, disponible en app).\nNavigation : Google Maps (fonctionne bien à Dakar), Waze.\nPaiement : Wave, Orange Money.\nCommunication : WhatsApp (très utilisé au Sénégal).\nSanté : l'application JOJ officielle (à venir).\nLangue : DÉGG (vous l'avez déjà !).\n\nConnexion : activez votre SIM locale avant d'arriver aux sites pour utiliser Google Maps hors-ligne.",
    actions: [{ label: "Commander Yango", url: "https://yango.com/fr_sn/" }],
  },
  // ── ARGENT & FINANCES ──────────────────────────────────────────
  {
    id: "money_exchange",
    keywords: ["argent", "monnaie", "fcfa", "euro", "dollar", "change", "banque", "atm", "distributeur", "retrait", "franc", "cfa", "taux", "devise"],
    title: "Argent & Change",
    response:
      "La monnaie locale est le Franc CFA (FCFA ou XOF).\nTaux indicatif : 1 euro = 655 FCFA, 1 dollar = environ 600 FCFA.\n\nRetrait d'espèces :\nDistributeurs Ecobank, BNP Paribas Sénégal, Société Générale dans toutes les grandes zones.\nDAB disponible à l'aéroport AIBD, au Plateau et à Diamniadio.\n\nChange : préférez les banques et bureaux de change officiels. Évitez les changeurs de rue.\n\nConseils : emportez assez de cash pour les petits achats. Les grands hôtels et restaurants acceptent les cartes bancaires.",
    actions: [],
  },
  // ── SANTÉ ──────────────────────────────────────────────────────
  {
    id: "emergency",
    keywords: ["urgence", "aide", "secours", "police", "ambulance", "blesse", "danger", "perdu", "vole", "accident", "sos", "gendarmerie", "blessé", "volé", "agression", "malaise"],
    title: "Urgences",
    response:
      "Numéros d'urgence au Sénégal :\n\nPolice : 17\nPompiers et SAMU : 18\nSAMU médical : 15\nGendarmerie : 800 00 20 20\nHôpital Principal de Dakar : +221 33 839 50 00\nClinique Pasteur Dakar : +221 33 849 77 77\n\nBénévoles JOJ (identifiables par leur gilet orange) : présents sur tous les sites, parlent plusieurs langues et peuvent vous orienter.\n\nEn cas de vol, rendez-vous au commissariat de police le plus proche pour faire une déclaration. Conservez le numéro de votre ambassade.",
    actions: [],
  },
  {
    id: "health",
    keywords: ["santé", "medecin", "docteur", "pharmacie", "maladie", "fievre", "paludisme", "malaria", "vaccin", "moustique", "diarrhée", "eau", "boire", "hôpital", "clinique", "médicament"],
    title: "Santé & Médecine",
    response:
      "Conseils santé pour les JOJ Dakar 2026 :\n\nEau : buvez uniquement de l'eau en bouteille ou filtrée. Ne buvez pas l'eau du robinet.\n\nPaludisme : le Sénégal est une zone à risque. Consultez votre médecin avant le départ pour un traitement préventif. Utilisez un répulsif anti-moustiques et dormez sous moustiquaire.\n\nVaccins recommandés : fièvre jaune (obligatoire), hépatite A et B, typhoïde. Vérifiez avec votre médecin.\n\nPharmacies : disponibles dans tous les quartiers. Apportez vos médicaments habituels.\n\nHôpitaux principaux : Hôpital Principal de Dakar, Clinique Pasteur, Hôpital de Fann.\n\nChaleur : restez hydraté, portez un chapeau et de la crème solaire.",
    actions: [],
  },
  {
    id: "water_beach",
    keywords: ["plage", "baignade", "nager", "mer", "ocean", "vague", "courant", "sécurité eau", "se baigner"],
    title: "Plages & Baignade",
    response:
      "Informations sur les plages au Sénégal :\n\nPlage de Saly : principale zone de sports nautiques pour les JOJ. Surveillance assurée pendant les compétitions.\nCorniche de Dakar : belle promenade, baignade à certains endroits.\n\nPrécautions :\nAttention aux courants marins qui peuvent être forts. Ne nagez jamais seul.\nRespectez les drapeaux de sécurité : rouge = baignade interdite, vert = sécurisé.\nÉvitez de laisser vos affaires sans surveillance sur la plage.\n\nDurée du soleil : 7h à 20h. La chaleur est intense de 12h à 16h. Appliquez de la crème solaire.",
    actions: [],
  },
  // ── HÉBERGEMENT ────────────────────────────────────────────────
  {
    id: "hotel",
    keywords: ["hotel", "hébergement", "chambre", "dormir", "nuit", "logement", "hôtel", "hebergement", "airbnb", "réservation", "booking", "resort"],
    title: "Hébergement",
    response:
      "Options d'hébergement pour les JOJ :\n\nDakar :\nHôtel Terrou-Bi (5 étoiles, vue mer), Radisson Blu, Novotel Dakar, King Fahd Palace.\n\nDiamniadio :\nPullman Teranga Diamniadio, hôtels officiels JOJ avec navettes incluses vers les sites.\n\nSaly :\nLamantin Beach Resort, Saly Hôtel, Paradise Inn.\n\nConseils : réservez bien à l'avance, les hôtels proches des sites JOJ seront complets. Les hôtels partenaires JOJ incluent les navettes CSS gratuites vers les sites.",
    actions: [{ label: "Booking.com Dakar", url: "https://www.booking.com/searchresults.fr.html?ss=Dakar" }],
  },
  // ── CULTURE & VIE PRATIQUE ──────────────────────────────────────
  {
    id: "culture",
    keywords: ["culture", "coutume", "tradition", "respect", "habitude", "comportement", "religion", "islam", "musulman", "priere", "ramadan", "tenue", "vetement", "dress code"],
    title: "Culture & Coutumes",
    response:
      "Conseils culturels pour votre séjour au Sénégal :\n\nReligion : le Sénégal est un pays à majorité musulmane (95%). Le respect des pratiques religieuses est important. L'appel à la prière se fait 5 fois par jour.\n\nTenue vestimentaire : portez des tenues respectueuses dans les lieux publics. Les épaules et les genoux couverts sont appréciés en dehors des zones touristiques et des sites sportifs.\n\nSalutations : les Sénégalais sont très chaleureux. Prenez le temps de se saluer avant d'entrer dans une conversation.\n\nTeranga : l'hospitalité sénégalaise est légendaire. Acceptez toujours un verre de thé (ataya) si on vous en propose.\n\nPhotographie : demandez toujours l'autorisation avant de photographier des personnes.",
    actions: [],
  },
  {
    id: "wolof_phrases",
    keywords: ["wolof", "apprendre", "langue locale", "parler", "mot", "expression", "salutation", "bonjour wolof", "merci wolof"],
    title: "Quelques mots en Wolof",
    response:
      "Apprenez quelques mots en Wolof pour impressionner les locaux :\n\nBonjour : Sa kanam (le matin), Nangadef (comment vas-tu ?)\nBien merci : Maa ngi fi rekk\nMerci : Jërejëf\nS'il vous plaît : Baaxal ma\nOui : Waaw\nNon : Déedéet\nCombien ? : Ñaata la jëf ?\nC'est trop cher : Dafa seer\nC'est délicieux : Dafa neex\nAu revoir : Ba beneen yoon\nDakar : Ndakaaru\n\nLa langue nationale du Sénégal est le Wolof. Le Français est la langue officielle. DÉGG signifie comprendre en Wolof.",
    actions: [],
  },
  {
    id: "shopping",
    keywords: ["shopping", "acheter", "marche", "souvenir", "cadeau", "artisanat", "tissu", "sandales", "bijoux", "negocier", "marchander", "boutique", "centre commercial"],
    title: "Shopping & Souvenirs",
    response:
      "Où faire du shopping à Dakar :\n\nMarchés : Marché Sandaga (centre-ville, artisanat, tissus), Marché Kermel (produits frais, souvenirs).\nCentres commerciaux : Sea Plaza, Sahm Mall, Centre Commercial Diamniadio.\n\nSouvenirs typiques : Tissu wax (pagne africain), statues en bois, bijoux en or et argent, sandales en cuir, masques, instruments de musique.\n\nMarchandage : c'est une pratique normale dans les marchés. Commencez à 30-40% du prix demandé et négociez tranquillement.\n\nPrix indicatifs : tissu wax 3 000 à 15 000 FCFA, statues 5 000 à 50 000 FCFA.",
    actions: [],
  },
  {
    id: "visa",
    keywords: ["visa", "passeport", "entrée", "frontière", "douane", "séjour", "immigration", "nationalité", "documents"],
    title: "Visa & Entrée",
    response:
      "Conditions d'entrée au Sénégal :\n\nLa plupart des pays n'ont pas besoin de visa pour entrer au Sénégal.\nExemptés de visa (séjour jusqu'à 90 jours) : tous les pays de l'Union Européenne, États-Unis, Canada, Royaume-Uni, Russie, Chine, Japon, Corée du Sud, Brésil et la plupart des pays africains.\n\nPasseport : doit être valide au moins 6 mois après la date d'entrée.\n\nFiche sanitaire : un certificat de vaccin contre la fièvre jaune peut être demandé selon votre pays d'origine.\n\nVisa sur place : certaines nationalités peuvent obtenir un visa à l'arrivée à l'aéroport AIBD. Vérifiez auprès de l'ambassade du Sénégal de votre pays.",
    actions: [],
  },
  {
    id: "weather",
    keywords: ["météo", "temps", "chaleur", "temperature", "pluie", "saison", "climate", "humidite", "vent", "harmattan"],
    title: "Météo & Climat",
    response:
      "Climat de Dakar en juillet-août (période JOJ) :\n\nSaison : saison des pluies (juillet-septembre). Pluies courtes mais intenses, surtout la nuit.\nTempérature : 25 à 33 degrés Celsius en journée, 22 à 27 la nuit.\nHumidité : 70 à 85%. L'air marin de l'Atlantique rend la chaleur plus supportable à Dakar.\n\nConseils :\nPortez des vêtements légers et respirants.\nHydratez-vous régulièrement : au moins 2 litres d'eau par jour.\nUtilisez de la crème solaire SPF 50 ou plus.\nÉvitez les activités intenses entre 12h et 16h.\n\nSaly (côte) est légèrement plus fraîche que Dakar grâce à la brise marine.",
    actions: [],
  },
  {
    id: "joj_info",
    keywords: ["joj", "jeux olympiques", "jeunesse", "programme", "calendrier", "sports", "nations", "athletes", "cio", "ceremonie", "ouverture", "cloture", "médaille", "podium", "dakar 2026"],
    title: "JOJ Dakar 2026",
    response:
      "Les Jeux Olympiques de la Jeunesse Dakar 2026 :\n\nDates : juillet-août 2026 (dates définitives à confirmer).\nLieu : Dakar, Sénégal, Afrique de l'Ouest.\nHistoire : première édition en Afrique. Créés en 2010, les JOJ réunissent des jeunes athlètes de 15 à 18 ans.\nNombre de sports : 32 disciplines olympiques.\nAthlètes : environ 4 000 jeunes athlètes de 206 nations.\n\nZones de compétition :\nDakar : Tour de l'Oeuf, Stade Iba Mar Diop, Corniche Ouest.\nDiamniadio : Stade Abdoulaye Wade, Dakar Arena, Centre des Expositions, Centre Équestre.\nSaly : Plage Saly Ouest (sports nautiques).\n\nCérémonie d'ouverture au Stade Abdoulaye Wade à Diamniadio.",
    actions: [],
  },
  {
    id: "tickets",
    keywords: ["billet", "ticket", "billets", "entrée", "places", "tarif", "gratuit", "prix", "acheter billet", "reservation"],
    title: "Billets & Accès",
    response:
      "Billets pour les compétitions JOJ 2026 :\n\nCertaines épreuves sont gratuites pour le public, notamment les disciplines en plein air.\nLes épreuves en salle nécessitent un billet.\n\nOù acheter : le site officiel des JOJ Dakar 2026 (dakar2026.com) et les points de vente officiels à Dakar.\n\nAccréditations : athlètes, entraîneurs, médias et officiels ont des accréditations spécifiques avec accès aux navettes CSS gratuites.\n\nConseil : achetez vos billets à l'avance pour les finales et cérémonies. Les places pour la cérémonie d'ouverture partent en premier.",
    actions: [{ label: "Site officiel JOJ", url: "https://dakar2026.com" }],
  },
  {
    id: "volunteering",
    keywords: ["bénévole", "volontaire", "volunteer", "aider", "travailler", "staff", "gilet", "accréditation", "badge"],
    title: "Bénévolat JOJ",
    response:
      "Les bénévoles des JOJ Dakar 2026 :\n\nLes bénévoles portent un gilet distinctif (généralement orange ou aux couleurs JOJ) et sont présents sur tous les sites.\n\nIls parlent plusieurs langues et peuvent vous aider pour :\nOrientation sur le site.\nPremiers secours de base.\nInformations pratiques.\nTraduction (avec DÉGG !).\n\nSi vous souhaitez être bénévole, les inscriptions se font via le site officiel des JOJ Dakar 2026.\n\nLe programme de bénévolat inclut une formation, un uniforme et l'accès aux sites.",
    actions: [],
  },
  {
    id: "gorée",
    keywords: ["gorée", "ile de gorée", "ile", "bateau", "ferry", "histoire", "esclavage", "patrimoine", "unesco", "visite", "tourisme", "monument"],
    title: "Île de Gorée",
    response:
      "L'Île de Gorée est un site UNESCO incontournable à visiter depuis Dakar :\n\nSituée à 3 km au large de Dakar, accessible en ferry depuis la Gare Maritime du Plateau.\nTraversée : environ 20 minutes, 5 200 FCFA aller-retour.\nHoraires : ferrys toutes les heures environ.\n\nÀ voir : la Maison des Esclaves (monument historique), le musée historique, les ruelles colorées.\nDurée recommandée : 3 à 4 heures.\n\nConseil : visitez en semaine pour éviter les foules. L'île est piétonne (pas de voitures).\n\nCet endroit symbolique est un hommage à la traite négrière et une méditation sur la dignité humaine.",
    actions: [],
  },
  {
    id: "electricity",
    keywords: ["electricite", "prise", "adaptateur", "voltage", "courant", "chargeur", "recharge", "power"],
    title: "Électricité",
    response:
      "Informations électriques au Sénégal :\n\nTension : 220 volts, 50 Hz (comme en Europe).\nPrises : type C et E (prises rondes européennes).\n\nAdaptateur nécessaire pour : USA, Canada, Japon, Royaume-Uni (Type G), Australie.\nLes visiteurs d'Europe continentale peuvent brancher directement.\n\nLes coupures de courant sont possibles. Les hôtels ont généralement des générateurs.\n\nConseil : emportez une multiprise et un chargeur universel, surtout si vous venez d'Amérique du Nord ou d'Asie.",
    actions: [],
  },
  {
    id: "photography",
    keywords: ["photo", "photographie", "camera", "prendre photo", "photographier", "selfie", "video", "droits photo"],
    title: "Photographie",
    response:
      "Conseils pour photographier au Sénégal et aux JOJ :\n\nSur les sites JOJ : les appareils photo personnels sont autorisés. Les trépieds et objectifs professionnels nécessitent une accréditation presse.\n\nDans la ville : demandez toujours l'autorisation avant de photographier des personnes, surtout des femmes voilées ou des personnes dans des lieux de culte. Un geste respectueux est toujours apprécié.\n\nLieux sacrés : évitez de photographier à l'intérieur des mosquées sans autorisation explicite.\n\nSites militaires et gouvernementaux : la photographie est interdite.\n\nPartage sur les réseaux : pensez à géolocaliser vos photos avec précaution pour votre sécurité.",
    actions: [],
  },
];

export const FALLBACK_RESPONSE =
  "Je n'ai pas trouvé d'information précise sur cette demande. Essayez de reformuler ou choisissez une question dans les suggestions ci-dessus.\n\nVous pouvez aussi utiliser l'onglet Traduction pour communiquer directement avec les locaux, ou demander de l'aide à un bénévole JOJ reconnaissable à son gilet.";

export function matchIntent(frenchText: string): ChatIntent | null {
  const lower = frenchText
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

  let bestMatch: ChatIntent | null = null;
  let bestScore = 0;

  for (const intent of INTENTS) {
    let score = 0;
    for (const kw of intent.keywords) {
      const kwNorm = kw
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "");
      if (lower.includes(kwNorm)) score++;
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = intent;
    }
  }

  return bestScore > 0 ? bestMatch : null;
}
