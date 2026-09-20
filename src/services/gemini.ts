export interface Message {
  role: 'user' | 'model';
  content: string;
}

export interface ChatOptions {
  prompt: string;
  history?: Message[];
  systemInstruction?: string;
}

export async function sendMessageToGemini(options: ChatOptions): Promise<string> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(options),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || `Server request failed with status ${response.status}`);
  }

  return data.text;
}
