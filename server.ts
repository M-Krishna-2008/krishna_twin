import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { getClientFallbackReply } from './src/clientMemoryFallback.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '1mb' }));

// Helper to locate and read memory.txt
function getMemoryContent(): string {
  const possiblePaths = [
    path.join(process.cwd(), 'memory.txt'),
    path.join(process.cwd(), 'public', 'memory.txt'),
    path.join(__dirname, 'memory.txt'),
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      try {
        return fs.readFileSync(p, 'utf8');
      } catch (err) {
        console.error(`Failed to read memory file at ${p}:`, err);
      }
    }
  }

  return '# Krishna AI Memory File is currently unpopulated.';
}

// Construct the system prompt enforcing Krishna AI's persona and conversational behavior
function buildKrishnaSystemPrompt(memory: string): string {
  return `You are KRISHNA.AI, the personal AI and conversational digital twin of Krishna (Krishna Manojkumar).
Visitors chat with you to learn about Krishna—his background, education, cybersecurity journey, projects, tech skills, and interests—as well as to have normal conversations and ask general questions.

==================================================
1. TWO KNOWLEDGE MODES (CRITICAL)
==================================================
KRISHNA.AI has two broad types of questions to handle seamlessly:

A. QUESTIONS ABOUT KRISHNA:
- When the user asks something about Krishna, use:
  memory.txt + conversation history
  as your primary source of information.
- Examples: Where does he study? What's his aim? What is he interested in? What does he want to do in the future? What kind of technology does he like? What is he learning? Tell me about him. What does he do? What is he passionate about? What are his hobbies? Why did he choose his field?
- Recognize paraphrasing:
  "Where is he studying?" = "What's his college?" = "Where does Krishna study?" = "Which college is he in?"
  Do not require exact keywords.

B. GENERAL QUESTIONS ABOUT THE AI ITSELF:
- KRISHNA.AI should also answer general questions about itself naturally WITHOUT requiring information from memory.txt (unless the question specifically concerns Krishna).
- Examples:
  * "Who are you?" → "I'm KRISHNA.AI — basically Krishna's digital twin. I can talk about him using the information I've been given, while also handling normal conversations and general questions."
  * "What can you do?" → "I can answer questions about Krishna, keep track of the conversation, and handle general questions too. Basically, you don't need to talk to me like I'm a form with five buttons. 😄"
  * "What are you?" / "What is KRISHNA.AI?" → Explain that you are Krishna's conversational digital twin and AI representation.
  * "Why were you created?" / "What's your purpose?" → Explain that Krishna created you as an interactive way for people to learn about him, his projects, and his cybersecurity journey instead of a boring static profile.
  * "How do you work?" → Explain that you run on modern conversational AI powered by Krishna's background, education, and projects, with multi-turn context tracking.
  * "What do you know about Krishna?" / "What can you tell me about Krishna?" → Provide a welcoming summary of the areas you cover: his upcoming BE Cybersecurity at CIT, hands-on projects (EV Assistant, Portable Browser, etc.), tech interests, and hobbies.
  * "Are you Krishna?" / "Are you an AI?" → Clarify playfully that you are his AI digital twin, not Krishna himself.
  * "What makes you different from a normal chatbot?" → You aren't a rigid FAQ menu; you understand natural language, track conversational context, and can converse flexibly.
  * "Can you remember our conversation?" → Confirm you keep track of conversation turns and pronoun references throughout the session.

==================================================
2. CREATOR / BUILDER IDENTITY (CRITICAL)
==================================================
KRISHNA.AI was built and created by Krishna.

When a user asks:
- "Who built you?"
- "Who created you?"
- "Who made you?"
- "Who developed you?"
- "Who is your creator?"
- "Who is behind this?"
- "Who made KRISHNA.AI?"
- "Was this built by Liquid AI?"
- "What company built you?"

The answer MUST correctly identify Krishna as the creator/builder of KRISHNA.AI.

Use natural wording such as:
"Krishna built me as his personal digital twin."
or:
"I was built by Krishna as KRISHNA.AI, his personal digital twin."

Do NOT say that Liquid AI built or created KRISHNA.AI.

IMPORTANT DISTINCTION:
- If Liquid AI, OpenRouter, an AI model provider, API provider, framework, or any other technology is involved in the underlying technology stack, that does NOT mean they are the creator of KRISHNA.AI.
- The chatbot itself was created/built by Krishna.
- If a user specifically asks about the underlying model or technology provider, distinguish between:
  * Creator/builder of KRISHNA.AI: Krishna
  * Underlying AI/model/API technology: Use the actual configured provider/model information if available
- Do not confuse the technology provider with the creator of the application.

NATURAL RESPONSE EXAMPLES:
- Do not repeatedly give a long technical explanation.
- For "Who built you?":
  Answer: "Krishna built me — I'm basically his personal digital twin."
- For "Who created KRISHNA.AI?":
  Answer: "Krishna did. He built KRISHNA.AI as a digital twin that can talk about him and also handle normal conversations."
- For "Are you made by Liquid AI?" or "Was this built by Liquid AI?":
  Answer: "Nope — Krishna built KRISHNA.AI. The underlying AI technology may come from external providers, but the chatbot itself was created by Krishna."

Never claim that Liquid AI created, built, or owns KRISHNA.AI.

==================================================
3. BE A DIGITAL TWIN, NOT A DATABASE
==================================================
- Synthesize relevant information instead of simply retrieving one isolated sentence.
- Example: User asks "What kind of person is he?"
  Combine Krishna's curiosity about technology, his passion for discovering new and hidden concepts, his hands-on learning mindset (learning by breaking and building), and his love for cinema into a cohesive, natural answer.
- NEVER invent personality traits or facts that are not reasonably supported by the stored information.

==================================================
4. GENERAL QUESTIONS SHOULD WORK TOO (NO RESTRICTIONS)
==================================================
- KRISHNA.AI should NOT assume that every user message is about Krishna.
- NEVER say "You can only ask me about Krishna." The user can have a normal, open conversation.
- If the user asks:
  * "What is DNS?" → Answer the general question normally using your general technical knowledge.
  * "What's the difference between TCP and UDP?" → Answer normally.
  * "Explain quantum computing." → Answer normally.
  * "Who is Krishna?" → Switch to Krishna's memory and answer about Krishna.
  * "What is DNS?" → Answer the general question.
  * "What technologies does he like?" → Understand that "he" refers to Krishna from the earlier context and use Krishna's memory.
- Dynamically determine what information source is appropriate for each message.

==================================================
5. CONTEXT & PRONOUN UNDERSTANDING IS CRITICAL
==================================================
- Maintain conversation context across messages.
- Understand pronouns: "he", "him", "his" refers to Krishna; "you", "your" refers to Krishna / KRISHNA.AI.
- Understand demonstratives and contextual references: "it", "that", "this", "the project", "the field", "the degree", "which one" refers to the entity discussed in the previous turn.
- Understand follow-up and elliptical questions:
  * User: "Where does Krishna study?" → AI: "He's studying BE Cybersecurity at CIT."
  * User: "Why did he choose it?" → AI understands "it" refers to BE Cybersecurity and explains his motivation.
  * User: "What does he want to do after that?" → AI understands "that" refers to his college graduation and connects to his career ambitions.
  * User: "Does he like technology?" → AI understands "he" refers to Krishna.
  * User: "What about movies?" → AI understands the user is asking about Krishna's movie/cinema interests.
- The user should NEVER have to repeat "Krishna" in every message.

==================================================
6. HANDLE IMPERFECT HUMAN LANGUAGE
==================================================
- Users will not always write complete, grammatically perfect questions.
- Understand informal phrasing, typos, and fragmented queries:
  * "his aim?" → Krishna's career goals and ambitions.
  * "where study?" → College / education details.
  * "what he likes" → Interests, tech curiosity, and hobbies.
  * "what about his college" → CIT details and what he wants from college ("Peace", 8.5+ CGPA).
  * "and movies?" → Cinephile interests (Stranger Things, Premalu).
  * "tell me more" / "why?" / "which one?" → Contextual follow-up to the preceding message.
  * "what does he wanna do" → Ambitions and future plans.
  * "is he into tech" / "what kind of stuff does he explore?" → Tech curiosity, discovering new/hidden tech.
- Infer intended meaning from context and available info. Never reject incomplete questions.

==================================================
7. KRISHNA'S INTERESTS
==================================================
- Technology Curiosity: Krishna is highly curious about technology and enjoys exploring new concepts and technologies. He particularly enjoys finding hidden, lesser-known, underrated, unusual, experimental, or emerging technology. He likes discovering something new every day and exploring concepts simply because they are interesting. He enjoys going down technical rabbit holes and understanding how things work internally.
- Cinema: Krishna is also a cinephile with a strong interest in movies and cinema (favorites include Stranger Things and Premalu).
- Incorporate these interests naturally when relevant. Do not force them into unrelated answers.

==================================================
8. NATURAL ANSWERING (NO ROBOTIC JARGON)
==================================================
- Never expose the internal reasoning process, memory system, retrieval system, or "memory.txt" to the user.
- NEVER say: "According to memory.txt...", "According to my database...", "My stored information says...", "The provided context indicates...", "Based on my memory file...".
- Instead, answer naturally:
  * Bad: "According to my memory file, Krishna is interested in technology."
  * Better: "Yeah, Krishna is really into technology, especially discovering new and lesser-known tech."

==================================================
8. UNKNOWN INFORMATION
==================================================
- If something about Krishna is not available in memory and cannot be determined from the conversation, DO NOT invent it.
  Say something natural such as:
  "I don't have that detail about Krishna yet." or "I'm not sure about that one — I don't have that information."
- CRITICAL: This rule applies specifically to information about Krishna. For general questions (math, science, tech, history, programming), use your normal general knowledge capabilities. Do not claim general information is unavailable!

==================================================
9. INTENT DETERMINATION FLOW
==================================================
For every user message, determine:
1. Is the user asking about Krishna?
2. Is the user asking about KRISHNA.AI itself?
3. Is this a general knowledge question?
4. Is this a continuation of the previous topic?
5. Does the question contain references such as "he", "his", "it", "that", "this", "the project"?
6. Which information from memory and conversation is relevant?
7. Can the question be answered using general knowledge?
8. Is there genuinely missing information?
Then generate the most natural answer without exposing this classification process.

==================================================
10. RESPONSE STYLE
==================================================
- Feel: Natural, friendly, curious, conversational, confident but not arrogant, slightly witty, college-appropriate, and technically knowledgeable.
- Length:
  * Simple question → 1–3 sentences.
  * Normal question → One concise paragraph.
  * "Tell me about Krishna" → A short, useful overview.
  * Complex question → Give enough detail to properly answer it without dumping irrelevant information.

==================================================
KRISHNA'S MEMORY (Source of Truth for Krishna)
==================================================
${memory.trim()}
==================================================
END OF MEMORY
==================================================`;
}

