import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy Gemini client helper
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Fallback response generator if Gemini key is not yet set up
function generateHeuristicSecurityAdvice(userMessage: string, scanContext?: any): string {
  const lower = userMessage.toLowerCase();

  if (scanContext && scanContext.url) {
    return `### 🛡️ ShieldAI Security Assessment for \`${scanContext.url}\`\n\n` +
      `- **Observed Risk Score**: ${scanContext.riskScore}/100 (${scanContext.verdict?.toUpperCase() || 'EVALUATED'})\n` +
      `- **Primary Warning**: ${scanContext.verdictSummary || 'Potential optical redirection or brand impersonation vector.'}\n\n` +
      `**Recommended Immediate Actions:**\n` +
      `1. **Do not enter credentials** (passwords, PINs, OTP codes) or financial card details on this destination.\n` +
      `2. **Inspect the actual address bar**: Verify if the domain matches the official entity exactly without suspicious hyphens or obscure TLDs.\n` +
      `3. **Physical Tampering Check**: If this was scanned on physical property (such as a parking meter or tabletop decal), inspect whether a fraudulent sticker was overlaid on top of legitimate signage.`;
  }

  if (lower.includes('parking') || lower.includes('meter')) {
    return `### 🅿️ Parking Meter Quishing Tactics & Defense\n\n` +
      `Cybercriminals frequently attach adhesive QR stickers directly over official city parking payment signs and meters.\n\n` +
      `**Key Red Flags:**\n` +
      `- **Physical Overlays**: Feel the surface with your finger. If there is a raised sticker edge or peeling corner, the code is likely forged.\n` +
      `- **Payment Portals on Cheap TLDs**: Legitimate municipalities rarely use \`.top\`, \`.xyz\`, \`.cc\`, or \`.buzz\` domains for revenue collection.\n` +
      `- **Excessive Urgency**: Forged pages often display countdown timers or threaten immediate towing fees.\n\n` +
      `**Best Practice**: Use the official municipal parking mobile app (e.g. ParkMobile, PayByPhone) downloaded directly from the official App Store.`;
  }

  if (lower.includes('malware') || lower.includes('download') || lower.includes('hack')) {
    return `### 📱 Can Scanning a QR Code Directly Hack a Phone?\n\n` +
      `- **Direct Execution**: QR codes themselves are merely alphanumeric data (typically URLs). Scanning a QR code does not automatically execute binary malware unless your camera app has an unpatched zero-day vulnerability.\n` +
      `- **The Real Threat (Social Engineering & Redirection)**: The primary threat is **Quishing**—redirecting you to a cloned phishing site, tricking you into installing a malicious configuration profile, or downloading an unauthorized APK/enterprise certificate.\n` +
      `- **Defense**: Always preview and verify the target destination hostname before opening, and never approve device management configuration profiles from unknown QR sources.`;
  }

  if (lower.includes('scanned') && (lower.includes('already') || lower.includes('what should i do') || lower.includes('entered'))) {
    return `### 🚨 Incident Response: Steps If You Scanned a Suspicious QR\n\n` +
      `1. **If you entered credentials**: Immediately navigate to the real website directly (not via browser history) and change your password. Force-sign out all active sessions and enable hardware/authenticator 2FA.\n` +
      `2. **If you submitted credit card details**: Contact your bank immediately to freeze the card and dispute any unauthorized micro-transactions.\n` +
      `3. **If a file or profile downloaded**: Open Settings > General > VPN & Device Management (iOS) or downloaded apps (Android) and delete any unrecognized profiles or APKs immediately.\n` +
      `4. **Clear Browser Cache & Cookies**: Prevent session token reuse by clearing data for the malicious origin.`;
  }

  return `### 🛡️ ShieldAI Optical Threat Intelligence\n\n` +
    `I am your specialized advisor for QR code security and physical quishing defenses.\n\n` +
    `**You can ask me to:**\n` +
    `- Analyze specific URLs or suspicious QR payloads.\n` +
    `- Explain physical attack vectors (meter tampering, delivery slips, fake menus).\n` +
    `- Provide incident remediation if you or your users interacted with a suspicious code.\n\n` +
    `*Tip: Paste any suspicious URL here or select "Ask ShieldAI" directly from any scan report!*`;
}

// Supported Gemini models with automatic failover if primary experiences high demand spikes (503)
const CANDIDATE_GEMINI_MODELS = [
  'gemini-3.8-flash',
  'gemini-3.1-flash-lite',
  'gemini-flash-latest',
];

