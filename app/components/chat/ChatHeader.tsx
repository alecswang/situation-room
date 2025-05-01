import Button from '../ui/Button';
import { UserRole } from '../../lib/types';

interface ChatHeaderProps {
  title: string;
  onExit: () => void;
  showBadge?: boolean;
  badgeText?: string;
  role: UserRole
}

export default function ChatHeader({ 
  title, 
  onExit,
  showBadge = false,
  badgeText = 'Journalist',
  role
}: ChatHeaderProps) {
  console.log("DEBUG: ", role)
  return (
    <div className="bg-white text-black p-4 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Button 
          onClick={onExit}
          variant={role === "activist" ? "outlineblackyellow" : "outlineblackblue"}
          className="text-black border-2"
        >
          ← Back
        </Button>
        <h2 className="text-xl font-bold">{title}</h2>
      </div>
      {showBadge && (
        <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-medium">
          {badgeText}
        </span>
      )}
    </div>
  );
}