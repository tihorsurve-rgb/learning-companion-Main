# Learning Companion AI 🎓

An intelligent AI learning companion that personalizes learning content, adapts to user pace, detects weak areas, and builds a structured learning path.

Built for the **Google Hack2Skill / Prompt War Challenge**.

## 🚀 Features

- **Personalized Onboarding**: Tailor your learning experience based on your topic, level, goal, and preferred style.
- **AI-Powered Roadmaps**: Automatically generate a 5-step roadmap for any topic using Google Gemini.
- **Adaptive Dashboard**: Lessons that adapt to your performance. Request easier explanations or real-life examples on the fly.
- **Smart Quizzes**: Dynamic quizzes that adjust difficulty based on your score.
- **Weak Area Detection**: Automatically identifies concepts you struggle with and suggests targeted revision.
- **AI Study Tools**: Instant study notes, memory tricks, and interactive flashcards.
- **Voice Support**: "Read Aloud" functionality for accessible learning.
- **Progress Analytics**: Track your completion, scores, and learning streaks.
- **Demo Mode**: Fully functional even without API keys using built-in mock data.

## 🛠️ Google Services Used

- **Google Gemini API**: Powers all AI features including roadmap generation, lesson content, quizzes, and study aids.
- **Firebase Auth**: Secure, anonymous guest login.
- **Firestore**: Scalable storage for user profiles and learning progress.
- **Web Speech API**: Integrated voice learning support.

## 🏗️ Architecture

The app follows a clean, modular architecture:
- `src/components`: Reusable UI and functional modules.
- `src/services`: Gemini and Firebase integrations.
- `src/hooks`: Custom hooks for Auth and state management.
- `src/utils`: Adaptive logic and security utilities.
- `src/types`: Comprehensive TypeScript definitions.

## 🔒 Security & Efficiency

- **Environment Variables**: Sensitive keys are never hardcoded.
- **Firestore Rules**: Restricted data access per user.
- **Input Sanitization**: All user inputs are sanitized before being sent to the AI.
- **Caching**: AI-generated content is stored in state/Firestore to minimize API calls.
- **Responsive & Accessible**: Semantic HTML, ARIA labels, and mobile-first design.

## 🧪 Testing

Comprehensive unit tests for core logic using Vitest:
- Adaptive difficulty adjustment logic.
- Quiz score calculation.
- Weak area detection.
- Security sanitization.

Run tests with:
```bash
npm test
```

## 📦 Getting Started

1. Clone the repository.
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and add your keys.
4. Run locally: `npm run dev`

## 🎬 Demo

Check out the live demo and walkthrough:
- **Live Demo**: [Link to your hosted app (e.g. Firebase Hosting/Vercel)](#)
- **Video Walkthrough**: [Link to your YouTube/Loom Demo Video](#)

## 🎬 Demo Scenario

1. Click **Start Learning Now**.
2. Enter Topic: "Photosynthesis".
3. Level: "Beginner", Pace: "Slow", Style: "Example-based", Time: "20 min".
4. Explore the generated **Roadmap**.
5. Read the **Lesson**, use **Read Aloud**.
6. Take the **Quiz**.
7. View **Weak Areas** and **Study Notes**.
8. Flip through **Flashcards**.

---

Built with ❤️ by Antigravity (Google Deepmind)
