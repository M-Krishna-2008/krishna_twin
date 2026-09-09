# KRISHNA.AI Backend Proxy

This is the standalone backend service that proxies chat requests between your static GitHub Pages frontend and OpenRouter.

## Why this is needed
GitHub Pages is a static hosting provider and cannot securely store private API keys like `OPENROUTER_API_KEY`. This proxy securely keeps your key secret, applies Krishna AI's system prompt using `memory.txt`, and talks to OpenRouter.

## Quick Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Copy `.env.example` to `.env`:**
   ```bash
   cp .env.example .env
   ```

3. **Fill in your key:**
   ```env
   OPENROUTER_API_KEY=your_key_here
   OPENROUTER_MODEL=google/gemma-4-26b-a4b-it:free
   PORT=5000
   ALLOWED_ORIGIN=https://<username>.github.io
   ```

4. **Run locally:**
   ```bash
   npm start
   ```

## 1-Click Cloud Deployment

You can host this backend on:
- **Render.com** (Free Web Service)
- **Railway.app**
- **Vercel** / **Fly.io**
- **Cloud Run** / **VPS**

Ensure you add `OPENROUTER_API_KEY` in your cloud host's Environment Variables panel!
