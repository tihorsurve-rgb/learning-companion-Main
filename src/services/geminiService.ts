import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

// Mock fallback for demo if API key is missing
const useMock = !apiKey || apiKey === "your_gemini_api_key_here";

const genAI = new GoogleGenerativeAI(apiKey || "mock_key");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export interface LearningContext {
  topic: string;
  level: string;
  pace: string;
  style: string;
  currentDifficulty: number;
}

export const generateExplanation = async (context: LearningContext, specificRequest?: string): Promise<string> => {
  if (useMock) {
    return generateMockExplanation(context, specificRequest);
  }

  try {
    const prompt = `You are a helpful learning companion. 
The user is learning about: ${context.topic}.
Their level is: ${context.level}.
Their preferred pace is: ${context.pace}.
Their preferred learning style is: ${context.style}.
Current difficulty level (1-10): ${context.currentDifficulty}.

${specificRequest ? `Specifically, the user asked: ${specificRequest}` : "Provide a short, engaging, and clear explanation of a subtopic or concept based on their level and style. Break it into small, digestible paragraphs."}

Keep the response concise (under 200 words) and format it nicely.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting right now. Let's try again in a moment!";
  }
};

export const generateQuizQuestions = async (context: LearningContext): Promise<{ question: string; options: string[]; answerIndex: number }[]> => {
  if (useMock) {
    return [
      {
        question: `What is the primary purpose of ${context.topic}?`,
        options: ["To provide energy", "To convert light to food", "To absorb water", "To release oxygen"],
        answerIndex: 1
      },
      {
        question: "Which of these is essential for this process?",
        options: ["Soil", "Sunlight", "Wind", "Insects"],
        answerIndex: 1
      },
      {
        question: "What is the byproduct?",
        options: ["Carbon Dioxide", "Oxygen", "Nitrogen", "Hydrogen"],
        answerIndex: 1
      }
    ];
  }

  try {
    const prompt = `Generate exactly 3 multiple choice questions about ${context.topic} suitable for a ${context.level} level learner.
Return the result strictly as a JSON array of objects with this structure:
[
  { "question": "Question text", "options": ["Option 1", "Option 2", "Option 3", "Option 4"], "answerIndex": 0 }
]
Do not include any other text, markdown blocks, or explanations. Just the JSON array.`;

    const result = await model.generateContent(prompt);
    const responseText = await result.response.text();
    
    // Clean up response if it contains markdown code blocks
    const cleanedText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
    
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Gemini API Error generating quiz:", error);
    throw new Error("Failed to generate quiz");
  }
};

const generateMockExplanation = (context: LearningContext, specificRequest?: string): string => {
  const requestLower = specificRequest?.toLowerCase() || "";
  
  if (requestLower.includes("easier")) {
    return `Let's make it simpler! Think of ${context.topic} like baking a cake. You need specific ingredients (like sunlight and water) to make something completely new (energy/food).`;
  }
  if (requestLower.includes("example")) {
    return `Here is an example: When you see a tree growing taller every year, it's using ${context.topic} to turn sunlight into the building blocks it needs to grow leaves and branches.`;
  }
  
  return `${context.topic} is a fascinating concept. Since you are at a ${context.level} level, let's start with the basics. It is the process by which organisms convert light energy into chemical energy. This energy is stored and later used to fuel the organisms' activities. We will go at a ${context.pace} pace to ensure you understand everything fully.`;
};
