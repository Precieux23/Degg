"use client";

import Image from "next/image";
import { useEffect, useRef, useState, startTransition } from "react";
import { translateText } from "@/lib/translate";

export type GuideKey =
  | "welcome"
  | "tabs"
  | "translate_language"
  | "translate_input"
  | "translate_voice"
  | "translate_output"
  | "phrases"
  | "conversation"
  | "mobilite"
  | "assistant";

const ORDER: GuideKey[] = [
  "welcome",
  "tabs",
  "translate_language",
  "translate_input",
  "translate_voice",
  "translate_output",
  "phrases",
  "conversation",
  "mobilite",
  "assistant",
];

type Props = {
  open: boolean;
  onClose: () => void;
  activeTab: "translate" | "phrases" | "conversation" | "mobilite" | "chatbot";
  isListening: boolean;
  isLoading: boolean;
  hasInput: boolean;
  hasOutput: boolean;
  initialStep?: GuideKey;
  locale: string;
};

function stepFromTab(tab: Props["activeTab"]): GuideKey {
  if (tab === "phrases") return "phrases";
  if (tab === "conversation") return "conversation";
  if (tab === "mobilite") return "mobilite";
  if (tab === "chatbot") return "assistant";
  return "translate_language";
}

type StepContent = { title: string; body: string };
type I18N = { steps: Record<GuideKey, StepContent> };

const FR: I18N = {
  steps: {
    welcome: {
      title: "Bienvenue sur DÉGG",
      body: "Je suis votre guide JOJ Dakar 2026.\n\nDEGG vous permet de traduire en direct, utiliser les phrases JOJ, discuter en mode conversation, consulter la carte des sites et poser vos questions à l'Assistant JOJ.\n\nAppuyez sur le bouton Guide d'utilisation à tout moment pour me retrouver.",
    },
    tabs: {
      title: "Choisissez votre mode",
      body: "Traduction : texte ou microphone.\nPhrases JOJ : expressions prêtes à l'emploi.\nConversation : échange A et B, traduction automatique.\nCarte JOJ : carte interactive des 8 sites.\nAssistant JOJ : questions pratiques, transport, SIM.",
    },
    translate_language: {
      title: "Langues",
      body: "Choisissez la langue de départ à gauche et la langue cible à droite.\n\nLe bouton au centre inverse les langues instantanément.",
    },
    translate_input: {
      title: "Saisie rapide",
      body: "Tapez votre message. La traduction se lance automatiquement après une courte pause.\n\nConseil : faites des phrases courtes pour une traduction plus précise.",
    },
    translate_voice: {
      title: "Microphone",
      body: "Appuyez sur Parler, puis parlez.\n\nLe texte se remplit automatiquement si votre navigateur supporte la reconnaissance vocale. Fonctionne mieux sur Chrome.",
    },
    translate_output: {
      title: "Résultat et audio",
      body: "La traduction s'affiche ici en vert.\n\nAppuyez sur Écouter pour la faire lire à voix haute dans la langue cible.",
    },
    phrases: {
      title: "Phrases JOJ",
      body: "Choisissez votre langue cible, puis appuyez sur une phrase.\n\nElle est envoyée dans l'onglet Traduction et la traduction arrive instantanément.",
    },
    conversation: {
      title: "Conversation A et B",
      body: "Deux personnes parlent chacune dans sa langue.\n\nAprès envoi, la traduction s'affiche de l'autre côté et peut être lue à voix haute automatiquement.",
    },
    mobilite: {
      title: "Carte des sites JOJ",
      body: "Explorez les 8 sites JOJ répartis en 3 zones : Dakar, Diamniadio et Saly.\n\n1. Sélectionnez une zone\n2. Choisissez un site\n3. Consultez la carte interactive et les transports disponibles\n4. Ouvrez Google Maps pour y naviguer",
    },
    assistant: {
      title: "Assistant JOJ",
      body: "L'assistant répond à vos questions en temps réel dans votre langue.\n\nTransports (TER, BRT, Yango, taxi), restaurants, cartes SIM, urgences, météo, culture locale, visa, argent, plages, shopping...\n\nPosez votre question librement en français ou dans n'importe quelle langue.",
    },
  },
};

