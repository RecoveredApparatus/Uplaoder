import { useState, useCallback } from 'react';
import { generateQuestion, evaluateAnswer } from '../services/gemini';
import { Question, GeminiError } from '../types';

export function useQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleError = (error: unknown) => {
    if (error instanceof GeminiError) {
      setError(`${error.message}. Please check your API key and try again.`);
    } else if (error instanceof Error) {
      setError(error.message);
    } else {
      setError('An unexpected error occurred. Please try again.');
    }
    console.error('Error:', error);
  };

  const loadNextQuestion = useCallback(async (topic: string) => {
    try {
      setIsLoading(true);
      setError('');
      const questionText = await generateQuestion(topic);
      
      const newQuestion: Question = {
        id: Date.now().toString(),
        question: questionText,
        userAnswer: '',
      };

      setCurrentQuestion(newQuestion);
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const submitAnswer = useCallback(async (
    questionId: string,
    answer: string,
    topic: string
  ) => {
    try {
      setIsLoading(true);
      if (!currentQuestion || currentQuestion.id !== questionId) {
        throw new Error('Question not found');
      }

      const feedback = await evaluateAnswer(currentQuestion.question, answer);
      setCurrentQuestion(prev => 
        prev && prev.id === questionId
          ? { ...prev, userAnswer: answer, feedback }
          : prev
      );
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  }, [currentQuestion]);

  return {
    currentQuestion,
    isLoading,
    error,
    loadNextQuestion,
    submitAnswer
  };
}