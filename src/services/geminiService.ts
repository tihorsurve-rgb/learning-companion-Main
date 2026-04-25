import { GoogleGenerativeAI } from "@google/generative-ai";
import { type UserProfile, type RoadmapStep, type Lesson, type QuizQuestion, type Difficulty, type Flashcard } from "../types";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const useMock = !apiKey || apiKey === "your_gemini_api_key_here";

const genAI = new GoogleGenerativeAI(apiKey || "mock_key");
// Using Gemini 2.0 Flash as it was found available for this key
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

export const generateRoadmap = async (user: UserProfile): Promise<RoadmapStep[]> => {
  const mockRoadmap = [
    { step: 1, title: "Foundations of " + user.topic, description: "Basic concepts and definitions", estimatedTime: "20 mins", completed: false },
    { step: 2, title: "Core Principles", description: "Deep dive into how it works", estimatedTime: "30 mins", completed: false },
    { step: 3, title: "Real-world Applications", description: "Seeing it in action", estimatedTime: "25 mins", completed: false },
    { step: 4, title: "Advanced Techniques", description: "Mastering the topic", estimatedTime: "40 mins", completed: false },
    { step: 5, title: "Final Project/Review", description: "Putting it all together", estimatedTime: "30 mins", completed: false },
  ];

  if (useMock) return mockRoadmap;

  const prompt = `Generate a 5-step learning roadmap for a student learning "${user.topic}".
User Level: ${user.level}
Goal: ${user.goal}
Preferred Pace: ${user.pace}
Learning Style: ${user.style}

Return ONLY a JSON array of objects with this structure:
[
  { "step": 1, "title": "...", "description": "...", "estimatedTime": "...", "completed": false }
]
Do not include any other text or markdown blocks.`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return JSON.parse(text.replace(/```json/g, "").replace(/```/g, "").trim());
  } catch (error) {
    console.error("Gemini Error, falling back to mock:", error);
    return mockRoadmap;
  }
};

export const generateLessonContent = async (user: UserProfile, step: RoadmapStep, difficultyOverride?: Difficulty): Promise<Lesson> => {
  if (useMock) {
    // High-quality mock data for the hackathon demo (Photosynthesis)
    if (user.topic.toLowerCase().includes("photosynthesis") || user.topic.toLowerCase().includes("plant")) {
      return {
        id: "demo-1",
        stepId: step.step,
        title: "The Magic of Photosynthesis",
        explanation: "Photosynthesis is the remarkable biological process where green plants, algae, and some bacteria convert light energy into chemical energy. It happens primarily in the leaves, specifically inside tiny organelles called chloroplasts. These chloroplasts contain chlorophyll, the pigment that captures sunlight. The core 'engine' of this process uses water (from roots) and carbon dioxide (from air) to manufacture glucose (food) and release oxygen as a vital byproduct.",
        example: "Imagine a plant as a solar-powered kitchen. The leaves are the solar panels, the chlorophyll is the chef, and the sunlight is the oven. The chef takes raw ingredients (CO2 and Water) and 'cooks' them into a delicious sugar cake (Glucose) while sending out fresh air (Oxygen) into the room!",
        commonMistakes: [
          "Thinking plants only do photosynthesis (they also respire!)",
          "Believing it happens at night (it requires light energy)",
          "Assuming soil is the main food source (it's actually CO2/Light)"
        ],
        practiceTask: "Find a leaf outside and try to identify the 'stomata' (tiny pores) on the underside where it 'breathes' in CO2.",
        summary: "Photosynthesis transforms light, water, and air into the fundamental energy source for almost all life on Earth.",
        keyPoints: [
          "Chlorophyll is essential for capturing photons.",
          "Chemical formula: 6CO2 + 6H2O + light -> C6H12O6 + 6O2",
          "Happens in two stages: Light-dependent and Light-independent (Calvin Cycle)."
        ],
        memoryTrick: "Remember: 'Plants Love Water And Air' (P.L.W.A) - Sunlight, Water, and Air make the food!",
        difficulty: difficultyOverride || user.level,
      };
    }

    return {
      id: Math.random().toString(36).substr(2, 9),
      stepId: step.step,
      title: step.title,
      explanation: `This is a beginner-friendly explanation of ${step.title}. It covers the fundamental concepts of ${user.topic}. In this section, we explore how the core principles apply to real-world scenarios and why they are important for mastering the subject.`,
      example: `For example, imagine ${user.topic} as a complex machine where every part has a specific role to play...`,
      commonMistakes: ["Applying the wrong formula", "Missing a critical step in the setup"],
      practiceTask: "Try to solve a basic problem using the principles learned in this chapter.",
      summary: "In summary, we have covered the essential foundations of " + step.title,
      keyPoints: ["Fundamental concept 1", "Practical application 2", "Common pitfalls to avoid"],
      memoryTrick: "Use the 'Three Finger' rule to remember the core pillars...",
      difficulty: difficultyOverride || user.level,
    };
  }

  const prompt = `Create a detailed lesson for: ${step.title} (Part of ${user.topic})
Level: ${difficultyOverride || user.level}
Style: ${user.style}

Provide:
- A beginner-friendly explanation (max 300 words)
- A real-world example
- 2-3 common mistakes
- A small practice task
- A summary
- 3-5 key points
- A memory trick

Return ONLY JSON:
{
  "title": "...",
  "explanation": "...",
  "example": "...",
  "commonMistakes": ["...", "..."],
  "practiceTask": "...",
  "summary": "...",
  "keyPoints": ["...", "..."],
  "memoryTrick": "..."
}
Do not include markdown blocks.`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const data = JSON.parse(text.replace(/```json/g, "").replace(/```/g, "").trim());
    return {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      stepId: step.step,
      difficulty: difficultyOverride || user.level,
    };
  } catch (error) {
    console.error("Gemini Error, falling back to mock:", error);
    // Return high-quality mock for Photosynthesis if applicable
    if (user.topic.toLowerCase().includes("photosynthesis") || user.topic.toLowerCase().includes("plant")) {
       return {
        id: "demo-1",
        stepId: step.step,
        title: "The Magic of Photosynthesis",
        explanation: "Photosynthesis is the remarkable biological process where green plants, algae, and some bacteria convert light energy into chemical energy. It happens primarily in the leaves, specifically inside tiny organelles called chloroplasts. These chloroplasts contain chlorophyll, the pigment that captures sunlight.",
        example: "Imagine a plant as a solar-powered kitchen. The leaves are the solar panels, the chlorophyll is the chef, and the sunlight is the oven.",
        commonMistakes: ["Thinking plants only do photosynthesis", "Believing it happens at night"],
        practiceTask: "Find a leaf outside and identify the stomata.",
        summary: "Photosynthesis transforms light, water, and air into energy.",
        keyPoints: ["Chlorophyll is essential", "6CO2 + 6H2O -> C6H12O6 + 6O2"],
        memoryTrick: "Plants Love Water And Air (P.L.W.A)",
        difficulty: difficultyOverride || user.level,
      };
    }
    return {
      id: Math.random().toString(36).substr(2, 9),
      stepId: step.step,
      title: step.title,
      explanation: `Could not connect to Gemini. Here is a placeholder for ${step.title}.`,
      example: "Example placeholder",
      commonMistakes: ["Mistake 1"],
      practiceTask: "Task 1",
      summary: "Summary 1",
      keyPoints: ["Point 1"],
      memoryTrick: "Trick 1",
      difficulty: difficultyOverride || user.level,
    };
  }
};

