import React from 'react';
import { markdownToHtml } from '../utils/markdown';

interface FeedbackPanelProps {
  visible: boolean;
  loading: boolean;
  feedback: string | null;
  score: number | null;
  totalScore: number;
  error: string | null;
}

const FeedbackPanel: React.FC<FeedbackPanelProps> = ({
  visible,
  loading,
  feedback,
  score,
  totalScore,
  error
}) => {
  if (!visible) {
    return null;
  }

  return (
    <div className="mt-6 bg-gray-800 p-6 rounded-lg shadow-lg">
      <div className="flex items-center mb-4">
        <h4 className="text-2xl font-bold text-cyan-400">AI Coach Feedback</h4>
        {loading && (
          <div className="ml-4 h-6 w-6 border-4 border-gray-600 border-t-cyan-500 rounded-full animate-spin" />
        )}
      </div>
      {error && <p className="text-red-400">{error}</p>}
      {!loading && !error && score !== null && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-white">
            Your Score for this submission:
            <span className="text-cyan-400"> {score}/100</span>
          </h3>
          <p className="text-gray-300">Your total score is now {totalScore}.</p>
        </div>
      )}
      {!loading && !error && feedback && (
        <div
          className="prose prose-invert max-w-none text-gray-300"
          dangerouslySetInnerHTML={{ __html: markdownToHtml(feedback) }}
        />
      )}
    </div>
  );
};

export default FeedbackPanel;