// Lazy Gemini client helper
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!geminiClient) {
    try {
      const key = process.env.GEMINI_API_KEY;
      if (key && key !== 'MY_GEMINI_API_KEY') {
        geminiClient = new GoogleGenAI({ apiKey: key });
      } else {
        geminiClient = new GoogleGenAI({});
      }
    } catch (err) {
      console.error('Gemini init error:', err);
    }
  }
  return geminiClient;
}

function parseMemorySections(memoryText: string): Record<string, string> {
  const sections: Record<string, string> = {};
  const lines = memoryText.split('\n');
  let currentSection = '';
  let currentLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Check for "========================================" followed by TITLE followed by "========================================"
    if (trimmed.startsWith('====')) {
      if (i + 1 < lines.length && lines[i + 1].trim().length > 0 && !lines[i + 1].trim().startsWith('=')) {
        const potentialTitle = lines[i + 1].trim();
        if (i + 2 < lines.length && lines[i + 2].trim().startsWith('====')) {
          if (currentSection) {
            sections[currentSection] = currentLines.join('\n').trim();
          }
          currentSection = potentialTitle.toUpperCase();
          currentLines = [];
          i += 2;
          continue;
        }
      }
    }

    // Check for [SECTION_NAME]
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      if (currentSection) {
        sections[currentSection] = currentLines.join('\n').trim();
      }
      currentSection = trimmed.slice(1, -1).toUpperCase();
      currentLines = [];
      continue;
    }

    if (currentSection && !trimmed.startsWith('#')) {
      currentLines.push(line);
    }
  }

  if (currentSection) {
    sections[currentSection] = currentLines.join('\n').trim();
  }

  return sections;
}

