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
    },
    {
      id: '4',
      title: 'Chemistry Champion',
      description: 'Mastered molecular structures',
      icon: '🧪',
      earned: true,
      earnedAt: new Date('2024-01-25')
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
    subject: 'mathematics',
    difficulty: 'intermediate',
    question: 'What is the derivative of x³ + 2x² - 5x + 3?',
    options: ['3x² + 4x - 5', '3x² + 2x - 5', 'x² + 4x - 5', '3x² + 4x + 5'],
    correctAnswer: 0,
    explanation: 'Using the power rule: d/dx(x³) = 3x², d/dx(2x²) = 4x, d/dx(-5x) = -5, d/dx(3) = 0. So the derivative is 3x² + 4x - 5.',
    xpReward: 75,
    coinReward: 15
  },
  {
    id: '3',
    subject: 'mathematics',
    difficulty: 'advanced',
    question: 'What is the limit of (sin x)/x as x approaches 0?',
    options: ['0', '1', '∞', 'undefined'],
    correctAnswer: 1,
    explanation: 'This is a fundamental limit in calculus. lim(x→0) (sin x)/x = 1. This can be proven using the squeeze theorem or L\'Hôpital\'s rule.',
    xpReward: 100,
    coinReward: 25
  },
  {
    id: '4',
    subject: 'physics',
    difficulty: 'basic',
    question: 'What is the formula for kinetic energy?',
    options: ['KE = mv²', 'KE = ½mv²', 'KE = m²v', 'KE = 2mv'],
    correctAnswer: 1,
    explanation: 'Kinetic energy is the energy of motion. The formula is KE = ½mv², where m is mass and v is velocity.',
    xpReward: 50,
    coinReward: 10
  },
  {
    id: '5',
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
    id: '6',
    subject: 'physics',
    difficulty: 'advanced',
    question: 'What is the Heisenberg Uncertainty Principle?',
    options: ['Δx·Δp ≥ ℏ/2', 'Δx·Δp = ℏ', 'Δx·Δp ≤ ℏ/2', 'Δx·Δp = ℏ/2'],
    correctAnswer: 0,
    explanation: 'The Heisenberg Uncertainty Principle states that Δx·Δp ≥ ℏ/2, where Δx is position uncertainty, Δp is momentum uncertainty, and ℏ is reduced Planck constant.',
    xpReward: 100,
    coinReward: 25
  },
  {
    id: '7',
    subject: 'chemistry',
    difficulty: 'basic',
    question: 'What is the chemical symbol for Gold?',
    options: ['Go', 'Gd', 'Au', 'Ag'],
    correctAnswer: 2,
    explanation: 'Gold\'s chemical symbol is Au, derived from the Latin word "aurum" meaning gold.',
    xpReward: 50,
    coinReward: 10
  },
  {
    id: '8',
    subject: 'chemistry',
    difficulty: 'intermediate',
    question: 'What is the pH of pure water at 25°C?',
    options: ['6', '7', '8', '14'],
    correctAnswer: 1,
    explanation: 'Pure water at 25°C has a pH of 7, which is considered neutral. This is because [H⁺] = [OH⁻] = 1×10⁻⁷ M.',
    xpReward: 75,
    coinReward: 15
  },
  {
    id: '9',
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
  },
  {
    id: '3',
    title: 'Chemistry Championship',
    description: 'Master molecular structures and chemical reactions!',
    subject: 'chemistry',
    difficulty: 'intermediate',
    startTime: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 hours from now
    endTime: new Date(Date.now() + 16 * 60 * 60 * 1000), // 16 hours from now
    prize: 6000,
    participants: [
      {
        userId: '3',
        name: 'Marie Curie Jr.',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
        score: 980,
        questionsAnswered: 12,
        correctAnswers: 10,
        timeSpent: 360
      }
    ],
    isSponsored: true,
    sponsor: 'ChemLab Institute',
    status: 'active'
  }
];

export const mockGames: Game[] = [
  {
    id: '1',
    title: 'Mathematics Mastery',
    description: 'From basic arithmetic to advanced calculus - test your mathematical prowess!',
    subject: 'mathematics',
    difficulty: 'basic',
    type: 'quiz',
    minBet: 10,
    maxBet: 100,
    icon: '🧮'
  },
  {
    id: '2',
    title: 'Advanced Math Challenge',
    description: 'Tackle complex mathematical concepts including calculus, algebra, and geometry.',
    subject: 'mathematics',
    difficulty: 'advanced',
    type: 'challenge',
    minBet: 50,
    maxBet: 500,
    icon: '📐'
  },
  {
    id: '3',
    title: 'Physics Challenge',
    description: 'Test your physics knowledge in this strategic challenge game.',
    subject: 'physics',
    difficulty: 'intermediate',
    type: 'challenge',
    minBet: 25,
    maxBet: 250,
    icon: '⚡'
  },
  {
    id: '4',
    title: 'Quantum Physics Quest',
    description: 'Dive deep into the mysterious world of quantum mechanics and relativity.',
    subject: 'physics',
    difficulty: 'advanced',
    type: 'puzzle',
    minBet: 75,
    maxBet: 750,
    icon: '🔬'
  },
  {
    id: '5',
    title: 'Chemistry Quest',
    description: 'Match molecular structures to win big in this exciting puzzle game.',
    subject: 'chemistry',
    difficulty: 'intermediate',
    type: 'puzzle',
    minBet: 30,
    maxBet: 300,
    icon: '🧪'
  },
  {
    id: '6',
    title: 'Organic Chemistry Lab',
    description: 'Master complex organic reactions and molecular synthesis pathways.',
    subject: 'chemistry',
    difficulty: 'advanced',
    type: 'challenge',
    minBet: 60,
    maxBet: 600,
    icon: '⚗️'
  }
];