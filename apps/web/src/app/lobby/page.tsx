'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { EXERCISES, ExerciseType, getExerciseEmoji } from '@fitness-duel/shared';
import { useUserStore } from '@/stores/userStore';
import { useSocketStore } from '@/stores/socketStore';
import { SocketEvent } from '@fitness-duel/shared';

export default function LobbyPage() {
  const router = useRouter();
  const { user } = useUserStore();
  const { socket, isConnected, connect } = useSocketStore();
  const [selectedExercise, setSelectedExercise] = useState<ExerciseType | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [queuePosition, setQueuePosition] = useState(0);

  useEffect(() => {
    if (!user) {
      router.push('/');
      return;
    }

    // Connect socket
    if (!socket) {
      connect(user.id, user.username);
    }
  }, [user, socket, connect, router]);

  useEffect(() => {
    if (!socket) return;

    // Listen for match found
    socket.on(SocketEvent.MATCH_FOUND, (data) => {
      console.log('Match found!', data);
      setIsSearching(false);
      router.push(`/match/${data.matchId}?role=${data.yourRole}`);
    });

    // Listen for queue status
    socket.on(SocketEvent.QUEUE_STATUS, (data) => {
      setQueuePosition(data.position);
    });

    return () => {
      socket.off(SocketEvent.MATCH_FOUND);
      socket.off(SocketEvent.QUEUE_STATUS);
    };
  }, [socket, router]);

  const handleJoinQueue = (exerciseType: ExerciseType) => {
    if (!socket || !user) return;

    setSelectedExercise(exerciseType);
    setIsSearching(true);

    socket.emit(SocketEvent.JOIN_QUEUE, {
      userId: user.id,
      username: user.username,
      exerciseType,
      avatar: user.avatar
    });
  };

  const handleCancelSearch = () => {
    if (!socket) return;

    socket.emit(SocketEvent.LEAVE_QUEUE);
    setIsSearching(false);
    setSelectedExercise(null);
    setQueuePosition(0);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen gradient-bg p-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src={user.avatar}
              alt={user.username}
              className="w-12 h-12 rounded-full bg-white"
            />
            <div>
              <div className="text-white font-bold text-lg">{user.username}</div>
              <div className="text-white/70 text-sm">
                {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
              </div>
            </div>
          </div>

          <div className="text-white text-right">
            <div className="text-sm opacity-70">Win Rate</div>
            <div className="text-2xl font-bold">{user.stats.winRate}%</div>
          </div>
        </div>

        {/* Searching Status */}
        {isSearching && (
          <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6 text-center">
            <div className="text-6xl mb-4 animate-pulse-fast">
              {selectedExercise && getExerciseEmoji(selectedExercise)}
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Finding Opponent...
            </h2>
            <p className="text-gray-600 mb-6">
              {queuePosition > 0 ? `Position in queue: ${queuePosition}` : 'Searching for a worthy opponent'}
            </p>
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-3 h-3 bg-primary rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
            <button
              onClick={handleCancelSearch}
              className="px-8 py-3 bg-gray-500 text-white rounded-lg font-bold hover:bg-gray-600 transition-all"
            >
              Cancel Search
            </button>
          </div>
        )}

        {/* Exercise Selection */}
        {!isSearching && (
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              Choose Your Battle
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {EXERCISES.map((exercise) => (
                <button
                  key={exercise.id}
                  onClick={() => handleJoinQueue(exercise.type)}
                  className="bg-gradient-to-br from-primary to-purple-600 rounded-xl p-6 text-white hover:scale-105 transition-transform shadow-lg"
                >
                  <div className="text-5xl mb-3">{getExerciseEmoji(exercise.type)}</div>
                  <h3 className="text-xl font-bold mb-2">{exercise.name}</h3>
                  <div className="text-sm opacity-90 mb-3">{exercise.description}</div>
                  <div className="bg-white/20 rounded-lg px-4 py-2 inline-block">
                    <span className="font-bold">{exercise.duration}s</span> • {exercise.category}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-white">{user.stats.totalMatches}</div>
            <div className="text-white/70">Total Matches</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-success">{user.stats.wins}</div>
            <div className="text-white/70">Wins</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-danger">{user.stats.losses}</div>
            <div className="text-white/70">Losses</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-warning">{user.stats.streak}</div>
            <div className="text-white/70">Current Streak</div>
          </div>
        </div>
      </div>
    </div>
  );
}
