# KRISHNA.AI ⚡

> **Personal AI Digital Twin** for Krishna — accessible via QR code, designed for static hosting on GitHub Pages with a secure OpenRouter backend proxy.

---

## 🌟 Core Architecture

```
QR CODE SCAN
     ↓
KRISHNA.AI Welcome Screen
     ↓
[ START CHAT → ]
     ↓
Full-Screen AI Digital Twin Chat
     ↓
Ask anything about Krishna (Source of truth: memory.txt)
```

- **Frontend (`src/`)**: Clean React + Tailwind CSS + Motion single-page digital-twin chat application. Compatible with **GitHub Pages** static hosting.
- **Memory (`memory.txt`)**: The single source of truth containing Krishna's background, education, cybersecurity experience, projects, and contact links.
- **Backend (`server.ts` & `backend/`)**: Secure API proxy that holds the `OPENROUTER_API_KEY`, injects `memory.txt` as system instructions, and queries OpenRouter (`google/gemma-4-26b-a4b-it:free`). **Never exposes the secret key to the browser.**

---

## 📁 Project Structure

```
├── memory.txt              # Krishna's knowledge base (Fill this with your details)
├── src/                    # Frontend React application
│   ├── components/         # WelcomeScreen, ChatHeader, ChatMessageItem, ChatInput, etc.
│   ├── config.ts           # Configurable API endpoint (for GitHub Pages)
│   ├── types.ts            # TypeScript interfaces
│   ├── App.tsx             # Main chat application & screen transitions
│   └── main.tsx            # Entry point
├── backend/                # Standalone backend proxy for production deployment
│   ├── server.js           # Node.js + Express proxy for OpenRouter
│   ├── package.json        # Backend dependencies (express, cors, dotenv)
│   └── .env.example        # Backend environment variables
├── server.ts               # Local full-stack development & preview server
├── vite.config.ts          # Vite build config with base: './' for GitHub Pages
└── package.json            # Root package configuration
```

---

## 🚀 1. How to Run Locally

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up your environment:**
   Create a `.env` file in the root directory:
   ```env
   OPENROUTER_API_KEY=your_actual_openrouter_api_key_here
   OPENROUTER_MODEL=google/gemma-4-26b-a4b-it:free
   PORT=3000
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

---

## 🧠 2. How to Fill `memory.txt`

Open `memory.txt` in any text editor. It contains labeled sections with instructions:

- `[ABOUT KRISHNA]` — Who you are, where you're based, core passions.
- `[EDUCATION]` — University, degree, year, coursework.
- `[CYBERSECURITY]` — CTFs, pentesting, certifications, focus areas.
- `[PROGRAMMING]` — Languages, tools, frameworks, coding preferences.
- `[AI]` — Experience with AI/ML, favorite models.
- `[PROJECTS]` — What you've built, tech stack, descriptions.
- `[SKILLS]` — Technical & soft skills.
- `[INTERESTS]` — Hobbies, sports, games, favorite books.
- `[CURRENTLY LEARNING]` — What you're currently studying.
- `[GOALS]` — Short-term & long-term aspirations.
- `[ACHIEVEMENTS]` — Awards, hackathons, milestones.
- `[FUN FACTS]` — Quirky or memorable facts.
- `[PERSONALITY]` — Digital twin vibe & tone.
- `[COMMUNICATION STYLE]` — How you like to communicate.
- `[PREFERENCES]` — OS, editor, tabs vs spaces.
- `[CONTACT / SOCIAL LINKS]` — Your real GitHub, LinkedIn, Instagram, email.

> 🔒 **Memory Rule**: The AI will **never** invent personal information. If a section is left blank, the digital twin honestly tells the user that the information is not recorded in memory.

---

## 🔑 3. How to Configure the OpenRouter API Key Securely

1. Go to [openrouter.ai](https://openrouter.ai) and generate an API key.
2. Store your key in `.env` (or environment variables in your hosting provider):
   ```env
   OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxxxxxxxxx
   OPENROUTER_MODEL=google/gemma-4-26b-a4b-it:free
   ```
3. **NEVER** put your `OPENROUTER_API_KEY` into frontend files (`src/*`), `memory.txt`, or Git. The `.gitignore` is preconfigured to prevent pushing `.env` files.

---

## 🌐 4. Where to Change the Production API Endpoint

In `src/config.ts`:

```typescript
export const APP_CONFIG = {
  // Option A: Set via VITE_API_URL environment variable during build
  // Option B: Overridden dynamically via window.__KRISHNA_AI_API_URL__ in index.html
  // Option C: Hardcode your backend URL directly here:
  getApiUrl: (): string => {
    if (typeof window !== 'undefined' && window.__KRISHNA_AI_API_URL__) {
      return window.__KRISHNA_AI_API_URL__;
    }
    return import.meta.env.VITE_API_URL || '/api/chat';
  },
};
```

When deploying to GitHub Pages, set `VITE_API_URL` to your live backend (e.g. `https://krishna-ai-backend.onrender.com/api/chat`).

---

## ☁️ 5. How to Deploy the Backend

The `backend/` directory is an independent lightweight microservice that can be deployed for free in 2 minutes:

### Deploy to Render.com (Recommended Free Hosting)
1. Push your repository to GitHub.
2. Go to [Render.com](https://render.com) and click **New Web Service**.
3. Connect your repository.
4. Settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. Under **Environment Variables**, add:
   - `OPENROUTER_API_KEY`: your OpenRouter API key
   - `OPENROUTER_MODEL`: `google/gemma-4-26b-a4b-it:free`
   - `ALLOWED_ORIGIN`: `https://<your-username>.github.io`
6. Copy your service URL (e.g., `https://krishna-ai-backend.onrender.com`).

---

## 📦 6. How to Build & Deploy the Frontend to GitHub Pages

1. **Build the static frontend with your backend URL:**
   ```bash
   VITE_API_URL="https://krishna-ai-backend.onrender.com/api/chat" npm run build:static
   ```
   This compiles all static assets into the `dist/` directory.

2. **Deploy to GitHub Pages:**
   - **Option 1 (gh-pages CLI):**
     ```bash
     npx gh-pages -d dist
     ```
   - **Option 2 (GitHub Actions):**
     Push to GitHub and enable GitHub Pages under **Settings > Pages > GitHub Actions** using standard static Vite deployment.

3. **Verify:**
   Visit `https://<your-username>.github.io/<repo-name>/`.
   Generate a QR code pointing to this URL and test on your mobile device!

---

## 🛡️ Security Best Practices

- No API keys exist in the frontend bundle or Git history.
- Rate limiting and input sanitization are handled on the server.
- The system instructions strictly prevent the AI from fabricating personal data.
- Roast mode is locked to lighthearted humor derived solely from `memory.txt`.
