
import React, { useState } from 'react';
import LoginForm from '@/components/LoginForm';
import CarRacingGame from '@/components/CarRacingGame';
import Leaderboard from '@/components/Leaderboard';
import { User } from '@/services/SnapserManager';

const Index = () => {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return (
      <div className="min-h-screen">
        <LoginForm onLogin={handleLogin} />
        <div className="fixed bottom-4 right-4 w-80">
          <Leaderboard />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <CarRacingGame user={user} onLogout={handleLogout} />
    </div>
  );
};

export default Index;