const EN: I18N = {
  steps: {
    welcome: {
      title: "Welcome to DÉGG",
      body: "I am your JOJ Dakar 2026 guide.\n\nDEGG lets you translate instantly, use JOJ phrases, chat in conversation mode, explore the site map, and ask questions to the JOJ Assistant.\n\nTap the User Guide button at any time to find me again.",
    },
    tabs: {
      title: "Choose your mode",
      body: "Translation: text or microphone.\nJOJ Phrases: ready-to-use expressions.\nConversation: A and B exchange with auto translation.\nJOJ Map: interactive map of all 8 sites.\nJOJ Assistant: practical questions, transport, SIM.",
    },
    translate_language: {
      title: "Languages",
      body: "Choose the source language on the left and the target language on the right.\n\nThe button in the center swaps them instantly.",
    },
    translate_input: {
      title: "Quick input",
      body: "Type your message. Translation starts automatically after a short pause.\n\nTip: keep sentences short for more accurate translation.",
    },
    translate_voice: {
      title: "Microphone",
      body: "Tap Speak, then talk.\n\nText fills in automatically if your browser supports speech recognition. Works best on Chrome.",
    },
    translate_output: {
      title: "Result and audio",
      body: "Your translation appears here in green.\n\nTap Listen to hear it read aloud in the target language.",
    },
    phrases: {
      title: "JOJ Phrases",
      body: "Pick a target language, then tap a phrase.\n\nIt jumps to the Translation tab and returns instantly.",
    },
    conversation: {
      title: "A and B Conversation",
      body: "Two people speak in their own language.\n\nAfter sending, the translation shows on the other side and can be read aloud automatically.",
    },
    mobilite: {
      title: "JOJ Sites Map",
      body: "Explore the 8 JOJ sites across 3 zones: Dakar, Diamniadio and Saly.\n\n1. Select a zone\n2. Choose a site\n3. View the interactive map and available transport\n4. Open Google Maps to navigate there",
    },
    assistant: {
      title: "JOJ Assistant",
      body: "The assistant answers your questions in real time in your language.\n\nTransport (TER, BRT, Yango, taxi), restaurants, SIM cards, emergencies, weather, local culture, visas, money, beaches, shopping...\n\nAsk freely in French or any language.",
    },
  },
};

