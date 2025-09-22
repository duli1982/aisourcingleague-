import React, {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState
} from 'react';

export interface Player {
  name: string;
  score: number;
}

interface PlayerContextValue {
  player: Player | null;
  leaderboard: Player[];
  registerPlayer: (name: string) => void;
  updateScore: (delta: number) => void;
}

const defaultLeaderboard: Player[] = [
  { name: 'Alex Johnson', score: 150 },
  { name: 'Maria Garcia', score: 135 },
  { name: 'Chen Wei', score: 110 },
  { name: 'Fatima Al-Sayed', score: 95 },
  { name: 'John Smith', score: 80 }
];

const PlayerContext = createContext<PlayerContextValue | undefined>(undefined);

export const PlayerProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [player, setPlayer] = useState<Player | null>(null);
  const [leaderboard, setLeaderboard] = useState<Player[]>(defaultLeaderboard);

  const registerPlayer = useCallback((name: string) => {
    const normalized = name.trim();
    if (!normalized) {
      return;
    }

    setLeaderboard(prev => {
      const existing = prev.find(
        entry => entry.name.toLowerCase() === normalized.toLowerCase()
      );

      if (existing) {
        setPlayer({ ...existing });
        return prev;
      }

      const newEntry: Player = { name: normalized, score: 0 };
      setPlayer(newEntry);
      return [...prev, newEntry];
    });
  }, []);

  const updateScore = useCallback(
    (delta: number) => {
      setLeaderboard(prev =>
        prev.map(entry => {
          if (player && entry.name === player.name) {
            const nextScore = Math.max(0, entry.score + delta);
            return { ...entry, score: nextScore };
          }
          return entry;
        })
      );

      setPlayer(prev => {
        if (!prev) {
          return prev;
        }
        const nextScore = Math.max(0, prev.score + delta);
        return { ...prev, score: nextScore };
      });
    },
    [player]
  );

  const sortedLeaderboard = useMemo(
    () => [...leaderboard].sort((a, b) => b.score - a.score),
    [leaderboard]
  );

  const value = useMemo(
    () => ({
      player,
      leaderboard: sortedLeaderboard,
      registerPlayer,
      updateScore
    }),
    [player, sortedLeaderboard, registerPlayer, updateScore]
  );

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
};

export const usePlayerStore = (): PlayerContextValue => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayerStore must be used within a PlayerProvider');
  }
  return context;
};
