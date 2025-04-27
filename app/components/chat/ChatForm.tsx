'use client';

import { useState } from 'react';
import Button from '../ui/Button';

interface ChatFormProps {
  onSubmit: (message: string) => void;
  placeholder?: string;
  className?: string;
}

export default function ChatForm({ onSubmit, placeholder, className }: ChatFormProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSubmit(message);
      setMessage('');
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className={`flex gap-2 p-2 bg-white border-t ${className}`}
    >
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={placeholder || "Type a message..."}
        className="flex-1 px-4 py-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <Button
        type="submit"
        disabled={!message.trim()}
        className="rounded-full w-12 h-12 flex items-center justify-center"
        variant="primary"
      >
        🕊️
      </Button>
    </form>
  );
}