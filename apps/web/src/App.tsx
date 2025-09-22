import React, { useEffect, useMemo, useState } from 'react';
import Header from './components/Header';
import NameModal from './components/NameModal';
import GameList from './components/GameList';
import GamePlay from './components/GamePlay';
import CoachChat from './components/CoachChat';
import Leaderboard from './components/Leaderboard';
import LearningHub from './components/LearningHub';
import { PlayerProvider, usePlayerStore } from './store/playerStore';
import { Game, Page } from './types';

const App: React.FC = () => (
  <PlayerProvider>
    <AppShell />
  </PlayerProvider>
);

const AppShell: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>('home');
  const [showModal, setShowModal] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  const { player, registerPlayer } = usePlayerStore();

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

  useEffect(() => {
    if (player) {
      setShowModal(false);
    }
  }, [player]);

  const selectedGame = useMemo(
    () => games.find(game => game.id === selectedGameId) ?? null,
    [games, selectedGameId]
  );

  const handleNameSubmit = (name: string) => {
    registerPlayer(name);
    setShowModal(false);
    setActivePage('home');
  };

  const handleNavigate = (page: Page) => {
    setActivePage(page);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <NameModal visible={showModal} onSubmit={handleNameSubmit} />
      <div className={showModal ? 'hidden' : ''}>
        <Header
          activePage={activePage}
          onNavigate={handleNavigate}
          mobileMenuOpen={mobileMenuOpen}
          onToggleMobileMenu={() => setMobileMenuOpen(prev => !prev)}
        />
        <main className="container mx-auto p-6 space-y-10">
          {activePage === 'home' && (
            <section className="bg-gray-800 rounded-lg p-8 shadow-xl">
              <h2 className="text-3xl font-bold text-cyan-400 mb-4">
                Welcome{player ? `, ${player.name}` : ''}!
              </h2>
              <p className="text-gray-300 mb-6">
                You are now part of a global competition for top tech recruiters. Compete in sourcing games, learn from our AI
                Coach, and climb the leaderboard to prove you're the best.
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gray-700 p-6 rounded-lg">
                  <h3 className="font-bold text-xl mb-2 text-white">Compete &amp; Win</h3>
                  <p className="text-gray-400">
                    Tackle real-world sourcing challenges and earn points for your precision and creativity.
                  </p>
                </div>
                <div className="bg-gray-700 p-6 rounded-lg">
                  <h3 className="font-bold text-xl mb-2 text-white">Learn with AI</h3>
                  <p className="text-gray-400">
                    Get personalized feedback and strategies from your dedicated AI Coach, powered by Gemini.
                  </p>
                </div>
                <div className="bg-gray-700 p-6 rounded-lg">
                  <h3 className="font-bold text-xl mb-2 text-white">Climb the Ranks</h3>
                  <p className="text-gray-400">
                    See how you stack up against your peers on a live, global leaderboard.
                  </p>
                </div>
              </div>
              <button
                className="mt-8 bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-6 rounded-md transition duration-300"
                onClick={() => handleNavigate('games')}
                type="button"
              >
                Go to The Games
              </button>
            </section>
          )}

          {activePage === 'games' && (
            <section className="space-y-6">
              <h2 className="text-3xl font-bold text-cyan-400">The Games</h2>
              <GameList
                games={games}
                selectedGameId={selectedGameId}
                onSelect={setSelectedGameId}
              />
              <GamePlay game={selectedGame} />
            </section>
          )}

          {activePage === 'coach' && (
            <section>
              <h2 className="text-3xl font-bold text-cyan-400 mb-6">AI Sourcing Coach</h2>
              <CoachChat />
            </section>
          )}

          {activePage === 'leaderboard' && (
            <section>
              <h2 className="text-3xl font-bold text-cyan-400 mb-6">Leaderboard</h2>
              <Leaderboard />
            </section>
          )}

          {activePage === 'learning' && (
            <section>
              <h2 className="text-3xl font-bold text-cyan-400 mb-6">Learning Hub</h2>
              <LearningHub />
            </section>
          )}
        </main>
      </div>
    </>
  );
};

export default App;
