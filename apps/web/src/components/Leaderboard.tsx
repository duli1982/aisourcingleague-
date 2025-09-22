import React from 'react';
import { usePlayerStore } from '../store/playerStore';

const Leaderboard: React.FC = () => {
  const { leaderboard, player } = usePlayerStore();

  return (
    <div className="bg-gray-800 rounded-lg p-8 shadow-xl">
      <table className="w-full text-left">
        <thead className="border-b-2 border-gray-600">
          <tr>
            <th className="p-3 text-lg">Rank</th>
            <th className="p-3 text-lg">Name</th>
            <th className="p-3 text-lg">Score</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((entry, index) => {
            const isCurrent = player && entry.name === player.name;
            return (
              <tr
                key={entry.name}
                className={
                  isCurrent
                    ? 'bg-cyan-900/50 font-bold'
                    : 'border-b border-gray-700 hover:bg-gray-700/50'
                }
              >
                <td className="p-3">{index + 1}</td>
                <td className="p-3">
                  {entry.name} {isCurrent ? '(You)' : ''}
                </td>
                <td className="p-3">{entry.score}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