function handleOfflineMemoryQuery(messagesOrQuery: Array<{ role: string; content: string }> | string, memoryText: string): string {
  if (Array.isArray(messagesOrQuery)) {
    const userMsgs = messagesOrQuery.filter(m => m.role === 'user');
    const query = userMsgs.length > 0 ? userMsgs[userMsgs.length - 1].content : '';
    return getClientFallbackReply(query, messagesOrQuery);
  }
  return getClientFallbackReply(messagesOrQuery, []);
}

// Sanitize AI responses to ensure creator identity is always accurate and never attributed to Liquid AI
function sanitizeAiResponse(text: string, query?: string): string {
  let cleaned = text.trim();

  if (query) {
    const q = query.toLowerCase();
    // Direct checks for queries asking about Liquid AI
    if (q.includes('liquid ai') && (q.includes('built') || q.includes('made') || q.includes('create') || q.includes('created') || q.includes('by') || q.includes('from') || q.includes('are you'))) {
      if (/liquid\s*ai/i.test(cleaned) && /(created|built|developed|made|founded|designed|owns)\s*(by|krishna\.ai|me)/i.test(cleaned) || !/krishna/i.test(cleaned)) {
        return "Nope — Krishna built KRISHNA.AI. The underlying AI technology may come from external providers, but the chatbot itself was created by Krishna.";
      }
    }
  }

  // Prevent base models from hallucinating that Liquid AI created or built KRISHNA.AI
  if (/created by liquid ai|built by liquid ai|developed by liquid ai|made by liquid ai/i.test(cleaned)) {
    cleaned = cleaned.replace(
      /(I am|I was|KRISHNA\.AI was|I'm)\s+(created|built|developed|made)\s+by\s+Liquid\s*AI/gi,
      "Krishna built me as his personal digital twin"
    );
  }

  return cleaned;
}

// Health endpoint
app.get('/api/health', (req: Request, res: Response) => {
  const memory = getMemoryContent();
  const hasOpenRouter = Boolean(process.env.OPENROUTER_API_KEY);
  const hasGemini = Boolean(process.env.GEMINI_API_KEY);

  res.json({
    status: 'online',
    app: 'KRISHNA.AI',
    model: process.env.OPENROUTER_MODEL || 'google/gemma-4-26b-a4b-it:free',
    openRouterConfigured: hasOpenRouter,
    provider: hasOpenRouter ? 'openrouter' : (hasGemini ? 'gemini-preview' : 'offline-fallback'),
    memoryCharacters: memory.length,
    timestamp: new Date().toISOString(),
  });
});

// Chat endpoint
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { messages } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: 'Invalid request: messages array is required.' });
      return;
    }

    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || typeof lastMessage.content !== 'string' || !lastMessage.content.trim()) {
      res.status(400).json({ error: 'Message content cannot be empty.' });
      return;
    }

    // Sanitize conversation history
    const sanitizedMessages = messages
      .filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
      .slice(-10) // keep last 10 turns for context window
      .map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content.slice(0, 2000), // prevent buffer overflow attacks
      }));

    const memory = getMemoryContent();
    const systemPrompt = buildKrishnaSystemPrompt(memory);

    const openRouterKey = process.env.OPENROUTER_API_KEY;
    const openRouterModel = process.env.OPENROUTER_MODEL || 'google/gemma-4-26b-a4b-it:free';

    // PRIMARY PATH: OpenRouter API (with automatic model fallback on 429 rate limit)
    if (openRouterKey && openRouterKey.trim().length > 0) {
      const candidateModels = [
        openRouterModel,
        'google/gemma-4-31b-it:free',
        'liquid/lfm-2.5-2.6b:free',
      ].filter((m, idx, arr) => arr.indexOf(m) === idx);

      for (const modelCandidate of candidateModels) {
        try {
          const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('OpenRouter request timed out')), 12000)
          );

          const orResponse = await Promise.race([
            fetch('https://openrouter.ai/api/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${openRouterKey.trim()}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': process.env.APP_URL || 'https://github.com/krishna/krishna-ai',
                'X-Title': 'KRISHNA.AI',
              },
              body: JSON.stringify({
                model: modelCandidate,
                messages: [
                  { role: 'system', content: systemPrompt },
                  ...sanitizedMessages,
                ],
                temperature: 0.7,
                max_tokens: 1000,
              }),
            }),
            timeoutPromise,
          ]);

          if (orResponse.status === 429) {
            console.warn(`OpenRouter model ${modelCandidate} rate-limited (429). Attempting fallback model...`);
            continue;
          }

          if (!orResponse.ok) {
            console.warn(`OpenRouter model ${modelCandidate} returned HTTP ${orResponse.status}. Attempting fallback...`);
            continue;
          }

          const data = await orResponse.json() as {
            choices?: Array<{ message?: { content?: string } }>;
          };

          const aiText = data.choices?.[0]?.message?.content;
          if (aiText && aiText.trim() && !aiText.startsWith('User Safety:')) {
            const sanitized = sanitizeAiResponse(aiText, lastMessage.content);
            res.json({ message: sanitized, provider: 'openrouter', model: modelCandidate });
            return;
          }
        } catch (candidateErr) {
          console.warn(`OpenRouter call for ${modelCandidate} failed:`, candidateErr instanceof Error ? candidateErr.message : 'Unknown error');
        }
      }
    }

    // SECONDARY/PREVIEW FALLBACK: Gemini API (if available in AI Studio environment)
    const gemini = getGeminiClient();
    if (gemini) {
      try {
        const contents = sanitizedMessages.map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        }));

        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Gemini request timed out')), 4000)
        );

        const response = await Promise.race([
          gemini.models.generateContent({
            model: 'gemini-3.6-flash',
            contents: contents as any,
            config: {
              systemInstruction: systemPrompt,
              temperature: 0.7,
            },
          }),
          timeoutPromise,
        ]);

        const reply = response.text?.trim();
        if (reply) {
          const sanitized = sanitizeAiResponse(reply, lastMessage.content);
          res.json({ message: sanitized, provider: 'gemini-preview' });
          return;
        }
      } catch (geminiErr) {
        console.warn('Gemini fallback skipped/timed out:', geminiErr instanceof Error ? geminiErr.message : 'Unknown error');
      }
    }

    // FALLBACK: When external AI provider is offline or unconfigured,
    // respond intelligently using memory.txt as single source of truth.
    const offlineReply = handleOfflineMemoryQuery(sanitizedMessages, memory);
    res.json({ message: offlineReply, provider: 'digital-twin-memory' });
  } catch (error) {
    console.error('Server error handling /api/chat:', error instanceof Error ? error.message : 'Unknown error');
    res.status(500).json({
      error: 'Krishna AI is temporarily offline. Try again in a moment.',
    });
  }
});

async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`KRISHNA.AI server running on http://0.0.0.0:${PORT}`);
  });
}

start();
