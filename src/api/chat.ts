import { SYSTEM_PROMPT } from '../constants/prompt';

export type Message = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export const fetchChatbotResponse = async (userMessage: string, history: Message[]): Promise<string> => {
  try {
    const messages: Message[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history,
      { role: 'user', content: userMessage },
    ];

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      throw new Error('API 호출 중 오류가 발생했습니다.');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Chat API Error:', error);
    return '죄송합니다. 오류가 발생했습니다. 잠시 후 다시 시도해주세요.\n\n한국어촌어항공단 수산어촌교육실(1600-3256)';
  }
};