export const generateQuiz = async (lesson: Lesson): Promise<QuizQuestion[]> => {
  const mockQuiz = [
    { question: "What is the main goal of this lesson?", options: ["Option A", "Option B", "Option C", "Option D"], correctAnswer: 0, explanation: "Option A is correct because..." },
    { question: "Which of these is a common mistake?", options: ["Mistake 1", "Correct Path", "Not a factor", "None"], correctAnswer: 0, explanation: "As mentioned, Mistake 1 is common." },
    { question: "What does the memory trick help with?", options: ["Recall", "Speed", "Spelling", "None"], correctAnswer: 0, explanation: "Tricks improve recall." },
  ];

  if (useMock) return mockQuiz;

  const prompt = `Generate 3-5 multiple choice questions for the lesson: ${lesson.title}.
Lesson content summary: ${lesson.summary}
Difficulty: ${lesson.difficulty}

Return ONLY JSON array:
[
  { "question": "...", "options": ["...", "...", "...", "..."], "correctAnswer": 0, "explanation": "..." }
]`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return JSON.parse(text.replace(/```json/g, "").replace(/```/g, "").trim());
  } catch (error) {
    console.error("Gemini Error, falling back to mock:", error);
    return mockQuiz;
  }
};

export const generateFlashcards = async (lesson: Lesson): Promise<Flashcard[]> => {
  const mockCards = [
    { id: '1', question: "What is the primary goal?", answer: "To understand the core concepts.", difficulty: lesson.difficulty, known: false },
    { id: '2', question: "How does this apply?", answer: "It applies in real-world scenarios.", difficulty: lesson.difficulty, known: false },
  ];

  if (useMock) return mockCards;

  const prompt = `Generate 5 flashcards for: ${lesson.title}.
Return ONLY JSON array:
[
  { "question": "...", "answer": "..." }
]`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cards = JSON.parse(text.replace(/```json/g, "").replace(/```/g, "").trim());
    return cards.map((c: any) => ({ ...c, id: Math.random().toString(36).substr(2, 9), difficulty: lesson.difficulty, known: false }));
  } catch (error) {
    console.error("Gemini Error, falling back to mock:", error);
    return mockCards;
  }
};

export const generateDailyPlan = async (user: UserProfile): Promise<string> => {
  const mockPlan = `Plan for ${user.dailyTime} mins: 10m reading, 5m quiz, 5m revision.`;

  if (useMock) return mockPlan;

  const prompt = `Generate a 1-day study plan for a user with ${user.dailyTime} minutes available.
Topic: ${user.topic}
Level: ${user.level}
Style: ${user.style}

Provide a breakdown of how they should spend their time (explanation, examples, quiz, revision).`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Gemini Error, falling back to mock:", error);
    return mockPlan;
  }
};
