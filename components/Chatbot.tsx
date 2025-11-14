

import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { getChatbotResponse } from '../services/geminiService';

export const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { sender: 'bot', text: 'Olá! Sou a Gema, sua assistente virtual. Como posso ajudar?' }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async () => {
    if (userInput.trim() === '') return;

    const newUserMessage: ChatMessage = { sender: 'user', text: userInput };
    setMessages(prev => [...prev, newUserMessage]);
    setUserInput('');
    setIsTyping(true);

    const response = await getChatbotResponse(userInput);
    
    const newBotMessage: ChatMessage = { sender: 'bot', text: response };
    setMessages(prev => [...prev, newBotMessage]);
    setIsTyping(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 right-6 bg-purple-600 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:bg-purple-700 transition-transform transform hover:scale-110 z-50"
        aria-label="Abrir chatbot"
      >
        <i className={`fas ${isOpen ? 'fa-times' : 'fa-comments'} text-2xl`}></i>
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 h-96 bg-white rounded-lg shadow-2xl flex flex-col z-50 animate-fade-in-up">
          <div className="p-4 bg-purple-600 text-white rounded-t-lg">
            <h3 className="font-bold text-lg">Atendimento Virtual</h3>
          </div>
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            {messages.map((msg, index) => (
              <div key={index} className={`flex mb-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`rounded-lg py-2 px-3 max-w-xs ${msg.sender === 'user' ? 'bg-blue-500 text-white animate-message-sent' : 'bg-gray-200 text-gray-800'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="rounded-lg py-2 px-3 bg-gray-200 text-gray-500">
                  <span className="animate-pulse">... digitando</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-2 border-t flex">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Digite sua mensagem..."
              className="flex-1 p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button onClick={handleSendMessage} className="bg-purple-600 text-white px-4 rounded-r-md hover:bg-purple-700">
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      )}
    </>
  );
};