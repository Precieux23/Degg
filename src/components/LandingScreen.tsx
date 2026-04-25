"use client";

import { useState, useEffect, useCallback } from "react";
import { LANGUAGES } from "@/lib/languages";
import { translateBatch } from "@/lib/translate";

interface Props {
  onStart: (lang: string) => void;
}

const JOJ_DATE = new Date("2026-08-01T00:00:00Z");

function getDaysRemaining() {
  return Math.max(0, Math.ceil((JOJ_DATE.getTime() - Date.now()) / 86400000));
}

const FR_CONTENT = {
  tagline1: "JEUX OLYMPIQUES DE LA JEUNESSE",
  appSubtitle: "Votre compagnon officiel · Dakar 2026",
  daysLabel: "jours avant les JOJ",
  langLabel: "Choisissez votre langue",
  cta: "Commencer",
  featuresTitle: "Fonctionnalités",
  pwa: "Application installable · Fonctionne hors-ligne",
  features: [
    { title: "Traduction instantanée", desc: "13 langues dont le Wolof" },
    { title: "Phrases JOJ prêtes", desc: "Expressions essentielles par catégorie" },
    { title: "Conversation bilingue", desc: "Échange en temps réel entre 2 personnes" },
    { title: "Carte des sites JOJ", desc: "8 sites · 3 zones avec cartes et transports" },
    { title: "Assistant JOJ", desc: "Transport, SIM, restaurants, urgences, culture" },
  ],
};

type Content = typeof FR_CONTENT;

