import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';
import { EXERCISES, ExerciseType, getExerciseEmoji, SocketEvent } from '@fitness-duel/shared';
import { useUserStore } from '../stores/userStore';
import { useSocketStore } from '../stores/socketStore';

export default function LobbyScreen({ navigation }: any) {
  const { user } = useUserStore();
  const { socket, isConnected, connect } = useSocketStore();
  const [isSearching, setIsSearching] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<ExerciseType | null>(null);

  useEffect(() => {
    if (!user) {
      navigation.replace('Home');
      return;
    }

    if (!socket) {
      connect(user.id, user.username);
    }
  }, [user, socket, connect, navigation]);

  useEffect(() => {
    if (!socket) return;

    socket.on(SocketEvent.MATCH_FOUND, (data) => {
      console.log('Match found!', data);
      setIsSearching(false);
      navigation.navigate('Match', { 
        matchId: data.matchId, 
        role: data.yourRole,
        opponent: data.opponent,
        exercise: data.exercise
      });
    });

    return () => {
      socket.off(SocketEvent.MATCH_FOUND);
    };
  }, [socket, navigation]);

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
  };

  if (!user) return null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* User Profile */}
        <View style={styles.profileCard}>
          <View style={styles.profileInfo}>
            <Image
              source={{ uri: user.avatar }}
              style={styles.avatar}
            />
            <View style={styles.profileText}>
              <Text style={styles.username}>{user.username}</Text>
              <Text style={styles.status}>
                {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
              </Text>
            </View>
          </View>
          
          <View style={styles.winRate}>
            <Text style={styles.winRateLabel}>Win Rate</Text>
            <Text style={styles.winRateValue}>{user.stats.winRate}%</Text>
          </View>
        </View>

        {/* Searching Status */}
        {isSearching && (
          <View style={styles.searchingCard}>
            <Text style={styles.searchingEmoji}>
              {selectedExercise && getExerciseEmoji(selectedExercise)}
            </Text>
            <Text style={styles.searchingTitle}>Finding Opponent...</Text>
            <ActivityIndicator size="large" color="#FF6B6B" style={styles.loader} />
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancelSearch}>
              <Text style={styles.cancelButtonText}>Cancel Search</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Exercise Selection */}
        {!isSearching && (
          <View style={styles.exercisesSection}>
            <Text style={styles.sectionTitle}>Choose Your Battle</Text>
            
            {EXERCISES.map((exercise) => (
              <TouchableOpacity
                key={exercise.id}
                style={styles.exerciseButton}
                onPress={() => handleJoinQueue(exercise.type)}
              >
                <View style={styles.exerciseContent}>
                  <Text style={styles.exerciseButtonEmoji}>{getExerciseEmoji(exercise.type)}</Text>
                  <View style={styles.exerciseInfo}>
                    <Text style={styles.exerciseButtonTitle}>{exercise.name}</Text>
                    <Text style={styles.exerciseButtonDesc}>{exercise.description}</Text>
                    <View style={styles.exerciseDetails}>
                      <Text style={styles.exerciseDuration}>{exercise.duration}s</Text>
                      <Text style={styles.exerciseCategory}> • {exercise.category}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Stats */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{user.stats.totalMatches}</Text>
            <Text style={styles.statLabel}>Matches</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: '#95E1D3' }]}>{user.stats.wins}</Text>
            <Text style={styles.statLabel}>Wins</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: '#FF6B6B' }]}>{user.stats.losses}</Text>
            <Text style={styles.statLabel}>Losses</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: '#FFE66D' }]}>{user.stats.streak}</Text>
            <Text style={styles.statLabel}>Streak</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#667eea',
  },
  scrollContent: {
    padding: 15,
  },
  profileCard: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'white',
    marginRight: 12,
  },
  profileText: {
    justifyContent: 'center',
  },
  username: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  status: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
  winRate: {
    alignItems: 'flex-end',
  },
  winRateLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
  winRateValue: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  searchingCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    marginBottom: 15,
  },
  searchingEmoji: {
    fontSize: 60,
    marginBottom: 15,
  },
  searchingTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  loader: {
    marginBottom: 20,
  },
  cancelButton: {
    backgroundColor: '#666',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 10,
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  exercisesSection: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
    textAlign: 'center',
  },
  exerciseButton: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  exerciseContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exerciseButtonEmoji: {
    fontSize: 40,
    marginRight: 15,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseButtonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 3,
  },
  exerciseButtonDesc: {
    fontSize: 13,
    color: '#666',
    marginBottom: 5,
  },
  exerciseDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exerciseDuration: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  exerciseCategory: {
    fontSize: 12,
    color: '#999',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 3,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
});
