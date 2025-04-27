import { useState, useRef, useEffect } from 'react';
import { collection, addDoc, serverTimestamp, query, orderBy, limit } from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { auth, firestore } from '../../config/firebase';
import { Message, UserRole } from '../../lib/types';
import ChatMessage from './ChatMessage';
import ChatHeader from './ChatHeader';

interface JournalistChatProps {
  roomId: string;
  roomName: string;
  role: UserRole
}

export default function JournalistChat({ roomId, roomName, role }: JournalistChatProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesRef = collection(firestore, 'rooms', roomId, 'journalistMessages');
  const q = query(messagesRef, orderBy('createdAt'), limit(25));
  
  // Updated useCollectionData usage
  const [messages = [], loading, error] = useCollectionData(q);
  
  const [formValue, setFormValue] = useState('');

  // Get message IDs manually
  const messagesWithIds = messages?.map((msg, index) => ({
    ...msg,
    id: `msg-${index}-${msg.createdAt?.toMillis() || Date.now()}`
  })) as Message[];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user || !formValue.trim()) return;

    try {
      await addDoc(messagesRef, {
        text: formValue,
        createdAt: serverTimestamp(),
        uid: user.uid,
        photoURL: user.photoURL || null,
        displayName: user.displayName || 'Anonymous',
        isJournalist: true
      });
      setFormValue('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (loading) return <div>Loading messages...</div>;
  if (error) return <div>Error loading messages: {error.message}</div>;

  return (
    <div className="flex flex-col h-full">
      <div className="messages-container flex-1 overflow-y-auto p-4">
        {messagesWithIds.map((msg) => (
          <ChatMessage 
            key={msg.id} 
            message={msg} 
            isCurrentUser={msg.uid === auth.currentUser?.uid}
            role="journalist"
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            value={formValue}
            onChange={(e) => setFormValue(e.target.value)}
            placeholder={`Message ${roomName} leaders`}
            className="flex-1 p-2 border rounded"
          />
          <button 
            type="submit" 
            disabled={!formValue}
            className="bg-blue-900 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}