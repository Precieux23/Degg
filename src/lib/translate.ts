/** Translate a single string. Returns null on failure. */
export async function translateText(
  text: string,
  from: string,
  to: string,
): Promise<string | null> {
  if (!text.trim()) return null;
  if (from === to) return text;
  try {
    const res = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, from, to }),
    });
    const data = await res.json();
    return data.translation || null;
  } catch {
    return null;
  }
}

/**
 * Translate an array of strings in a SINGLE DeepL API call.
 * Returns the original array on failure.
 */
export async function translateBatch(
  texts: string[],
  from: string,
  to: string,
): Promise<string[]> {
  if (!texts.length) return [];
  if (from === to) return texts;
  try {
    const res = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texts, from, to }),
    });
    const data = await res.json();
    if (
      Array.isArray(data.translations) &&
      data.translations.length === texts.length
    ) {
      return data.translations as string[];
    }
    return texts;
  } catch {
    return texts;
  }
}
