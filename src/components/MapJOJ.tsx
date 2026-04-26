"use client";

import { useState, useEffect } from "react";
import { translateText, translateBatch } from "@/lib/translate";

interface Site {
  id: string;
  name: string;
  sports: string[];
  transport: { type: string; detail: string }[];
  lat: number;
  lon: number;
}

interface Zone {
  id: string;
  name: string;
  distance: string;
  color: string;
  bg: string;
  border: string;
  sites: Site[];
}

const ZONES: Zone[] = [
  {
    id: "dakar",
    name: "Dakar",
    distance: "Centre-ville",
    color: "text-green-700",
    bg: "bg-green-50",
    border: "border-green-200",
    sites: [
      {
        id: "tour-oeuf",
        name: "Tour de l'Oeuf",
        sports: ["Natation", "Basket 3x3", "Skateboard", "Baseball 5", "Breaking"],
        transport: [
          { type: "BRT", detail: "Ligne BRT — Arrêt Corniche" },
          { type: "DDD", detail: "Dakar Dem Dikk — Ligne 6" },
          { type: "Taxi", detail: "Taxi depuis Plateau ~10 min" },
        ],
        lat: 14.6937, lon: -17.4441,
      },
      {
        id: "iba-mar-diop",
        name: "Stade Iba Mar Diop",
        sports: ["Athlétisme", "Boxe", "Futsal", "Rugby à 7"],
        transport: [
          { type: "DDD", detail: "Dakar Dem Dikk — Arrêt Médina" },
          { type: "BRT", detail: "Ligne BRT — Arrêt Médina" },
          { type: "Taxi", detail: "Taxi depuis Plateau ~8 min" },
        ],
        lat: 14.6892, lon: -17.4467,
      },
      {
        id: "corniche-ouest",
        name: "Corniche Ouest",
        sports: ["Cyclisme sur route", "Let's Move", "Sports engagement"],
        transport: [
          { type: "BRT", detail: "Ligne BRT — Arrêt Corniche Ouest" },
          { type: "DDD", detail: "Dakar Dem Dikk — Ligne 8" },
          { type: "Taxi", detail: "Taxi depuis Plateau ~12 min" },
        ],
        lat: 14.6785, lon: -17.4523,
      },
    ],
  },
  {
    id: "diamniadio",
    name: "Diamniadio",
    distance: "30 km de Dakar",
    color: "text-green-800",
    bg: "bg-green-50",
    border: "border-green-300",
    sites: [
      {
        id: "stade-wade",
        name: "Stade Abdoulaye Wade",
        sports: ["Tir à l'arc", "Cérémonie d'ouverture"],
        transport: [
          { type: "TER", detail: "Train Express Régional — Gare Diamniadio" },
          { type: "CSS", detail: "Navette officielle CSS depuis hôtels" },
          { type: "DDD", detail: "Dakar Dem Dikk — Express Diamniadio" },
        ],
        lat: 14.7167, lon: -17.1833,
      },
      {
        id: "dakar-arena",
        name: "Dakar Arena",
        sports: ["Badminton", "Futsal"],
        transport: [
          { type: "TER", detail: "Train Express Régional — Gare Diamniadio" },
          { type: "CSS", detail: "Navette officielle CSS depuis hôtels" },
          { type: "DDD", detail: "Dakar Dem Dikk — Express Diamniadio" },
        ],
        lat: 14.7201, lon: -17.1812,
      },
      {
        id: "centre-expositions",
        name: "Centre des Expositions",
        sports: ["Escrime", "Gymnastique", "Judo", "Taekwondo", "Tennis de table", "Wushu"],
        transport: [
          { type: "TER", detail: "Train Express Régional — Gare Diamniadio" },
          { type: "CSS", detail: "Navette officielle CSS depuis hôtels" },
        ],
        lat: 14.7189, lon: -17.1845,
      },
      {
        id: "centre-equestre",
        name: "Centre Equestre",
        sports: ["Sports équestres", "Saut d'obstacles"],
        transport: [
          { type: "TER", detail: "Train Express Régional — Gare Diamniadio" },
          { type: "CSS", detail: "Navette officielle CSS depuis hôtels" },
        ],
        lat: 14.7145, lon: -17.1867,
      },
    ],
  },
  {
    id: "saly",
    name: "Saly",
    distance: "80 km de Dakar",
    color: "text-green-900",
    bg: "bg-green-50",
    border: "border-green-400",
    sites: [
      {
        id: "plage-saly",
        name: "Plage Saly Ouest",
        sports: ["Aviron de mer", "Beach Volley", "Surf", "Sports nautiques"],
        transport: [
          { type: "CSS", detail: "Navette officielle CSS — départ Dakar et Diamniadio" },
          { type: "DDD", detail: "Dakar Dem Dikk — Ligne express Saly" },
          { type: "TER", detail: "TER + navette de correspondance depuis Thiès" },
        ],
        lat: 14.4667, lon: -16.9833,
      },
    ],
  },
];

