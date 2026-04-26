"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { matchIntent, FALLBACK_RESPONSE, QUICK_QUESTIONS, ChatMessage, ChatIntent } from "@/lib/chatbot";
import { LANGUAGES } from "@/lib/languages";
import { translateText, translateBatch } from "@/lib/translate";

interface Props {
  defaultLang: string;
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  // UI strings translated in userLang (from page.tsx)
  headerTitle?: string;
  headerSubtitle?: string;
  quickQuestionsLabel?: string;
  newConvLabel?: string;
  tipText?: string;
  tipTab?: string;
  inputPlaceholder?: string;
}

const WELCOME_FR =
  "Bonjour. Je suis votre assistant JOJ Dakar 2026.\n\nPosez-moi vos questions sur les transports, restaurants, cartes SIM, urgences, culture, visas, météo ou tout autre sujet lié aux Jeux. Je réponds dans votre langue.";

function renderText(text: string) {
  const lines = text.split("\n");
  return lines.map((line, i) => (
    <span key={i}>
      {line}
      {i < lines.length - 1 && <br />}
    </span>
  ));
}

export default function ChatbotAssistant({
  defaultLang,
  messages,
  setMessages,
  headerTitle = "Assistant JOJ Dakar 2026",
  headerSubtitle = "Transport · Restaurants · SIM · Urgences · Culture",
  quickQuestionsLabel = "Questions fréquentes",
  newConvLabel = "Nouvelle conversation",
  tipText = "Besoin de traduire une phrase précise ? Utilisez l'onglet",
  tipTab = "Traduction",
  inputPlaceholder = "Posez votre question...",
}: Props) {
  const [chatLang, setChatLang] = useState(defaultLang);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showQuick, setShowQuick] = useState(messages.length <= 1);
  const [quickLabels, setQuickLabels] = useState(QUICK_QUESTIONS.map((q) => q.label));
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  const getLangName = (code: string) => LANGUAGES.find((l) => l.code === code)?.name || code;

  const setWelcome = useCallback(
    async (lang: string) => {
      if (lang === "FR") {
        setMessages([{ id: "welcome", role: "bot", text: WELCOME_FR }]);
        return;
      }
      const translated = await translateText(WELCOME_FR, "FR", lang);
      setMessages([{ id: "welcome", role: "bot", text: translated || WELCOME_FR }]);
    },
    [setMessages]
  );

  useEffect(() => {
    if (!initialized.current && messages.length === 0) {
      initialized.current = true;
      setWelcome(defaultLang);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Translate quick questions when chatLang changes
  useEffect(() => {
    if (chatLang === "FR") {
      setQuickLabels(QUICK_QUESTIONS.map((q) => q.label));
      return;
    }
    translateBatch(QUICK_QUESTIONS.map((q) => q.label), "FR", chatLang).then((translated) => {
      setQuickLabels(translated.map((t, i) => t || QUICK_QUESTIONS[i].label));
    });
  }, [chatLang]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    setShowQuick(messages.length <= 1);
  }, [messages.length]);

  const processMessage = async (userText: string) => {
    if (!userText.trim() || isProcessing) return;

    const msgId = Date.now().toString();
    setMessages((prev) => [...prev, { id: msgId, role: "user", text: userText }]);
    setInput("");
    setIsProcessing(true);
    setShowQuick(false);

    const loadingId = msgId + "_l";
    setMessages((prev) => [...prev, { id: loadingId, role: "bot", text: "", isLoading: true }]);

    try {
      let frInput = userText;
      if (chatLang !== "FR") {
        frInput = (await translateText(userText, chatLang, "FR")) || userText;
      }

      const intent = matchIntent(frInput);
      const frResponse = intent ? intent.response : FALLBACK_RESPONSE;

      let finalText = frResponse;
      if (chatLang !== "FR") {
        finalText = (await translateText(frResponse, "FR", chatLang)) || frResponse;
      }

      setMessages((prev) =>
        prev
          .filter((m) => m.id !== loadingId)
          .concat({
            id: loadingId + "_r",
            role: "bot",
            text: finalText,
            intent: intent ?? undefined,
          })
      );
    } catch {
      setMessages((prev) =>
        prev
          .filter((m) => m.id !== loadingId)
          .concat({ id: loadingId + "_e", role: "bot", text: "Une erreur est survenue. Réessayez." })
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLangChange = async (newLang: string) => {
    setChatLang(newLang);
    await setWelcome(newLang);
    setShowQuick(true);
  };

  return (
    <div className="space-y-3">
      {/* Header — solid green, no gradient */}
      <div className="rounded-2xl p-4" style={{ background: "#0fa958" }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white font-bold text-sm">{headerTitle}</p>
            <p className="text-white/70 text-xs mt-0.5">{headerSubtitle}</p>
          </div>
          <select
            value={chatLang}
            onChange={(e) => handleLangChange(e.target.value)}
            className="bg-white/20 border border-white/30 text-white rounded-xl px-2 py-1.5 text-xs font-semibold focus:outline-none"
            aria-label="Langue de l'assistant"
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code} className="text-gray-800 bg-white">
                {l.flag} {l.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quick questions */}
      {showQuick && (
        <div className="bg-white rounded-2xl border border-gray-100 p-3 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">
            {quickQuestionsLabel}
          </p>
          <div className="grid grid-cols-2 gap-2">
            {QUICK_QUESTIONS.map((q, i) => (
              <button
                key={q.label}
                onClick={() => processMessage(q.label)}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-gray-50 hover:bg-green-50 hover:border-green-200 border border-transparent text-left transition-all"
              >
                <span className="text-xs text-gray-700 font-medium leading-tight">
                  {quickLabels[i] || q.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat messages */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="max-h-80 overflow-y-auto p-3 space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.isLoading ? (
                <div className="flex items-center gap-1.5 px-4 py-3 bg-gray-100 rounded-2xl rounded-tl-sm">
                  {[0, 150, 300].map((d) => (
                    <div
                      key={d}
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: `${d}ms` }}
                    />
                  ))}
                </div>
              ) : msg.role === "user" ? (
                <div className="max-w-[85%] text-white rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm" style={{ background: "#0fa958" }}>
                  {msg.text}
                </div>
              ) : (
                <div className="max-w-[90%] space-y-2">
                  <div className="bg-gray-50 border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3">
                    {(msg as { intent?: ChatIntent }).intent && (
                      <p className="text-xs font-bold mb-1.5" style={{ color: "#0fa958" }}>
                        {(msg as { intent: ChatIntent }).intent.title}
                      </p>
                    )}
                    <p className="text-sm text-gray-800 leading-relaxed">
                      {renderText(msg.text)}
                    </p>
                  </div>
                  {(msg as { intent?: ChatIntent }).intent?.actions?.length ? (
                    <div className="flex flex-wrap gap-2">
                      {(msg as { intent: ChatIntent }).intent.actions.map((action) => (
                        <a
                          key={action.url}
                          href={action.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-2 text-white text-xs font-bold rounded-xl transition-all"
                          style={{ background: "#0c8a48" }}
                        >
                          {action.label}
                        </a>
                      ))}
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-gray-100 p-3 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                processMessage(input);
              }
            }}
            placeholder={`${inputPlaceholder} (${getLangName(chatLang)})`}
            className="flex-1 text-sm text-gray-800 bg-gray-50 rounded-xl px-3 py-2 outline-none focus:ring-2 placeholder-gray-300"
            style={{ "--tw-ring-color": "#0fa958" } as React.CSSProperties}
            disabled={isProcessing}
          />
          <button
            onClick={() => processMessage(input)}
            disabled={!input.trim() || isProcessing}
            className="px-4 py-2 text-white text-xs font-bold rounded-xl disabled:opacity-40 transition-all flex-shrink-0"
            style={{ background: "#0fa958" }}
          >
            {isProcessing ? "..." : "→"}
          </button>
        </div>
      </div>

      {/* Reset */}
      {messages.length > 1 && (
        <button
          onClick={() => {
            setWelcome(chatLang);
            setShowQuick(true);
          }}
          className="w-full py-2.5 rounded-xl text-xs font-medium text-gray-400 hover:text-gray-600 hover:bg-gray-50 border border-gray-100 transition-all"
        >
          {newConvLabel}
        </button>
      )}

      {/* Tip */}
      <div className="bg-gray-50 rounded-2xl border border-gray-100 p-3 text-center">
        <p className="text-xs text-gray-500">
          {tipText}{" "}
          <span className="font-bold" style={{ color: "#0fa958" }}>{tipTab}</span>
        </p>
      </div>
    </div>
  );
}
