"use client";

import { useState } from "react";

interface Site {
  id: string;
  name: string;
  sports: string[];
  transport: {
    type: string;
    icon: string;
    detail: string;
  }[];
  coords: string;
}

interface Zone {
  id: string;
  name: string;
  distance: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: string;
  sites: Site[];
}

const ZONES: Zone[] = [
  {
    id: "dakar",
    name: "Dakar",
    distance: "Centre-ville",
    color: "text-green-700",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    icon: "🏙️",
    sites: [
      {
        id: "tour-oeuf",
        name: "Tour de l'Œuf",
        sports: ["🏊 Natation", "🏀 Basket 3x3", "🛹 Skateboard", "⚾ Baseball 5", "🕺 Breaking"],
        transport: [
          { type: "BRT", icon: "🚌", detail: "Ligne BRT — Arrêt Corniche" },
          { type: "DDD", icon: "🚌", detail: "Dakar Dem Dikk — Ligne 6" },
          { type: "Taxi", icon: "🚕", detail: "Taxi depuis Plateau ~10 min" },
        ],
        coords: "14.6937° N, 17.4441° W",
      },
      {
        id: "iba-mar-diop",
        name: "Stade Iba Mar Diop",
        sports: ["🏃 Athlétisme", "🥊 Boxe", "⚽ Futsal", "🏉 Rugby à 7"],
        transport: [
          { type: "DDD", icon: "🚌", detail: "Dakar Dem Dikk — Arrêt Médina" },
          { type: "BRT", icon: "🚌", detail: "Ligne BRT — Arrêt Médina" },
          { type: "Taxi", icon: "🚕", detail: "Taxi depuis Plateau ~8 min" },
        ],
        coords: "14.6892° N, 17.4467° W",
      },
      {
        id: "corniche-ouest",
        name: "Corniche Ouest",
        sports: ["🚴 Cyclisme sur route", "🎉 Espace Let's Move", "🏄 Sports engagement"],
        transport: [
          { type: "BRT", icon: "🚌", detail: "Ligne BRT — Arrêt Corniche Ouest" },
          { type: "DDD", icon: "🚌", detail: "Dakar Dem Dikk — Ligne 8" },
          { type: "Taxi", icon: "🚕", detail: "Taxi depuis Plateau ~12 min" },
        ],
        coords: "14.6785° N, 17.4523° W",
      },
    ],
  },
  {
    id: "diamniadio",
    name: "Diamniadio",
    distance: "30 km de Dakar",
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    icon: "🏟️",
    sites: [
      {
        id: "stade-wade",
        name: "Stade Abdoulaye Wade",
        sports: ["🏹 Tir à l'arc", "🎖️ Cérémonie d'ouverture"],
        transport: [
          { type: "TER", icon: "🚆", detail: "Train Express Régional — Gare Diamniadio" },
          { type: "CSS", icon: "🚌", detail: "Navette officielle CSS depuis hôtels" },
          { type: "DDD", icon: "🚌", detail: "Dakar Dem Dikk — Express Diamniadio" },
        ],
        coords: "14.7167° N, 17.1833° W",
      },
      {
        id: "dakar-arena",
        name: "Dakar Arena",
        sports: ["🏸 Badminton", "⚽ Futsal"],
        transport: [
          { type: "TER", icon: "🚆", detail: "Train Express Régional — Gare Diamniadio" },
          { type: "CSS", icon: "🚌", detail: "Navette officielle CSS depuis hôtels" },
          { type: "DDD", icon: "🚌", detail: "Dakar Dem Dikk — Express Diamniadio" },
        ],
        coords: "14.7201° N, 17.1812° W",
      },
      {
        id: "centre-expositions",
        name: "Centre des Expositions",
        sports: ["🤺 Escrime", "🤸 Gymnastique", "🥋 Judo", "🥋 Taekwondo", "🏓 Tennis de table", "🥷 Wushu"],
        transport: [
          { type: "TER", icon: "🚆", detail: "Train Express Régional — Gare Diamniadio" },
          { type: "CSS", icon: "🚌", detail: "Navette officielle CSS depuis hôtels" },
        ],
        coords: "14.7189° N, 17.1845° W",
      },
      {
        id: "centre-equestre",
        name: "Centre Équestre",
        sports: ["🐴 Sports équestres", "🏇 Saut d'obstacles"],
        transport: [
          { type: "TER", icon: "🚆", detail: "Train Express Régional — Gare Diamniadio" },
          { type: "CSS", icon: "🚌", detail: "Navette officielle CSS depuis hôtels" },
        ],
        coords: "14.7145° N, 17.1867° W",
      },
    ],
  },
  {
    id: "saly",
    name: "Saly",
    distance: "80 km de Dakar",
    color: "text-orange-700",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    icon: "🏖️",
    sites: [
      {
        id: "plage-saly",
        name: "Plage Saly Ouest",
        sports: ["🚣 Aviron de mer", "🏐 Beach Volley", "🏄 Surf", "🚤 Sports nautiques"],
        transport: [
          { type: "CSS", icon: "🚌", detail: "Navette officielle CSS — départ Dakar & Diamniadio" },
          { type: "DDD", icon: "🚌", detail: "Dakar Dem Dikk — Ligne express Saly" },
          { type: "TER", icon: "🚆", detail: "TER + navette de correspondance depuis Thiès" },
        ],
        coords: "14.4667° N, 16.9833° W",
      },
    ],
  },
];

