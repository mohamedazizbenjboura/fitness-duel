import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { EXERCISES, getExerciseEmoji } from '@fitness-duel/shared';
import { useUserStore } from '../stores/userStore';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';

export default function HomeScreen({ navigation }: any) {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useUserStore();

  const handleStart = async () => {
    if (username.trim().length < 3) {
      alert('Username must be at least 3 characters');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim() })
      });

      const data = await response.json();
      if (data.success) {
        setUser(data.data);
        navigation.navigate('Lobby');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Failed to connect to server');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>💪</Text>
            <Text style={styles.titleText}>Fitness Duel</Text>
            <Text style={styles.subtitle}>Live 1v1 Competition</Text>
          </View>

          {/* Login Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Enter the Arena</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Enter your username"
              placeholderTextColor="#999"
              value={username}
              onChangeText={setUsername}
              maxLength={20}
              autoCapitalize="none"
            />
            
            <TouchableOpacity
              style={[styles.button, (!username.trim() || username.trim().length < 3) && styles.buttonDisabled]}
              onPress={handleStart}
              disabled={isLoading || !username.trim() || username.trim().length < 3}
            >
              <Text style={styles.buttonText}>
                {isLoading ? 'Creating...' : 'Start Fighting! 🔥'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Exercises Preview */}
          <View style={styles.exercisesContainer}>
            <Text style={styles.exercisesTitle}>Available Exercises</Text>
            <View style={styles.exercisesGrid}>
              {EXERCISES.slice(0, 4).map((exercise) => (
                <View key={exercise.id} style={styles.exerciseCard}>
                  <Text style={styles.exerciseEmoji}>{getExerciseEmoji(exercise.type)}</Text>
                  <Text style={styles.exerciseName}>{exercise.name}</Text>
                  <Text style={styles.exerciseDuration}>{exercise.duration}s</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Features */}
          <View style={styles.features}>
            <View style={styles.feature}>
              <Text style={styles.featureEmoji}>🎥</Text>
              <Text style={styles.featureTitle}>Live Video</Text>
              <Text style={styles.featureText}>Real-time streaming</Text>
            </View>
            
            <View style={styles.feature}>
              <Text style={styles.featureEmoji}>🎙️</Text>
              <Text style={styles.featureTitle}>Voice Chat</Text>
              <Text style={styles.featureText}>Talk to opponent</Text>
            </View>
            
            <View style={styles.feature}>
              <Text style={styles.featureEmoji}>🏆</Text>
              <Text style={styles.featureTitle}>Fair Voting</Text>
              <Text style={styles.featureText}>Mutual agreement</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#667eea',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  title: {
    fontSize: 80,
    marginBottom: 10,
  },
  titleText: {
    fontSize: 42,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  button: {
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  exercisesContainer: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  exercisesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 15,
  },
  exercisesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  exerciseCard: {
    width: '48%',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  exerciseEmoji: {
    fontSize: 40,
    marginBottom: 5,
  },
  exerciseName: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
  exerciseDuration: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
  features: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  feature: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  featureEmoji: {
    fontSize: 30,
    marginBottom: 5,
  },
  featureTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
    marginBottom: 3,
  },
  featureText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 10,
    textAlign: 'center',
  },
});
