import React from 'react';
import { Game } from '../types';

interface GameListProps {
  games: Game[];
  selectedGameId: string | null;
  onSelect: (id: string) => void;
}

const GameList: React.FC<GameListProps> = ({ games, selectedGameId, onSelect }) => {
  if (games.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-8 shadow-xl">
        <p className="text-gray-300">New games are coming soon. Stay tuned!</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {games.map(game => {
        const isActive = game.id === selectedGameId;
        return (
          <button
            key={game.id}
            onClick={() => onSelect(game.id)}
            className={`text-left bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 border ${
              isActive ? 'border-cyan-400 ring-2 ring-cyan-500/50' : 'border-gray-700'
            }`}
            type="button"
          >
            <h3 className="text-xl font-bold text-white mb-2">{game.title}</h3>
            <p className="text-gray-400 mb-3">{game.objective}</p>
            <div className="text-gray-500 text-sm">
              Focus Areas:
              <ul className="list-disc list-inside mt-1 space-y-1">
                {game.focus.map(item => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            {isActive && (
              <p className="mt-4 text-cyan-400 font-semibold">Selected</p>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default GameList;
