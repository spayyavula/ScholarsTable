export interface User {
  id: string;
  name: string;
  avatar: string;
  coins: number;
  xp: number;
  level: number;
  achievements: Achievement[];
  stats: UserStats;
  subscriptionStatus?: 'free' | 'active' | 'canceled' | 'past_due';
  subscriptionPlan?: string;
  customerId?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedAt?: Date;
}

export interface UserStats {
  gamesPlayed: number;
  questionsAnswered: number;
  correctAnswers: number;
  streakRecord: number;
  tournamentsWon: number;
  totalXpEarned: number;
}

export interface Question {
  id: string;
  subject: Subject;
  difficulty: Difficulty;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  xpReward: number;
  coinReward: number;
  hint?: string;
}

export interface Tournament {
  id: string;
  title: string;
  description: string;
  subject: Subject;
  difficulty: Difficulty;
  startTime: Date;
  endTime: Date;
  prize: number;
  participants: TournamentParticipant[];
  isSponsored: boolean;
  sponsor?: string;
  status: 'upcoming' | 'active' | 'completed';
}

export interface TournamentParticipant {
  userId: string;
  name: string;
  avatar: string;
  score: number;
  questionsAnswered: number;
  correctAnswers: number;
  timeSpent: number;
}

export interface Game {
  id: string;
  title: string;
  description: string;
  subject: Subject;
  difficulty: Difficulty;
  type: GameType;
  minBet: number;
  maxBet: number;
  icon: string;
}

export type Subject = 'mathematics' | 'physics' | 'chemistry';
export type Subject = 'mathematics' | 'physics' | 'chemistry' | 'html' | 'css' | 'javascript' | 'python' | 'react' | 'angular' | 'vue' | 'react-native';
export type Subject = 'mathematics' | 'physics' | 'chemistry' | 'html' | 'css' | 'javascript' | 'python' | 'react' | 'angular' | 'vue' | 'react-native' | 'nodejs' | 'react-backend';
export type Difficulty = 'basic' | 'intermediate' | 'advanced';
export type GameType = 'quiz' | 'puzzle' | 'challenge' | 'tournament';

export interface CodingQuestion extends Question {
  codeTemplate?: string;
  expectedOutput?: string;
  testCases?: TestCase[];
  language: 'html' | 'css' | 'javascript' | 'python' | 'tailwind' | 'typescript';
}

export interface TestCase {
  input: string;
  expectedOutput: string;
  description: string;
}

export interface BobMessage {
  id: string;
  type: 'tips' | 'encouragement' | 'celebration' | 'hints';
  message: string;
  timestamp: Date;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number | string;
  period: string;
  description: string;
  features: string[];
  limitations: string[];
  popular: boolean;
  priceId: string | null;
  color: string;
  icon: any;
}

export interface MarketingContact {
  id?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  interests?: string[];
  source?: string;
  subscribeDate?: string;
  lists?: string[];
  tags?: string[];
}