export default function LandingScreen({ onStart }: Props) {
  const [lang, setLang] = useState("FR");
  const [days, setDays] = useState(0);
  const [content, setContent] = useState<Content>(FR_CONTENT);
  const [isTranslating, setIsTranslating] = useState(false);

  // Client-only countdown to avoid hydration mismatch
  useEffect(() => {
    setDays(getDaysRemaining());
    const id = setInterval(() => setDays(getDaysRemaining()), 60000);
    return () => clearInterval(id);
  }, []);

  const translateContent = useCallback(async (targetLang: string) => {
    if (targetLang === "FR") {
      setContent(FR_CONTENT);
      return;
    }
    setIsTranslating(true);
    try {
      // Build flat array: fixed strings + feature titles + feature descs
      const fixedTexts = [
        FR_CONTENT.tagline1,
        FR_CONTENT.appSubtitle,
        FR_CONTENT.daysLabel,
        FR_CONTENT.langLabel,
        FR_CONTENT.cta,
        FR_CONTENT.featuresTitle,
        FR_CONTENT.pwa,
      ];
      const featureTitles = FR_CONTENT.features.map((f) => f.title);
      const featureDescs = FR_CONTENT.features.map((f) => f.desc);
      const allTexts = [...fixedTexts, ...featureTitles, ...featureDescs];

      // Single batch API call
      const translated = await translateBatch(allTexts, "FR", targetLang);
      if (translated.length !== allTexts.length) return;

      const n = FR_CONTENT.features.length;
      const base = fixedTexts.length;

      setContent({
        tagline1: translated[0] || FR_CONTENT.tagline1,
        appSubtitle: translated[1] || FR_CONTENT.appSubtitle,
        daysLabel: translated[2] || FR_CONTENT.daysLabel,
        langLabel: translated[3] || FR_CONTENT.langLabel,
        cta: translated[4] || FR_CONTENT.cta,
        featuresTitle: translated[5] || FR_CONTENT.featuresTitle,
        pwa: translated[6] || FR_CONTENT.pwa,
        features: FR_CONTENT.features.map((f, i) => ({
          title: translated[base + i] || f.title,
          desc: translated[base + n + i] || f.desc,
        })),
      });
    } finally {
      setIsTranslating(false);
    }
  }, []);

  const handleLangChange = (newLang: string) => {
    setLang(newLang);
    translateContent(newLang);
  };

  const selectedFlag = LANGUAGES.find((l) => l.code === lang)?.flag ?? "";

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">

      {/* ── HERO (dark) — tout tient dans un viewport mobile ───── */}
      <div
        className="relative flex flex-col items-center px-5 py-8"
        style={{
          background:
            "linear-gradient(170deg, #071a10 0%, #0a2a16 40%, #0f3d22 70%, #143d28 100%)",
          minHeight: "100svh",
        }}
      >
        {/* Decorative blobs */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute -top-12 right-0 w-64 h-64 rounded-full opacity-15"
            style={{ background: "radial-gradient(circle, #ffd34d 0%, transparent 70%)" }}
          />
          <div
            className="absolute bottom-1/3 -left-16 w-56 h-56 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, #ff7a1a 0%, transparent 70%)" }}
          />
          {/* Track arcs */}
          {[100, 140, 180].map((r) => (
            <div
              key={r}
              aria-hidden
              className="absolute bottom-0 left-1/2 rounded-full border opacity-[0.07]"
              style={{
                width: r * 2,
                height: r,
                borderColor: "#ffd34d",
                transform: "translateX(-50%)",
                borderBottomWidth: 0,
              }}
            />
          ))}
        </div>

        {/* Top: branding */}
        <div className="relative flex flex-col items-center flex-shrink-0 mb-5">
          {/* Torch flame */}
          <div
            className="mb-1"
            style={{
              width: 22,
              height: 36,
              background:
                "radial-gradient(ellipse at 50% 90%, #ffd34d 0%, #ff7a1a 45%, #dc2626 80%, transparent 100%)",
              borderRadius: "50% 50% 30% 30% / 60% 60% 40% 40%",
              animation: "joj-flame 1.4s ease-in-out infinite alternate",
              filter: "blur(0.5px)",
            }}
          />
          <div
            style={{
              width: 7,
              height: 18,
              background: "linear-gradient(to bottom, #b8973a, #7a5e1a)",
              borderRadius: "2px 2px 3px 3px",
              marginTop: -3,
            }}
          />
        </div>

        {/* App logo */}
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3 shadow-2xl flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #0fa958, #ff7a1a)" }}
        >
          <span className="text-white font-black text-2xl tracking-tighter">D</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-black text-white tracking-tight leading-none mb-1 flex-shrink-0">
          DÉGG
        </h1>

        <p
          className="font-black tracking-[0.25em] text-yellow-400 text-[10px] uppercase mb-1 flex-shrink-0"
          style={{ opacity: isTranslating ? 0.4 : 1, transition: "opacity 0.3s" }}
        >
          DAKAR 2026
        </p>

        <p
          className="text-xs text-white/50 text-center mb-4 flex-shrink-0"
          style={{ opacity: isTranslating ? 0.4 : 1, transition: "opacity 0.3s" }}
        >
          {content.tagline1}
        </p>

        {/* Countdown */}
        <div className="flex flex-col items-center mb-5 flex-shrink-0">
          <span className="text-5xl font-black text-white tabular-nums leading-none">
            {days}
          </span>
          <span
            className="text-[10px] text-white/40 font-semibold uppercase tracking-widest mt-0.5"
            style={{ opacity: isTranslating ? 0.4 : 1, transition: "opacity 0.3s" }}
          >
            {content.daysLabel}
          </span>
        </div>

        {/* Language selector — visible in initial viewport */}
        <div className="w-full max-w-sm flex-shrink-0 mb-3">
          <p
            className="text-[11px] font-bold text-white/50 text-center mb-2 uppercase tracking-wide"
            style={{ opacity: isTranslating ? 0.4 : 1, transition: "opacity 0.3s" }}
          >
            {content.langLabel}
          </p>
          <select
            value={lang}
            onChange={(e) => handleLangChange(e.target.value)}
            className="w-full rounded-2xl px-4 py-3 text-base font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-400 shadow-lg"
            style={{
              background: "rgba(255,255,255,0.95)",
              border: "2px solid rgba(255,211,77,0.5)",
            }}
            aria-label="Langue principale"
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.flag} {l.name}
              </option>
            ))}
          </select>
          {isTranslating && (
            <p className="text-[11px] text-green-400 text-center mt-1.5 font-semibold">
              {lang === "FR" ? "" : "Traduction en cours..."}
            </p>
          )}
        </div>

        {/* CTA — visible in initial viewport */}
        <button
          onClick={() => onStart(lang)}
          disabled={isTranslating}
          className="w-full max-w-sm py-4 rounded-2xl font-black text-lg text-white shadow-2xl transition-transform active:scale-95 disabled:opacity-60 flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #0fa958, #ff7a1a)" }}
        >
          {content.cta} {selectedFlag}
        </button>

        {/* Scroll hint */}
        <div className="flex flex-col items-center mt-5 flex-shrink-0">
          <p
            className="text-[10px] text-white/30 uppercase tracking-widest mb-2"
            style={{ opacity: isTranslating ? 0.3 : 1, transition: "opacity 0.3s" }}
          >
            {content.featuresTitle}
          </p>
          <div className="flex flex-col gap-0.5 items-center opacity-30">
            <div className="w-4 h-0.5 bg-white/60 rounded" />
            <div className="w-3 h-0.5 bg-white/40 rounded" />
            <div className="w-2 h-0.5 bg-white/20 rounded" />
          </div>
        </div>
      </div>

      {/* ── FEATURES (white) — scrollable below the fold ──────── */}
      <div className="bg-white px-5 pt-6 pb-10 max-w-md w-full mx-auto space-y-3">
        <p
          className="text-xs font-bold text-gray-400 uppercase tracking-wide text-center"
          style={{ opacity: isTranslating ? 0.4 : 1, transition: "opacity 0.3s" }}
        >
          {content.featuresTitle}
        </p>

        {content.features.map((f, i) => {
          const gradients = [
            "linear-gradient(135deg,#0fa958,#0c8a48)",
            "linear-gradient(135deg,#ff7a1a,#e86910)",
            "linear-gradient(135deg,#ffd34d,#c9a000)",
            "linear-gradient(135deg,#0fa958,#ff7a1a)",
            "linear-gradient(135deg,#0c8a48,#143d28)",
          ];
          return (
            <div
              key={i}
              className="flex items-center gap-3 bg-gray-50 rounded-2xl px-4 py-3 border border-gray-100"
              style={{ opacity: isTranslating ? 0.4 : 1, transition: "opacity 0.3s" }}
            >
              <div
                className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center text-white text-xs font-black"
                style={{ background: gradients[i] }}
              >
                {i + 1}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-gray-800 truncate">{f.title}</p>
                <p className="text-xs text-gray-500 truncate">{f.desc}</p>
              </div>
            </div>
          );
        })}

        <p
          className="text-xs text-gray-400 text-center pt-2"
          style={{ opacity: isTranslating ? 0.4 : 1, transition: "opacity 0.3s" }}
        >
          {content.pwa}
        </p>
      </div>
    </div>
  );
}
