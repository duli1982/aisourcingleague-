import React, { useState, useEffect } from 'react';
import { getGreeting } from '../api/greeting';

const Greeting: React.FC = () => {
  const [greeting, setGreeting] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGreeting = async () => {
      try {
        const { message } = await getGreeting();
        setGreeting(message);
      } catch (err) {
        setError('Failed to fetch greeting.');
      } finally {
        setLoading(false);
      }
    };

    fetchGreeting();
  }, []);

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="text-center p-4 bg-gray-700 rounded-lg shadow-md">
      <p className="text-lg text-white">{greeting}</p>
    </div>
  );
};

export default Greeting;
