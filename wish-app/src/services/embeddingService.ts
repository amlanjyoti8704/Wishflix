import { GoogleGenAI } from "@google/genai";

let _ai: GoogleGenAI | null = null;

function getAI() {
  if (!_ai) {
    _ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY!,
    });
  }
  return _ai;
}

export async function generateEmbedding(
  text: string
) {
  const result =
    await getAI().models.embedContent({
      model: "gemini-embedding-001",
      contents: text,
    });

  return result.embeddings?.[0]?.values ?? [];
}