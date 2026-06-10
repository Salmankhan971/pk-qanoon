import { GoogleGenAI, Type } from '@google/genai';

let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is missing.');
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'qanoon-ai-vercel',
        },
      },
    });
  }
  return aiClient;
}

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

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, history } = req.body || {};

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message payload is required' });
    }

    let ai: GoogleGenAI;
    try {
      ai = getGeminiClient();
    } catch (err: any) {
      return res.status(500).json({
        error: 'Gemini API is not configured. Please add GEMINI_API_KEY in Vercel Environment Variables.',
        details: err.message,
      });
    }

    const pastMessages = (history || []).map((msg: any) => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }],
    }));

    const contents = [
      ...pastMessages,
      { role: 'user', parts: [{ text: message }] },
    ];

    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
      contents: contents as any,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            legalAreas: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Identified Pakistani legal namespaces or subjects in the user language.',
            },
            statutes: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Relevant Acts or Sections under Pakistani laws.',
            },
            explanation: {
              type: Type.STRING,
              description: 'Simple legal explanation in the user language.',
            },
            steps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Actionable next steps in the user language.',
            },
            disclaimer: {
              type: Type.STRING,
              description: 'General guidance disclaimer in the requested language.',
            },
            clarificationNeeded: {
              type: Type.BOOLEAN,
              description: 'True if the prompt is too vague, off-topic, or about non-Pakistani laws.',
            },
          },
          required: ['legalAreas', 'statutes', 'explanation', 'steps', 'disclaimer', 'clarificationNeeded'],
        },
      },
    });

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).send(response.text || '{}');
  } catch (error: any) {
    console.error('Error in /api/chat:', error);
    return res.status(500).json({
      error: 'An error occurred during legal guidance lookup',
      details: error.message,
    });
  }
}
