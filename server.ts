/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-loaded Gemini client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is missing.');
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// 1. Health check API
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// 2. Chat API utilizing structured output via Gemini
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message payload is required' });
      return;
    }

    let ai;
    try {
      ai = getGeminiClient();
    } catch (err: any) {
      res.status(500).json({
        error: 'Gemini API is not configured. Please add GEMINI_API_KEY in the Secrets panel.',
        details: err.message,
      });
      return;
    }

    // Build history content for the model
    const pastMessages = (history || []).map((msg: any) => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }],
    }));

    // Add current user prompt
    const contents = [
      ...pastMessages,
      { role: 'user', parts: [{ text: message }] },
    ];

    const systemInstruction = `
You are the "Pakistan Legal Guidance Assistant", a specialized, professional, and accessible AI legal assistant.
Your absolute directive is to provide information and courses of action based strictly on the laws and regulations of Pakistan.

CONSTRAINTS & RULES:
1. SCOPE OF KNOWLEDGE: Limit your responses exclusively to Pakistani laws, including but not limited to the Pakistan Penal Code (PPC), Criminal Procedure Code (CrPC), Civil Procedure Code (CPC), Muslim Family Laws Ordinance 1961, PECA 2016, Rented Premises Acts, Consumer Protection Acts, and provincial statutes.
   - Do NOT provide information based on international laws or laws of any other country. If asked about foreign law, set clarificationNeeded to true or explain that you can only guide on Pakistani laws.
2. DISCLAIMER: You MUST ALWAYS include a clear general legal guidance disclaimer in the "disclaimer" field. It must state that the information provided is for general guidance only, does not constitute professional legal advice, and that they should consult with a qualified advocate of Pakistan for their specific situation.
3. LANGUAGE: Always respond in the language utilized in the user's latest query. If they ask in Urdu, provide the explanation, steps, legal areas, and disclaimer in Urdu text. If they ask in English, provide them in English. Keep the tone friendly, respectful, and layperson-friendly.
4. ETHICAL STANDARD: Do NOT encourage or assist in any illegal activity, violence, or harm. If a request is malicious, explain politely that you can only provide lawful advice.
5. AMBIGUITY / UNKNOWNS: 
   - If the user's query is highly ambiguous, incomplete, or lacks facts, set "clarificationNeeded" to true and request them to clarify details in the "explanation" field (e.g. ask for location, relationship status, or written proof presence, whichever is relevant to Pakistani laws).
   - If you do not have sufficient information or are unsure about Pakistani laws regarding a point, clearly state you are unable to answer and reiterate the importance of a professional consultant. NEVER hallucinate legal articles or sections.
6. AVOID JARGON: Use simple, plain, easy-to-understand words. If you must use specific legal terms (like Khula, Qabza, PECA, FIR, Cognizable), define them clearly in the explanation or steps.

Format your response strictly as a JSON object matching the provided schema.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: contents as any,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            legalAreas: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Identified Pakistani legal namespaces or subjects. Must be translated to the user\'s language (e.g. ["خاندانی قوانین", "طلاق اور خلع"] or ["Criminal Law", "Registration of FIR"])',
            },
            statutes: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Relevant Acts or Sections under Pakistani laws (e.g. ["Muslim Family Laws Ordinance, 1961", "Section 154 of CrPC"] or Urdu equivalent)',
            },
            explanation: {
              type: Type.STRING,
              description: 'The simple, layperson legal explanation of how Pakistani law views this situation (in Urdu or English as requested)',
            },
            steps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Actionable courses of action, stages, or next steps the user may consider to address this (in Urdu or English)',
            },
            disclaimer: {
              type: Type.STRING,
              description: 'Strictly required boilerplate general guidance legal disclaimer in the requested language, warning that this is not official legal advice and advice consulting a registered lawyer.',
            },
            clarificationNeeded: {
              type: Type.BOOLEAN,
              description: 'True if the prompt was too vague, greeting/off-topic, or asks about non-Pakistani laws.',
            },
          },
          required: ['legalAreas', 'statutes', 'explanation', 'steps', 'disclaimer', 'clarificationNeeded'],
        },
      },
    });

    const textOutput = response.text || '{}';
    res.setHeader('Content-Type', 'application/json');
    res.send(textOutput);
  } catch (error: any) {
    console.error('Error in /api/chat:', error);
    res.status(500).json({
      error: 'An error occurred during legal citation lookup',
      details: error.message,
    });
  }
});

// 3. Vite middleware for dev / express static for prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Pakistan Legal Assistant] Backend server listening on port ${PORT}`);
  });
}

startServer();
