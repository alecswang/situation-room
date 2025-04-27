'use client';

import { useRef, useEffect, useState } from 'react';
import { collection, addDoc, serverTimestamp, query, orderBy, limit } from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { auth, firestore } from '../../config/firebase';
import { Message } from '../../lib/types';
import ChatMessage from './ChatMessage';

interface PublicChatProps {
  roomId: string;
}

export default function PublicChat({ roomId }: PublicChatProps) {
  const dummy = useRef<HTMLDivElement>(null);
  const messagesRef = collection(firestore, 'rooms', roomId, 'messages');
  const q = query(messagesRef, orderBy('createdAt'), limit(25));
  
  // Updated collection data hook usage
  const [messages = [], loading, error] = useCollectionData(q);
  
  const [formValue, setFormValue] = useState('');

  // Generate message IDs for React keys
  const messagesWithIds = messages?.map((msg, index) => ({
    ...msg,
    id: `msg-${index}-${msg.createdAt?.toMillis() || Date.now()}`
  })) as Message[];

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const { uid, photoURL, displayName } = auth.currentUser || {};
    if (!uid || !formValue.trim()) return;

    try {
      // Correct Firebase v9 syntax for adding documents
      await addDoc(messagesRef, {
        text: formValue,
        createdAt: serverTimestamp(),
        uid,
        photoURL: photoURL || null,
        displayName: displayName || 'Anonymous',
        isLeader: false
      });

      setFormValue('');
      dummy.current?.scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  useEffect(() => {
    dummy.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (loading) return <div className="p-4 text-center">Loading messages...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error.message}</div>;

  return (
    <div className="flex flex-col h-full">
      <main className="flex-1 overflow-y-auto p-4">
        {messagesWithIds.map(msg => (
          <ChatMessage key={msg.id} message={msg} isCurrentUser={msg.uid === auth.currentUser?.uid} role='activist'/>
        ))}
        <div ref={dummy}></div>
      </main>

      <form onSubmit={sendMessage} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
            value={formValue}
            onChange={(e) => setFormValue(e.target.value)}
            placeholder="Message the group"
          />
          <button
            type="submit"
            disabled={!formValue}
            className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}