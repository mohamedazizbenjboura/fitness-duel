'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { SocketEvent, WEBRTC_CONFIG, MatchStatus } from '@fitness-duel/shared';
import { useSocketStore } from '@/stores/socketStore';
import { useUserStore } from '@/stores/userStore';

type MatchPhase = 'waiting' | 'countdown' | 'duel' | 'review' | 'voting' | 'completed';

export default function MatchPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const matchId = params.matchId as string;
  const role = searchParams.get('role');
  
  const { socket } = useSocketStore();
  const { user } = useUserStore();
  
  const [phase, setPhase] = useState<MatchPhase>('waiting');
  const [countdown, setCountdown] = useState(3);
  const [timeLeft, setTimeLeft] = useState(60);
  const [opponent, setOpponent] = useState<any>(null);
  const [votes, setVotes] = useState({ player1: false, player2: false });
  const [myVote, setMyVote] = useState<string | null>(null);
  const [winner, setWinner] = useState<string | null>(null);
  
  // Video refs
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (!socket || !user) return;

    // Setup WebRTC
    setupWebRTC();

    // Socket listeners
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
        router.push('/lobby');
      }, 5000);
    });

    // WebRTC signaling
    socket.on(SocketEvent.WEBRTC_OFFER, async (data) => {
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.offer));
        const answer = await peerConnectionRef.current.createAnswer();
        await peerConnectionRef.current.setLocalDescription(answer);
        socket.emit(SocketEvent.WEBRTC_ANSWER, { matchId, answer });
      }
    });

    socket.on(SocketEvent.WEBRTC_ANSWER, async (data) => {
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.answer));
      }
    });

    socket.on(SocketEvent.WEBRTC_ICE_CANDIDATE, async (data) => {
      if (peerConnectionRef.current && data.candidate) {
        await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
      }
    });

    return () => {
      socket.off(SocketEvent.COUNTDOWN_START);
      socket.off(SocketEvent.DUEL_START);
      socket.off(SocketEvent.DUEL_END);
      socket.off(SocketEvent.VOTE_UPDATE);
      socket.off(SocketEvent.WINNER_DECLARED);
      socket.off(SocketEvent.WEBRTC_OFFER);
      socket.off(SocketEvent.WEBRTC_ANSWER);
      socket.off(SocketEvent.WEBRTC_ICE_CANDIDATE);
      
      cleanupWebRTC();
    };
  }, [socket, user, matchId, router]);

  const setupWebRTC = async () => {
    try {
      // Get local stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 1280, height: 720 },
        audio: true
      });
      
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Create peer connection
      const peerConnection = new RTCPeerConnection(WEBRTC_CONFIG);
      peerConnectionRef.current = peerConnection;

      // Add local tracks
      stream.getTracks().forEach(track => {
        peerConnection.addTrack(track, stream);
      });

      // Handle remote stream
      peerConnection.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      // Handle ICE candidates
      peerConnection.onicecandidate = (event) => {
        if (event.candidate && socket) {
          socket.emit(SocketEvent.WEBRTC_ICE_CANDIDATE, {
            matchId,
            candidate: event.candidate
          });
        }
      };

      // If player1, create offer
      if (role === 'player1' && socket) {
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        socket.emit(SocketEvent.WEBRTC_OFFER, { matchId, offer });
      }
    } catch (error) {
      console.error('Error setting up WebRTC:', error);
      alert('Failed to access camera/microphone');
    }
  };

  const cleanupWebRTC = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }
  };

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

  const startRecording = () => {
    if (!localStreamRef.current) return;

    try {
      const mediaRecorder = new MediaRecorder(localStreamRef.current, {
        mimeType: 'video/webm;codecs=vp9'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      recordedChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start();
      console.log('🎥 Recording started');
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      console.log('🎥 Recording stopped');
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

  return (
    <div className="min-h-screen bg-dark flex flex-col">
      {/* Header */}
      <div className="bg-black/50 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="text-white font-bold">Match ID: {matchId}</div>
          <div className="text-white font-bold text-2xl">
            {phase === 'duel' && formatTime(timeLeft)}
          </div>
          <div className="text-white">Phase: {phase}</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        {phase === 'countdown' && (
          <div className="text-center">
            <div className="text-white text-9xl font-bold countdown-animation">
              {countdown > 0 ? countdown : 'GO! 🔥'}
            </div>
          </div>
        )}

        {(phase === 'duel' || phase === 'review' || phase === 'voting') && (
          <div className="max-w-6xl w-full grid md:grid-cols-2 gap-4">
            {/* Remote Video (Opponent) */}
            <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-black/70 px-4 py-2 rounded-lg">
                <div className="text-white font-bold">Opponent</div>
              </div>
              {votes.player2 && (
                <div className="absolute top-4 right-4 bg-success px-4 py-2 rounded-lg">
                  <div className="text-white font-bold">✓ Voted</div>
                </div>
              )}
            </div>

            {/* Local Video (You) */}
            <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover scale-x-[-1]"
              />
              <div className="absolute top-4 left-4 bg-primary/70 px-4 py-2 rounded-lg">
                <div className="text-white font-bold">You</div>
              </div>
              {votes.player1 && (
                <div className="absolute top-4 right-4 bg-success px-4 py-2 rounded-lg">
                  <div className="text-white font-bold">✓ Voted</div>
                </div>
              )}
            </div>
          </div>
        )}

        {phase === 'completed' && winner && (
          <div className="text-center">
            <div className="text-6xl mb-4">🏆</div>
            <div className="text-white text-4xl font-bold mb-4">
              {winner === user?.id ? 'You Won!' : 'Opponent Won!'}
            </div>
            <div className="text-white/70">Returning to lobby...</div>
          </div>
        )}
      </div>

      {/* Voting Panel */}
      {phase === 'review' && (
        <div className="bg-black/70 p-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-6">
              <h2 className="text-white text-2xl font-bold mb-2">Who Won?</h2>
              <p className="text-white/70">Both players must agree on the winner</p>
            </div>
            
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => handleVote(opponent?.userId || '')}
                disabled={myVote !== null}
                className={`px-8 py-4 rounded-lg font-bold text-lg transition-all ${
                  myVote === opponent?.userId
                    ? 'bg-success text-white'
                    : 'bg-white text-dark hover:bg-gray-200'
                } disabled:opacity-50`}
              >
                Opponent Won
              </button>
              
              <button
                onClick={() => handleVote(user?.id || '')}
                disabled={myVote !== null}
                className={`px-8 py-4 rounded-lg font-bold text-lg transition-all ${
                  myVote === user?.id
                    ? 'bg-success text-white'
                    : 'bg-white text-dark hover:bg-gray-200'
                } disabled:opacity-50`}
              >
                I Won
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
