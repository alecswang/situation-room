'use client';

import { useAuth } from './hooks/useAuth';
import Loading from './components/ui/Loading';
import SignIn from './components/auth/SignIn';
import ActivistDashboard from './components/dashboard/ActivistDashboard';
import JournalistDashboard from './components/dashboard/JournalistDashboard';
import Header from './components/layout/Header';

export default function Home() {
  const { user, userData, loading } = useAuth();

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-white">
      <Header user={user} role={userData?.role} />
      
      <main className="container mx-auto py-4 px-4">
        {!user ? (
          <SignIn />
        ) : userData?.role === 'activist' ? (
          <ActivistDashboard />
        ) : userData?.role === 'journalist' ? (
          <JournalistDashboard />
        ) : (
          <div>Determining your role...</div>
        )}
      </main>
    </div>
  );
}