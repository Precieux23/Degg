import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { text, from, to } = await req.json();

  if (!text || !from || !to) {
    return NextResponse.json({ error: "Paramètres manquants" }, { status: 400 });
  }

  if (from === to) {
    return NextResponse.json({ translation: text });
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
        text: [text],
        source_lang: String(from).toUpperCase(),
        target_lang: String(to).toUpperCase(),
      }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const msg =
        data?.message ||
        data?.error ||
        `Erreur DeepL (${response.status})`;
      return NextResponse.json({ error: msg }, { status: 502 });
    }

    if (data?.translations?.[0]?.text) {
      return NextResponse.json({
        translation: data.translations[0].text,
      });
    }

    return NextResponse.json({ error: "Erreur de traduction" }, { status: 502 });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}