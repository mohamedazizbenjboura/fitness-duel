import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Alert,
} from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { SocketEvent } from '@fitness-duel/shared';
import { useSocketStore } from '../stores/socketStore';
import { useUserStore } from '../stores/userStore';

const { width, height } = Dimensions.get('window');

type MatchPhase = 'waiting' | 'countdown' | 'duel' | 'review' | 'voting' | 'completed';

export default function MatchScreen({ route, navigation }: any) {
  const { matchId, role, opponent, exercise } = route.params;
  const { socket } = useSocketStore();
  const { user } = useUserStore();
  
  const [phase, setPhase] = useState<MatchPhase>('waiting');
  const [countdown, setCountdown] = useState(3);
  const [timeLeft, setTimeLeft] = useState(60);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [votes, setVotes] = useState({ player1: false, player2: false });
  const [myVote, setMyVote] = useState<string | null>(null);
  const [winner, setWinner] = useState<string | null>(null);
  
  const cameraRef = useRef<Camera>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on(SocketEvent.COUNTDOWN_START, () => {
      setPhase('countdown');
      startCountdown();
    });

    socket.on(SocketEvent.DUEL_START, (data) => {
      setPhase('duel');
      setTimeLeft(data.duration);
      startRecording();
      startTimer(data.duration);
    });

    socket.on(SocketEvent.DUEL_END, () => {
      setPhase('review');
      stopRecording();
    });

    socket.on(SocketEvent.VOTE_UPDATE, (data) => {
      setVotes({
        player1: data.player1Voted,
        player2: data.player2Voted
      });
    });

    socket.on(SocketEvent.WINNER_DECLARED, (data) => {
      setWinner(data.winnerId);
      setPhase('completed');
      setTimeout(() => {
        navigation.navigate('Lobby');
      }, 5000);
    });

    return () => {
      socket.off(SocketEvent.COUNTDOWN_START);
      socket.off(SocketEvent.DUEL_START);
      socket.off(SocketEvent.DUEL_END);
      socket.off(SocketEvent.VOTE_UPDATE);
      socket.off(SocketEvent.WINNER_DECLARED);
    };
  }, [socket, navigation]);

  const startCountdown = () => {
    let count = 3;
    setCountdown(count);
    const interval = setInterval(() => {
      count--;
      setCountdown(count);
      if (count === 0) {
        clearInterval(interval);
      }
    }, 1000);
  };

  const startTimer = (duration: number) => {
    let time = duration;
    const interval = setInterval(() => {
      time--;
      setTimeLeft(time);
      if (time === 0) {
        clearInterval(interval);
      }
    }, 1000);
  };

  const startRecording = async () => {
    if (cameraRef.current) {
      try {
        setIsRecording(true);
        const video = await cameraRef.current.recordAsync();
        console.log('Recording saved:', video.uri);
      } catch (error) {
        console.error('Recording error:', error);
      }
    }
  };

  const stopRecording = () => {
    if (cameraRef.current && isRecording) {
      cameraRef.current.stopRecording();
      setIsRecording(false);
    }
  };

  const handleVote = (votedUserId: string) => {
    if (!socket) return;
    
    setMyVote(votedUserId);
    socket.emit(SocketEvent.SELECT_WINNER, {
      matchId,
      winnerId: votedUserId
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (hasPermission === null) {
    return <View style={styles.container}><Text>Requesting camera permission...</Text></View>;
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No access to camera</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Timer Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>{exercise}</Text>
        {phase === 'duel' && (
          <Text style={styles.timer}>{formatTime(timeLeft)}</Text>
        )}
        <Text style={styles.phaseText}>{phase}</Text>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {phase === 'countdown' && (
          <View style={styles.countdownContainer}>
            <Text style={styles.countdownText}>
              {countdown > 0 ? countdown : 'GO! 🔥'}
            </Text>
          </View>
        )}

        {(phase === 'duel' || phase === 'review') && (
          <Camera
            ref={cameraRef}
            style={styles.camera}
            type={CameraType.front}
          >
            <View style={styles.cameraOverlay}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>YOU</Text>
              </View>
              {isRecording && (
                <View style={styles.recordingBadge}>
                  <Text style={styles.recordingText}>● REC</Text>
                </View>
              )}
            </View>
          </Camera>
        )}

        {phase === 'completed' && winner && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultEmoji}>🏆</Text>
            <Text style={styles.resultText}>
              {winner === user?.id ? 'You Won!' : 'Opponent Won!'}
            </Text>
            <Text style={styles.resultSubtext}>Returning to lobby...</Text>
          </View>
        )}
      </View>

      {/* Voting Panel */}
      {phase === 'review' && (
        <View style={styles.votingPanel}>
          <Text style={styles.votingTitle}>Who Won?</Text>
          <Text style={styles.votingSubtitle}>Both players must agree</Text>
          
          <View style={styles.votingButtons}>
            <TouchableOpacity
              style={[
                styles.voteButton,
                myVote === opponent?.userId && styles.voteButtonSelected
              ]}
              onPress={() => handleVote(opponent?.userId || '')}
              disabled={myVote !== null}
            >
              <Text style={styles.voteButtonText}>Opponent Won</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.voteButton,
                myVote === user?.id && styles.voteButtonSelected
              ]}
              onPress={() => handleVote(user?.id || '')}
              disabled={myVote !== null}
            >
              <Text style={styles.voteButtonText}>I Won</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.voteStatus}>
            <Text style={styles.voteStatusText}>
              {votes.player1 ? '✓' : '○'} Player 1 Voted
            </Text>
            <Text style={styles.voteStatusText}>
              {votes.player2 ? '✓' : '○'} Player 2 Voted
            </Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A2E',
  },
  header: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  timer: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  phaseText: {
    color: 'white',
    fontSize: 14,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countdownContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  countdownText: {
    color: 'white',
    fontSize: 120,
    fontWeight: 'bold',
  },
  camera: {
    width: width,
    height: height * 0.7,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    padding: 20,
  },
  badge: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: 'white',
    fontWeight: 'bold',
  },
  recordingBadge: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'red',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  recordingText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  resultContainer: {
    alignItems: 'center',
  },
  resultEmoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  resultText: {
    color: 'white',
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  resultSubtext: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 16,
  },
  votingPanel: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 20,
  },
  votingTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  votingSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    marginBottom: 20,
  },
  votingButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  voteButton: {
    flex: 1,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  voteButtonSelected: {
    backgroundColor: '#95E1D3',
  },
  voteButtonText: {
    color: '#333',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  voteStatus: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  voteStatusText: {
    color: 'white',
    fontSize: 12,
  },
  errorText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
});
