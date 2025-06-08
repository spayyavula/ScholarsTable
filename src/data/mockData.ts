import { User, Question, Tournament, Game, Achievement } from '../types';

export const mockUser: User = {
  id: '1',
  name: 'Alex Scholar',
  avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
  coins: 2500,
  xp: 15750,
  level: 12,
  achievements: [
    {
      id: '1',
      title: 'First Win',
      description: 'Won your first quiz game',
      icon: '🏆',
      earned: true,
      earnedAt: new Date('2024-01-15')
    },
    {
      id: '2',
      title: 'Math Master',
      description: 'Answered 100 math questions correctly',
      icon: '🧮',
      earned: true,
      earnedAt: new Date('2024-01-20')
    },
    {
      id: '3',
      title: 'Physics Pioneer',
      description: 'Completed advanced physics challenges',
      icon: '⚡',
      earned: false
    }
  ],
  stats: {
    gamesPlayed: 127,
    questionsAnswered: 892,
    correctAnswers: 734,
    streakRecord: 23,
    tournamentsWon: 3,
    totalXpEarned: 15750
  }
};

export const mockQuestions: Question[] = [
  {
    id: '1',
    subject: 'mathematics',
    difficulty: 'basic',
    question: 'What is 15 × 8?',
    options: ['110', '120', '130', '125'],
    correctAnswer: 1,
    explanation: '15 × 8 = 120. You can solve this by breaking it down: (10 × 8) + (5 × 8) = 80 + 40 = 120',
    xpReward: 50,
    coinReward: 10
  },
  {
    id: '2',
    subject: 'physics',
    difficulty: 'intermediate',
    question: 'What is the speed of light in vacuum?',
    options: ['299,792,458 m/s', '300,000,000 m/s', '299,000,000 m/s', '301,000,000 m/s'],
    correctAnswer: 0,
    explanation: 'The speed of light in vacuum is exactly 299,792,458 meters per second, which is often approximated as 3 × 10⁸ m/s.',
    xpReward: 75,
    coinReward: 15
  },
  {
    id: '3',
    subject: 'chemistry',
    difficulty: 'advanced',
    question: 'What is the electron configuration of Iron (Fe)?',
    options: ['[Ar] 3d⁶ 4s²', '[Ar] 3d⁵ 4s²', '[Ar] 3d⁷ 4s¹', '[Ar] 3d⁸'],
    correctAnswer: 0,
    explanation: 'Iron (Fe) has 26 electrons. Its electron configuration is [Ar] 3d⁶ 4s², following the Aufbau principle.',
    xpReward: 100,
    coinReward: 25
  }
];

export const mockTournaments: Tournament[] = [
  {
    id: '1',
    title: 'Math Mastery Challenge',
    description: 'Test your mathematical skills in this exciting tournament!',
    subject: 'mathematics',
    difficulty: 'intermediate',
    startTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
    endTime: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours from now
    prize: 5000,
    participants: [
      {
        userId: '1',
        name: 'Alex Scholar',
        avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
        score: 1250,
        questionsAnswered: 15,
        correctAnswers: 13,
        timeSpent: 420
      },
      {
        userId: '2',
        name: 'Sarah Einstein',
        avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
        score: 1180,
        questionsAnswered: 14,
        correctAnswers: 12,
        timeSpent: 380
      }
    ],
    isSponsored: true,
    sponsor: 'MathTech Academy',
    status: 'active'
  },
  {
    id: '2',
    title: 'Physics Phenomena',
    description: 'Explore the wonders of physics in this championship!',
    subject: 'physics',
    difficulty: 'advanced',
    startTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
    endTime: new Date(Date.now() + 28 * 60 * 60 * 1000), // 28 hours from now
    prize: 7500,
    participants: [],
    isSponsored: true,
    sponsor: 'Quantum Labs',
    status: 'upcoming'
  }
];

export const mockGames: Game[] = [
  {
    id: '1',
    title: 'Knowledge Roulette',
    description: 'Spin the wheel of knowledge! Answer random questions to win coins.',
    subject: 'mathematics',
    difficulty: 'basic',
    type: 'quiz',
    minBet: 10,
    maxBet: 100,
    icon: '🎰'
  },
  {
    id: '2',
    title: 'Physics Challenge',
    description: 'Test your physics knowledge in this strategic challenge game.',
    subject: 'physics',
    difficulty: 'intermediate',
    type: 'challenge',
    minBet: 25,
    maxBet: 250,
    icon: '🃏'
  },
  {
    id: '3',
    title: 'Chemistry Quest',
    description: 'Match molecular structures to win big in this exciting puzzle game.',
    subject: 'chemistry',
    difficulty: 'advanced',
    type: 'puzzle',
    minBet: 50,
    maxBet: 500,
    icon: '🎲'
  }
];