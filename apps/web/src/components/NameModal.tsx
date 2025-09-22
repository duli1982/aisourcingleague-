import React, { FormEvent, useState } from 'react';

interface NameModalProps {
  visible: boolean;
  onSubmit: (name: string) => void;
}

const NameModal: React.FC<NameModalProps> = ({ visible, onSubmit }) => {
  const [name, setName] = useState('');

  if (!visible) {
    return null;
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = name.trim();
    if (trimmed.length === 0) {
      return;
    }
    onSubmit(trimmed);
    setName('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-cyan-400">
          Welcome to the AI Sourcing League!
        </h2>
        <p className="text-gray-300 mb-6">
          Please enter your name to join the competition.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={event => setName(event.target.value)}
            placeholder="Your Name"
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            required
          />
          <button
            type="submit"
            className="w-full mt-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-md transition duration-300"
          >
            Start Sourcing!
          </button>
        </form>
      </div>
    </div>
  );
};

export default NameModal;
