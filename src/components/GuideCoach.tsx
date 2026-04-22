"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

export type GuideKey =
  | "welcome"
  | "tabs"
  | "translate_language"
  | "translate_input"
  | "translate_voice"
  | "translate_output"
  | "phrases"
  | "conversation";

export type GuideLocale = "fr" | "en";

type Props = {
  open: boolean;
  onClose: () => void;

  activeTab: "translate" | "phrases" | "conversation";
  isListening: boolean;
  isLoading: boolean;
  hasInput: boolean;
  hasOutput: boolean;

  initialStep?: GuideKey;

  /* Langue contrôlée par l'app (header) */
  locale: GuideLocale;
  onLocaleChange: (locale: GuideLocale) => void;
};

const ORDER: GuideKey[] = [
  "welcome",
  "tabs",
  "translate_language",
  "translate_input",
  "translate_voice",
  "translate_output",
  "phrases",
  "conversation",
];

function stepFromTab(tab: Props["activeTab"]): GuideKey {
  if (tab === "phrases") return "phrases";
  if (tab === "conversation") return "conversation";
  return "translate_language";
}

const I18N: Record<
  GuideLocale,
  {
    ui: {
      guide: string;
      close: string;
      prev: string;
      next: string;
      understood: string;
      restart: string;
      goToMyScreen: string;
      step: (i: number, n: number) => string;
      language: string;
      modeLine: (mode: string) => string;
      micOn: string;
      loading: string;
    };
    steps: Record<GuideKey, { title: string; body: string }>;
    hints: {
      hasInput: string;
      listening: string;
      outputReady: string;
    };
    modes: {
      translate: string;
      phrases: string;
      conversation: string;
    };
  }
> = {
  fr: {
    ui: {
      guide: "GUIDE",
      close: "Fermer",
      prev: "← Précédent",
      next: "Suivant →",
      understood: "Compris",
      restart: "Recommencer",
      goToMyScreen: "Aller à mon écran",
      step: (i, n) => `ÉTAPE ${i}/${n}`,
      language: "Langue",
      modeLine: (mode) => `Mode actuel: ${mode}`,
      micOn: "Micro en cours",
      loading: "Traduction en cours",
    },
    modes: {
      translate: "🌐 Traduire",
      phrases: "⚡ Phrases JOJ",
      conversation: "💬 Conversation",
    },
    steps: {
      welcome: {
        title: "Bienvenue sur DÉGG",
        body:
          "Je suis ton guide.\n\nIci tu peux traduire en direct, utiliser les phrases JOJ, ou discuter en mode conversation A/B.\n\nTu peux me rappeler à tout moment avec le bouton Guide en bas à droite.",
      },
      tabs: {
        title: "Choisis ton mode",
        body:
          "🌐 Traduire: texte ou micro.\n⚡ Phrases JOJ: phrases prêtes à l’emploi.\n💬 Conversation: échange A/B, traduction + lecture auto.",
      },
      translate_language: {
        title: "Langues",
        body:
          "Choisis la langue de départ à gauche et la langue cible à droite.\n\nLe bouton ⇄ inverse les langues instantanément.",
      },
      translate_input: {
        title: "Saisie rapide",
        body:
          "Tape ton message. La traduction se lance automatiquement après une courte pause.\n\nAstuce: fais des phrases courtes pour une traduction plus fluide.",
      },
      translate_voice: {
        title: "Micro",
        body:
          "Appuie sur 🎤 Parler, puis parle.\n\nLe texte se remplit automatiquement si ton navigateur supporte la reconnaissance vocale.",
      },
      translate_output: {
        title: "Résultat + audio",
        body:
          "La traduction s’affiche ici.\n\nTu peux appuyer sur 🔊 Écouter pour la faire lire à voix haute.",
      },
      phrases: {
        title: "Phrases JOJ",
        body:
          "Choisis ta langue cible, puis tape sur une phrase.\n\nElle s’envoie dans Traduire et la traduction arrive instantanément.",
      },
      conversation: {
        title: "Conversation A/B",
        body:
          "Deux personnes parlent chacune dans sa langue.\n\nAprès envoi, la traduction s’affiche de l’autre côté et peut être lue à voix haute.",
      },
    },
    hints: {
      hasInput: "Je vois du texte, la traduction arrive bientôt.",
      listening: "Je t’écoute. Parle maintenant.",
      outputReady: "Tu peux appuyer sur 🔊 pour la lecture.",
    },
  },

  en: {
    ui: {
      guide: "GUIDE",
      close: "Close",
      prev: "← Back",
      next: "Next →",
      understood: "Got it",
      restart: "Restart",
      goToMyScreen: "Go to my screen",
      step: (i, n) => `STEP ${i}/${n}`,
      language: "Language",
      modeLine: (mode) => `Current mode: ${mode}`,
      micOn: "Mic is on",
      loading: "Translating",
    },
    modes: {
      translate: "🌐 Translate",
      phrases: "⚡ JOJ Phrases",
      conversation: "💬 Conversation",
    },
    steps: {
      welcome: {
        title: "Welcome to DÉGG",
        body:
          "I’m your guide.\n\nHere you can translate instantly, use JOJ phrases, or chat in A/B conversation mode.\n\nYou can open me anytime with the Guide button in the bottom right.",
      },
      tabs: {
        title: "Pick a mode",
        body:
          "🌐 Translate: text or mic.\n⚡ JOJ Phrases: ready-made phrases.\n💬 Conversation: A/B chat, translation + auto voice.",
      },
      translate_language: {
        title: "Languages",
        body:
          "Choose the source language on the left and the target language on the right.\n\nUse ⇄ to swap instantly.",
      },
      translate_input: {
        title: "Quick input",
        body:
          "Type your message. Translation starts automatically after a short pause.\n\nTip: keep sentences short for smoother translation.",
      },
      translate_voice: {
        title: "Microphone",
        body:
          "Tap 🎤 Speak, then talk.\n\nYour text will be filled automatically if your browser supports speech recognition.",
      },
      translate_output: {
        title: "Result + audio",
        body:
          "Your translation appears here.\n\nTap 🔊 Listen to hear it out loud.",
      },
      phrases: {
        title: "JOJ Phrases",
        body:
          "Pick a target language, then tap a phrase.\n\nIt jumps to Translate and returns instantly.",
      },
      conversation: {
        title: "A/B Conversation",
        body:
          "Two people speak in their own language.\n\nAfter sending, the translation shows on the other side and can be read aloud.",
      },
    },
    hints: {
      hasInput: "I see text, translation is coming.",
      listening: "I’m listening. Speak now.",
      outputReady: "You can tap 🔊 to listen.",
    },
  },
};

