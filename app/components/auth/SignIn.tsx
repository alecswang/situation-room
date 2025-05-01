'use client';

import { useState } from 'react';
import { auth } from '../../config/firebase';
import { signInAnonymously, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { firestore } from '../../config/firebase';
import RoleSelection from './RoleSelection';
import Button from '../ui/Button';

export default function SignIn() {
  const [role, setRole] = useState<'activist' | 'journalist' | null>(null);

  const signInAnonymousActivist = async () => {
    const result = await signInAnonymously(auth);
    await setDoc(doc(firestore, 'users', result.user.uid), {
      role: 'activist',
      isAnonymous: true,
      createdAt: new Date()
    }, { merge: true });
    // Immediately signs in, no additional confirmation needed
  };

  const signInGoogleActivist = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    await setDoc(doc(firestore, 'users', result.user.uid), {
      role: 'activist',
      displayName: result.user.displayName,
      email: result.user.email,
      photoURL: result.user.photoURL,
      createdAt: new Date()
    }, { merge: true });
  };

  const signInJournalist = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    await setDoc(doc(firestore, 'users', result.user.uid), {
      role: 'journalist',
      displayName: result.user.displayName,
      email: result.user.email,
      photoURL: result.user.photoURL,
      isJournalist: true,
      createdAt: new Date()
    }, { merge: true });
  };

  if (!role) {
    return <RoleSelection onSelectRole={setRole} />;
  }

  if (role === 'activist') {
    return (
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        <div className="space-y-4">
          <Button 
            onClick={signInAnonymousActivist}
            className="w-full"
            variant="primary"
          >
            Continue Anonymously
          </Button>
          <div className="relative flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-500">or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          <Button 
            onClick={signInGoogleActivist}
            className="w-full"
            variant="secondary"
          >
            Sign in with Google
          </Button>
        </div>
        <p className="mt-4 text-sm text-gray-600 text-center">
          Anonymous mode leaves no personal trace
        </p>
      </div>
    );
  }

  // Journalist sign in
  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <Button 
        onClick={signInJournalist}
        className="w-full"
        variant="secondary"
      >
        Sign in with Google as Journalist
      </Button>
      <p className="mt-4 text-sm text-gray-600 text-center">
        Journalists must verify their identity
      </p>
    </div>
  );
}