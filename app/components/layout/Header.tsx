import { User } from 'firebase/auth';
import SignOut from '../auth/SignOut';
import Image from 'next/image';

type UserRole = 'activist' | 'journalist' | undefined | null;

interface HeaderProps {
  user: User | null;
  role: UserRole;
}

export default function Header({ user, role }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto flex items-center justify-between py-4 px-4">
        <div className="flex items-center space-x-4">
          <Image
            src="/logo.png"
            alt="Rubber Room Logo"
            width={40}
            height={40}
            className="h-10 w-auto"
          />
          <h1 className="text-xl font-bold text-gray-900">Situation Room</h1>
        </div>
        {user && <SignOut role={role} />}
      </div>
    </header>
  );
}