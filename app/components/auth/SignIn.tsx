'use client';

import { useState } from 'react';
import { auth } from '../../config/firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { firestore } from '../../config/firebase';
import RoleSelection from './RoleSelection';
import Button from '../ui/Button';

export default function SignIn() {
  const [role, setRole] = useState<'activist' | 'journalist' | null>(null);

  const signInWithGoogle = async () => {
    if (!role) return;
    
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    
    await setDoc(doc(firestore, 'users', result.user.uid), {
      role,
      displayName: result.user.displayName,
      email: result.user.email
    }, { merge: true });
  };

  if (!role) {
    return <RoleSelection onSelectRole={setRole} />;
  }

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <Button 
        onClick={signInWithGoogle}
        className="w-full"
        variant={role=="activist"?"primary":"secondary"}
      >
        Sign in with Google as {role}
      </Button>
      <p className="mt-4 text-sm text-gray-600 text-center">
        Do not violate the community guidelines or you will be banned for life!
      </p>
    </div>
  );
}