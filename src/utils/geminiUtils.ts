import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini API
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.error("Gemini API key is not defined in environment variables");
  throw new Error("Gemini API key is not defined in environment variables");
}

const genAI = new GoogleGenerativeAI(API_KEY);

export const analyzeImagesWithGemini = async (
  beforeImage: string,
  afterImage: string
): Promise<{
  description: string;
  resolved: boolean;
  confidence: number;
}> => {
  console.log("Starting image analysis...");
  try {
    // Validate input images
    if (!beforeImage || !afterImage) {
      throw new Error("Both before and after images are required");
    }

    // Extract base64 data from data URLs
    const getBase64Data = (dataUrl: string, type: string) => {
      console.log(`Extracting base64 data for ${type}:`, dataUrl.substring(0, 50));
      // Fixed regex to match data:image/<format>;base64,<data>
      const matches = dataUrl.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/i);
      if (!matches || matches.length !== 3) {
        console.error(`Invalid data URL format for ${type}:`, dataUrl.substring(0, 100));
        throw new Error(`Invalid image data format for ${type} image`);
      }
      const format = matches[1].toLowerCase();
      if (!["jpeg", "png", "jpg"].includes(format)) {
        console.error(`Unsupported format for ${type}:`, format);
        throw new Error(`Unsupported image format for ${type}: ${format}. Use JPEG or PNG.`);
      }
      return {
        base64: matches[2],
        mimeType: `image/${format === "jpg" ? "jpeg" : format}`
      };
    };

    const beforeData = getBase64Data(beforeImage, "before");
    const afterData = getBase64Data(afterImage, "after");
    console.log("Base64 data extracted successfully");

    // Create model instance
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    console.log("Model initialized: gemini-1.5-flash");

    const prompt = `
      You are an AI assistant tasked with carefully identifying changes between two images of an incident site.

      Image 1: BEFORE the resolution.
      Image 2: AFTER the resolution.

      Compare them and return a structured summary of what changed.

      If the images appear the same or no meaningful resolution is visible, respond exactly with:
      "No issue resolved. Forwarded to higher authorities."

      Else, respond with this:
      resolved: true,
      description: "<short structured summary of what was resolved>"
    `;

    console.log("Sending request to Gemini API...");

    // Generate content
    const result = await model.generateContent([
      prompt,
      { inlineData: { data: beforeData.base64, mimeType: beforeData.mimeType } },
      { inlineData: { data: afterData.base64, mimeType: afterData.mimeType } }
    ]);

    console.log("Received response from Gemini API");

    const response = await result.response;
    const text = response.text().trim();
    console.log("Response text:", text);

    // Parse the response
    if (text === "No issue resolved. Forwarded to higher authorities.") {
      return {
        description: "No issue resolved. Forwarded to higher authorities.",
        resolved: false,
        confidence: 0.5
      };
    }

    // Parse resolved: true, description: format
    const resolvedMatch = text.match(/resolved:\s*true\s*,/i);
    const descriptionMatch = text.match(/description:\s*"([^"]+)"/i);

    if (resolvedMatch && descriptionMatch) {
      return {
        description: descriptionMatch[1],
        resolved: true,
        confidence: 0.8
      };
    }

    // Handle unexpected response
    console.error("Unexpected response format:", text);
    throw new Error("Invalid response format from Gemini API");
  } catch (error) {
    console.error("Detailed error in analyzeImagesWithGemini:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to analyze images: ${error.message}`);
    }
    throw new Error("Failed to analyze images: Unknown error");
  }
};