import { Room } from '../../lib/types';
import { Timestamp } from 'firebase/firestore';

type UserRole = 'activist' | 'journalist';

interface RoomCardProps {
  room: Room;
  onClick: () => void;
  role: UserRole;
}

export default function RoomCard({ room, onClick, role }: RoomCardProps) {
  // Helper function to safely display the creation date
  const getCreatedAtDate = () => {
    if (!room.createdAt) return 'Unknown date';
    
    try {
      // Type guard for Firestore Timestamp
      if (typeof room.createdAt === 'object' && 'toDate' in room.createdAt) {
        return (room.createdAt as unknown as Timestamp).toDate().toLocaleDateString();
      }
      
      // Handle if it's already a Date object
      if (room.createdAt instanceof Date) {
        return room.createdAt.toLocaleDateString();
      }
      
      return 'Invalid date';
    } catch (error) {
      console.error('Error parsing date:', error);
      return 'Invalid date';
    }
  };

  return (
    <div 
      onClick={onClick}
      className={`bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer border border-transparent ${
        role === "activist" ? "hover:border-yellow-400" : "hover:border-blue-800"
      }`}
    >
      <h3 className="font-bold text-lg">{room.name}</h3>
      <p className="text-gray-600 mt-2 text-sm">
        {room.description || "No description provided"}
      </p>
      <div className="flex justify-between text-xs text-gray-500 mt-4">
        <span>Members: {room.memberCount || 0}</span>
        <span>
          Created: {getCreatedAtDate()}
        </span>
      </div>
    </div>
  );
}