import { GoogleGenerativeAI } from '@google/generative-ai';
import { GeminiError } from '../types';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY || API_KEY === 'your_api_key_here') {
  throw new Error('VITE_GEMINI_API_KEY is not set in .env file');
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

export async function generateQuestion(topic: string): Promise<string> {
  try {
    const prompt = `Generate an interesting and thought-provoking question about ${topic}. 
      The question should be subjective and encourage critical thinking.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    throw new GeminiError('Failed to generate question', error);
  }
}

export async function evaluateAnswer(question: string, answer: string): Promise<string> {
  try {
    const prompt = `Question: ${question}
      User's Answer: ${answer}
      
      Please evaluate this answer and provide constructive feedback. Include:
      1. What aspects of the answer were strong
      2. Areas for improvement
      3. Additional perspectives to consider
      
      Format the response in a friendly, encouraging tone.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    throw new GeminiError('Failed to evaluate answer', error);
  }
}