'use client';

import { auth } from '../../config/firebase';
import { User, signOut } from 'firebase/auth';
import Button from '../ui/Button';

interface signOutProps {
  role: any;
}

export default function SignOut({ role }: signOutProps) {
  const handleSignOut = () => {
    signOut(auth).catch((error) => {
      console.error('Error signing out:', error);
    });
  };

  return (
    <Button 
      onClick={handleSignOut}
      variant={role=="activist"?"outlineblackyellow":"outlineblackblue"}
      className="px-4 py-2"
    >
      Sign Out
    </Button>
  );
}