export default function GuideCoach(props: Props) {
  const { open, onClose, initialStep } = props;

  const t = I18N[props.locale];

  const initialIndex = useMemo(() => {
    const target = initialStep ?? "welcome";
    const idx = ORDER.indexOf(target);
    return idx >= 0 ? idx : 0;
  }, [initialStep]);

  const [idx, setIdx] = useState(initialIndex);

  useEffect(() => {
    if (!open) return;
    if (!initialStep) return;
    const newIdx = ORDER.indexOf(initialStep);
    if (newIdx >= 0) setIdx(newIdx);
  }, [open, initialStep]);

  if (!open) return null;

  const stepKey = ORDER[idx];
  const step = t.steps[stepKey];

  const canGoPrev = idx > 0;
  const canGoNext = idx < ORDER.length - 1;

  const modeLabel =
    props.activeTab === "translate"
      ? t.modes.translate
      : props.activeTab === "phrases"
      ? t.modes.phrases
      : t.modes.conversation;

  const hint =
    stepKey === "translate_input" && props.hasInput
      ? t.hints.hasInput
      : stepKey === "translate_voice" && props.isListening
      ? t.hints.listening
      : stepKey === "translate_output" && props.hasOutput && !props.isLoading
      ? t.hints.outputReady
      : null;

  return (
    <div className="joj-overlay" role="dialog" aria-modal="true">
      <div className="joj-coach">
        <div className="joj-coach-top">
          <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
            <span
              className="joj-badge"
              style={{
                padding: "6px 10px",
                borderRadius: 999,
                fontWeight: 950,
                fontSize: 12,
                background: "rgba(255,255,255,0.70)",
                whiteSpace: "nowrap",
              }}
            >
              {t.ui.guide} • {t.ui.step(idx + 1, ORDER.length)}
            </span>

            <span
              style={{
                fontWeight: 950,
                color: "var(--joj-ink)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
              title={step.title}
            >
              {step.title}
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <label style={{ fontSize: 12, fontWeight: 900, opacity: 0.8 }}>
              {t.ui.language}
            </label>

            <select
              value={props.locale}
              onChange={(e) => props.onLocaleChange(e.target.value as GuideLocale)}
              className="bg-white/70 border border-black/10 rounded-xl px-2 py-1 text-xs font-semibold outline-none"
              aria-label="Guide language"
              title="Guide language"
            >
              <option value="fr">Français</option>
              <option value="en">English</option>
            </select>

            <button className="joj-btn joj-btn-ghost" onClick={onClose} aria-label={t.ui.close}>
              ✕
            </button>
          </div>
        </div>

        <div className="joj-coach-body">
          <Image
            src="/guide/portrait.png"
            alt="Guide"
            width={220}
            height={220}
            className="joj-portrait"
            priority
          />

          <div className="joj-bubble">
            <p
              style={{
                whiteSpace: "pre-line",
                color: "rgba(11,18,32,0.88)",
                fontSize: 14,
                lineHeight: 1.45,
                margin: 0,
              }}
            >
              {step.body}
            </p>

            <div style={{ marginTop: 10, fontSize: 12, opacity: 0.72 }}>
              {t.ui.modeLine(modeLabel)}
              {props.isListening ? ` • ${t.ui.micOn}` : ""}
              {props.isLoading ? ` • ${t.ui.loading}` : ""}
            </div>

            {hint && (
              <div
                style={{
                  marginTop: 10,
                  fontSize: 12,
                  fontWeight: 900,
                  color: "rgba(15,169,88,0.95)",
                }}
              >
                {hint}
              </div>
            )}
          </div>
        </div>

        <div className="joj-coach-actions">
          <button
            className="joj-btn"
            onClick={() => canGoPrev && setIdx((v) => v - 1)}
            disabled={!canGoPrev}
            style={{ opacity: canGoPrev ? 1 : 0.4 }}
          >
            {t.ui.prev}
          </button>

          <button
            className="joj-btn joj-btn-ghost"
            onClick={() => {
              const target = stepFromTab(props.activeTab);
              const newIdx = ORDER.indexOf(target);
              setIdx(newIdx >= 0 ? newIdx : 0);
            }}
          >
            {t.ui.goToMyScreen}
          </button>

          <button className="joj-btn joj-btn-ghost" onClick={() => setIdx(0)}>
            {t.ui.restart}
          </button>

          <button
            className="joj-btn joj-btn-primary"
            onClick={() => {
              if (canGoNext) setIdx((v) => v + 1);
              else onClose();
            }}
          >
            {canGoNext ? t.ui.next : t.ui.understood}
          </button>
        </div>
      </div>
    </div>
  );
}