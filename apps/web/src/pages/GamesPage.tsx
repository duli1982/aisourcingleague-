import React, { useEffect, useMemo, useState } from 'react';
import GameList from '../components/GameList';
import GamePlay from '../components/GamePlay';
import { Game } from '../types';

const GamesPage: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);

  useEffect(() => {
    const loadGames = async () => {
      try {
        const response = await fetch('/data/games.json');
        const data: Game[] = await response.json();
        setGames(data);
        if (data.length > 0) {
          setSelectedGameId(data[0].id);
        }
      } catch (error) {
        console.error('Failed to load games configuration', error);
      }
    };

    loadGames();
  }, []);

  const selectedGame = useMemo(() => games.find(game => game.id === selectedGameId) ?? null, [games, selectedGameId]);

  return (
    <section className="space-y-6">
      <h2 className="text-3xl font-bold text-cyan-400">The Games</h2>
      <GameList games={games} selectedGameId={selectedGameId} onSelect={setSelectedGameId} />
      <GamePlay game={selectedGame} />
    </section>
  );
};

export default GamesPage;
