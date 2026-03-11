import { create } from 'zustand';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'recruiter' | 'admin';
}

export interface ExtractedSkills {
  email: string;
  phone: string;
  skills: string[];
  name?: string;
  experience?: string;
}

export interface Quiz {
  id: string;
  skill: string;
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface JobRecommendation {
  id: string;
  role: string;
  company: string;
  skills: string[];
  matchScore: number;
  description: string;
  salary?: string;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string) => void;
  logout: () => void;
}

interface SkillStore {
  extractedSkills: ExtractedSkills | null;
  setExtractedSkills: (skills: ExtractedSkills) => void;
  clearSkills: () => void;
}

interface QuizStore {
  quizzes: Quiz[];
  currentQuiz: Quiz | null;
  setQuizzes: (quizzes: Quiz[]) => void;
  setCurrentQuiz: (quiz: Quiz | null) => void;
}

interface JobStore {
  jobRecommendations: JobRecommendation[];
  setJobRecommendations: (jobs: JobRecommendation[]) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  logout: () => set({ user: null, token: null }),
}));

export const useSkillStore = create<SkillStore>((set) => ({
  extractedSkills: null,
  setExtractedSkills: (skills) => set({ extractedSkills: skills }),
  clearSkills: () => set({ extractedSkills: null }),
}));

export const useQuizStore = create<QuizStore>((set) => ({
  quizzes: [],
  currentQuiz: null,
  setQuizzes: (quizzes) => set({ quizzes }),
  setCurrentQuiz: (quiz) => set({ currentQuiz: quiz }),
}));

export const useJobStore = create<JobStore>((set) => ({
  jobRecommendations: [],
  setJobRecommendations: (jobs) => set({ jobRecommendations: jobs }),
}));
