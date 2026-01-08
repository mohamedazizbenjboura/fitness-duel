import { Server as SocketServer, Socket } from 'socket.io';
import { SocketEvent, ExerciseType, MatchStatus } from '@fitness-duel/shared';
import { queueManager } from '../services/QueueManager';
import { matchManager } from '../services/MatchManager';
import { v4 as uuidv4 } from 'uuid';

export function initializeSocketHandlers(io: SocketServer) {
  io.on('connection', (socket: Socket) => {
    console.log(`✅ Client connected: ${socket.id}`);
    
    // Store user data in socket
    let userData: { userId?: string; username?: string } = {};
    
    // User identification
    socket.on('identify', (data: { userId: string; username: string }) => {
      userData = data;
      console.log(`👤 User identified: ${data.username} (${data.userId})`);
    });
    
    // Join matchmaking queue
    socket.on(SocketEvent.JOIN_QUEUE, (data: { userId: string; username: string; exerciseType: ExerciseType; avatar?: string }) => {
      try {
        console.log(`🎯 ${data.username} joining queue for ${data.exerciseType}`);
        
        queueManager.addToQueue({
          userId: data.userId,
          socketId: socket.id,
          username: data.username,
          avatar: data.avatar,
          exerciseType: data.exerciseType,
          joinedAt: new Date()
        });
        
        // Try to find a match
        const match = queueManager.tryMatch(data.exerciseType);
        
        if (match) {
          console.log(`🎉 Match found! ${match.player1.username} vs ${match.player2.username}`);
          
          // Create match in match manager
          matchManager.createMatch(match);
          
          // Notify both players
          io.to(match.player1.socketId).emit(SocketEvent.MATCH_FOUND, {
            matchId: match.id,
            opponent: {
              userId: match.player2.userId,
              username: match.player2.username,
              avatar: match.player2.avatar
            },
            exercise: match.exerciseType,
            yourRole: 'player1'
          });
          
          io.to(match.player2.socketId).emit(SocketEvent.MATCH_FOUND, {
            matchId: match.id,
            opponent: {
              userId: match.player1.userId,
              username: match.player1.username,
              avatar: match.player1.avatar
            },
            exercise: match.exerciseType,
            yourRole: 'player2'
          });
          
          // Start countdown after 2 seconds
          setTimeout(() => {
            io.to(match.player1.socketId).to(match.player2.socketId).emit(SocketEvent.COUNTDOWN_START, {
              matchId: match.id
            });
            
            matchManager.updateMatchStatus(match.id, MatchStatus.COUNTDOWN);
            
            // Start duel after countdown (3 seconds)
            setTimeout(() => {
              const currentMatch = matchManager.getMatch(match.id);
              if (currentMatch) {
                io.to(match.player1.socketId).to(match.player2.socketId).emit(SocketEvent.DUEL_START, {
                  matchId: match.id,
                  duration: currentMatch.duration
                });
                
                matchManager.updateMatchStatus(match.id, MatchStatus.IN_PROGRESS);
                
                // End duel after duration
                setTimeout(() => {
                  const finalMatch = matchManager.getMatch(match.id);
                  if (finalMatch) {
                    io.to(match.player1.socketId).to(match.player2.socketId).emit(SocketEvent.DUEL_END, {
                      matchId: match.id
                    });
                    
                    matchManager.updateMatchStatus(match.id, MatchStatus.REVIEW);
                  }
                }, currentMatch.duration * 1000);
              }
            }, 3000);
          }, 2000);
        } else {
          // Send queue status
          socket.emit(SocketEvent.QUEUE_STATUS, {
            position: queueManager.getQueuePosition(socket.id, data.exerciseType),
            waiting: true
          });
        }
      } catch (error: any) {
        console.error('Error joining queue:', error);
        socket.emit(SocketEvent.ERROR, { message: error.message });
      }
    });
    
    // Leave queue
    socket.on(SocketEvent.LEAVE_QUEUE, () => {
      queueManager.removeFromQueue(socket.id);
      console.log(`👋 Client left queue: ${socket.id}`);
    });
    
    // Select winner
    socket.on(SocketEvent.SELECT_WINNER, (data: { matchId: string; winnerId: string }) => {
      try {
        const match = matchManager.getMatch(data.matchId);
        if (!match) throw new Error('Match not found');
        
        // Update vote
        if (match.player1.socketId === socket.id) {
          match.player1.vote = data.winnerId;
        } else if (match.player2.socketId === socket.id) {
          match.player2.vote = data.winnerId;
        }
        
        // Notify both players of vote update
        io.to(match.player1.socketId).to(match.player2.socketId).emit(SocketEvent.VOTE_UPDATE, {
          matchId: data.matchId,
          player1Voted: !!match.player1.vote,
          player2Voted: !!match.player2.vote
        });
        
        // Check for mutual agreement
        if (match.player1.vote && match.player2.vote) {
          if (match.player1.vote === match.player2.vote) {
            // Winner declared!
            match.winner = match.player1.vote;
            matchManager.updateMatchStatus(data.matchId, MatchStatus.COMPLETED);
            
            io.to(match.player1.socketId).to(match.player2.socketId).emit(SocketEvent.WINNER_DECLARED, {
              matchId: data.matchId,
              winnerId: match.winner,
              winnerName: match.winner === match.player1.userId ? match.player1.username : match.player2.username
            });
            
            console.log(`🏆 Winner declared: ${match.winner === match.player1.userId ? match.player1.username : match.player2.username}`);
          } else {
            // Votes don't match - notify players
            io.to(match.player1.socketId).to(match.player2.socketId).emit(SocketEvent.ERROR, {
              message: 'No mutual agreement. Both players must agree on the winner.'
            });
          }
        }
      } catch (error: any) {
        socket.emit(SocketEvent.ERROR, { message: error.message });
      }
    });
    
    // WebRTC signaling - Video
    socket.on(SocketEvent.WEBRTC_OFFER, (data: { matchId: string; offer: any }) => {
      const match = matchManager.getMatch(data.matchId);
      if (match) {
        const targetSocket = match.player1.socketId === socket.id ? match.player2.socketId : match.player1.socketId;
        io.to(targetSocket).emit(SocketEvent.WEBRTC_OFFER, {
          offer: data.offer,
          from: socket.id
        });
      }
    });
    
    socket.on(SocketEvent.WEBRTC_ANSWER, (data: { matchId: string; answer: any }) => {
      const match = matchManager.getMatch(data.matchId);
      if (match) {
        const targetSocket = match.player1.socketId === socket.id ? match.player2.socketId : match.player1.socketId;
        io.to(targetSocket).emit(SocketEvent.WEBRTC_ANSWER, {
          answer: data.answer,
          from: socket.id
        });
      }
    });
    
    socket.on(SocketEvent.WEBRTC_ICE_CANDIDATE, (data: { matchId: string; candidate: any }) => {
      const match = matchManager.getMatch(data.matchId);
      if (match) {
        const targetSocket = match.player1.socketId === socket.id ? match.player2.socketId : match.player1.socketId;
        io.to(targetSocket).emit(SocketEvent.WEBRTC_ICE_CANDIDATE, {
          candidate: data.candidate,
          from: socket.id
        });
      }
    });
    
    // WebRTC signaling - Voice (separate peer connection)
    socket.on(SocketEvent.VOICE_OFFER, (data: { matchId: string; offer: any }) => {
      const match = matchManager.getMatch(data.matchId);
      if (match) {
        const targetSocket = match.player1.socketId === socket.id ? match.player2.socketId : match.player1.socketId;
        io.to(targetSocket).emit(SocketEvent.VOICE_OFFER, {
          offer: data.offer,
          from: socket.id
        });
      }
    });
    
    socket.on(SocketEvent.VOICE_ANSWER, (data: { matchId: string; answer: any }) => {
      const match = matchManager.getMatch(data.matchId);
      if (match) {
        const targetSocket = match.player1.socketId === socket.id ? match.player2.socketId : match.player1.socketId;
        io.to(targetSocket).emit(SocketEvent.VOICE_ANSWER, {
          answer: data.answer,
          from: socket.id
        });
      }
    });
    
    socket.on(SocketEvent.VOICE_ICE_CANDIDATE, (data: { matchId: string; candidate: any }) => {
      const match = matchManager.getMatch(data.matchId);
      if (match) {
        const targetSocket = match.player1.socketId === socket.id ? match.player2.socketId : match.player1.socketId;
        io.to(targetSocket).emit(SocketEvent.VOICE_ICE_CANDIDATE, {
          candidate: data.candidate,
          from: socket.id
        });
      }
    });
    
    // Disconnect
    socket.on('disconnect', () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
      queueManager.removeFromQueue(socket.id);
      // TODO: Handle match disconnection
    });
  });
}
