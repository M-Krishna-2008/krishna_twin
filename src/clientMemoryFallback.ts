/**
 * KRISHNA.AI — Semantic Reasoning & Contextual Digital Twin Engine
 *
 * Implements:
 * 1. Two Knowledge Modes:
 *    - Mode A: Questions ABOUT KRISHNA (memory.txt + conversation history)
 *    - Mode B: General questions ABOUT KRISHNA.AI ITSELF (natural AI digital twin identity)
 * 2. Mode C: General technical & conversational questions (DNS, TCP vs UDP, Quantum computing, APIs, etc.)
 * 3. Conversational context tracking & pronoun resolution ("he", "his", "it", "that", "this", "why did he choose it?")
 * 4. Flexible handling of imperfect, informal, or fragmented human language
 * 5. Natural digital twin synthesis without robotic boilerplate
 */

export interface ChatHistoryMessage {
  role: string;
  content: string;
}

// Track conversational subject context across dialogue turns
interface ConversationContext {
  lastTopic:
    | 'cybersecurity'
    | 'education'
    | 'projects'
    | 'ev_assistant'
    | 'portable_browser'
    | 'fitgen'
    | 'safety_assistant'
    | 'kvns'
    | 'hardware_device'
    | 'interests'
    | 'cinema'
    | 'learning'
    | 'aim_future'
    | 'personality'
    | 'contact'
    | 'ai_itself'
    | 'general_tech'
    | 'none';
  lastAssistantSnippet: string;
  lastUserSnippet: string;
}

function analyzeConversationContext(history?: ChatHistoryMessage[]): ConversationContext {
  if (!history || history.length === 0) {
    return { lastTopic: 'none', lastAssistantSnippet: '', lastUserSnippet: '' };
  }

  const userMsgs = history.filter(m => m.role === 'user');
  const assistantMsgs = history.filter(m => m.role === 'assistant');

  const lastAssistant = assistantMsgs.length > 0 ? assistantMsgs[assistantMsgs.length - 1].content.toLowerCase() : '';
  const lastUser = userMsgs.length > 1 ? userMsgs[userMsgs.length - 2].content.toLowerCase() : '';

  let lastTopic: ConversationContext['lastTopic'] = 'none';

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
  } else if (lastAssistant.includes('programmable') || lastAssistant.includes('hardware') || lastUser.includes('hardware')) {
    lastTopic = 'hardware_device';
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
  } else if (lastAssistant.includes('digital twin') || lastAssistant.includes('krishna.ai') || lastUser.includes('who are you') || lastUser.includes('what can you do')) {
    lastTopic = 'ai_itself';
  } else if (lastAssistant.includes('dns') || lastAssistant.includes('tcp') || lastAssistant.includes('quantum') || lastAssistant.includes('protocol')) {
    lastTopic = 'general_tech';
  } else if (lastAssistant.includes('projects') || lastUser.includes('project') || lastUser.includes('built')) {
    lastTopic = 'projects';
  }

  return {
    lastTopic,
    lastAssistantSnippet: lastAssistant,
    lastUserSnippet: lastUser,
  };
}

