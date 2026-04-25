import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { text, texts, from, to } = body;

  if (!from || !to) {
    return NextResponse.json({ error: "Paramètres manquants" }, { status: 400 });
  }

  // Accept single string OR array of strings
  const textArray: string[] = Array.isArray(texts)
    ? texts
    : typeof text === "string" && text
    ? [text]
    : [];

  if (textArray.length === 0) {
    return NextResponse.json({ error: "Paramètres manquants" }, { status: 400 });
  }

  // Same language → return as-is
  if (String(from).toUpperCase() === String(to).toUpperCase()) {
    return NextResponse.json({
      translation: textArray[0],
      translations: textArray,
    });
  }

  if (!process.env.DEEPL_API_KEY) {
    return NextResponse.json(
      { error: "DEEPL_API_KEY manquante côté serveur" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch("https://api-free.deepl.com/v2/translate", {
      method: "POST",
      headers: {
        Authorization: `DeepL-Auth-Key ${process.env.DEEPL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: textArray,
        source_lang: String(from).toUpperCase(),
        target_lang: String(to).toUpperCase(),
      }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const msg = data?.message || data?.error || `Erreur DeepL (${response.status})`;
      return NextResponse.json({ error: msg }, { status: 502 });
    }

    if (data?.translations?.length) {
      const translationTexts: string[] = data.translations.map(
        (t: { text: string }) => t.text
      );
      return NextResponse.json({
        translation: translationTexts[0],
        translations: translationTexts,
      });
    }

    return NextResponse.json({ error: "Erreur de traduction" }, { status: 502 });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
