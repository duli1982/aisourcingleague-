import React, { FormEvent, useState } from 'react';
import { submitGame } from '../api/client';
import { usePlayerStore } from '../store/playerStore';
import { Game } from '../types';
import FeedbackPanel from './FeedbackPanel';

interface GamePlayProps {
  game: Game | null;
}

const GamePlay: React.FC<GamePlayProps> = ({ game }) => {
  const { player, updateScore } = usePlayerStore();
  const [submission, setSubmission] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [panelVisible, setPanelVisible] = useState(false);

  if (!player) {
    return (
      <div className="bg-gray-800 rounded-lg p-8 shadow-xl">
        <p className="text-gray-300">
          Enter your name to join the league before attempting a challenge.
        </p>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="bg-gray-800 rounded-lg p-8 shadow-xl">
        <p className="text-gray-300">
          Select a game from the list to see its brief and submit your strategy.
        </p>
      </div>
    );
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const trimmed = submission.trim();
    if (!trimmed) {
      return;
    }

    setPanelVisible(true);
    setLoading(true);
    setError(null);

    try {
      const result = await submitGame(game.id, trimmed);
      setFeedback(result.feedback);
      setScore(result.score);
      if (result.score > 0) {
        updateScore(result.score);
      }
    } catch (err) {
      console.error(err);
      setFeedback(null);
      setScore(null);
      setError('Sorry, there was an error getting feedback. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-8 shadow-xl">
      <h3 className="text-3xl font-bold text-cyan-400 mb-4">{game.title}</h3>
      <p className="text-gray-300 mb-4">{game.scenario}</p>
      <p className="text-gray-200 font-semibold mb-6">{game.objective}</p>
      <div className="mb-6">
        <h4 className="text-lg text-cyan-300 font-semibold mb-2">Focus on:</h4>
        <ul className="list-disc list-inside text-gray-300 space-y-1">
          {game.focus.map(item => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      <form onSubmit={handleSubmit}>
        <textarea
          value={submission}
          onChange={event => setSubmission(event.target.value)}
          rows={4}
          className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          placeholder="e.g., (engineer OR developer) AND ..."
        />
        <button
          type="submit"
          disabled={loading}
          className="mt-4 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-md transition duration-300"
        >
          {loading ? 'Getting Feedback...' : 'Submit & Get Feedback'}
        </button>
      </form>
      <FeedbackPanel
        visible={panelVisible}
        loading={loading}
        feedback={feedback}
        score={score}
        totalScore={player?.score ?? 0}
        error={error}
      />
    </div>
  );
};

export default GamePlay;
