import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*';

app.use(cors({
  origin: ALLOWED_ORIGIN === '*' ? true : ALLOWED_ORIGIN,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '1mb' }));

// Helper to locate and read memory.txt
function getMemoryContent() {
  const possiblePaths = [
    path.join(__dirname, 'memory.txt'),
    path.join(__dirname, '..', 'memory.txt'),
    path.join(process.cwd(), 'memory.txt'),
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

// System prompt construction
function buildKrishnaSystemPrompt(memory) {
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

function parseMemorySections(memoryText) {
  const sections = {};
  const lines = memoryText.split('\n');
  let currentSection = '';
  let currentLines = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

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

function cleanText(text) {
  return (text || '')
    .toLowerCase()
    .replace(/[?!.,;:'"’“”(){}\[\]\-_/\\#@$%^&*`~]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function hasWordMatch(cleaned, word) {
  const regex = new RegExp(`\\b${word}\\b`, 'i');
  return regex.test(cleaned);
}

function hasAnyWordMatch(cleaned, words) {
  return words.some(w => hasWordMatch(cleaned, w));
}

function hasAnyPhraseMatch(cleaned, phrases) {
  return phrases.some(p => cleaned.includes(cleanText(p)));
}

function handleOfflineMemoryQuery(messagesOrQuery, memoryText) {
  let userQuery = '';
  let conversationHistory = [];

  if (Array.isArray(messagesOrQuery)) {
    conversationHistory = messagesOrQuery;
    const userMsgs = messagesOrQuery.filter(m => m.role === 'user');
    if (userMsgs.length > 0) {
      userQuery = userMsgs[userMsgs.length - 1].content;
    }
  } else if (typeof messagesOrQuery === 'string') {
    userQuery = messagesOrQuery;
  }

  const query = cleanText(userQuery);

  // Analyze conversation context
  let lastTopic = 'none';
  let lastAssistant = '';
  let lastUser = '';

  if (conversationHistory.length > 0) {
    const userMsgs = conversationHistory.filter(m => m.role === 'user');
    const assistantMsgs = conversationHistory.filter(m => m.role === 'assistant');
    lastAssistant = assistantMsgs.length > 0 ? assistantMsgs[assistantMsgs.length - 1].content.toLowerCase() : '';
    lastUser = userMsgs.length > 1 ? userMsgs[userMsgs.length - 2].content.toLowerCase() : '';

    if (lastAssistant.includes('ev assistant') || lastUser.includes('ev assistant') || lastUser.includes('voice assistant')) {
      lastTopic = 'ev_assistant';
    } else if (lastAssistant.includes('portable') || lastAssistant.includes('browser') || lastUser.includes('browser')) {
      lastTopic = 'portable_browser';
    } else if (lastAssistant.includes('fitgen') || lastUser.includes('fitgen')) {
      lastTopic = 'fitgen';
    } else if (lastAssistant.includes('safety assistant') || lastUser.includes('safety assistant')) {
      lastTopic = 'safety_assistant';
    } else if (lastAssistant.includes('kvns') || lastAssistant.includes('sesame') || lastUser.includes('kvns')) {
      lastTopic = 'kvns';
    } else if (lastAssistant.includes('chennai institute of technology') || lastAssistant.includes('cit') || lastAssistant.includes('be cybersecurity') || lastUser.includes('study') || lastUser.includes('college')) {
      lastTopic = 'education';
    } else if (lastAssistant.includes('cybersecurity') || lastUser.includes('cybersecurity') || lastUser.includes('security')) {
      lastTopic = 'cybersecurity';
    } else if (lastAssistant.includes('cinephile') || lastAssistant.includes('movie') || lastAssistant.includes('cinema') || lastUser.includes('movie') || lastUser.includes('cinema')) {
      lastTopic = 'cinema';
    } else if (lastAssistant.includes('currently learning') || lastAssistant.includes('fundamentals') || lastUser.includes('learning')) {
      lastTopic = 'learning';
    } else if (lastAssistant.includes('aim') || lastAssistant.includes('engineer') || lastAssistant.includes('future') || lastUser.includes('aim') || lastUser.includes('goal')) {
      lastTopic = 'aim_future';
    } else if (lastAssistant.includes('projects') || lastUser.includes('project') || lastUser.includes('built')) {
      lastTopic = 'projects';
    }
  }

  // 1. ROASTS / HUMOR
  if (
    hasAnyWordMatch(query, ['roast', 'mock', 'burn']) ||
    hasAnyPhraseMatch(query, ['make fun of', 'make fun', 'roast him', 'roast krishna'])
  ) {
    const roasts = [
      "Krishna wants to become an elite cybersecurity engineer, but his favorite programming languages are literally 'HTML, JS, CSS'—who's going to break the news to him that HTML isn't a programming language? 💀",
      "Krishna's definition of an introduction is literally: 'Here, scan this QR code and talk to my AI instead of talking to me.' Peak cyber-introvert efficiency! 💀",
      "He's entering an engineering college in BE Cybersecurity and when asked what he wants from college, he wrote: 'Peace.' Bro, you signed up for engineering, not a Buddhist monastery! 💀",
      "Krishna built an entire AI twin, a portable USB browser, and an Android safety assistant before even finishing his first day of college. Someone please stop this man before he automates his entire degree! 💀"
    ];
    return roasts[Math.floor(Math.random() * roasts.length)];
  }

  // 2. CONTEXTUAL FOLLOW-UP: "WHY DID HE CHOOSE IT?"
  const isWhyFollowUp =
    hasAnyPhraseMatch(query, [
      'why did he choose it',
      'why did he choose that',
      'why did he pick it',
      'why did he pick that',
      'why he chose it',
      'why did he go for it',
      'why choose it',
      'why that',
      'why this',
      'what made him choose it',
      'why did he choose',
      'why did he pick',
      'why it',
    ]) ||
    (query === 'why' || query === 'why so' || query === 'how come' || query === 'what was the reason');

  if (isWhyFollowUp) {
    if (lastTopic === 'cybersecurity' || lastTopic === 'education' || lastAssistant.includes('cybersecurity')) {
      return "He chose cybersecurity because of the rapid rise in digital threats and vulnerabilities—he genuinely wants to solve those problems and protect people's digital lives. He's particularly drawn to hands-on defensive security, web application auditing, and combining AI with security tools.";
    }
    if (lastTopic === 'ev_assistant') {
      return "He built EV Assistant to explore voice interaction combined with local LLMs (like Ollama and SQLite) so the assistant could have long-term memory without relying on third-party cloud APIs.";
    }
    if (lastTopic === 'portable_browser') {
      return "He built the Portable Browser to solve a real practical headache: being able to carry your personalized browsing environment, tabs, and configurations on a USB stick to use seamlessly across any school or lab PC.";
    }
    return "He's driven by practical curiosity—whether it's tackling rising digital security threats, exploring local AI models, or building tools that solve real everyday headaches.";
  }

  // 3. CONTEXTUAL FOLLOW-UP: "TELL ME MORE ABOUT THAT" / "ELABORATE"
  const isElaborateFollowUp =
    hasAnyPhraseMatch(query, [
      'tell me more about that',
      'tell me more about it',
      'tell me more',
      'can you elaborate',
      'elaborate on that',
      'elaborate',
      'more about that',
      'more about it',
      'explain that',
      'explain more',
      'go deeper',
    ]);

  if (isElaborateFollowUp) {
    if (lastTopic === 'ev_assistant') {
      return "For EV AI Assistant, Krishna combined speech recognition and synthesis with Electron, Node.js, and locally running LLMs (such as Qwen and Gemma via Ollama), backed by SQLite to persist user conversation memory across sessions without external cloud APIs.";
    }
    if (lastTopic === 'portable_browser') {
      return "The Portable Personal Browser runs entirely off a USB drive with configurable performance modes, letting Krishna bring his personalized workspace to different school and lab computers without leaving sensitive session traces behind.";
    }
    if (lastTopic === 'cybersecurity' || lastTopic === 'education') {
      return "In cybersecurity, Krishna focuses on practical hands-on defense—studying real-world vulnerabilities through the PortSwigger Web Security Academy and network architecture through Cisco Networking Academy. He's especially interested in AI-assisted threat detection and security automation.";
    }
    if (lastTopic === 'cinema') {
      return "As a cinephile, Krishna loves great direction, pacing, and engaging screenplays. He's drawn to sci-fi mysteries like *Stranger Things* and fresh romantic-comedy storytelling like *Premalu*.";
    }
    if (lastTopic === 'aim_future') {
      return "Krishna's overarching ambition is to become a top-tier Cyber Security Engineer. He plans to use his college years at CIT to dive into hackathons, build production-grade security tooling, and contribute real solutions to current cybersecurity challenges.";
    }
  }

  // 4. CONTEXTUAL FOLLOW-UP: "IS IT FINISHED?"
  if (
    hasAnyPhraseMatch(query, [
      'is it finished',
      'is it done',
      'is it complete',
      'has he finished it',
      'is it still ongoing',
      'what is the status',
      'is it working',
    ])
  ) {
    return "Most of Krishna's projects are functional prototypes and active learning experiments. He prefers building real, working systems to test out ideas and learn by breaking and rebuilding things, rather than just keeping concepts theoretical.";
  }

  // 5. CONTEXTUAL FOLLOW-UP: "WHICH ONE IS COOLEST?"
  if (
    hasAnyPhraseMatch(query, [
      'which one is coolest',
      'which one is the coolest',
      'which is coolest',
      'what is his coolest project',
      'what is his best project',
      'which project is best',
      'favorite project',
      'coolest thing he built',
      'which one do you like',
    ]) ||
    (hasWordMatch(query, 'coolest') && (hasWordMatch(query, 'project') || hasWordMatch(query, 'one')))
  ) {
    return "That's a tough call! His portable USB browser and voice-enabled EV Assistant with local Ollama LLMs are super slick, but his experiment building a low-budget programmable cybersecurity hardware device is probably one of the coolest because of how ambitious it is.";
  }

  // 6. MOVIES / CINEMA / CINEPHILE
  const isCinemaIntent =
    hasAnyPhraseMatch(query, [
      'what about movies',
      'what about cinema',
      'what about films',
      'and movies',
      'and cinema',
      'and films',
      'does he like movies',
      'does he like cinema',
      'does he like films',
      'is he into movies',
      'is he into cinema',
      'is he a cinephile',
      'his favorite movie',
      'his favorite movies',
      'his favorite shows',
      'favorite film',
      'what movies does he like',
      'what films does he like',
      'what does he watch',
    ]) ||
    hasAnyWordMatch(query, ['cinema', 'cinephile', 'movies', 'films', 'premalu']) ||
    (hasWordMatch(query, 'movie') && !hasWordMatch(query, 'theater')) ||
    (hasWordMatch(query, 'stranger') && hasWordMatch(query, 'things'));

  if (isCinemaIntent) {
    return "Krishna is a genuine cinephile with a strong passion for movies and cinema. He appreciates quality storytelling and directing across diverse genres, with big favorites being *Stranger Things* and *Premalu*.";
  }

  // 7. AIM / CAREER DIRECTION / GOALS / FUTURE / "WHAT'S HE DOING WITH HIS LIFE?"
  const isAimOrFutureIntent =
    hasAnyPhraseMatch(query, [
      'what is his aim',
      'what is his goal',
      'what are his goals',
      'what is his ambition',
      'what does he want to become',
      'what does he want to be',
      'what does he want to do in the future',
      'what does he want to do',
      'what is his dream',
      'what is his dream project',
      'what is he doing with his life',
      'what are his future plans',
      'future plans',
      'future goals',
      'what is his career goal',
      'career goal',
      'where does he see himself',
      'what does he aspire to',
      'and what does he want to do in the future',
      'and in the future',
      'what about the future',
      'what about his future',
      'what about his aim',
      'and his aim',
      'what does he hope to achieve',
    ]) ||
    (hasAnyWordMatch(query, ['aim', 'ambition', 'aspirations', 'aspiration', 'become']) && hasAnyWordMatch(query, ['his', 'krishna', 'he', 'future', 'want'])) ||
    (hasWordMatch(query, 'dream') && hasAnyWordMatch(query, ['project', 'job', 'future', 'krishna', 'his'])) ||
    (hasWordMatch(query, 'future') && (hasWordMatch(query, 'plans') || hasWordMatch(query, 'goals') || hasWordMatch(query, 'direction') || hasWordMatch(query, 'in the')));

  if (isAimOrFutureIntent) {
    return "Krishna's primary aim is to become a top-tier Cyber Security Engineer and build innovative technologies that solve real-world security threats. As he begins his BE in Cybersecurity at CIT, his goals are to build a strong foundation, maintain an 8.5+ CGPA, compete in hackathons, and develop practical AI and defensive security tools.";
  }

  // 8. WHY CYBERSECURITY / MOTIVATION
  const isWhyCyberIntent =
    hasAnyPhraseMatch(query, [
      'why did he choose cybersecurity',
      'why cybersecurity',
      'why did he pick cybersecurity',
      'why did he choose cyber',
      'why did he choose security',
      'what got him into cybersecurity',
      'what made him choose cybersecurity',
      'why did he go into cybersecurity',
      'reason for choosing cybersecurity',
      'why is he interested in cybersecurity',
      'what got him interested in cybersecurity',
      'motivation for cybersecurity',
    ]) ||
    (hasWordMatch(query, 'why') && hasAnyWordMatch(query, ['cybersecurity', 'cyber', 'security']) && hasAnyWordMatch(query, ['choose', 'pick', 'study', 'chose', 'into']));

  if (isWhyCyberIntent) {
    return "Krishna chose cybersecurity because of the rapid rise in digital threats and vulnerabilities—he genuinely wants to solve those problems and help secure people's digital lives. He's particularly drawn to hands-on defensive security, web application auditing, and combining AI with security tools.";
  }

  // 9. EDUCATION / WHERE IS HE STUDYING / CIT / DEGREE
  const isEducationIntent =
    hasAnyPhraseMatch(query, [
      'where is he studying',
      'where does he study',
      'what is he studying',
      'which college',
      'what college',
      'what degree',
      'where is he going to college',
      'which institute',
      'what school did he go to',
      'what is his education',
      'educational background',
      'his studies',
      'and his studies',
      'what about his studies',
      'what about his education',
      'where does he go to school',
      'college life',
      'what does he want from college',
      'what course',
      'his degree',
    ]) ||
    hasAnyWordMatch(query, ['cit', 'cbse', 'cgpa']) ||
    (hasAnyWordMatch(query, ['studying', 'study', 'studies', 'college', 'degree', 'university']) && hasAnyWordMatch(query, ['where', 'which', 'what', 'he', 'his', 'krishna']));

  if (isEducationIntent) {
    if (hasAnyPhraseMatch(query, ['what does he want from college', 'from college', 'in college', 'college goal'])) {
      return "When asked what he wants from college, his answer was simply: 'Peace.' Academically, he aims to maintain an 8.5+ CGPA, participate heavily in hackathons, and build a rock-solid foundation for his career as a Cyber Security Engineer.";
    }
    return "Krishna completed his Class 12 CBSE schooling and is about to start his Bachelor of Engineering (BE) in Cybersecurity at CIT (Chennai Institute of Technology) on September 15, 2026. He's focused on mastering security fundamentals and targeting an 8.5+ CGPA.";
  }

  // 10. CURRENTLY LEARNING
  const isLearningIntent =
    hasAnyPhraseMatch(query, [
      'what is he currently learning',
      'what is he learning',
      'currently learning',
      'what is he studying now',
      'what is he learning right now',
      'what is he learning now',
      'what is he practicing',
      'what is he exploring now',
      'what are his current studies',
      'current learning',
      'learning now',
    ]) ||
    (hasWordMatch(query, 'learning') && hasAnyWordMatch(query, ['currently', 'now', 'what', 'right now', 'presently']));

  if (isLearningIntent) {
    return "Right now, Krishna is actively learning core cybersecurity fundamentals, networking (including CCNA-related concepts), web application security through PortSwigger Web Security Academy, C programming, and security automation.";
  }

  // 11. TECHNOLOGY CURIOSITY / HIDDEN TECH / WHAT KIND OF TECH DOES HE LIKE
  const isTechCuriosityIntent =
    hasAnyPhraseMatch(query, [
      'what kind of technology does he like',
      'what kind of tech does he like',
      'what technology does he like',
      'what tech does he like',
      'what kind of technology',
      'what tech is he into',
      'hidden tech',
      'lesser known tech',
      'lesser-known',
      'unusual tech',
      'unconventional tech',
      'underrated tech',
      'rabbit holes',
      'what does he discover',
      'technology curiosity',
      'new concepts',
      'emerging tech',
      'emerging technology',
      'how does this work',
    ]);

  if (isTechCuriosityIntent) {
    return "Krishna is highly curious about emerging, unconventional, and hidden or lesser-known technologies. He has a daily habit of discovering something new every single day, going down technical rabbit holes to understand how systems work internally—from local AI models and security automation to networking protocols and embedded hardware.";
  }

  // 12. INTERESTS / WHAT IS HE INTO / WHAT DOES HE DO WHEN HE'S BORED
  const isInterestsIntent =
    hasAnyPhraseMatch(query, [
      'what is he into',
      'what s he into',
      'what are his interests',
      'what does he like',
      'what does he do when he s bored',
      'what does he do when hes bored',
      'what does he do when bored',
      'when he is bored',
      'when he gets bored',
      'in his free time',
      'free time',
      'spare time',
      'what are his hobbies',
      'his hobbies',
      'what catches his attention',
      'what does he enjoy',
      'what does he do for fun',
      'for fun',
      'what is he curious about',
      'what does he do outside of',
      'what does he like doing',
    ]) ||
    (hasAnyWordMatch(query, ['interests', 'hobbies', 'hobby', 'pastime']) && hasAnyWordMatch(query, ['what', 'his', 'krishna', 'he'])) ||
    (hasWordMatch(query, 'bored') && hasAnyWordMatch(query, ['does', 'do', 'when', 'he', 'krishna']));

  if (isInterestsIntent) {
    return "Krishna is deeply curious about technology—he spends time exploring new concepts, emerging tech, and discovering hidden or lesser-known technology every single day. He loves going down technical rabbit holes to figure out how systems work under the hood. Outside of tech, he's a true cinephile who loves movies and cinema (like *Stranger Things* and *Premalu*), plays games (all the GTA titles), and listens to music.";
  }

  // 13. TELL ME SOMETHING INTERESTING / FUN FACTS
  const isInterestingFactIntent =
    hasAnyPhraseMatch(query, [
      'tell me something interesting about him',
      'tell me something interesting',
      'something interesting about him',
      'something interesting',
      'anything interesting about him',
      'anything interesting',
      'tell me a fun fact',
      'fun facts',
      'fun fact',
      'random facts',
      'random fact',
      'tell me a fact',
      'quirk',
      'quirks',
      'interesting things',
      'interesting thing',
    ]) ||
    (hasWordMatch(query, 'interesting') && hasAnyWordMatch(query, ['something', 'anything', 'tell', 'fact', 'him', 'krishna'])) ||
    (hasWordMatch(query, 'fun') && hasWordMatch(query, 'fact'));

  if (isInterestingFactIntent) {
    return `Here are a few genuine fun facts from his memory 😄:
- He built a portable personal browser designed to run completely from a USB flash drive across different computers.
- His idea of an introduction is literally: "Here, scan this QR code and talk to my AI."
- He prefers learning by actually breaking, testing, and rebuilding things rather than only reading theory.
- He likes ambitious "why not build it?" projects, including experimenting with building his own programmable cybersecurity device on a low budget.
- When asked what he wants from college, his answer was simply: "Peace."`;
  }

  // 14. SPECIFIC PROJECTS: EV ASSISTANT
  if (
    hasAnyPhraseMatch(query, [
      'ev assistant',
      'ev ai assistant',
      'ev ai',
      'voice assistant',
      'voice ai',
    ]) ||
    (hasWordMatch(query, 'ev') && hasAnyWordMatch(query, ['assistant', 'project', 'ai']))
  ) {
    return "EV AI Assistant is a voice-based personal assistant Krishna built using Electron, Node.js, Ollama (for local LLMs), and SQLite. It features voice input and speech synthesis, conversation history, long-term memory, and local AI integration without needing third-party cloud APIs.";
  }

  // 15. SPECIFIC PROJECTS: PORTABLE BROWSER
  if (
    hasAnyPhraseMatch(query, [
      'portable browser',
      'usb browser',
      'personal browser',
      'portable personal browser',
    ]) ||
    (hasWordMatch(query, 'browser') && hasAnyWordMatch(query, ['usb', 'portable', 'flash drive', 'stick']))
  ) {
    return "The Portable Personal Browser is a self-contained browser environment Krishna built to run directly from a USB flash drive. It features configurable performance modes and lets him carry his personalized browsing environment across different school and lab computers.";
  }

  // 16. SPECIFIC PROJECTS: FITGEN AI
  if (hasWordMatch(query, 'fitgen')) {
    return "FitGen AI is a Python GUI application concept Krishna developed that combines customized workout planning with AI-driven fitness recommendations.";
  }

  // 17. SPECIFIC PROJECTS: SAFETY ASSISTANT
  if (hasAnyPhraseMatch(query, ['safety assistant', 'android safety', 'safety app'])) {
    return "Safety Assistant is an Android-focused utility concept Krishna explored, featuring water intake reminders, bedtime schedules, and emergency SOS SMS communication.";
  }

  // 18. SPECIFIC PROJECTS: KVNS COMPANY
  if (
    hasAnyWordMatch(query, ['kvns', 'sesame']) ||
    hasAnyPhraseMatch(query, ['paruthi vidhai', 'family business', 'family company'])
  ) {
    return "KVNS Company is his family's paruthi vidhai (sesame) business in Virudhunagar, founded around 1997 by Natarajan Rajesekaran. Krishna built a complete business website for the company.";
  }

  // 19. SPECIFIC PROJECTS: HARDWARE CYBERSECURITY DEVICE
  if (
    hasAnyPhraseMatch(query, ['cybersecurity device', 'hardware device', 'programmable device', 'low budget device', 'hardware project']) ||
    (hasWordMatch(query, 'hardware') && hasAnyWordMatch(query, ['device', 'experiment', 'cybersecurity']))
  ) {
    return "One of Krishna's ambitious experimental projects is building his own programmable cybersecurity hardware device on a low budget, exploring hands-on security concepts at the hardware and firmware level.";
  }

  // 20. GENERAL PROJECTS / PORTFOLIO
  const isProjectsIntent =
    hasAnyPhraseMatch(query, [
      'what has he built',
      'what has he made',
      'what did he build',
      'what does he build',
      'what kind of stuff does he build',
      'what projects has he done',
      'what projects has he worked on',
      'what are his projects',
      'tell me about his projects',
      'his projects',
      'show me his projects',
      'what can he do',
      'what can krishna do',
      'what has he done',
      'portfolio',
      'his work',
    ]) ||
    (hasWordMatch(query, 'projects') && hasAnyWordMatch(query, ['what', 'his', 'tell', 'show', 'any', 'list'])) ||
    (hasWordMatch(query, 'built') && hasAnyWordMatch(query, ['what', 'has', 'he', 'krishna']));

  if (isProjectsIntent) {
    return `Krishna has built and explored practical working prototypes across several domains:
1. **KRISHNA.AI**: His interactive digital twin chatbot.
2. **EV AI Assistant**: A voice assistant built with Electron, Node.js, SQLite, and local Ollama LLMs.
3. **Portable Personal Browser**: A browser built to run directly from a USB drive across different PCs.
4. **FitGen AI**: A Python GUI fitness application with AI recommendations.
5. **Safety Assistant**: An Android concept app with hydration reminders and SOS SMS alerts.
6. **KVNS Company Website**: A website built for his family's sesame business.

Check out his full portfolio at: https://m-krishna-2008.github.io/My_Portfolio/`;
  }

  // 21. CYBERSECURITY GENERAL
  if (
    hasAnyPhraseMatch(query, ['cybersecurity', 'cyber security', 'web security', 'network security', 'vulnerability', 'defensive security', 'portswigger', 'owasp']) ||
    hasWordMatch(query, 'cybersecurity') ||
    (hasWordMatch(query, 'security') && !hasWordMatch(query, 'social'))
  ) {
    return "Cybersecurity is Krishna's primary passion. He focuses heavily on defensive security, web application security (practicing on PortSwigger Web Security Academy), network defense (Cisco Networking Academy), and AI-assisted security automation to solve emerging real-world threats.";
  }

  // 22. TECH STACK / LANGUAGES / SKILLS
  const isTechStackIntent =
    hasAnyPhraseMatch(query, [
      'what technologies does he use',
      'what languages does he know',
      'programming languages',
      'programming language',
      'what is his tech stack',
      'tech stack',
      'what tools does he use',
      'what are his skills',
      'his skills',
      'technical skills',
      'does he know python',
      'does he know javascript',
      'what does he code in',
    ]) ||
    (hasAnyWordMatch(query, ['languages', 'stack', 'skills', 'tools']) && hasAnyWordMatch(query, ['what', 'his', 'he', 'tech', 'coding', 'programming']));

  if (isTechStackIntent) {
    return "Krishna has hands-on experience with Python, JavaScript, Node.js, React, Flask, C, and SQLite. For AI, he works with Ollama and OpenRouter, and for cybersecurity, he trains on PortSwigger Web Security Academy and Cisco Networking Academy.";
  }

  // 23. FAVORITES
  const isFavoritesIntent =
    hasAnyPhraseMatch(query, [
      'favorite food',
      'favorite game',
      'favorite games',
      'favorite song',
      'favorite music',
      'favorite artist',
      'what does he eat',
      'his favorites',
      'what are his favorites',
    ]) ||
    (hasWordMatch(query, 'favorite') && hasAnyWordMatch(query, ['food', 'game', 'games', 'music', 'song', 'things']));

  if (isFavoritesIntent) {
    return `Here are a few of Krishna's favorites:
- **Food**: Grilled Chicken
- **Games**: All the GTA games
- **Movies/Shows**: *Stranger Things* & *Premalu*
- **Music**: "Perfect" by Ed Sheeran
- **Technology**: AI & Cybersecurity`;
  }

  // 24. WHO IS KRISHNA
  const isAboutKrishnaIntent =
    hasAnyPhraseMatch(query, [
      'who is krishna',
      'who is he',
      'tell me about krishna',
      'tell me about him',
      'what kind of person is he',
      'what is he like',
      'describe krishna',
      'who are you',
      'introduce krishna',
      'introduce yourself',
    ]) ||
    query === 'who is' ||
    query === 'who is krishna manojkumar' ||
    query === 'about him';

  if (isAboutKrishnaIntent) {
    return "Krishna is a curious, hands-on cybersecurity student who completed Class 12 CBSE and is entering CIT Chennai for BE Cybersecurity. He loves uncovering hidden technology, exploring new concepts every day, and building practical prototypes across AI, web tools, and security. He's also an avid cinephile who loves movies.";
  }

  // 25. SOCIAL / CONTACT
  const isContactIntent =
    hasAnyPhraseMatch(query, [
      'how to contact him',
      'how can i contact him',
      'how to reach him',
      'how can i reach krishna',
      'github',
      'linkedin',
      'portfolio',
      'email',
      'phone number',
      'contact details',
      'social media',
      'social links',
      'connect with him',
    ]) ||
    hasAnyWordMatch(query, ['github', 'linkedin', 'portfolio', 'email', 'phone']);

  if (isContactIntent) {
    return `You can connect with Krishna through:
- **GitHub**: [github.com/M-Krishna-2008](https://github.com/M-Krishna-2008)
- **LinkedIn**: [linkedin.com/in/krishna-manojkumar-76477b41b](https://www.linkedin.com/in/krishna-manojkumar-76477b41b/)
- **Portfolio**: [m-krishna-2008.github.io/My_Portfolio](https://m-krishna-2008.github.io/My_Portfolio/)
- **Email**: krishnamanojkumar031208@gmail.com
- **Phone**: +91 7550279400`;
  }

  // 26. NATURAL MISSING INFORMATION FALLBACK
  return "I don't have that detail about Krishna yet. I know he's focused on cybersecurity, building practical AI and security tools, and studying at CIT, but that specific detail isn't in my memory.";
}

// Health check
app.get('/api/health', (req, res) => {
  const memory = getMemoryContent();
  res.json({
    status: 'online',
    app: 'KRISHNA.AI Backend',
    model: process.env.OPENROUTER_MODEL || 'google/gemma-4-26b-a4b-it:free',
    hasKey: Boolean(process.env.OPENROUTER_API_KEY),
    memoryCharacters: memory.length,
  });
});

// Chat proxy
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Invalid request: messages array is required.' });
    }

    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || typeof lastMessage.content !== 'string' || !lastMessage.content.trim()) {
      return res.status(400).json({ error: 'Message content cannot be empty.' });
    }

    const sanitizedMessages = messages
      .filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
      .slice(-10)
      .map(m => ({
        role: m.role,
        content: m.content.slice(0, 2000),
      }));

    const memory = getMemoryContent();
    const systemPrompt = buildKrishnaSystemPrompt(memory);

    const openRouterKey = process.env.OPENROUTER_API_KEY;
    const openRouterModel = process.env.OPENROUTER_MODEL || 'google/gemma-4-26b-a4b-it:free';

    if (openRouterKey && openRouterKey.trim().length > 0) {
      const candidateModels = [
        openRouterModel,
        'google/gemma-4-31b-it:free',
        'liquid/lfm-2.5-2.6b:free',
      ].filter((m, idx, arr) => arr.indexOf(m) === idx);

      for (const modelCandidate of candidateModels) {
        try {
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('OpenRouter request timed out')), 12000)
          );

          const orResponse = await Promise.race([
            fetch('https://openrouter.ai/api/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${openRouterKey.trim()}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': process.env.APP_URL || 'https://github.com',
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
            console.warn(`OpenRouter model ${modelCandidate} returned status ${orResponse.status}`);
            continue;
          }

          const data = await orResponse.json();
          const aiText = data.choices?.[0]?.message?.content;

          if (aiText && aiText.trim() && !aiText.startsWith('User Safety:')) {
            return res.json({ message: aiText.trim(), provider: 'openrouter', model: modelCandidate });
          }
        } catch (candidateErr) {
          console.warn(`OpenRouter candidate ${modelCandidate} failed:`, candidateErr.message);
        }
      }
    }

    // Fallback directly to offline memory digital twin engine
    const offlineReply = handleOfflineMemoryQuery(sanitizedMessages, memory);
    return res.json({ message: offlineReply, provider: 'digital-twin-memory' });
  } catch (error) {
    console.error('Error handling chat request:', error);
    const memory = getMemoryContent();
    const fallback = handleOfflineMemoryQuery(req.body?.messages || '', memory);
    return res.json({ message: fallback, provider: 'digital-twin-memory' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`KRISHNA.AI Backend running on port ${PORT}`);
});
