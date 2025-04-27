import { useState, useEffect, useRef } from 'react';
import { collection, query, orderBy, limit, addDoc, serverTimestamp } from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { auth, firestore } from '../config/firebase';
import { Message } from '../lib/types';

export function useChat(roomId: string, collectionName: string = 'messages') {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesRef = collection(firestore, 'rooms', roomId, collectionName);
  const q = query(messagesRef, orderBy('createdAt'), limit(25));
  
  // Remove idField from options and handle IDs manually
  const [messagesData = [], loading, error] = useCollectionData(q);
  
  // Add IDs to messages for React keys
  const messages = messagesData.map((msg, index) => ({
    ...msg,
    id: `${roomId}-${index}-${msg.createdAt?.toMillis() || Date.now()}`
  })) as Message[];

  const [formValue, setFormValue] = useState('');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formValue.trim()) return;

    const { uid, photoURL, displayName } = auth.currentUser || {};
    if (!uid) return;

    try {
      await addDoc(messagesRef, {
        text: formValue,
        createdAt: serverTimestamp(),
        uid,
        photoURL: photoURL || null,
        displayName: displayName || 'Anonymous',
        isLeader: collectionName === 'journalistMessages'
      });
      setFormValue('');
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  return {
    messages,
    loading,
    error,
    formValue,
    setFormValue,
    sendMessage,
    messagesEndRef
  };
}