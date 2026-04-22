"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { LANGUAGES, JOJ_PHRASES } from "@/lib/languages";

function AssistantGuide({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 text-center">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-600 flex items-center justify-center text-white text-3xl font-bold">
          👨🏿‍🦱
        </div>
        <h2 className="text-lg font-bold text-gray-900">Bienvenue à DÉGG</h2>
        <p className="text-sm text-gray-600 mt-2">
          Je suis ton coach linguistique pour les JOJ Dakar 2026. 
          Je vais te guider pour traduire, apprendre des phrases essentielles et discuter en direct !
        </p>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition-all"
        >
          Commencer →
        </button>
      </div>
    </div>
  );
}

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [fromLang, setFromLang] = useState("FR");
  const [toLang, setToLang] = useState("WO");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeTab, setActiveTab] = useState<"translate" | "phrases" | "conversation">("translate");
  const [history, setHistory] = useState<{ input: string; output: string; from: string; to: string }[]>([]);
  const [convMessages, setConvMessages] = useState<{ text: string; lang: string; side: "A" | "B" }[]>([]);
  const [convInputA, setConvInputA] = useState("");
  const [convInputB, setConvInputB] = useState("");
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showGuide, setShowGuide] = useState(true);

  const getLangName = (code: string) =>
    LANGUAGES.find((l) => l.code === code)?.name || code;

  const getLangFlag = (code: string) =>
    LANGUAGES.find((l) => l.code === code)?.flag || "🌐";

  const translate = useCallback(async (text: string, from: string, to: string) => {
    if (!text.trim()) return null;
    setIsLoading(true);
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, from, to }),
      });
      const data = await res.json();
      if (data.translation) {
        setTranslatedText(data.translation);
        setHistory((prev) => [
          { input: text, output: data.translation, from, to },
          ...prev.slice(0, 9),
        ]);
        return data.translation;
      }
    } finally {
      setIsLoading(false);
    }
    return null;
  }, []);

  const speak = (text: string, lang: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const langMap: Record<string, string> = {
      FR: "fr-FR", EN: "en-GB", AR: "ar-SA", ES: "es-ES",
      PT: "pt-PT", ZH: "zh-CN", JA: "ja-JP", SW: "sw-KE", WO: "fr-SN",
    };
    utterance.lang = langMap[lang] || "fr-FR";
    utterance.rate = 0.9;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const startListening = (targetLang: string, onResult: (text: string) => void) => {
    const SpeechRecognition =
      window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Reconnaissance vocale non supportée sur ce navigateur. Utilisez Chrome.");
      return;
    }
    if (recognitionRef.current) recognitionRef.current.stop();
    const langMap: Record<string, string> = {
      FR: "fr-FR", EN: "en-GB", AR: "ar-SA", ES: "es-ES",
      PT: "pt-PT", ZH: "zh-CN", JA: "ja-JP", SW: "sw-KE", WO: "fr-SN",
    };
    const recognition = new SpeechRecognition();
    recognition.lang = langMap[targetLang] || "fr-FR";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (e) => {
      const text = e.results[0][0].transcript;
      onResult(text);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
    recognitionRef.current = recognition;
    setIsListening(true);
  };

  useEffect(() => {
    if (!inputText.trim()) { setTranslatedText(""); return; }
    const delay = setTimeout(() => translate(inputText, fromLang, toLang), 800);
    return () => clearTimeout(delay);
  }, [inputText, fromLang, toLang, translate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [convMessages]);

  const swapLanguages = () => {
    setFromLang(toLang);
    setToLang(fromLang);
    setInputText(translatedText);
    setTranslatedText(inputText);
  };

  const sendConvMessage = async (side: "A" | "B") => {
    const text = side === "A" ? convInputA : convInputB;
    const from = side === "A" ? fromLang : toLang;
    const to = side === "A" ? toLang : fromLang;
    if (!text.trim()) return;
    setConvMessages((prev) => [...prev, { text, lang: from, side }]);
    if (side === "A") setConvInputA(""); else setConvInputB("");
    const res = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, from, to }),
    });
    const data = await res.json();
    if (data.translation) {
      setConvMessages((prev) => [...prev, { text: data.translation, lang: to, side: side === "A" ? "B" : "A" }]);
      speak(data.translation, to);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {showGuide && <AssistantGuide onClose={() => setShowGuide(false)} />}
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-20 shadow-sm">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-green-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm">D</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-none">DÉGG</h1>
              <p className="text-xs text-gray-400">JOJ Dakar 2026</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-medium">
              🇸🇳 Wolof
            </span>
            <span className="text-xs bg-orange-100 text-orange-700 px-2.5 py-1 rounded-full font-medium">
              9 langues
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-5 space-y-4">
        {/* Tabs */}
        <div className="flex bg-white rounded-2xl border border-gray-100 p-1 shadow-sm">
          {[
            { key: "translate", label: "🌐 Traduire" },
            { key: "phrases", label: "⚡ Phrases JOJ" },
            { key: "conversation", label: "💬 Conversation" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`flex-1 py-2.5 text-xs font-semibold rounded-xl transition-all ${
                activeTab === tab.key
                  ? "bg-green-600 text-white shadow-sm"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB: Traduire */}
        {activeTab === "translate" && (
          <div className="space-y-3">
            {/* Sélecteur langues */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
              <div className="flex items-center gap-2">
                <select
                  value={fromLang}
                  onChange={(e) => setFromLang(e.target.value)}
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.flag} {l.name}
                    </option>
                  ))}
                </select>

                <button
                  onClick={swapLanguages}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-green-50 text-green-600 hover:bg-green-100 transition-all text-xl font-bold flex-shrink-0"
                >
                  ⇄
                </button>

                <select
                  value={toLang}
                  onChange={(e) => setToLang(e.target.value)}
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.flag} {l.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Input */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
              <div className="flex items-start gap-2 mb-3">
                <span className="text-xs font-semibold text-gray-400 mt-1 w-6">{getLangFlag(fromLang)}</span>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`Tapez en ${getLangName(fromLang)}...`}
                  className="flex-1 h-24 resize-none text-gray-800 text-base outline-none placeholder-gray-300 leading-relaxed"
                />
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                <span className="text-xs text-gray-300">{inputText.length} caractères</span>
                <div className="flex gap-2">
                  {inputText && (
                    <button
                      onClick={() => { setInputText(""); setTranslatedText(""); }}
                      className="px-3 py-1.5 rounded-xl text-xs font-medium bg-gray-100 text-gray-500 hover:bg-gray-200 transition-all"
                    >
                      ✕ Effacer
                    </button>
                  )}
                  <button
                    onClick={() => startListening(fromLang, (text) => setInputText(text))}
                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      isListening
                        ? "bg-red-500 text-white animate-pulse"
                        : "bg-green-600 text-white hover:bg-green-700"
                    }`}
                  >
                    🎤 {isListening ? "Écoute..." : "Parler"}
                  </button>
                </div>
              </div>
            </div>

            {/* Output */}
            <div className="bg-green-600 rounded-2xl p-4 shadow-sm">
              <div className="flex items-start gap-2 mb-3">
                <span className="text-xs mt-1 w-6">{getLangFlag(toLang)}</span>
                {isLoading ? (
                  <div className="flex items-center gap-2 text-green-100">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-green-200 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-2 h-2 bg-green-200 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-2 h-2 bg-green-200 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                    <span className="text-sm">Traduction...</span>
                  </div>
                ) : (
                  <p className="flex-1 text-white text-base leading-relaxed min-h-[4rem]">
                    {translatedText || (
                      <span className="text-green-300 text-sm">
                        La traduction apparaîtra ici...
                      </span>
                    )}
                  </p>
                )}
              </div>
              {translatedText && !isLoading && (
                <div className="flex items-center justify-between pt-3 border-t border-green-500">
                  <span className="text-xs text-green-300">
                    {getLangName(fromLang)} → {getLangName(toLang)}
                  </span>
                  <button
                    onClick={() => speak(translatedText, toLang)}
                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      isSpeaking
                        ? "bg-white text-green-600 animate-pulse"
                        : "bg-green-500 text-white hover:bg-green-400"
                    }`}
                  >
                    🔊 {isSpeaking ? "Lecture..." : "Écouter"}
                  </button>
                </div>
              )}
            </div>

            {/* Historique */}
            {history.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
                <h3 className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wide">
                  🕐 Récent
                </h3>
                <div className="space-y-2">
                  {history.slice(0, 3).map((item, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setInputText(item.input);
                        setFromLang(item.from);
                        setToLang(item.to);
                      }}
                      className="w-full text-left p-3 rounded-xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100"
                    >
                      <p className="text-sm text-gray-700 truncate">{item.input}</p>
                      <p className="text-xs text-green-600 truncate mt-0.5">{item.output}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB: Phrases JOJ */}
        {activeTab === "phrases" && (
          <div className="space-y-3">
            <div className="bg-green-600 rounded-2xl p-4 text-center">
              <p className="text-white font-semibold text-sm">Phrases essentielles JOJ</p>
              <p className="text-green-200 text-xs mt-1">
                Tap → traduction instantanée vers {getLangFlag(toLang)} {getLangName(toLang)}
              </p>
            </div>

            {/* Sélecteur langue cible */}
            <div className="bg-white rounded-2xl border border-gray-100 p-3 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-medium">Traduire vers :</span>
                <select
                  value={toLang}
                  onChange={(e) => setToLang(e.target.value)}
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>{l.flag} {l.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {JOJ_PHRASES.map((cat) => (
              <div key={cat.category} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
                <h3 className="font-semibold text-gray-700 mb-3 text-sm">{cat.category}</h3>
                <div className="space-y-2">
                  {cat.phrases.map((phrase) => (
                    <button
                      key={phrase}
                      onClick={() => {
                        setInputText(phrase);
                        setFromLang("FR");
                        setActiveTab("translate");
                        translate(phrase, "FR", toLang);
                      }}
                      className="w-full text-left px-4 py-3 rounded-xl bg-gray-50 hover:bg-green-50 hover:text-green-700 text-sm text-gray-700 transition-all border border-transparent hover:border-green-200 font-medium"
                    >
                      {phrase} →
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB: Conversation */}
        {activeTab === "conversation" && (
          <div className="space-y-3">
            {/* Header conversation */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-green-100 rounded-full flex items-center justify-center text-xs font-bold text-green-700">A</div>
                  <select
                    value={fromLang}
                    onChange={(e) => setFromLang(e.target.value)}
                    className="bg-gray-50 border border-gray-200 rounded-xl px-2 py-1.5 text-xs font-medium focus:outline-none"
                  >
                    {LANGUAGES.map((l) => (
                      <option key={l.code} value={l.code}>{l.flag} {l.name}</option>
                    ))}
                  </select>
                </div>
                <span className="text-gray-300 text-lg">⇄</span>
                <div className="flex items-center gap-2">
                  <select
                    value={toLang}
                    onChange={(e) => setToLang(e.target.value)}
                    className="bg-gray-50 border border-gray-200 rounded-xl px-2 py-1.5 text-xs font-medium focus:outline-none"
                  >
                    {LANGUAGES.map((l) => (
                      <option key={l.code} value={l.code}>{l.flag} {l.name}</option>
                    ))}
                  </select>
                  <div className="w-7 h-7 bg-orange-100 rounded-full flex items-center justify-center text-xs font-bold text-orange-700">B</div>
                </div>
              </div>
            </div>

            {/* Messages */}
            {convMessages.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm max-h-64 overflow-y-auto space-y-3">
                {convMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.side === "A" ? "justify-start" : "justify-end"}`}>
                    <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${
                      msg.side === "A"
                        ? "bg-green-600 text-white rounded-tl-sm"
                        : "bg-orange-100 text-orange-900 rounded-tr-sm"
                    }`}>
                      <p className="text-xs opacity-60 mb-1">
                        {getLangFlag(msg.lang)} {getLangName(msg.lang)}
                      </p>
                      <p>{msg.text}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}

            {/* Input Personne A */}
            <div className="bg-green-50 rounded-2xl border border-green-100 p-4">
              <p className="text-xs font-semibold text-green-700 mb-2">
                Personne A — {getLangFlag(fromLang)} {getLangName(fromLang)}
              </p>
              <textarea
                value={convInputA}
                onChange={(e) => setConvInputA(e.target.value)}
                placeholder={`Parlez en ${getLangName(fromLang)}...`}
                className="w-full h-16 resize-none text-sm text-gray-800 outline-none bg-transparent placeholder-green-300"
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => startListening(fromLang, (text) => setConvInputA(text))}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isListening ? "bg-red-500 text-white animate-pulse" : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                >
                  🎤 {isListening ? "Écoute..." : "Micro"}
                </button>
                <button
                  onClick={() => sendConvMessage("A")}
                  className="flex-1 py-1.5 rounded-xl text-xs font-semibold bg-green-600 text-white hover:bg-green-700 transition-all"
                >
                  Envoyer → {getLangFlag(toLang)}
                </button>
              </div>
            </div>

            {/* Input Personne B */}
            <div className="bg-orange-50 rounded-2xl border border-orange-100 p-4">
              <p className="text-xs font-semibold text-orange-700 mb-2">
                Personne B — {getLangFlag(toLang)} {getLangName(toLang)}
              </p>
              <textarea
                value={convInputB}
                onChange={(e) => setConvInputB(e.target.value)}
                placeholder={`Parlez en ${getLangName(toLang)}...`}
                className="w-full h-16 resize-none text-sm text-gray-800 outline-none bg-transparent placeholder-orange-300"
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => startListening(toLang, (text) => setConvInputB(text))}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isListening ? "bg-red-500 text-white animate-pulse" : "bg-orange-500 text-white hover:bg-orange-600"
                  }`}
                >
                  🎤 {isListening ? "Écoute..." : "Micro"}
                </button>
                <button
                  onClick={() => sendConvMessage("B")}
                  className="flex-1 py-1.5 rounded-xl text-xs font-semibold bg-orange-500 text-white hover:bg-orange-600 transition-all"
                >
                  Envoyer → {getLangFlag(fromLang)}
                </button>
              </div>
            </div>

            {/* Reset conversation */}
            {convMessages.length > 0 && (
              <button
                onClick={() => setConvMessages([])}
                className="w-full py-2.5 rounded-xl text-xs font-medium text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all border border-gray-100"
              >
                🗑️ Effacer la conversation
              </button>
            )}
          </div>
        )}
      </div>
      <footer className="text-center py-8 text-xs text-gray-300">
        DÉGG · JOJ Dakar 2026 · <span className="text-green-400">Dafa dégg</span> 🇸🇳
      </footer>
    </main>
  );
}