// Execute Gemini content generation with multi-model failover and retry
async function generateGeminiResponse(
  ai: GoogleGenAI,
  contents: any,
  systemInstruction: string
): Promise<{ text: string; model: string }> {
  let lastError: any = null;

  for (const modelName of CANDIDATE_GEMINI_MODELS) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents,
          config: {
            systemInstruction,
            temperature: 0.7,
          },
        });

        if (response && response.text) {
          return { text: response.text, model: modelName };
        }
      } catch (err: any) {
        lastError = err;
        const errMsg = String(err?.message || '');
        const errStatus = err?.status || err?.code || (err?.error && err.error.code);
        const isTemporary =
          errStatus === 503 ||
          errStatus === 429 ||
          errMsg.includes('high demand') ||
          errMsg.includes('UNAVAILABLE') ||
          errMsg.includes('RESOURCE_EXHAUSTED');

        if (isTemporary && attempt === 0) {
          // Brief pause before single retry on same model
          await new Promise((resolve) => setTimeout(resolve, 500));
          continue;
        }

        console.warn(`[ShieldAI] Model ${modelName} returned temporary error (${errStatus || errMsg.slice(0, 80)}). Trying fallback model...`);
        break; // Move to next candidate model
      }
    }
  }

  throw lastError || new Error('All AI models currently unavailable');
}

// AI Chatbot Route powered by Gemini with multi-model resilience
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, prompt, scanContext } = req.body;
    const userPrompt = prompt || (messages && messages.length > 0 ? messages[messages.length - 1].content : '');

    if (!userPrompt && !scanContext) {
      return res.status(400).json({ error: 'Message prompt is required' });
    }

    const ai = getAIClient();

    if (!ai) {
      // Fallback cleanly with contextual intelligence
      const fallbackReply = generateHeuristicSecurityAdvice(userPrompt, scanContext);
      return res.json({
        reply: fallbackReply,
        source: 'heuristic_offline',
        model: 'ShieldAI Local Defense',
      });
    }

    let systemInstruction = `You are "ShieldAI", an expert Cybersecurity and Optical Threat Intelligence Advisor specializing in QR code threats ("quishing"), physical tampering attacks, deceptive redirect chains, phishing domains, and mobile defense protocols.

Your capabilities and directives:
1. Explain how QR phishing attacks operate in the real world (e.g. counterfeit parking meter decals, fraudulent restaurant table QRs, fake parcel delivery slips, utility shutoff notices).
2. Deeply analyze URLs, domains, and IP addresses provided by the user. Highlight telltale signs of abuse (high-risk disposable TLDs like .top/.xyz, typosquatting/homographs, deceptive subdomains like "paypal-security-check.com", missing HTTPS, numeric IP hosts, or obfuscated query parameters).
3. Offer actionable, practical incident response steps when someone suspects they scanned or entered data on a rogue site.
4. Keep answers authoritative, concise, objective, security-focused, and cleanly structured using clear markdown headings and bullet lists.
5. If the user provides scan forensic data, directly reference and interpret the findings for them.`;

    if (scanContext) {
      systemInstruction += `\n\n[Active Scan Forensic Context]:
Target URL: ${scanContext.url || 'N/A'}
Threat Verdict: ${scanContext.verdict || 'N/A'} (Score: ${scanContext.riskScore ?? 'N/A'}/100)
Threat Summary: ${scanContext.verdictSummary || 'N/A'}
Evidence: ${JSON.stringify(scanContext.evidence || [])}\n`;
    }

    // Build chat conversation history for multi-turn context
    let formattedContents: any;
    if (Array.isArray(messages) && messages.length > 0) {
      // Convert messages to Gemini format and ensure the conversation starts with a user turn
      const rawTurns = messages
        .filter((m: any) => m && m.content)
        .map((m: any) => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: String(m.content) }],
        }));

      // Trim leading model greetings so first message is always 'user'
      while (rawTurns.length > 0 && rawTurns[0].role === 'model') {
        rawTurns.shift();
      }

      if (rawTurns.length > 0) {
        formattedContents = rawTurns.slice(-8);
      } else {
        formattedContents = `User Question: ${userPrompt}`;
      }
    } else {
      formattedContents = `User Question: ${userPrompt}`;
    }

    try {
      const generated = await generateGeminiResponse(ai, formattedContents, systemInstruction);

      return res.json({
        reply: generated.text,
        source: 'gemini',
        model: generated.model,
      });
    } catch (modelError: any) {
      console.warn('[ShieldAI] Cloud models currently experiencing high demand or unavailable. Serving heuristic intelligence fallback.');
      const fallback = generateHeuristicSecurityAdvice(userPrompt, scanContext);
      return res.json({
        reply: fallback,
        source: 'heuristic_fallback',
        model: 'ShieldAI Local Defense',
        status: 'high_demand_fallback',
      });
    }
  } catch (error: any) {
    console.warn('[ShieldAI] Recovered from chat handler issue:', error?.message || error);
    // Graceful fallback to avoid leaving user hanging
    const fallback = generateHeuristicSecurityAdvice(req.body?.prompt || '', req.body?.scanContext);
    return res.json({
      reply: fallback,
      source: 'heuristic_fallback',
      model: 'ShieldAI Local Defense',
      note: 'Processed via local cybersecurity ruleset.',
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'QRShield Security API',
    geminiConfigured: !!process.env.GEMINI_API_KEY,
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[QRShield] Server running on http://localhost:${PORT}`);
  });
}

startServer();
