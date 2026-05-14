import React, { useState, useRef, useEffect } from 'react';
import { fetchChatbotResponse, type Message } from '../api/chat';
import './Chatbot.css';

const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);

export const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: '안녕하세요! 수산공익직불제 관련 전문 챗봇입니다. 궁금한 점을 질문해 주세요.\n\n한국어촌어항공단 수산어촌교육실(1600-3256)' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessageContent = input.trim();
    const userMsg: Message = { role: 'user', content: userMessageContent };
    
    // Save history without the new message for the API call
    const currentHistory = [...messages];
    
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const responseContent = await fetchChatbotResponse(userMessageContent, currentHistory);
      
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: responseContent }
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: '죄송합니다. 통신 오류가 발생했습니다. 한국어촌어항공단으로 문의해 주세요.\n\n한국어촌어항공단 수산어촌교육실(1600-3256)' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <h2>수산공익직불제 챗봇</h2>
        <p>어업인 여러분의 궁금증을 해결해 드립니다.</p>
      </div>
      
      <div className="chatbot-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message-row ${msg.role}`}>
            {msg.role === 'assistant' && (
              <img src="/fish.png" alt="프로필" className="assistant-avatar" />
            )}
            <div className={`message ${msg.role}`}>
              <div className="message-text">{msg.content}</div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message-row assistant">
            <img src="/fish.png" alt="프로필" className="assistant-avatar" />
            <div className="message assistant">
              <div className="loading-dots">
                <span></span><span></span><span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="chatbot-input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="수산공익직불제에 대해 질문해 보세요..."
          className="chatbot-input"
          disabled={isLoading}
        />
        <button type="submit" className="chatbot-button" disabled={!input.trim() || isLoading} aria-label="전송">
          <SendIcon />
        </button>
      </form>
    </div>
  );
};
