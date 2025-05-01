'use client';

import { useState } from 'react';
import { collection } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';
import { firestore } from '../../config/firebase';
import { Room } from '../../lib/types';
import JournalistChat from '../chat/JournalistChat';
import Input from '../ui/Input';
import Loading from '../ui/Loading';
import RoomCard from '../room/RoomCard';
import ChatHeader from '../chat/ChatHeader';

export default function JournalistDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [rooms, loading, error] = useCollection(
    collection(firestore, 'rooms'),
    { snapshotListenOptions: { includeMetadataChanges: true } }
  );

  const filteredRooms = rooms?.docs
    .map(doc => ({ id: doc.id, ...doc.data() } as Room))
    .filter(room =>
      room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="space-y-6">
      {!selectedRoom && (
        <>
          <h2 className="text-2xl font-bold">Browse Activist Groups</h2>
          <Input
            type="text"
            placeholder="Search groups..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md"
            role="journalist"
          />
        </>
      )}

      {selectedRoom ? (
        <div className="flex flex-col h-[calc(100vh-180px)] border rounded-lg overflow-hidden">
          <ChatHeader
            title={selectedRoom.name}
            onExit={() => setSelectedRoom(null)}
            role="journalist"
          />
          <div className="flex-1 overflow-y-auto"> {/* Scrollable area */}
            <JournalistChat
              roomId={selectedRoom.id}
              roomName={selectedRoom.name}
              role="journalist"
            />
          </div>
        </div>
      ) : (
        <>
          {loading && <Loading />}
          {error && <p className="text-red-500">Error loading groups: {error.message}</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRooms?.map(room => (
              <RoomCard
                key={room.id}
                room={room}
                onClick={() => setSelectedRoom(room)}
                role="journalist"
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