const TRANSPORT_PHRASES_FR = [
  "Où est l'arrêt de bus ?",
  "Ce bus va-t-il à Diamniadio ?",
  "À quelle heure part la navette ?",
  "Combien coûte le ticket ?",
];

interface TranslatedDetail {
  siteName: string;
  sports: string[];
  transport: string[];
}

interface Props {
  toLang: string;
  getLangName: (code: string) => string;
  getLangFlag: (code: string) => string;
  onPhraseSelect: (phrase: string) => void;
  sportsTitle?: string;
  transportTitle?: string;
  phrasesTitle?: string;
  openMapsBtn?: string;
  yangoBtn?: string;
  backLabel?: string;
  selectZone?: string;
  sitesLabel?: string;
  gpsLabel?: string;
}

export default function MapJOJ({
  toLang,
  getLangName,
  getLangFlag,
  onPhraseSelect,
  sportsTitle = "Sports et épreuves",
  transportTitle = "Comment y aller",
  phrasesTitle = "Phrases transport utiles",
  openMapsBtn = "Ouvrir dans Google Maps",
  yangoBtn = "Commander un taxi",
  backLabel = "Retour",
  selectZone = "Sélectionnez une zone pour voir les sites",
  sitesLabel = "sites",
  gpsLabel = "Coordonnées GPS",
}: Props) {
  const [activeZone, setActiveZone] = useState<string>("dakar");
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [detail, setDetail] = useState<TranslatedDetail | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);

  // Translate zone distance labels
  const [zoneDistances, setZoneDistances] = useState(ZONES.map((z) => z.distance));
  // Translate transport quick phrases
  const [transportPhrases, setTransportPhrases] = useState(TRANSPORT_PHRASES_FR);

  useEffect(() => {
    if (toLang === "FR") {
      setZoneDistances(ZONES.map((z) => z.distance));
      setTransportPhrases(TRANSPORT_PHRASES_FR);
      return;
    }
    const textsToTranslate = [
      ...ZONES.map((z) => z.distance),
      ...TRANSPORT_PHRASES_FR,
    ];
    translateBatch(textsToTranslate, "FR", toLang).then((translated) => {
      setZoneDistances(ZONES.map((_, i) => translated[i] || ZONES[i].distance));
      setTransportPhrases(
        TRANSPORT_PHRASES_FR.map((p, i) => translated[ZONES.length + i] || p)
      );
    });
  }, [toLang]);

  const zone = ZONES.find((z) => z.id === activeZone)!;

  const handleSiteSelect = async (site: Site) => {
    setSelectedSite(site);
    setDetail(null);

    if (toLang === "FR") {
      setDetail({ siteName: site.name, sports: site.sports, transport: site.transport.map((t) => t.detail) });
      return;
    }

    setIsTranslating(true);
    try {
      const textsToTranslate = [
        site.name,
        site.sports.join(" | "),
        ...site.transport.map((t) => t.detail),
      ];
      const translated = await translateBatch(textsToTranslate, "FR", toLang);

      const sports = (translated[1] || site.sports.join(" | "))
        .split(" | ")
        .map((s, i) => s || site.sports[i] || s);

      setDetail({
        siteName: translated[0] || site.name,
        sports,
        transport: site.transport.map((t, i) => translated[2 + i] || t.detail),
      });
    } finally {
      setIsTranslating(false);
    }
  };

  const mapsUrl = (site: Site) =>
    `https://www.google.com/maps/search/?api=1&query=${site.lat},${site.lon}`;

  const osmEmbedUrl = (site: Site) =>
    `https://www.openstreetmap.org/export/embed.html?bbox=${site.lon - 0.01},${site.lat - 0.01},${site.lon + 0.01},${site.lat + 0.01}&layer=mapnik&marker=${site.lat},${site.lon}`;

  return (
    <div className="max-w-2xl mx-auto px-4 pb-5 space-y-3">
      {/* Header — solid green */}
      <div className="rounded-2xl p-4" style={{ background: "#0fa958" }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white font-bold text-sm">Carte des sites JOJ</p>
            <p className="text-white/70 text-xs mt-0.5">8 sites · 3 zones · Dakar 2026</p>
          </div>
          <span className="text-xs bg-white/20 text-white px-2 py-1 rounded-full font-semibold">
            {getLangFlag(toLang)} {getLangName(toLang)}
          </span>
        </div>
      </div>

      {/* Zone selector */}
      <div className="bg-white rounded-2xl border border-gray-100 p-1 shadow-sm flex gap-1">
        {ZONES.map((z, zi) => (
          <button
            key={z.id}
            onClick={() => { setActiveZone(z.id); setSelectedSite(null); setDetail(null); }}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
              activeZone === z.id
                ? "text-white"
                : "text-gray-500 hover:text-gray-700"
            }`}
            style={activeZone === z.id ? { background: "#0fa958" } : {}}
          >
            {z.name}
            <span className="block text-[10px] font-normal opacity-70">
              {zoneDistances[zi]}
            </span>
          </button>
        ))}
      </div>

      {/* Site list */}
      {!selectedSite && (
        <div className="space-y-2">
          <p className="text-xs text-gray-400 text-center">{selectZone}</p>
          {zone.sites.map((site) => (
            <button
              key={site.id}
              onClick={() => handleSiteSelect(site)}
              className={`w-full text-left p-4 rounded-2xl border-2 ${zone.bg} ${zone.border} hover:shadow-md transition-all`}
            >
              <p className={`font-bold text-sm ${zone.color} mb-2`}>{site.name}</p>
              <div className="flex flex-wrap gap-1 mb-2">
                {site.sports.slice(0, 3).map((s) => (
                  <span key={s} className="text-xs bg-white text-gray-600 px-2 py-0.5 rounded-full border border-gray-100">{s}</span>
                ))}
                {site.sports.length > 3 && (
                  <span className="text-xs text-gray-400 bg-white px-2 py-0.5 rounded-full border border-gray-100">
                    +{site.sports.length - 3}
                  </span>
                )}
              </div>
              <div className="flex gap-1.5">
                {site.transport.map((t) => (
                  <span key={t.type} className="text-[10px] font-bold bg-white text-gray-700 px-2 py-0.5 rounded-full border border-gray-200">{t.type}</span>
                ))}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Site detail */}
      {selectedSite && (
        <div className="space-y-3">
          <button
            onClick={() => { setSelectedSite(null); setDetail(null); }}
            className="flex items-center gap-2 text-sm font-semibold hover:underline"
            style={{ color: "#0fa958" }}
          >
            ← {backLabel} · {zone.name}
          </button>

          {/* Site name */}
          <div className={`rounded-2xl p-4 border-2 ${zone.bg} ${zone.border}`}>
            <p className={`text-lg font-black ${zone.color}`}>
              {isTranslating ? "..." : (detail?.siteName || selectedSite.name)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {gpsLabel} : {selectedSite.lat.toFixed(4)}° N, {Math.abs(selectedSite.lon).toFixed(4)}° W
            </p>
          </div>

          {/* Map */}
          <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
            <iframe
              title={`Carte ${selectedSite.name}`}
              src={osmEmbedUrl(selectedSite)}
              className="w-full h-52"
              loading="lazy"
              style={{ border: 0 }}
            />
          </div>

          {/* Open Maps */}
          <a
            href={mapsUrl(selectedSite)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl font-bold text-sm text-white transition-all"
            style={{ background: "#0fa958" }}
          >
            {openMapsBtn}
          </a>

          {/* Sports */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">{sportsTitle}</p>
            <div className="flex flex-wrap gap-2">
              {(detail?.sports || selectedSite.sports).map((s, i) => (
                <span key={i} className={`text-xs px-3 py-1.5 rounded-xl border font-medium ${zone.bg} ${zone.color} ${zone.border}`}>{s}</span>
              ))}
            </div>
          </div>

          {/* Transport */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">{transportTitle}</p>
            <div className="space-y-2">
              {selectedSite.transport.map((t, i) => (
                <div key={t.type} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <span className="text-xs font-black text-gray-700 bg-white px-2 py-1 rounded-lg border border-gray-200 flex-shrink-0">{t.type}</span>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {isTranslating ? t.detail : (detail?.transport[i] || t.detail)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Transport phrases */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">{phrasesTitle}</p>
            <div className="space-y-2">
              {transportPhrases.map((phrase, i) => (
                <button
                  key={i}
                  onClick={() => onPhraseSelect(TRANSPORT_PHRASES_FR[i])}
                  className="w-full text-left px-3 py-2.5 rounded-xl bg-gray-50 text-xs text-gray-700 transition-all border border-transparent font-medium hover:border-green-200 hover:bg-green-50 hover:text-green-700"
                >
                  {phrase} →
                </button>
              ))}
            </div>
          </div>

          {/* Yango */}
          <a
            href="https://yango.com/fr_sn/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-full py-3 rounded-2xl font-bold text-sm text-white transition-all"
            style={{ background: "#0c8a48" }}
          >
            {yangoBtn}
          </a>
        </div>
      )}
    </div>
  );
}
