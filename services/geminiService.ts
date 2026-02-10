
import { GoogleGenAI, Type } from "@google/genai";
import { Fight, Prediction } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const fetchUpcomingFights = async (): Promise<Fight[]> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: "Find the upcoming UFC event and its main card fights including fighter names, weight classes, and current betting odds. Format as JSON.",
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            event: { type: Type.STRING },
            date: { type: Type.STRING },
            weightClass: { type: Type.STRING },
            fighterA: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                record: { type: Type.STRING }
              }
            },
            fighterB: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                record: { type: Type.STRING }
              }
            },
            oddsA: { type: Type.STRING },
            oddsB: { type: Type.STRING }
          },
          required: ["id", "event", "fighterA", "fighterB"]
        }
      }
    }
  });

  try {
    return JSON.parse(response.text || "[]");
  } catch (e) {
    console.error("Failed to parse fights", e);
    return [];
  }
};

export const generatePrediction = async (fight: Fight): Promise<Prediction> => {
  const prompt = `Analyze the UFC fight: ${fight.fighterA.name} (${fight.fighterA.record}) vs ${fight.fighterB.name} (${fight.fighterB.record}). 
  Event: ${fight.event}. Weight Class: ${fight.weightClass}.
  Provide a detailed prediction including the winner, confidence percentage (0-100), predicted method of victory (KO/TKO, Submission, Decision), and a concise reasoning based on their recent history, stylistic matchup, and camp news. Use Google Search for the latest fighter stats and news.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          fightId: { type: Type.STRING },
          winner: { type: Type.STRING },
          confidence: { type: Type.NUMBER },
          method: { type: Type.STRING },
          round: { type: Type.STRING },
          reasoning: { type: Type.STRING }
        },
        required: ["winner", "confidence", "method", "reasoning"]
      }
    }
  });

  const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
    title: chunk.web?.title || "Source",
    uri: chunk.web?.uri || "#"
  })) || [];

  try {
    const data = JSON.parse(response.text || "{}");
    return { ...data, fightId: fight.id, sources };
  } catch (e) {
    throw new Error("Prediction generation failed");
  }
};
