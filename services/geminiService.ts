
import { GoogleGenAI } from "@google/genai";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    if (!process.env.API_KEY) {
      throw new Error("API_KEY is not defined in environment variables.");
    }
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async transformImage(base64Image: string, prompt: string): Promise<string> {
    try {
      // Remove data URL prefix if present
      const cleanBase64 = base64Image.replace(/^data:image\/\w+;base64,/, "");
      const mimeType = base64Image.match(/^data:(image\/\w+);base64,/)?.[1] || 'image/png';

      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              inlineData: {
                data: cleanBase64,
                mimeType: mimeType,
              },
            },
            {
              text: prompt,
            },
          ],
        },
      });

      let imageUrl = "";
      if (response.candidates && response.candidates[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            imageUrl = `data:image/png;base64,${part.inlineData.data}`;
            break;
          }
        }
      }

      if (!imageUrl) {
        throw new Error("The model did not return an image part.");
      }

      return imageUrl;
    } catch (error: any) {
      console.error("Gemini Image Transformation Error:", error);
      throw new Error(error.message || "Failed to transform image.");
    }
  }
}
