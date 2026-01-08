'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { EXERCISES, getExerciseEmoji } from '@fitness-duel/shared';
import { useUserStore } from '@/stores/userStore';

export default function HomePage() {
  const router = useRouter();
  const { user, setUser } = useUserStore();
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateUser = async () => {
    if (username.trim().length < 3) {
      alert('Username must be at least 3 characters');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim() })
      });

      const data = await response.json();
      if (data.success) {
        setUser(data.data);
        router.push('/lobby');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Failed to create user');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-white mb-4">
            💪 Fitness Duel
          </h1>
          <p className="text-xl text-white/90">
            Live 1v1 Bodyweight Competition Platform
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Enter the Arena
          </h2>
          
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCreateUser()}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-primary focus:outline-none text-lg"
              maxLength={20}
            />
            
            <button
              onClick={handleCreateUser}
              disabled={isLoading || username.trim().length < 3}
              className="w-full bg-primary text-white py-3 rounded-lg font-bold text-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? 'Creating...' : 'Start Fighting! 🔥'}
            </button>
          </div>
        </div>

        {/* Exercise Preview */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4 text-center">
            Available Exercises
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {EXERCISES.map((exercise) => (
              <div
                key={exercise.id}
                className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center hover:bg-white/30 transition-all"
              >
                <div className="text-4xl mb-2">{getExerciseEmoji(exercise.type)}</div>
                <div className="text-white font-semibold">{exercise.name}</div>
                <div className="text-white/70 text-sm">{exercise.duration}s</div>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 text-center">
            <div className="text-3xl mb-2">🎥</div>
            <div className="text-white font-semibold">Live Video</div>
            <div className="text-white/70 text-sm">See your opponent in real-time</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 text-center">
            <div className="text-3xl mb-2">🎙️</div>
            <div className="text-white font-semibold">Voice Chat</div>
            <div className="text-white/70 text-sm">Talk during review phase</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 text-center">
            <div className="text-3xl mb-2">🏆</div>
            <div className="text-white font-semibold">Fair Voting</div>
            <div className="text-white/70 text-sm">Mutual winner agreement</div>
          </div>
        </div>
      </div>
    </div>
  );
}
