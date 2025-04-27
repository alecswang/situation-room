'use client';

import { useState } from 'react';
import RoomList from '../room/RoomList';
import ChatContainer from '../chat/ChatContainer';
import { Room } from '../../lib/types';

export default function ActivistDashboard() {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  
  return selectedRoom ? (
    <ChatContainer
      roomId={selectedRoom.id}
      roomName={selectedRoom.name}
      onExit={() => setSelectedRoom(null)} 
    />
  ) : (
    <RoomList onSelectRoom={setSelectedRoom} />
  );
}