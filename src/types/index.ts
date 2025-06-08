export interface User {
  id: string;
  name: string;
  avatar: string;
  coins: number;
  xp: number;
  level: number;
  achievements: Achievement[];
  stats: UserStats;
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
export type Difficulty = 'basic' | 'intermediate' | 'advanced';
export type GameType = 'quiz' | 'puzzle' | 'challenge' | 'tournament';

export interface BobMessage {
  id: string;
  type: 'tip' | 'encouragement' | 'celebration' | 'hint';
  message: string;
  timestamp: Date;
}