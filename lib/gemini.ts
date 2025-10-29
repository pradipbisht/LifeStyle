// lib/gemini.ts - Free AI Integration using Google Gemini
// Get your free API key from: https://makersuite.google.com/app/apikey

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

export interface AIResponse {
  text: string;
  success: boolean;
  error?: string;
}

export async function generateSkincareRoutine(
  skinType: string,
  concerns: string[],
  age?: number
): Promise<AIResponse> {
  if (!GEMINI_API_KEY) {
    return {
      text: "AI service not configured. Please add GEMINI_API_KEY to your environment variables.",
      success: false,
      error: "Missing API key",
    };
  }

  const prompt = `You are a professional dermatologist. Create a detailed, personalized skincare routine for someone with the following profile:

Skin Type: ${skinType}
Concerns: ${concerns.join(", ") || "None specified"}
${age ? `Age: ${age}` : ""}

Please provide:
1. Morning Routine (5 steps with specific product types)
2. Evening Routine (4-5 steps with specific product types)
3. Weekly treatments (1-2 recommendations)
4. Key ingredients to look for
5. Ingredients to avoid

Format your response as JSON with this structure:
{
  "morning": [{"step": "Cleanser", "product": "Gentle Foaming Cleanser", "description": "why"}],
  "evening": [{"step": "Cleanser", "product": "Oil-Based Cleanser", "description": "why"}],
  "weekly": ["Treatment 1", "Treatment 2"],
  "keyIngredients": ["Ingredient 1", "Ingredient 2"],
  "avoid": ["Ingredient 1", "Ingredient 2"]
}`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`AI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    return {
      text,
      success: true,
    };
  } catch (error) {
    console.error("AI generation error:", error);
    return {
      text: "",
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function analyzeSkinConcern(
  description: string
): Promise<AIResponse> {
  if (!GEMINI_API_KEY) {
    return {
      text: "AI service not configured.",
      success: false,
      error: "Missing API key",
    };
  }

  const prompt = `As a dermatologist, analyze this skin concern and provide:
1. Possible causes
2. Recommended treatments
3. Products to use
4. When to see a doctor

Skin concern: ${description}

Keep response concise (max 200 words).`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    });

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    return {
      text,
      success: true,
    };
  } catch (error) {
    return {
      text: "",
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
