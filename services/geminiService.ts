import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedMelody, NoteName } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateMelody = async (mood: string): Promise<GeneratedMelody> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Compose a simple melody for a 2-octave piano (C3 to B4) based on the mood: "${mood}".
      Use exact note names from this list: C3, C#3, D3, D#3, E3, F3, F#3, G3, G#3, A3, A#3, B3, C4, C#4, D4, D#4, E4, F4, F#4, G4, G#4, A4, A#4, B4.
      The melody should be between 8 and 16 notes long.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "A creative title for the melody" },
            notes: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Array of note names (e.g., 'C4', 'D#3', 'A4')"
            },
            description: { type: Type.STRING, description: "A short explanation of why this fits the mood" }
          },
          required: ["title", "notes", "description"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as GeneratedMelody;
    }
    throw new Error("Empty response from Gemini");

  } catch (error) {
    console.error("Error generating melody:", error);
    // Fallback in case of API error.
    // Fixed: Use valid NoteName types (C3-B4) instead of invalid ones like "C", "C5".
    return {
      title: "Fallback Tune",
      notes: ["C3", "E3", "G3", "C4", "G3", "E3", "C3"] as NoteName[],
      description: "A simple arpeggio (API might be unavailable)."
    };
  }
};