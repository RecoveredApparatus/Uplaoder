import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, ArrowRight } from 'lucide-react';
import { useQuiz } from '../hooks/useQuiz';

export default function QuizPage() {
  const [currentAnswer, setCurrentAnswer] = useState('');
  const navigate = useNavigate();
  const { currentQuestion, isLoading, error, loadNextQuestion, submitAnswer } = useQuiz();

  useEffect(() => {
    const topic = localStorage.getItem('quiz_topic');
    if (!topic) {
      navigate('/');
      return;
    }

    // Load initial question
    loadNextQuestion(topic);
  }, [loadNextQuestion, navigate]);

  const handleSubmitAnswer = async () => {
    if (!currentAnswer.trim() || !currentQuestion) return;

    const topic = localStorage.getItem('quiz_topic');
    if (!topic) return;

    await submitAnswer(currentQuestion.id, currentAnswer, topic);
    setCurrentAnswer('');
  };

  const handleNextQuestion = async () => {
    const topic = localStorage.getItem('quiz_topic');
    if (!topic) return;
    await loadNextQuestion(topic);
  };

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your first question...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">{currentQuestion.question}</h2>
          
          {currentQuestion.feedback ? (
            <>
              <div className="mb-4">
                <p className="font-medium text-gray-700">Your Answer:</p>
                <p className="mt-2 text-gray-600">{currentQuestion.userAnswer}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg mb-4">
                <p className="font-medium text-purple-800">Feedback:</p>
                <p className="mt-2 text-purple-600">{currentQuestion.feedback}</p>
              </div>
              <button
                onClick={handleNextQuestion}
                disabled={isLoading}
                className="flex items-center justify-center w-full py-3 px-4 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowRight className="w-5 h-5 mr-2" />
                Next Question
              </button>
            </>
          ) : (
            <div className="space-y-4">
              <textarea
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder="Type your answer here..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-[120px]"
              />
              <button
                onClick={handleSubmitAnswer}
                disabled={isLoading || !currentAnswer.trim()}
                className="flex items-center justify-center w-full py-3 px-4 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5 mr-2" />
                {isLoading ? 'Submitting...' : 'Submit Answer'}
              </button>
            </div>
          )}
        </div>

        {error && (
          <div className="text-red-500 text-center py-4 mt-4 bg-white rounded-lg shadow-md">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}