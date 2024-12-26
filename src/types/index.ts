export interface QuizState {
  apiKey: string;
  topic: string;
  isLoading: boolean;
  error: string | null;
}

export interface Question {
  id: string;
  question: string;
  userAnswer?: string;
  feedback?: string;
}

export interface ApiResponse {
  success: boolean;
  message?: string;
  data?: any;
}

export class GeminiError extends Error {
  constructor(message: string, public originalError: unknown) {
    super(message);
    this.name = 'GeminiError';
  }
}