import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey || apiKey === 'PLACEHOLDER_API_KEY') {
    throw new Error("Gemini API Key not configured. Please add VITE_GEMINI_API_KEY to .env.local");
  }
  return new GoogleGenAI({ apiKey });
};

export const polishReason = async (
  rawReason: string, 
  type: string,
  style: 'formal' | 'poetic' | 'simple' = 'formal'
): Promise<string> => {
  try {
    const ai = getClient();
    
    const prompt = `
      Tolong ubah alasan izin berikut ini menjadi bahasa Indonesia yang lebih ${style}, sopan, dan sesuai untuk konteks izin "${type}".
      
      Alasan asli: "${rawReason}"
      
      Hanya berikan hasil perubahannya saja tanpa tanda kutip atau teks pembuka/penutup tambahan. Pastikan alasannya terdengar masuk akal dan respek.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text?.trim() || rawReason;
  } catch (error) {
    console.error("Error generating polishing reason:", error);
    return rawReason; // Fallback to original if error
  }
};