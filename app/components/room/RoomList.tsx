'use client';

import { useState } from 'react';
import { collection, addDoc, serverTimestamp, doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, firestore } from '../../config/firebase';
import RoomCard from './RoomCard';
import { useCollection } from 'react-firebase-hooks/firestore';
import { Room } from '../../lib/types';
import Loading from '../ui/Loading';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import { useAuthState } from 'react-firebase-hooks/auth';

interface RoomListProps {
  onSelectRoom: (room: Room) => void;
}

export default function RoomList({ onSelectRoom }: RoomListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [user] = useAuthState(auth);
  const [rooms, loading, error] = useCollection(
    collection(firestore, 'rooms'),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  const createRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;
    
    if (!user) return;
    
    // Check if user is anonymous
    const userDoc = await getDoc(doc(firestore, 'users', user.uid));
    if (userDoc.exists() && userDoc.data()?.isAnonymous) {
      alert('Anonymous users cannot create rooms. Please sign in with Google to create a room.');
      return;
    }

    try {
      const newRoomRef = await addDoc(collection(firestore, 'rooms'), {
        name: newRoomName,
        createdAt: serverTimestamp(),
        createdBy: user.uid,
        createdByName: user.displayName || 'Anonymous',
        leaders: [user.uid],
        description: "",
        memberCount: 1
      });

      await setDoc(doc(firestore, 'rooms', newRoomRef.id, 'members', user.uid), {
        isLeader: true,
        joinedAt: serverTimestamp()
      });

      setNewRoomName('');
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error creating room:', err);
    }
  };

  if (loading) return <Loading />;
  if (error) return <div>Error loading rooms</div>;

  // Check if current user is anonymous
  const isAnonymous = user?.isAnonymous || false;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Chat Rooms</h2>
        {!isAnonymous && (
          <Button 
            onClick={() => setIsModalOpen(true)}
            variant="primary"
          >
            Create New Room
          </Button>
        )}
      </div>
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <form onSubmit={createRoom} className="space-y-4">
          <h3 className="text-xl font-bold">Create New Room</h3>
          <div>
            <label htmlFor="roomName" className="block text-sm font-medium text-gray-700 mb-1">
              Room Name
            </label>
            <input
              id="roomName"
              type="text"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              placeholder="Enter room name"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              autoFocus
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button 
              type="button" 
              onClick={() => setIsModalOpen(false)}
              variant="outlineyellow"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="primary"
              disabled={!newRoomName.trim()}
            >
              Create
            </Button>
          </div>
        </form>
      </Modal>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rooms?.docs.map(doc => {
          const room = { id: doc.id, ...doc.data() } as Room;
          return (
            <RoomCard
              key={room.id}
              room={room}
              onClick={() => onSelectRoom(room)}
              role="activist"
            />
          );
        })}
      </div>
    </div>
  );
}