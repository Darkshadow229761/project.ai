import { GoogleGenAI } from '@google/genai';

export const config = {
  runtime: 'nodejs',
};

interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

interface RequestBody {
  prompt?: string;
  history?: ChatMessage[];
  systemInstruction?: string;
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: 'Server configuration error: GEMINI_API_KEY is not set.',
    });
  }

  try {
    const body: RequestBody = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { prompt, history, systemInstruction } = body;

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({ error: 'Prompt is required and must be a non-empty string.' });
    }

    const ai = new GoogleGenAI({ apiKey });

    const contents = [];
    if (Array.isArray(history)) {
      for (const msg of history) {
        contents.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }],
        });
      }
    }
    contents.push({
      role: 'user',
      parts: [{ text: prompt.trim() }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents,
      config: systemInstruction ? { systemInstruction } : undefined,
    });

    const replyText = response.text || '';

    return res.status(200).json({
      success: true,
      text: replyText,
    });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    
    if (error?.status === 429) {
      return res.status(429).json({ error: 'Rate limit exceeded. Please try again shortly.' });
    }

    return res.status(500).json({
      error: 'Failed to generate response from Gemini API.',
    });
  }
}
