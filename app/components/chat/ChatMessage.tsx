import { Message, UserRole } from '../../lib/types';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface ChatMessageProps {
  message: Message;
  isCurrentUser: boolean;
  role: UserRole;
}

// Store mapping of user IDs to anonymous numbers
const anonymousIdMap = new Map<string, number>();
let nextAnonymousId = 1;

const avatarColors = [
  'bg-red-400', 'bg-blue-400', 'bg-green-400', 'bg-yellow-400',
  'bg-purple-400', 'bg-pink-400', 'bg-indigo-400', 'bg-gray-400',
  'bg-teal-400', 'bg-orange-400'
];

export default function ChatMessage({ message, isCurrentUser, role }: ChatMessageProps) {
  const [anonymousId, setAnonymousId] = useState<number>(0);
  const [avatarColor, setAvatarColor] = useState<string>('bg-gray-400');
  const [showRealIdentity, setShowRealIdentity] = useState<boolean>(false);

  useEffect(() => {
    // Ensure boolean value by using !! to coerce undefined to false
    const shouldShowRealIdentity = !!message.isJournalist;
    setShowRealIdentity(shouldShowRealIdentity);

    if (!shouldShowRealIdentity) {
      // Assign anonymous ID for non-journalists
      if (!anonymousIdMap.has(message.uid)) {
        anonymousIdMap.set(message.uid, nextAnonymousId);
        nextAnonymousId++;
      }
      setAnonymousId(anonymousIdMap.get(message.uid)!);

      // Generate consistent avatar color
      const hash = Array.from(message.uid).reduce((acc, char) => acc + char.charCodeAt(0), 0);
      setAvatarColor(avatarColors[hash % avatarColors.length]);
    }
  }, [message.uid, message.isJournalist]);

  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex max-w-xs md:max-w-md lg:max-w-lg ${isCurrentUser ? 'flex-row-reverse' : ''}`}>
        <div className="flex-shrink-0">
          {showRealIdentity ? (
            // Real profile picture for journalists
            <Image
              src={message.photoURL || '/default-avatar.png'}
              alt={message.displayName || 'Journalist'}
              width={40}
              height={40}
              className="rounded-full"
            />
          ) : (
            // Anonymous avatar for others
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${avatarColor}`}>
              <span className="text-white font-bold">{anonymousId}</span>
            </div>
          )}
        </div>
        <div className={`ml-2 mr-2 ${isCurrentUser ? 'text-right' : 'text-left'}`}>
          <div 
            className={`inline-block px-4 py-2 rounded-lg ${
              isCurrentUser 
                ? role === "activist" 
                  ? 'bg-yellow-500 text-black'
                  : 'bg-blue-900 text-white'
                : 'bg-gray-200 text-gray-800'
            }`}
          >
            {!isCurrentUser && (
              <p className="font-bold text-sm text-black">
                {showRealIdentity ? (
                  // Journalist name with badge
                  <>
                    {message.displayName}
                    <span className="ml-1 text-xs font-normal">(Journalist)</span>
                  </>
                ) : (
                  // Anonymous ID for others
                  `Anonymous ${anonymousId}`
                )}
              </p>
            )}
            <p>{message.text}</p>
          </div>
        </div>
      </div>
    </div>
  );
}