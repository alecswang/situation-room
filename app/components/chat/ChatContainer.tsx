'use client';

import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { auth, firestore } from '../../config/firebase';
import ChatHeader from './ChatHeader';
import PublicChat from './PublicChat';
import LeaderJournalistChat from './JournalistChat';

interface ChatContainerProps {
  roomId: string;
  roomName: string;
  onExit: () => void;
}

export default function ChatContainer({ roomId, roomName, onExit }: ChatContainerProps) {
  const [activeTab, setActiveTab] = useState<'public' | 'journalist'>('public');
  const [isLeader, setIsLeader] = useState(false);

  useEffect(() => {
    const checkLeaderStatus = async () => {
      const user = auth.currentUser;
      if (!user) return;
      
      const memberDoc = await getDoc(
        doc(firestore, 'rooms', roomId, 'members', user.uid)
      );
      setIsLeader(memberDoc.exists() && memberDoc.data()?.isLeader);
    };
    
    checkLeaderStatus();
  }, [roomId]);

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] border rounded-lg overflow-hidden">
      <ChatHeader 
        title={roomName}
        onExit={onExit}
        role='activist'
      />

      {isLeader && (
        <div className="flex border-b">
          <button 
            className={`flex-1 py-2 font-medium ${activeTab === 'public' ? 'bg-yellow-500 text-black' : 'bg-gray-100'}`}
            onClick={() => setActiveTab('public')}
          >
            Group Chat
          </button>
          <button 
            className={`flex-1 py-2 font-medium ${activeTab === 'journalist' ? 'bg-blue-900 text-white' : 'bg-gray-100'}`}
            onClick={() => setActiveTab('journalist')}
          >
            Journalist Channel
          </button>
        </div>
      )}

      <div className="flex-1 overflow-hidden">
        {activeTab === 'public' ? (
          <PublicChat roomId={roomId} />
        ) : (
          <LeaderJournalistChat roomId={roomId} roomName={roomName} role="activist"/>
        )}
      </div>
    </div>
  );
}