// Clean and normalize text for semantic evaluation
function clean(text: string): string {
  return text
    .toLowerCase()
    .replace(/[?!.,;:'"’“”(){}\[\]\-_/\\#@$%^&*`~]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function hasWord(cleaned: string, word: string): boolean {
  const regex = new RegExp(`\\b${word}\\b`, 'i');
  return regex.test(cleaned);
}

function hasAnyWord(cleaned: string, words: string[]): boolean {
  return words.some(w => hasWord(cleaned, w));
}

function hasPhrase(cleaned: string, phrase: string): boolean {
  return cleaned.includes(clean(phrase));
}

function hasAnyPhrase(cleaned: string, phrases: string[]): boolean {
  return phrases.some(p => cleaned.includes(clean(p)));
}

/**
 * Main conversational response engine
 */
export function getClientFallbackReply(
  rawQuery: string,
  conversationHistory?: ChatHistoryMessage[]
): string {
  const query = clean(rawQuery);
  const context = analyzeConversationContext(conversationHistory);

  // =========================================================================
  // 1. PLAYFUL ROASTS / HUMOR
  // =========================================================================
  if (
    hasAnyWord(query, ['roast', 'mock', 'burn']) ||
    hasAnyPhrase(query, ['make fun of', 'make fun', 'roast him', 'roast krishna'])
  ) {
    const roasts = [
      "Krishna wants to become an elite cybersecurity engineer, but his favorite programming languages are literally 'HTML, JS, CSS'—who's going to break the news to him that HTML isn't a programming language? 💀",
      "Krishna's definition of an introduction is literally: 'Here, scan this QR code and talk to my AI instead of talking to me.' Peak cyber-introvert efficiency! 💀",
      "He's entering an engineering college in BE Cybersecurity and when asked what he wants from college, he wrote: 'Peace.' Bro, you signed up for engineering, not a Buddhist monastery! 💀",
      "Krishna built an entire AI twin, a portable USB browser, and an Android safety assistant before even stepping into his first college class. Someone please stop this man before he automates his entire degree! 💀"
    ];
    return roasts[Math.floor(Math.random() * roasts.length)];
  }

  // =========================================================================
  // 2. MODE B: QUESTIONS ABOUT KRISHNA.AI ITSELF
  // =========================================================================

  // "Who are you?" / "What are you?" / "What is KRISHNA.AI?" / "Tell me about yourself"
  const isWhoAreYouIntent =
    hasAnyPhrase(query, [
      'who are you',
      'what are you',
      'what is krishna ai',
      'what is krishna.ai',
      'what is krishnaai',
      'who are u',
      'what are u',
      'tell me about yourself',
      'introduce yourself',
      'what kind of ai are you',
    ]) ||
    query === 'who r u' ||
    query === 'who are you' ||
    query === 'what is this';

  if (isWhoAreYouIntent) {
    return "I'm KRISHNA.AI — basically Krishna's digital twin. I can talk about him using the information I've been given, while also handling normal conversations and general questions.";
  }

  // "What can you do?" / "What can I ask you?" / "What kind of questions can I ask?"
  const isCapabilitiesIntent =
    hasAnyPhrase(query, [
      'what can you do',
      'what can u do',
      'what do you do',
      'what can i ask you',
      'what kind of questions can i ask',
      'what questions can i ask',
      'what can i ask',
      'what are your capabilities',
      'how can you help',
      'what can you tell me',
      'what are you capable of',
    ]);

  if (isCapabilitiesIntent) {
    return "I can answer questions about Krishna, keep track of the conversation, and handle general questions too. Basically, you don't need to talk to me like I'm a form with five buttons. 😄 Feel free to ask about his background, projects, college, tech interests, or anything technical in general!";
  }

  // "Why were you created?" / "What is your purpose?" / "Why did Krishna make you?"
  const isPurposeIntent =
    hasAnyPhrase(query, [
      'why were you created',
      'why was you created',
      'why did he create you',
      'why did krishna create you',
      'why did krishna make you',
      'why did he make you',
      'what is your purpose',
      'whats your purpose',
      'what was the purpose of creating you',
      'why do you exist',
      'reason for your creation',
    ]);

  if (isPurposeIntent) {
    return "Krishna created me as his interactive digital twin so people could get to know him, his cybersecurity journey, and his projects in a conversational way—sort of a living, interactive introduction rather than a static resume.";
  }

  // "How do you work?" / "How were you built?"
  const isHowItWorksIntent =
    hasAnyPhrase(query, [
      'how do you work',
      'how does krishna ai work',
      'how were you built',
      'how was this built',
      'how do u work',
      'how does it work',
      'what powers you',
      'what makes you work',
    ]);

  if (isHowItWorksIntent) {
    return "I work as a conversational digital twin powered by AI, using Krishna's background, projects, education, and interests as my source of truth, while keeping track of conversation context across messages.";
  }

  // "What do you know about Krishna?" / "What information do you have?" / "What can you tell me about Krishna?"
  const isWhatDoYouKnowIntent =
    hasAnyPhrase(query, [
      'what do you know about krishna',
      'what do you know about him',
      'what info do you have',
      'what information do you have',
      'what can you tell me about krishna',
      'what do you know',
      'what data do you have',
    ]);

  if (isWhatDoYouKnowIntent) {
    return "I know quite a bit about Krishna! From his upcoming BE Cybersecurity degree at CIT and his career goals, to his hands-on projects (like EV Assistant, his portable browser, and FitGen AI), his tech curiosity, learning journey, and even his favorites like movies and games.";
  }

  // "Are you Krishna?" / "Are you an AI?" / "Are you a bot?" / "Are you human?"
  const isAreYouKrishnaIntent =
    hasAnyPhrase(query, [
      'are you krishna',
      'are you the real krishna',
      'are you human',
      'are you a human',
      'are you an ai',
      'are you a bot',
      'are you a robot',
      'is this krishna',
      'is this a bot',
      'are you real',
    ]);

  if (isAreYouKrishnaIntent) {
    return "I'm KRISHNA.AI, Krishna's AI digital twin—not the biological Krishna himself, but designed to represent his background, thoughts, projects, and personality as closely as possible.";
  }

  // "What makes you different from a normal chatbot?"
  const isDifferentChatbotIntent =
    hasAnyPhrase(query, [
      'what makes you different',
      'how are you different',
      'why are you different',
      'different from a normal chatbot',
      'how are you different from a normal chatbot',
      'different from other chatbots',
    ]);

  if (isDifferentChatbotIntent) {
    return "Unlike a traditional chatbot with rigid buttons or canned FAQ answers, I understand conversational context, keep track of pronouns, connect different parts of Krishna's life, and can also hold normal conversations or answer general tech questions.";
  }

  // "Can you remember our conversation?" / "Do you have memory?"
  const isMemoryAbilityIntent =
    hasAnyPhrase(query, [
      'can you remember our conversation',
      'do you remember what we talked about',
      'do you have memory',
      'can you remember',
      'do you remember',
    ]);

  if (isMemoryAbilityIntent) {
    return "Yes! I keep track of our conversation history so you can ask follow-ups using 'he', 'it', or 'that' without having to repeat yourself every time.";
  }

  // =========================================================================
  // CREATOR / BUILDER IDENTITY & DISTINCTION FROM MODEL PROVIDERS
  // =========================================================================

  // "Was this built by Liquid AI?" / "Are you made by Liquid AI?"
  const isLiquidAiIntent =
    hasAnyPhrase(query, [
      'built by liquid ai',
      'made by liquid ai',
      'created by liquid ai',
      'developed by liquid ai',
      'from liquid ai',
      'are you liquid ai',
      'is liquid ai your creator',
      'did liquid ai make you',
      'did liquid ai build you',
      'did liquid ai create you',
    ]) ||
    (hasPhrase(query, 'liquid ai') && (hasWord(query, 'built') || hasWord(query, 'made') || hasWord(query, 'create') || hasWord(query, 'created') || hasWord(query, 'by')));

  if (isLiquidAiIntent) {
    return "Nope — Krishna built KRISHNA.AI. The underlying AI technology may come from external providers, but the chatbot itself was created by Krishna.";
  }

  // "Who built you?"
  if (
    query === 'who built you' ||
    query === 'who built u' ||
    hasAnyPhrase(query, ['who built you', 'who built u'])
  ) {
    return "Krishna built me — I'm basically his personal digital twin.";
  }

  // "Who created KRISHNA.AI?" / "Who made KRISHNA.AI?"
  if (
    hasAnyPhrase(query, [
      'who created krishna ai',
      'who created krishna.ai',
      'who created krishnaai',
      'who made krishna ai',
      'who made krishna.ai',
      'who built krishna ai',
      'who built krishna.ai',
      'who developed krishna ai',
      'who is behind krishna ai',
      'who is behind krishna.ai',
    ])
  ) {
    return "Krishna did. He built KRISHNA.AI as a digital twin that can talk about him and also handle normal conversations.";
  }

  // "Who created you?" / "Who made you?" / "Who developed you?" / "Who is your creator?" / "Who is behind this?" / "What company built you?"
  const isWhoMadeYouIntent =
    hasAnyPhrase(query, [
      'who made you',
      'who created you',
      'who developed you',
      'who coded you',
      'who programmed you',
      'who is your creator',
      'who is behind this',
      'who is behind you',
      'who is your developer',
      'what company built you',
      'what company made you',
      'which company built you',
      'which company made you',
      'who designed you',
      'who owns you',
      'who owns krishna ai',
      'who owns krishna.ai',
    ]);

  if (isWhoMadeYouIntent) {
    return "Krishna built me as his personal digital twin.";
  }

  // Question specifically distinguishing underlying model/provider
  if (
    (hasWord(query, 'model') || hasWord(query, 'provider') || hasWord(query, 'api') || hasWord(query, 'llm')) &&
    (hasWord(query, 'creator') || hasWord(query, 'built') || hasWord(query, 'who') || hasWord(query, 'made'))
  ) {
    return "Krishna is the creator and builder of KRISHNA.AI. While the underlying AI model and API infrastructure come from external providers, the chatbot itself was created by Krishna as his personal digital twin.";
  }

  // =========================================================================
  // 3. MODE C: GENERAL TECHNICAL & KNOWLEDGE QUESTIONS
  // (KRISHNA.AI must answer general questions using general knowledge!)
  // =========================================================================

  // DNS
  if (
    hasAnyPhrase(query, ['what is dns', 'explain dns', 'how does dns work', 'tell me about dns']) ||
    (query === 'dns')
  ) {
    return "DNS (Domain Name System) is essentially the internet's phonebook. It translates human-friendly domain names (like `google.com`) into computer-readable IP addresses (like `142.250.190.46`), allowing browsers to locate and communicate with web servers.";
  }

  // TCP vs UDP
  if (
    hasAnyPhrase(query, [
      'tcp vs udp',
      'tcp and udp',
      'difference between tcp and udp',
      'what is tcp vs udp',
      'explain tcp and udp',
      'compare tcp and udp',
    ])
  ) {
    return "TCP (Transmission Control Protocol) is connection-oriented and reliable—it guarantees that packets arrive in order through handshakes and acknowledgments (used for web browsing, email, and file transfers). UDP (User Datagram Protocol) is connectionless and faster with no delivery guarantees, making it ideal for real-time applications like multiplayer gaming, live video streaming, and VoIP.";
  }

  // Quantum computing
  if (
    hasAnyPhrase(query, ['what is quantum computing', 'explain quantum computing', 'how does quantum computing work']) ||
    query === 'quantum computing'
  ) {
    return "Quantum computing harnesses the principles of quantum mechanics—primarily superposition and entanglement—to process complex information. Unlike classical computers that rely on binary bits (0 or 1), quantum computers use qubits, which can exist in multiple states simultaneously. This allows them to solve certain intricate problems (in cryptography, molecular modeling, and optimization) exponentially faster than classical systems.";
  }

  // API / REST API
  if (
    hasAnyPhrase(query, ['what is an api', 'what is api', 'explain api', 'what is rest api', 'what is a rest api', 'how do apis work']) ||
    query === 'api'
  ) {
    return "An API (Application Programming Interface) is a set of defined rules, protocols, and tools that allows different software applications to communicate with each other. For example, when you check the weather on your phone, the app uses an API to request and receive updated forecast data from a remote weather service.";
  }

  // IP Address / IPv4 vs IPv6
  if (
    hasAnyPhrase(query, ['what is an ip address', 'what is ip address', 'ipv4 vs ipv6', 'explain ip address']) ||
    query === 'ip address'
  ) {
    return "An IP (Internet Protocol) address is a unique numerical identifier assigned to every device connected to a computer network. IPv4 uses 32-bit numerical addresses formatted as four decimals (e.g., `192.168.1.1`), while IPv6 uses 128-bit hexadecimal addresses (e.g., `2001:db8::1`) to accommodate the billions of modern devices on the global internet.";
  }

  // HTTP vs HTTPS
  if (
    hasAnyPhrase(query, ['http vs https', 'difference between http and https', 'what is https', 'what is http'])
  ) {
    return "HTTP (Hypertext Transfer Protocol) transmits web data between a browser and a server in plain text, making it vulnerable to eavesdropping. HTTPS adds SSL/TLS encryption, ensuring end-to-end data confidentiality, data integrity (preventing tampering), and server authentication.";
  }

  // SQL Injection
  if (
    hasAnyPhrase(query, ['what is sql injection', 'what is sqli', 'explain sql injection', 'how does sql injection work'])
  ) {
    return "SQL Injection (SQLi) is a critical security vulnerability where an attacker manipulates database queries by inputting malicious SQL syntax through unsanitized form fields or URL parameters. This can allow attackers to bypass authentication, view private records, or modify and delete entire database tables.";
  }

  // XSS (Cross-Site Scripting)
  if (
    hasAnyPhrase(query, ['what is xss', 'what is cross site scripting', 'explain xss'])
  ) {
    return "Cross-Site Scripting (XSS) is a web vulnerability where attackers inject malicious client-side scripts (typically JavaScript) into trusted web applications. When other users visit the affected page, the malicious script executes in their browsers, potentially stealing session tokens, cookies, or sensitive user data.";
  }

  // VPN
  if (
    hasAnyPhrase(query, ['what is a vpn', 'what is vpn', 'how does a vpn work']) ||
    query === 'vpn'
  ) {
    return "A VPN (Virtual Private Network) creates a private, encrypted tunnel between your device and a secure remote server. It hides your real IP address and encrypts all outbound and inbound internet traffic, safeguarding your browsing activity on public Wi-Fi networks and preventing ISP tracking.";
  }

  // Linux
  if (
    hasAnyPhrase(query, ['what is linux', 'why linux', 'why is linux popular in cybersecurity']) ||
    query === 'linux'
  ) {
    return "Linux is an open-source, Unix-like operating system kernel celebrated for its stability, modularity, and security. It powers the majority of cloud servers and supercomputers, and is the operating system of choice in cybersecurity (distributions like Kali Linux and ParrotOS) because it grants complete control over networking sockets, file systems, and command-line automation.";
  }

  // Git / GitHub
  if (
    hasAnyPhrase(query, ['what is git', 'git vs github', 'difference between git and github', 'what is github'])
  ) {
    return "Git is a distributed version control system that runs locally on your machine to track changes in code over time and manage branches. GitHub is a cloud-based hosting platform built on top of Git that allows developers to store remote repositories, collaborate with pull requests, review code, and manage issues.";
  }

  // Docker / Containerization
  if (
    hasAnyPhrase(query, ['what is docker', 'what is containerization', 'docker vs vm']) ||
    query === 'docker'
  ) {
    return "Docker is a containerization platform that packages an application together with its runtime, system libraries, and configuration files into a standardized container. Unlike virtual machines that emulate an entire guest operating system, containers share the host kernel, making them remarkably lightweight, fast to start, and consistent across any environment.";
  }

  // Encryption
  if (
    hasAnyPhrase(query, ['what is encryption', 'symmetric vs asymmetric', 'symmetric vs asymmetric encryption'])
  ) {
    return "Encryption converts plaintext into unreadable ciphertext using mathematical cryptographic keys. Symmetric encryption uses a single shared secret key to both encrypt and decrypt (fast, e.g., AES-256). Asymmetric encryption uses a mathematically linked key pair—a public key to encrypt and a private key to decrypt (e.g., RSA or ECC), which is foundational to HTTPS and digital signatures.";
  }

  // Firewall
  if (
    hasAnyPhrase(query, ['what is a firewall', 'what is firewall', 'how does a firewall work'])
  ) {
    return "A firewall is a network security system that monitors, filters, and inspects incoming and outgoing network traffic based on configured security rules. It establishes a defensive barrier between a trusted internal network and untrusted external networks (like the open internet) to block unauthorized connections.";
  }

  // =========================================================================
  // 4. CONTEXTUAL FOLLOW-UPS & PRONOUN UNDERSTANDING
  // =========================================================================

  // "Why did he choose it?" / "Why did he pick that?" / "Why?"
  const isWhyFollowUp =
    hasAnyPhrase(query, [
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
    if (context.lastTopic === 'cybersecurity' || context.lastTopic === 'education' || context.lastAssistantSnippet.includes('cybersecurity')) {
      return "He chose cybersecurity because of the rapid rise in digital threats and vulnerabilities—he genuinely wants to solve those problems and protect people's digital lives. He's particularly drawn to hands-on defensive security, web application auditing, and combining AI with security tools.";
    }
    if (context.lastTopic === 'ev_assistant') {
      return "He built EV Assistant to explore voice interaction combined with local LLMs (like Ollama and SQLite) so the assistant could have long-term memory without relying on third-party cloud APIs.";
    }
    if (context.lastTopic === 'portable_browser') {
      return "He built the Portable Browser to solve a real practical headache: being able to carry your personalized browsing environment, tabs, and configurations on a USB stick to use seamlessly across any school or lab PC.";
    }
    return "He's driven by practical curiosity—whether it's tackling rising digital security threats, exploring local AI models, or building tools that solve real everyday headaches.";
  }

  // "What about movies?" / "And movies?" / "What about cinema?"
  const isMoviesFollowUp =
    hasAnyPhrase(query, [
      'what about movies',
      'what about cinema',
      'and movies',
      'and cinema',
      'what about films',
      'movies too',
      'does he watch movies',
    ]);

  if (isMoviesFollowUp) {
    return "Krishna is a true cinephile! He has a strong interest in movies, filmmaking, and storytelling. Some of his favorites include *Stranger Things* and *Premalu*—he loves discussing great direction, engaging plots, and fresh screenplays.";
  }

  // "And what does he want to do in the future?" / "What does he want to do after that?"
  const isFutureFollowUp =
    hasAnyPhrase(query, [
      'and what does he want to do in the future',
      'what does he want to do after that',
      'what about the future',
      'and after that',
      'and in the future',
      'what next',
      'what does he want to do later',
    ]);

  if (isFutureFollowUp) {
    return "In the future, Krishna aims to become a top-tier Cyber Security Engineer, building production-grade security tooling and solving complex real-world threat challenges. He plans to use his time at CIT to master defense, security automation, and AI-driven protection.";
  }

  // "What technologies does he like?" / "Does he like technology?" / "Is he into tech?"
  const isTechCuriosityFollowUp =
    hasAnyPhrase(query, [
      'what technologies does he like',
      'what technology does he like',
      'does he like technology',
      'is he into tech',
      'what tech is he into',
      'what kind of technology does he like',
      'what kind of tech does he like',
      'what kind of stuff does he explore',
    ]);

  if (isTechCuriosityFollowUp) {
    return "Krishna is deeply curious about technology! Beyond mainstream tech, he specifically loves discovering hidden, obscure, experimental, and underrated tools. He has a daily habit of finding something new every day, exploring local AI (like Ollama), security automation, networking concepts, and embedded hardware.";
  }

  // "Tell me more about that" / "Elaborate" / "Explain that"
  const isElaborateFollowUp =
    hasAnyPhrase(query, [
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
    if (context.lastTopic === 'ev_assistant') {
      return "For EV AI Assistant, Krishna combined speech recognition and synthesis with Electron, Node.js, and locally running LLMs (such as Qwen and Gemma via Ollama), backed by SQLite to persist user conversation memory across sessions without external cloud APIs.";
    }
    if (context.lastTopic === 'portable_browser') {
      return "The Portable Personal Browser runs entirely off a USB drive with configurable performance modes, letting Krishna bring his personalized workspace to different school and lab computers without leaving sensitive session traces behind.";
    }
    if (context.lastTopic === 'cybersecurity' || context.lastTopic === 'education') {
      return "In cybersecurity, Krishna focuses on practical hands-on defense—studying real-world vulnerabilities through PortSwigger Web Security Academy and network architecture through Cisco Networking Academy. He's especially interested in AI-assisted threat detection and security automation.";
    }
    if (context.lastTopic === 'cinema') {
      return "As a cinephile, Krishna loves great direction, pacing, and engaging screenplays. He's drawn to sci-fi mysteries like *Stranger Things* and fresh romantic-comedy storytelling like *Premalu*.";
    }
    if (context.lastTopic === 'aim_future') {
      return "Krishna's overarching ambition is to become a top-tier Cyber Security Engineer. He plans to use his college years at CIT to dive into hackathons, build production-grade security tooling, and contribute real solutions to current cybersecurity challenges.";
    }
    return "Krishna learns through practical prototyping—testing boundaries, understanding how things work under the hood, and combining fields like AI and cybersecurity into functional projects.";
  }

  // "Is it finished?" / "Is it done?" / "Status"
  if (
    hasAnyPhrase(query, [
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

  // "Which one is coolest?" / "Favorite project"
  if (
    hasAnyPhrase(query, [
      'which one is coolest',
      'which one is the coolest',
      'what is the coolest project',
      'coolest project',
      'his best project',
      'favorite project',
    ])
  ) {
    return "Two especially cool ones are the **EV AI Assistant**—a voice-driven assistant powered by local Ollama LLMs with persistent SQLite memory—and his **Portable Personal Browser**, designed to run completely off a USB drive with configurable performance modes.";
  }

  // =========================================================================
  // 5. QUESTIONS ABOUT KRISHNA (MODE A)
  // =========================================================================

  // AIM / FUTURE / GOALS / CAREER DIRECTION / AMBITION
  const isAimIntent =
    hasAnyPhrase(query, [
      'what is his aim',
      'what is his goal',
      'what is his ambition',
      'what does he want to become',
      'what does he want to do in the future',
      'what are his future plans',
      'what does he wanna do',
      'what does he want to be',
      'what is his dream',
      'what is he aiming for',
      'what s his aim',
      'whats his aim',
      'his aim',
      'his goal',
      'his future',
      'career goal',
      'what is his career goal',
      'what are his goals',
      'what is he doing with his life',
    ]) ||
    query === 'his aim' ||
    query === 'aim' ||
    query === 'goal' ||
    query === 'what is his aim';

  if (isAimIntent) {
    return "Krishna's primary aim is to become a top-tier Cyber Security Engineer. He's passionate about solving real-world security challenges, building automated defense tools, and combining AI with security. He's kicking off this journey with his BE in Cybersecurity at CIT (Chennai Institute of Technology) with an academic goal of 8.5+ CGPA.";
  }

  // EDUCATION / COLLEGE / WHERE STUDY / CLASS 12 / DEGREE
  const isEducationIntent =
    hasAnyPhrase(query, [
      'where is he studying',
      'where does he study',
      'where study',
      'which college',
      'what is his college',
      'what college',
      'which school',
      'his school',
      'his education',
      'educational background',
      'what degree',
      'which degree',
      'what is he studying',
      'what does he study',
      'when does college start',
      'cgpa goal',
      'what about his college',
      'where is he going to study',
      'cit',
      'chennai institute of technology',
      'class 12',
      'cbse',
    ]) ||
    query === 'college' ||
    query === 'education' ||
    query === 'where study' ||
    query === 'where does he study';

  if (isEducationIntent) {
    return "Krishna completed his Class 12 under the CBSE curriculum and is about to begin his Bachelor of Engineering (BE) in Cybersecurity at CIT (Chennai Institute of Technology) on September 15, 2026. His goal is to maintain an 8.5+ CGPA—and when asked what he wants from college, he famously said: 'Peace.' 😄";
  }

  // WHY CYBERSECURITY
  const isWhyCyberIntent =
    hasAnyPhrase(query, [
      'why did he choose cybersecurity',
      'why cybersecurity',
      'why did he pick cybersecurity',
      'why choose cybersecurity',
      'why did he choose his field',
      'why security',
      'what made him choose cybersecurity',
      'reason for cybersecurity',
    ]);

  if (isWhyCyberIntent) {
    return "Krishna chose cybersecurity because of the rapid rise in real-world digital threats and attacks. Rather than just watching from the sidelines, he genuinely wants to solve these security challenges, build resilient defensive systems, and safeguard people's digital data.";
  }

  // WHAT IS HE LEARNING / CURRENT STUDIES / CERTIFICATIONS
  const isLearningIntent =
    hasAnyPhrase(query, [
      'what is he learning',
      'what is he currently learning',
      'what is he learning now',
      'what is he studying right now',
      'what is he exploring',
      'current learning',
      'certifications',
      'portswigger',
      'cisco',
      'comptia',
    ]) ||
    query === 'what is he learning' ||
    query === 'learning';

  if (isLearningIntent) {
    return "Krishna is currently diving into:\n- **Cybersecurity Fundamentals & Defense**: Web security labs on PortSwigger Web Security Academy and CompTIA Security+ concepts.\n- **Networking**: In-depth network protocols and routing with Cisco Networking Academy (CCNA topics).\n- **Programming**: C programming and security automation with Python.\n- **AI & LLMs**: Local model orchestration with Ollama and OpenRouter.";
  }

  // TECH CURIOSITY / DISCOVERING HIDDEN TECH / WHAT KIND OF TECH HE LIKES
  const isTechInterestIntent =
    hasAnyPhrase(query, [
      'what kind of technology does he like',
      'what tech does he like',
      'what technology does he like',
      'what kind of tech',
      'hidden tech',
      'lesser known tech',
      'underrated tech',
      'rabbit holes',
      'technical curiosity',
      'does he like tech',
      'is he into tech',
      'what kind of stuff does he explore',
    ]);

  if (isTechInterestIntent) {
    return "Krishna is fascinated by both cutting-edge and unconventional technology. He has a daily habit of discovering something new, especially hidden, obscure, underrated, or experimental tools. He loves diving down technical rabbit holes to see how systems work under the hood, exploring local LLMs, embedded hardware, network protocols, and security automation.";
  }

  // CINEMA / MOVIES / HOBBIES
  const isCinemaIntent =
    hasAnyPhrase(query, [
      'what about movies',
      'movies',
      'cinema',
      'films',
      'cinephile',
      'favorite movie',
      'favorite show',
      'stranger things',
      'premalu',
      'does he like movies',
      'movie interests',
    ]) ||
    query === 'movies' ||
    query === 'cinema';

  if (isCinemaIntent) {
    return "Krishna is a dedicated cinephile! He loves movies, filmmaking, and compelling storytelling. Some of his favorites include *Stranger Things* and *Premalu*. He appreciates good screenplay pacing, creative direction, and discussing plot mechanics.";
  }

  // GENERAL INTERESTS / HOBBIES / WHAT HE LIKES / WHAT DOES HE DO WHEN BORED
  const isInterestsIntent =
    hasAnyPhrase(query, [
      'what is he into',
      'what are his interests',
      'what does he like',
      'what does he do when he is bored',
      'what does he do when he s bored',
      'what are his hobbies',
      'hobbies',
      'free time',
      'what does he do for fun',
      'what he likes',
      'his passions',
      'what is he passionate about',
    ]) ||
    query === 'interests' ||
    query === 'hobbies' ||
    query === 'what he likes';

  if (isInterestsIntent) {
    return "Krishna's interests center around two main passions:\n1. **Technology Curiosity**: Constantly exploring emerging tech, discovering hidden and lesser-known utilities every day, testing local AI models, and building practical software experiments.\n2. **Cinema & Movies**: He is an authentic cinephile who loves storytelling, great direction, and films across diverse genres (such as *Stranger Things* and *Premalu*).";
  }

  // PROJECTS OVERVIEW / WHAT HAS HE BUILT / PORTFOLIO
  const isProjectsIntent =
    hasAnyPhrase(query, [
      'what has he built',
      'what has he made',
      'what did he build',
      'what did he make',
      'what does he do',
      'what can he do',
      'his projects',
      'projects',
      'portfolio',
      'what kind of stuff does he build',
      'show me his projects',
      'tell me about his projects',
    ]) ||
    query === 'projects' ||
    query === 'what did he build' ||
    query === 'what has he built';

  if (isProjectsIntent) {
    return "Krishna has built a variety of practical projects across AI, security, and web development:\n- **EV AI Assistant**: Desktop voice assistant using Electron, Node.js, and local LLMs (Ollama) with SQLite persistent memory.\n- **Portable Personal Browser**: Lightweight browser configured to run straight from a USB drive across different computers.\n- **FitGen AI**: Python GUI application exploring fitness and workout assistance with AI.\n- **Safety Assistant**: Android-oriented emergency assistant with SOS, SMS communication, and safety reminders.\n- **KVNS Company Website**: Paruthi Vidhai/sesame business website built for his family business established in 1997.\n- **Programmable Cybersecurity Device**: Experiments with low-budget programmable hardware for hands-on security learning.";
  }

  // SPECIFIC PROJECT: EV AI ASSISTANT
  if (
    hasAnyPhrase(query, ['ev assistant', 'ev ai assistant', 'voice assistant', 'qwen', 'ollama assistant'])
  ) {
    return "The **EV AI Assistant** is a desktop voice assistant Krishna built using Electron, Node.js, and locally hosted LLMs through Ollama (like Qwen and Gemma). It features real-time speech recognition, audio responses, and uses SQLite for persistent conversation memory so it remembers context across sessions without cloud APIs.";
  }

  // SPECIFIC PROJECT: PORTABLE PERSONAL BROWSER
  if (
    hasAnyPhrase(query, ['portable browser', 'portable personal browser', 'usb browser', 'browser project'])
  ) {
    return "The **Portable Personal Browser** is designed to run entirely off a USB drive without needing an installer. It includes configurable performance modes and lets Krishna carry his own customized browsing environment across different computers without leaving session data behind.";
  }

  // SPECIFIC PROJECT: FITGEN AI
  if (
    hasAnyPhrase(query, ['fitgen', 'fitgen ai', 'fitness app', 'fitness project'])
  ) {
    return "**FitGen AI** is a Python desktop GUI application concept combining artificial intelligence with fitness routines, helping users generate and manage personalized workouts.";
  }

  // SPECIFIC PROJECT: SAFETY ASSISTANT
  if (
    hasAnyPhrase(query, ['safety assistant', 'android assistant', 'sos project', 'emergency app'])
  ) {
    return "The **Safety Assistant** is an Android-focused assistant concept featuring water/bedtime health reminders, instant emergency SOS triggering, and SMS-based emergency communication.";
  }

  // SPECIFIC PROJECT: KVNS COMPANY
  if (
    hasAnyPhrase(query, ['kvns', 'kvns website', 'kvns company', 'sesame business', 'family business'])
  ) {
    return "**KVNS Company** is a website Krishna built for a family business founded in 1997 by Natarajan Rajesekaran in Virudhunagar, focusing on the Paruthi Vidhai / sesame seed industry.";
  }

  // SPECIFIC PROJECT: HARDWARE / CYBERSECURITY DEVICE
  if (
    hasAnyPhrase(query, ['hardware device', 'cybersecurity device', 'programmable device', 'hardware experiment', 'embedded device'])
  ) {
    return "Krishna enjoys ambitious 'why not build it?' challenges—including experimenting with low-budget programmable microcontrollers and hardware devices for practical cybersecurity and networking tests.";
  }

  // TOOLS / TECHNOLOGIES / TECH STACK
  const isTechStackIntent =
    hasAnyPhrase(query, [
      'what technologies does he know',
      'programming languages',
      'tech stack',
      'skills',
      'technologies',
      'python',
      'javascript',
      'react',
      'node',
      'electron',
    ]) ||
    query === 'skills' ||
    query === 'tech stack';

  if (isTechStackIntent) {
    return "Krishna's technical toolkit includes:\n- **Languages**: Python, JavaScript, Node.js, React, C, HTML/CSS\n- **Security & Networking**: Web vulnerability auditing (PortSwigger), Cisco Networking Academy, CCNA concepts, defensive security\n- **AI & Automation**: Ollama (local LLMs), OpenRouter, Electron, SQLite\n- **Infrastructure**: Git, GitHub, Firebase, Supabase, Docker and Nginx fundamentals.";
  }

  // FAVORITES
  const isFavoritesIntent =
    hasAnyPhrase(query, [
      'favorite food',
      'favorite game',
      'favorite movie',
      'favorite song',
      'favorite music',
      'what does he like to eat',
      'what does he eat',
      'his favorites',
      'what are his favorites',
    ]) ||
    (hasWord(query, 'favorite') && hasAnyWord(query, ['food', 'game', 'games', 'music', 'song', 'things']));

  if (isFavoritesIntent) {
    return `Here are a few of Krishna's favorites:
- **Food**: Grilled Chicken
- **Games**: All the GTA games
- **Movies/Shows**: *Stranger Things* & *Premalu*
- **Music**: "Perfect" by Ed Sheeran
- **Technology**: AI & Cybersecurity`;
  }

  // FUN FACTS / SOMETHING INTERESTING
  const isFunFactIntent =
    hasAnyPhrase(query, [
      'fun fact',
      'fun facts',
      'something interesting',
      'tell me something interesting',
      'tell me a fun fact',
      'interesting fact',
      'tell me something cool',
    ]);

  if (isFunFactIntent) {
    const facts = [
      "Krishna's definition of an introduction is literally: 'Here, scan this QR code and talk to my AI instead of talking to me.'",
      "When asked what he wants most from his upcoming engineering college, Krishna wrote: 'Peace.' 😄",
      "Krishna has a daily habit of discovering something new every day—especially hidden, obscure, or experimental tools that aren't mainstream.",
      "Krishna has tried building his own low-budget programmable cybersecurity hardware device for hands-on experimentation.",
      "He designed a portable browser that boots and runs entirely from a USB flash drive without leaving traces on the host PC."
    ];
    return facts[Math.floor(Math.random() * facts.length)];
  }

  // WHO IS KRISHNA / TELL ME ABOUT KRISHNA / WHAT KIND OF PERSON IS HE
  const isAboutKrishnaIntent =
    hasAnyPhrase(query, [
      'who is krishna',
      'who is he',
      'tell me about krishna',
      'tell me about him',
      'what kind of person is he',
      'what is he like',
      'describe krishna',
      'introduce krishna',
    ]) ||
    query === 'who is krishna' ||
    query === 'who is krishna manojkumar' ||
    query === 'about him' ||
    query === 'about krishna';

  if (isAboutKrishnaIntent) {
    return "Krishna is a curious, hands-on cybersecurity student who completed Class 12 CBSE and is about to start his BE in Cybersecurity at CIT. He's driven by a genuine curiosity about technology—especially discovering hidden or lesser-known tech every day and going down technical rabbit holes to understand how things work under the hood. He learns by breaking, testing, and building real prototypes rather than just reading theory. Outside of tech, he's a true cinephile who loves movies and storytelling.";
  }

  // SOCIAL / CONTACT / GITHUB / LINKEDIN / PORTFOLIO / EMAIL / PHONE
  const isContactIntent =
    hasAnyPhrase(query, [
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
    hasAnyWord(query, ['github', 'linkedin', 'portfolio', 'email', 'phone']);

  if (isContactIntent) {
    return `You can connect with Krishna through:
- **GitHub**: [github.com/M-Krishna-2008](https://github.com/M-Krishna-2008)
- **LinkedIn**: [linkedin.com/in/krishna-manojkumar-76477b41b](https://www.linkedin.com/in/krishna-manojkumar-76477b41b/)
- **Portfolio**: [m-krishna-2008.github.io/My_Portfolio](https://m-krishna-2008.github.io/My_Portfolio/)
- **Email**: krishnamanojkumar031208@gmail.com
- **Phone**: +91 7550279400`;
  }

  // =========================================================================
  // 6. GREETINGS & CASUAL CHATTER
  // =========================================================================
  if (
    hasAnyWord(query, ['hello', 'hi', 'hey', 'greetings', 'sup', 'yo']) ||
    hasAnyPhrase(query, ['good morning', 'good afternoon', 'good evening', 'how are you', 'how r u'])
  ) {
    return "Hey there! I'm KRISHNA.AI, Krishna's conversational digital twin. You can ask me anything about Krishna—his cybersecurity path, projects, tech interests, or college—or we can just chat and explore general tech topics. What's on your mind?";
  }

  if (
    hasAnyWord(query, ['thanks', 'thank', 'thx']) ||
    hasAnyPhrase(query, ['thank you', 'thanks a lot', 'appreciate it'])
  ) {
    return "You're welcome! Let me know if there's anything else you'd like to explore or ask about.";
  }

  if (
    hasAnyWord(query, ['cool', 'nice', 'awesome', 'great', 'neat', 'super'])
  ) {
    return "Glad you think so! Feel free to ask more about Krishna's projects, tech interests, or anything else you're curious about.";
  }

  if (
    hasAnyWord(query, ['bye', 'goodbye', 'cya']) ||
    hasAnyPhrase(query, ['see you', 'talk to you later', 'catch you later'])
  ) {
    return "Catch you later! Drop by anytime if you want to chat more with Krishna's digital twin. 👋";
  }

  // =========================================================================
  // 7. MISSING INFORMATION OR UNRECOGNIZED QUERY FALLBACK
  // =========================================================================
  // If the user mentions Krishna, "he", "his", "him", or asks something about him that isn't in memory:
  if (
    hasAnyWord(query, ['krishna', 'he', 'his', 'him']) ||
    hasAnyPhrase(query, ['about him', 'does he', 'is he', 'did he', 'will he', 'can he'])
  ) {
    return "I don't have that detail about Krishna yet. I know he's focused on cybersecurity, building practical AI and security tools, and studying at CIT, but that specific detail isn't in my memory.";
  }

  // For general queries that don't match known topics:
  return "I'm not completely sure about that one! Feel free to ask me anything about Krishna (his background, college, projects, cybersecurity, tech curiosity, or cinema) or ask a general technical question.";
}
