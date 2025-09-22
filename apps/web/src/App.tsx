import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import NameModal from './components/NameModal';
import CoachChat from './components/CoachChat';
import Leaderboard from './components/Leaderboard';
import LearningHub from './components/LearningHub';
import { PlayerProvider, usePlayerStore } from './store/playerStore';
import { Page } from './types';
import HomePage from './pages/HomePage';
import GamesPage from './pages/GamesPage';

const App: React.FC = () => (
  <PlayerProvider>
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  </PlayerProvider>
);

const AppShell: React.FC = () => {
  const [showModal, setShowModal] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { player, registerPlayer } = usePlayerStore();

  useEffect(() => {
    if (player) {
      setShowModal(false);
    }
  }, [player]);

  const handleNameSubmit = (name: string) => {
    registerPlayer(name);
    setShowModal(false);
  };

  const handleNavigate = (_page: Page) => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <NameModal visible={showModal} onSubmit={handleNameSubmit} />
      <div className={showModal ? 'hidden' : ''}>
        <Header
          onNavigate={handleNavigate}
          mobileMenuOpen={mobileMenuOpen}
          onToggleMobileMenu={() => setMobileMenuOpen(prev => !prev)}
        />
        <main className="container mx-auto p-6 space-y-10">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/games" element={<GamesPage />} />
            <Route
              path="/coach"
              element={
                <section>
                  <h2 className="text-3xl font-bold text-cyan-400 mb-6">AI Sourcing Coach</h2>
                  <CoachChat />
                </section>
              }
            />
            <Route
              path="/leaderboard"
              element={
                <section>
                  <h2 className="text-3xl font-bold text-cyan-400 mb-6">Leaderboard</h2>
                  <Leaderboard />
                </section>
              }
            />
            <Route
              path="/learning"
              element={
                <section>
                  <h2 className="text-3xl font-bold text-cyan-400 mb-6">Learning Hub</h2>
                  <LearningHub />
                </section>
              }
            />
          </Routes>
        </main>
      </div>
    </>
  );
};

export default App;
