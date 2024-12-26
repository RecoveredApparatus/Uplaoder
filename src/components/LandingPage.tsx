import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export default function LandingPage() {
  const [topic, setTopic] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!topic.trim()) {
      setError('Please enter a topic');
      return;
    }

    setIsLoading(true);
    try {
      localStorage.setItem('quiz_topic', topic);
      navigate('/quiz');
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <Sparkles className="w-8 h-8 text-purple-500 mr-2" />
          <h1 className="text-3xl font-bold text-gray-800">AI Quiz Master</h1>
        </div>

        <form onSubmit={handleStart} className="space-y-6">
          <div>
            <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">
              Quiz Topic
            </label>
            <input
              type="text"
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="e.g., Mathematics, History, Science"
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 bg-purple-600 text-white rounded-lg font-medium 
              ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-700'} 
              transition duration-200`}
          >
            {isLoading ? 'Starting...' : 'Start Quiz'}
          </button>
        </form>
      </div>
    </div>
  );
}