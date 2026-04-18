import { useState, useEffect, useRef, useCallback } from 'react';
import { getLiveScore, initMatchSocket, joinMatchRoom, leaveMatchRoom, onLiveScoreUpdate, onTurnUpdate } from '../Services/matchService';

export const useLiveScore = (matchId) => {
  const [liveData, setLiveData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const socketRef = useRef(null);

  const token = localStorage.getItem('token');

  const fetchLiveScore = useCallback(async () => {
    if (!matchId) return;
    try {
      setLoading(true);
      const data = await getLiveScore(matchId);
      setLiveData(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load live score');
      console.error('Live score fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [matchId]);

  useEffect(() => {
    if (!matchId || !token) {
      setLoading(false);
      return;
    }

    // Initial fetch
    fetchLiveScore();

    // Socket setup
    socketRef.current = initMatchSocket(token);
    joinMatchRoom(matchId);

    const handleLiveUpdate = (data) => {
      console.log('Socket live update:', data);
      setLiveData((prev) => ({ ...prev, ...data }));
    };

    const handleTurnUpdate = (data) => {
      console.log('Socket turn update:', data);
      setLiveData((prev) => ({
        ...prev,
        scorecard: {
          ...prev?.scorecard,
          currentStriker: data.currentStriker,
          currentNonStriker: data.currentNonStriker,
          currentBowler: data.currentBowler
        }
      }));
    };

    onLiveScoreUpdate(handleLiveUpdate);
    onTurnUpdate(handleTurnUpdate);

    // Polling backup
    const interval = setInterval(fetchLiveScore, 3000);

    return () => {
      clearInterval(interval);
      if (socketRef.current) {
        leaveMatchRoom(matchId);
        socketRef.current.disconnect();
      }
    };
  }, [matchId, token, fetchLiveScore]);

  return { liveData, loading, error, refetch: fetchLiveScore };
};

