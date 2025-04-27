import { Message, UserRole } from '../../lib/types';
import Image from 'next/image';

interface ChatMessageProps {
  message: Message;
  isCurrentUser: boolean;
  role: UserRole
}

export default function ChatMessage({ message, isCurrentUser, role }: ChatMessageProps) {
  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex max-w-xs md:max-w-md lg:max-w-lg ${isCurrentUser ? 'flex-row-reverse' : ''}`}>
        <div className="flex-shrink-0">
          <Image
            src={message.photoURL || '/default-avatar.png'}
            alt={message.displayName || 'User'}
            width={40}
            height={40}
            className="rounded-full"
          />
        </div>
        <div className={`ml-2 mr-2 ${isCurrentUser ? 'text-right' : 'text-left'}`}>
          <div 
            className={`inline-block px-4 py-2 rounded-lg ${
              isCurrentUser 
                ? role === "activist" 
                  ? 'bg-yellow-500 text-black' // Activist styling
                  : 'bg-blue-900 text-white'   // Default/journalist styling
                : 'bg-gray-200 text-gray-800'
            }`}
          >
            {!isCurrentUser && (
              <p className={"font-bold text-sm text-black"}>
                {message.displayName}
                {message.isLeader && ' (Leader)'}
                {message.isJournalist && ' (Journalist)'}
              </p>
            )}
            <p>{message.text}</p>
            {/* {message.createdAt && (
              <p className={`text-xs mt-1 ${isCurrentUser ? 'text-gray-700' : 'text-gray-500'}`}>
                {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
}