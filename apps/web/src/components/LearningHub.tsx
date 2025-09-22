import React from 'react';

const modules = [
  {
    title: 'Advanced Boolean',
    description:
      'Go beyond AND, OR, NOT. Master X-ray searching, semantic search, and more.',
    link: '#'
  },
  {
    title: 'Candidate Engagement',
    description:
      'Learn to craft outreach messages that get replies and build talent pipelines.',
    link: '#'
  },
  {
    title: 'Decoding Job Descriptions',
    description:
      'Use AI to extract key skills and build the perfect candidate persona.',
    link: '#'
  },
  {
    title: 'Sourcing on GitHub',
    description:
      'Find top developers by analyzing their code, contributions, and activity.',
    link: '#'
  }
];

const LearningHub: React.FC = () => (
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
    {modules.map(module => (
      <div
        key={module.title}
        className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-cyan-500/20 hover:-translate-y-1 transition-all duration-300"
      >
        <h3 className="font-bold text-xl mb-2 text-white">{module.title}</h3>
        <p className="text-gray-400 mb-4">{module.description}</p>
        <a href={module.link} className="text-cyan-400 font-semibold">
          Start Module &rarr;
        </a>
      </div>
    ))}
  </div>
);

export default LearningHub;
