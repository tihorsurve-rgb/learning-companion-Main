# Learning Companion

An intelligent, adaptive learning assistant built with React, Vite, Firebase, and Google Gemini API. This application personalizes educational content, tracks user progress, and adjusts learning difficulty based on quiz performance.

## 🚀 Demo Flow
1. Open the application.
2. Enter a topic (e.g., "Photosynthesis").
3. Select "Beginner" level and "Slow" pace.
4. Click "Start Learning".
5. Read the generated simple explanation.
6. Click "Take Quiz" and answer the questions.
7. Observe how the feedback and difficulty adapt based on your score:
   - Low score: "Let's slow down and explain with simpler examples."
   - High score: "Great! Moving to a slightly advanced concept."

## 🛠️ Architecture & Tech Stack
- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Vanilla CSS (Custom properties, CSS modules-like scoping, glassmorphism)
- **Icons**: Lucide React
- **AI Services**: Google Generative AI (Gemini 1.5 Flash)
- **Database & Auth**: Firebase Firestore (Ready for Auth integration)
- **Testing**: Vitest, React Testing Library

## 🔒 Security Notes
- **API Keys**: API keys are securely managed via environment variables and are **not** hardcoded in the application source.
- **Firestore Rules**: Configured to ensure users can only read/write their own progress data.
- **Input Validation**: Handled natively and via React state before API submission to Gemini.

## ⚙️ Setup Instructions

1. **Clone & Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Rename `.env.example` to `.env.local` and add your keys:
   ```env
   VITE_GEMINI_API_KEY=your_real_gemini_api_key
   VITE_FIREBASE_API_KEY=your_firebase_key
   # ...other firebase config
   ```
   *Note: If no Gemini API key is provided, the app will automatically run in "Mock Mode" for demo purposes.*

3. **Start Development Server**
   ```bash
   npm run dev
   ```

## 🧪 Testing

The project uses Vitest for testing core logic (like the adaptive difficulty scoring).

Run tests with:
```bash
npm run test
```

## 📊 Google Services Used
- **Google Gemini API**: For generating dynamic learning content, personalized explanations, and contextual quizzes.
- **Firebase Firestore**: For storing user progress, completed lessons, and difficulty metrics.
- **Firebase Auth** (Optional Extension): Scaffolded for seamless login and user identification.