const TRANSPORT_PHRASES: Record<string, string[]> = {
  general: [
    "Où est l'arrêt de bus ?",
    "Ce bus va-t-il à Diamniadio ?",
    "À quelle heure part la navette ?",
    "Où est la gare TER ?",
    "Combien coûte le ticket ?",
    "Quel bus va à Saly ?",
  ],
};

interface MobiliteJOJProps {
  toLang: string;
  getLangName: (code: string) => string;
  getLangFlag: (code: string) => string;
  onTranslate: (text: string, from: string, to: string) => Promise<string | null>;
  onPhraseSelect: (phrase: string) => void;
}

export default function MobiliteJOJ({
  toLang,
  getLangName,
  getLangFlag,
  onTranslate,
  onPhraseSelect,
}: MobiliteJOJProps) {
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [translatedSiteName, setTranslatedSiteName] = useState<string>("");
  const [translatedSports, setTranslatedSports] = useState<string[]>([]);
  const [translatedTransport, setTranslatedTransport] = useState<string[]>([]);
  const [isTranslating, setIsTranslating] = useState(false);
  const [view, setView] = useState<"zones" | "sites" | "detail">("zones");

  const handleZoneSelect = (zoneId: string) => {
    setSelectedZone(zoneId);
    setSelectedSite(null);
    setView("sites");
  };

  const handleSiteSelect = async (site: Site) => {
    setSelectedSite(site);
    setView("detail");

    if (toLang === "FR") {
      setTranslatedSiteName(site.name);
      setTranslatedSports(site.sports);
      setTranslatedTransport(site.transport.map((t) => t.detail));
      return;
    }

    setIsTranslating(true);
    try {
      // Traduit le nom du site
      const name = await onTranslate(site.name, "FR", toLang);
      setTranslatedSiteName(name || site.name);

      // Traduit les sports (sans émoji)
      const sportsText = site.sports.map((s) => s.replace(/^\S+\s/, "")).join(" | ");
      const sportsTranslated = await onTranslate(sportsText, "FR", toLang);
      if (sportsTranslated) {
        const parts = sportsTranslated.split(" | ");
        setTranslatedSports(
          site.sports.map((s, i) => {
            const emoji = s.match(/^\S+/)?.[0] || "";
            return `${emoji} ${parts[i] || s.replace(/^\S+\s/, "")}`;
          })
        );
      } else {
        setTranslatedSports(site.sports);
      }

      // Traduit les infos transport
      const transportDetails = await Promise.all(
        site.transport.map((t) => onTranslate(t.detail, "FR", toLang))
      );
      setTranslatedTransport(transportDetails.map((t, i) => t || site.transport[i].detail));
    } finally {
      setIsTranslating(false);
    }
  };

  const currentZone = ZONES.find((z) => z.id === selectedZone);

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="bg-green-600 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-1">
          <p className="text-white font-semibold text-sm">🗺️ Mobilité JOJ Dakar 2026</p>
          <span className="text-xs bg-green-500 text-green-100 px-2 py-0.5 rounded-full">
            {getLangFlag(toLang)} {getLangName(toLang)}
          </span>
        </div>
        <p className="text-green-200 text-xs">
          3 zones · 8 sites · Traduit dans ta langue
        </p>
      </div>

      {/* Breadcrumb */}
      {view !== "zones" && (
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <button
            onClick={() => { setView("zones"); setSelectedZone(null); setSelectedSite(null); }}
            className="text-green-600 font-medium hover:underline"
          >
            Zones
          </button>
          {selectedZone && (
            <>
              <span>›</span>
              <button
                onClick={() => { setView("sites"); setSelectedSite(null); }}
                className={`font-medium hover:underline ${view === "sites" ? "text-gray-700" : "text-green-600"}`}
              >
                {currentZone?.icon} {currentZone?.name}
              </button>
            </>
          )}
          {selectedSite && (
            <>
              <span>›</span>
              <span className="text-gray-700 font-medium truncate">{selectedSite.name}</span>
            </>
          )}
        </div>
      )}

      {/* VUE: Zones */}
      {view === "zones" && (
        <div className="space-y-3">
          <p className="text-xs text-gray-500 text-center">
            Sélectionne une zone pour voir les sites
          </p>
          {ZONES.map((zone) => (
            <button
              key={zone.id}
              onClick={() => handleZoneSelect(zone.id)}
              className={`w-full text-left p-4 rounded-2xl border-2 ${zone.bgColor} ${zone.borderColor} transition-all hover:shadow-md`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{zone.icon}</span>
                  <div>
                    <p className={`font-bold text-base ${zone.color}`}>{zone.name}</p>
                    <p className="text-xs text-gray-500">{zone.distance}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-2xl font-bold ${zone.color}`}>{zone.sites.length}</p>
                  <p className="text-xs text-gray-500">sites</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {zone.sites.map((site) => (
                  <span
                    key={site.id}
                    className="text-xs bg-white bg-opacity-70 text-gray-600 px-2 py-0.5 rounded-full border border-gray-200"
                  >
                    {site.name}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* VUE: Sites d'une zone */}
      {view === "sites" && currentZone && (
        <div className="space-y-2">
          <p className="text-xs text-gray-500 text-center">
            {currentZone.sites.length} sites dans la zone {currentZone.name}
          </p>
          {currentZone.sites.map((site) => (
            <button
              key={site.id}
              onClick={() => handleSiteSelect(site)}
              className={`w-full text-left p-4 rounded-2xl border ${currentZone.bgColor} ${currentZone.borderColor} hover:shadow-md transition-all`}
            >
              <p className={`font-bold text-sm ${currentZone.color} mb-1`}>{site.name}</p>
              <div className="flex flex-wrap gap-1">
                {site.sports.slice(0, 3).map((sport) => (
                  <span key={sport} className="text-xs text-gray-600 bg-white px-2 py-0.5 rounded-full border border-gray-100">
                    {sport}
                  </span>
                ))}
                {site.sports.length > 3 && (
                  <span className="text-xs text-gray-400 bg-white px-2 py-0.5 rounded-full border border-gray-100">
                    +{site.sports.length - 3}
                  </span>
                )}
              </div>
              <div className="flex gap-2 mt-2">
                {site.transport.map((t) => (
                  <span key={t.type} className="text-xs bg-white text-gray-700 px-2 py-0.5 rounded-full border border-gray-200 font-medium">
                    {t.icon} {t.type}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* VUE: Détail d'un site */}
      {view === "detail" && selectedSite && (
        <div className="space-y-3">
          {/* Nom traduit */}
          <div className={`rounded-2xl p-4 border-2 ${currentZone?.bgColor} ${currentZone?.borderColor}`}>
            <p className="text-xs text-gray-500 mb-1">📍 Site — {getLangFlag(toLang)} {getLangName(toLang)}</p>
            {isTranslating ? (
              <div className="flex items-center gap-2 text-green-600">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
                <span className="text-sm">Traduction en cours...</span>
              </div>
            ) : (
              <p className={`font-bold text-lg ${currentZone?.color}`}>
                {translatedSiteName || selectedSite.name}
              </p>
            )}
          </div>

          {/* Sports */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
              🏅 Sports & Épreuves
            </p>
            <div className="flex flex-wrap gap-2">
              {(isTranslating ? selectedSite.sports : translatedSports).map((sport, i) => (
                <span
                  key={i}
                  className={`text-xs px-3 py-1.5 rounded-xl border font-medium ${currentZone?.bgColor} ${currentZone?.color} ${currentZone?.borderColor}`}
                >
                  {sport}
                </span>
              ))}
            </div>
          </div>

          {/* Transports */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
              🚌 Comment y aller
            </p>
            <div className="space-y-2">
              {selectedSite.transport.map((t, i) => (
                <div key={t.type} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <span className="text-lg flex-shrink-0">{t.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-700 mb-0.5">{t.type}</p>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {isTranslating
                        ? t.detail
                        : translatedTransport[i] || t.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Phrases transport rapides */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
              ⚡ Phrases transport utiles
            </p>
            <div className="space-y-2">
              {TRANSPORT_PHRASES.general.map((phrase) => (
                <button
                  key={phrase}
                  onClick={() => onPhraseSelect(phrase)}
                  className="w-full text-left px-3 py-2.5 rounded-xl bg-gray-50 hover:bg-green-50 hover:text-green-700 text-xs text-gray-700 transition-all border border-transparent hover:border-green-200 font-medium"
                >
                  {phrase} →
                </button>
              ))}
            </div>
          </div>

          {/* Coordonnées GPS */}
          <div className="bg-gray-50 rounded-2xl border border-gray-100 p-3 text-center">
            <p className="text-xs text-gray-400">📍 GPS: {selectedSite.coords}</p>
          </div>
        </div>
      )}
    </div>
  );
}