import React from 'react';
import { Page } from '../types';

interface HeaderProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
  mobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
}

const navItems: { label: string; page: Page }[] = [
  { label: 'Home', page: 'home' },
  { label: 'The Games', page: 'games' },
  { label: 'AI Coach', page: 'coach' },
  { label: 'Leaderboard', page: 'leaderboard' },
  { label: 'Learning Hub', page: 'learning' }
];

const Header: React.FC<HeaderProps> = ({
  activePage,
  onNavigate,
  mobileMenuOpen,
  onToggleMobileMenu
}) => {
  const renderNavLink = ({ label, page }: { label: string; page: Page }) => (
    <button
      key={page}
      className={`nav-link text-sm md:text-base px-3 py-2 rounded-md transition-colors duration-200 ${
        activePage === page
          ? 'text-white bg-cyan-600 md:bg-transparent md:text-cyan-400'
          : 'text-gray-300 hover:text-white'
      }`}
      onClick={() => onNavigate(page)}
      type="button"
    >
      {label}
    </button>
  );

  return (
    <header className="bg-gray-800 shadow-lg sticky top-0 z-40">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">AI Sourcing League</h1>
          <p className="text-sm text-cyan-400">Powered by Randstad &amp; Gemini</p>
        </div>
        <div className="hidden md:flex space-x-2">{navItems.map(renderNavLink)}</div>
        <div className="md:hidden">
          <button
            onClick={onToggleMobileMenu}
            className="text-white focus:outline-none"
            type="button"
            aria-label="Toggle navigation menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            </svg>
          </button>
        </div>
      </nav>
      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-800 border-t border-gray-700">
          <div className="flex flex-col px-4 py-2 space-y-1">
            {navItems.map(item => (
              <button
                key={item.page}
                onClick={() => onNavigate(item.page)}
                className={`text-left py-2 px-2 rounded-md ${
                  activePage === item.page
                    ? 'bg-cyan-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
                type="button"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
