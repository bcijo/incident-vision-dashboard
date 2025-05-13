import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini API
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.error("Gemini API key is not defined in environment variables");
  throw new Error("Gemini API key is not defined in environment variables");
}

const genAI = new GoogleGenerativeAI(API_KEY);

/**
 * Predicts a severity score for an incident based on its details
 * @param incidentType The type of incident (e.g., 'water-logging', 'fire')
 * @param description The description of the incident
 * @param taluk The location/taluk where the incident occurred
 * @returns An object containing the severity score (1-5) and explanation
 */
export const predictSeverityScore = async (
  incidentType: string,
  description: string,
  taluk: string
): Promise<{ score: number; explanation: string }> => {
  try {
    // Create model instance using the 2.5 Flash model as specified
    const model = genAI.getGenerativeModel({ model: "models/gemini-2.5-flash-preview-04-17" });
    console.log("Model initialized: models/gemini-2.5-flash-preview-04-17");

    // Craft a prompt that will generate a severity score from 1-5 with a one-line explanation
    const prompt = `
      You are an AI assistant tasked with assessing the severity of incidents for emergency response prioritization.
      
      Analyze the following incident details:
      - Type: ${incidentType}
      - Description: ${description}
      - Location: ${taluk}
      
      Rate the severity of this incident on a scale of 1 to 5, where:
      1 = Minor incident with minimal impact
      2 = Low severity with limited disruption
      3 = Moderate severity requiring attention
      4 = High severity with significant impact
      5 = Critical emergency requiring immediate response
      
      Provide your response in this exact format:
      {"score": [1-5], "explanation": "[One sentence explanation for the rating]"}
    `;

    console.log("Sending severity prediction request to Gemini API...");

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();
    
    console.log("Received severity prediction from Gemini API");

    // Parse the JSON response
    try {
      // Extract JSON if it's embedded in other text
      const jsonMatch = text.match(/\{\s*"score"\s*:\s*\d+\s*,\s*"explanation"\s*:\s*"[^"]+"\s*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : text;
      
      const parsedResponse = JSON.parse(jsonStr);
      
      // Validate the response format
      if (typeof parsedResponse.score !== 'number' || typeof parsedResponse.explanation !== 'string') {
        throw new Error("Invalid response format");
      }
      
      // Ensure score is between 1-5
      const score = Math.max(1, Math.min(5, Math.round(parsedResponse.score)));
      
      return {
        score,
        explanation: parsedResponse.explanation
      };
    } catch (parseError) {
      console.error("Failed to parse Gemini response:", text);
      throw new Error(`Failed to parse severity prediction: ${parseError.message}`);
    }
  } catch (error) {
    console.error("Error in predictSeverityScore:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to predict severity: ${error.message}`);
    }
    throw new Error("Failed to predict severity: Unknown error");
  }
};

/**
 * Analyzes before and after images of an incident site to determine if the issue was resolved
 * @param beforeImage Base64-encoded image of the incident site before resolution attempt
 * @param afterImage Base64-encoded image of the incident site after resolution attempt
 * @returns Object containing description, resolution status, and confidence level
 */
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

    // Create model instance - using the 2.5 Flash model for better structured output
    const model = genAI.getGenerativeModel({ model: "models/gemini-2.5-flash-preview-04-17" });
    console.log("Model initialized: models/gemini-2.5-flash-preview-04-17");

    // Improved prompt that explicitly requests JSON format and considers partial solutions as resolved
    const prompt = `
      You are an AI assistant tasked with analyzing before and after images of an incident site.
      
      Image 1: BEFORE the resolution attempt.
      Image 2: AFTER the resolution attempt.
      
      Compare these images and determine if the incident has been addressed in any way.
      
      IMPORTANT: Consider the incident as "resolved" even if only a partial or temporary solution has been implemented.
      Any visible attempt to address the issue, even if not completely fixed, should be marked as resolved = true.
      
      Respond ONLY with a valid JSON object in this exact format:
      
      {
        "resolved": boolean,  // true if ANY attempt to resolve the issue is visible, even if partial or temporary
        "description": string,  // brief description highlighting what changed, including any temporary solutions
        "confidence": number  // your confidence in this assessment (0.0 to 1.0)
      }
      
      In the description:
      - If it's a partial or temporary solution, explicitly mention this (e.g., "Temporary barriers placed to redirect water")
      - If it's fully resolved, describe the complete solution
      - If nothing has changed, explain why you believe no resolution attempt was made
      
      Do not include any explanatory text outside the JSON object.
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

    // Extract JSON from response (in case there's any text before or after the JSON)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Could not find JSON object in Gemini response");
    }
    
    const jsonStr = jsonMatch[0];
    
    try {
      // Parse the JSON response
      const parsedResponse = JSON.parse(jsonStr);
      
      // Validate the response structure
      if (typeof parsedResponse.resolved !== 'boolean' || 
          typeof parsedResponse.description !== 'string' || 
          typeof parsedResponse.confidence !== 'number') {
        throw new Error("Invalid response structure from Gemini API");
      }
      
      // Ensure confidence is between 0 and 1
      const confidence = Math.max(0, Math.min(1, parsedResponse.confidence));
      
      return {
        description: parsedResponse.description,
        resolved: parsedResponse.resolved,
        confidence: confidence
      };
    } catch (parseError) {
      console.error("Failed to parse JSON response:", jsonStr, parseError);
      
      // Fallback to legacy parsing for backward compatibility
      if (text.includes("No issue resolved") || text.toLowerCase().includes("not resolved")) {
        return {
          description: "No issue resolved. Forwarded to higher authorities.",
          resolved: false,
          confidence: 0.5
        };
      }
      
      // Try to extract description using regex as a last resort
      const descriptionMatch = text.match(/description["']?\s*:\s*["']([^"']+)["']/i) || 
                              text.match(/["']description["']\s*:\s*["']([^"']+)["']/i);
      
      if (descriptionMatch) {
        return {
          description: descriptionMatch[1],
          resolved: text.toLowerCase().includes("resolved\s*:\s*true"),
          confidence: 0.6 // Lower confidence since we had to use fallback parsing
        };
      }
      
      throw new Error(`Failed to parse Gemini response: ${parseError.message}`);
    }
  } catch (error) {
    console.error("Detailed error in analyzeImagesWithGemini:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to analyze images: ${error.message}`);
    }
    throw new Error("Failed to analyze images: Unknown error");
  }
};