export default function GuideCoach(props: Props) {
  const { open, onClose, initialStep, activeTab, locale } = props;

  const initialIndex = (() => {
    const t = initialStep ?? "welcome";
    const i = ORDER.indexOf(t);
    return i >= 0 ? i : 0;
  })();

  const [idx, setIdx] = useState(initialIndex);
  const [translatedStep, setTranslatedStep] = useState<StepContent | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const cache = useRef<Map<string, StepContent>>(new Map());

  useEffect(() => {
    if (!open || !initialStep) return;
    const newIdx = ORDER.indexOf(initialStep);
    startTransition(() => {
      if (newIdx >= 0) setIdx(newIdx);
    });
  }, [open, initialStep]);

  const stepKey = ORDER[idx];
  const langCode = locale.toUpperCase();
  const isNative = langCode === "FR" || langCode === "EN" || langCode === "EN-GB";
  const baseI18N = langCode === "FR" ? FR : EN;
  const baseStep = baseI18N.steps[stepKey];

  useEffect(() => {
    if (!open) return;

    if (isNative) {
      startTransition(() => setTranslatedStep(null));
      return;
    }

    const key = `${langCode}__${stepKey}`;
    if (cache.current.has(key)) {
      startTransition(() => setTranslatedStep(cache.current.get(key)!));
      return;
    }

    const run = async () => {
      startTransition(() => { setTranslatedStep(null); setIsTranslating(true); });
      const frStep = FR.steps[stepKey];
      const [title, body] = await Promise.all([
        translateText(frStep.title, "FR", langCode),
        translateText(frStep.body, "FR", langCode),
      ]);
      const result: StepContent = { title: title || frStep.title, body: body || frStep.body };
      cache.current.set(key, result);
      startTransition(() => { setTranslatedStep(result); setIsTranslating(false); });
    };

    run();
  }, [open, stepKey, langCode, isNative]);

  if (!open) return null;

  const display: StepContent = translatedStep || baseStep;

  const canGoPrev = idx > 0;
  const canGoNext = idx < ORDER.length - 1;

  const tabLabel =
    activeTab === "translate"
      ? "Traduction"
      : activeTab === "phrases"
      ? "Phrases JOJ"
      : activeTab === "mobilite"
      ? "Carte JOJ"
      : activeTab === "chatbot"
      ? "Assistant JOJ"
      : "Conversation";

  const hint =
    stepKey === "translate_input" && props.hasInput
      ? "Du texte est détecté, la traduction arrive."
      : stepKey === "translate_voice" && props.isListening
      ? "Micro actif. Parlez maintenant."
      : stepKey === "translate_output" && props.hasOutput && !props.isLoading
      ? "Appuyez sur Écouter pour la lecture audio."
      : null;

  return (
    <div className="joj-overlay" role="dialog" aria-modal="true">
      <div className="joj-coach">
        {/* Top bar */}
        <div className="joj-coach-top">
          <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
            <span className="joj-badge" style={{ padding: "6px 10px", borderRadius: 999, fontWeight: 900, fontSize: 12, background: "rgba(255,255,255,0.70)", whiteSpace: "nowrap" }}>
              Guide d&apos;utilisation · {idx + 1}/{ORDER.length}
            </span>
            <span
              style={{ fontWeight: 900, color: "var(--joj-ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", opacity: isTranslating ? 0.4 : 1 }}
              title={display.title}
            >
              {display.title}
            </span>
          </div>
          <button className="joj-btn joj-btn-ghost" onClick={onClose} aria-label="Fermer">
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="joj-coach-body">
          <Image src="/guide/portrait.png" alt="Guide" width={220} height={220} className="joj-portrait" priority />
          <div className="joj-bubble">
            {isTranslating && (
              <div className="flex gap-1 mb-3">
                {[0, 150, 300].map((d) => (
                  <div key={d} className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
                ))}
              </div>
            )}

            <p style={{ whiteSpace: "pre-line", color: "rgba(11,18,32,0.88)", fontSize: 14, lineHeight: 1.5, margin: 0, opacity: isTranslating ? 0.4 : 1 }}>
              {display.body}
            </p>

            <div style={{ marginTop: 10, fontSize: 12, opacity: 0.6 }}>
              Mode actuel : {tabLabel}
              {props.isListening ? " · Micro actif" : ""}
              {props.isLoading ? " · Traduction en cours" : ""}
            </div>

            {hint && (
              <div style={{ marginTop: 8, fontSize: 12, fontWeight: 900, color: "rgba(15,169,88,0.95)" }}>
                {hint}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="joj-coach-actions">
          <button
            className="joj-btn"
            onClick={() => canGoPrev && setIdx((v) => v - 1)}
            disabled={!canGoPrev}
            style={{ opacity: canGoPrev ? 1 : 0.4 }}
          >
            Précédent
          </button>

          <button
            className="joj-btn joj-btn-ghost"
            onClick={() => {
              const target = stepFromTab(activeTab);
              const i = ORDER.indexOf(target);
              startTransition(() => setIdx(i >= 0 ? i : 0));
            }}
          >
            Mon écran actuel
          </button>

          <button className="joj-btn joj-btn-ghost" onClick={() => startTransition(() => setIdx(0))}>
            Recommencer
          </button>

          <button
            className="joj-btn joj-btn-primary"
            onClick={() => {
              if (canGoNext) setIdx((v) => v + 1);
              else onClose();
            }}
          >
            {canGoNext ? "Suivant" : "Compris"}
          </button>
        </div>
      </div>
    </div>
  );
}
