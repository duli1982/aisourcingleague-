import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { askCoach } from '../api/client';
import { markdownToHtml } from '../utils/markdown';

type Sender = 'user' | 'coach';

interface Message {
  id: number;
  sender: Sender;
  content: string;
  isTyping?: boolean;
}

const CoachChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      sender: 'coach',
      content:
        "Hello! I'm your AI Sourcing Coach, powered by Gemini. Ask me for advice on sourcing strategies, how to improve a search string, or anything else you need to win the league!"
    }
  ]);
  const [input, setInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const chatRef = useRef<HTMLDivElement | null>(null);
  const messageIdRef = useRef(1);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) {
      return;
    }

    const userMessage: Message = {
      id: messageIdRef.current++,
      sender: 'user',
      content: trimmed
    };

    const typingMessage: Message = {
      id: messageIdRef.current++,
      sender: 'coach',
      content: '...',
      isTyping: true
    };

    setMessages(prev => [...prev, userMessage, typingMessage]);
    setInput('');
    setIsSubmitting(true);

    try {
      const result = await askCoach(trimmed);
      setMessages(prev =>
        prev.map(message =>
          message.isTyping
            ? { ...message, content: result.response, isTyping: false }
            : message
        )
      );
    } catch (error) {
      console.error(error);
      setMessages(prev =>
        prev.map(message =>
          message.isTyping
            ? {
                ...message,
                content:
                  "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
                isTyping: false
              }
            : message
        )
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-xl h-[60vh] flex flex-col">
      <div ref={chatRef} className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`p-3 rounded-lg max-w-md text-sm md:text-base ${
                message.sender === 'user' ? 'bg-cyan-600 text-white' : 'bg-gray-700 text-gray-100'
              }`}
            >
              {message.isTyping ? (
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:0.2s]" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:0.4s]" />
                </div>
              ) : message.sender === 'coach' ? (
                <div
                  className="prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: markdownToHtml(message.content)
                  }}
                />
              ) : (
                message.content
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 bg-gray-700 border-t border-gray-600">
        <form
          onSubmit={handleSubmit}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            value={input}
            onChange={event => setInput(event.target.value)}
            className="flex-1 bg-gray-600 border border-gray-500 rounded-full px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            placeholder="Ask your coach..."
            disabled={isSubmitting}
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-cyan-600 hover:bg-cyan-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold p-2 rounded-full"
            aria-label="Send message"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default CoachChat;
