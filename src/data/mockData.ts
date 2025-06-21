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
    },
    {
      id: '5',
      title: 'HTML Hero',
      description: 'Built your first webpage',
      icon: '🌐',
      earned: true,
      earnedAt: new Date('2024-01-28')
    },
    {
      id: '6',
      title: 'CSS Stylist',
      description: 'Created beautiful designs',
      icon: '🎨',
      earned: false
    },
    {
      id: '7',
      title: 'JavaScript Jedi',
      description: 'Mastered dynamic programming',
      icon: '⚡',
      earned: false
    },
    {
      id: '8',
      title: 'Python Programmer',
      description: 'Solved 50 Python challenges',
      icon: '🐍',
      earned: true,
      earnedAt: new Date('2024-02-01')
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
    coinReward: 10,
    hint: 'Try breaking 15 into 10 + 5, then multiply each part by 8 separately!'
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
    coinReward: 15,
    hint: 'Remember the power rule: d/dx(xⁿ) = n·xⁿ⁻¹. Apply it to each term separately!'
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
    coinReward: 25,
    hint: 'This is a famous limit! Think about the unit circle and what happens to sin(x) when x is very small.'
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
    coinReward: 10,
    hint: 'Energy of motion involves mass and velocity squared. Don\'t forget the fraction!'
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
    coinReward: 15,
    hint: 'It\'s very close to 300 million m/s, but the exact value is slightly less. Look for the most precise number!'
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
    coinReward: 25,
    hint: 'The principle sets a minimum limit on uncertainty. Look for the "greater than or equal to" symbol!'
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
    coinReward: 10,
    hint: 'Think about the Latin word for gold - "aurum". The symbol comes from this ancient name!'
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
    coinReward: 15,
    hint: 'Pure water is neither acidic nor basic - it\'s perfectly neutral on the pH scale!'
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
    coinReward: 25,
    hint: 'Iron has 26 electrons. After Argon (18 electrons), you need to place 8 more. Remember 4s fills before 3d!'
  },
  // Additional coding questions for different difficulty levels
  {
    id: '10',
    subject: 'html',
    difficulty: 'basic',
    question: 'Which HTML tag is used to create a hyperlink?',
    options: ['<link>', '<a>', '<href>', '<url>'],
    correctAnswer: 1,
    explanation: 'The <a> tag (anchor tag) is used to create hyperlinks. The href attribute specifies the URL of the page the link goes to.',
    xpReward: 50,
    coinReward: 10,
    hint: 'Think "anchor" - what letter does that start with? This tag "anchors" links to other pages!'
  },
  {
    id: '11',
    subject: 'css',
    difficulty: 'basic',
    question: 'Which CSS property is used to change the text color?',
    options: ['text-color', 'font-color', 'color', 'text-style'],
    correctAnswer: 2,
    explanation: 'The "color" property in CSS is used to set the color of text. For example: color: red; or color: #ff0000;',
    xpReward: 50,
    coinReward: 10,
    hint: 'The simplest and most direct property name - just one word that describes exactly what it does!'
  },
  {
    id: '12',
    subject: 'javascript',
    difficulty: 'intermediate',
    question: 'What does the following code return: typeof null?',
    options: ['"null"', '"undefined"', '"object"', '"boolean"'],
    correctAnswer: 2,
    explanation: 'In JavaScript, typeof null returns "object". This is actually a well-known bug in JavaScript that has been kept for backward compatibility.',
    xpReward: 75,
    coinReward: 15,
    hint: 'This is a famous JavaScript quirk! null is treated as a primitive, but typeof returns something unexpected...'
  },
  {
    id: '13',
    subject: 'python',
    difficulty: 'intermediate',
    question: 'What is the result of [1, 2, 3] * 2 in Python?',
    options: ['[2, 4, 6]', '[1, 2, 3, 1, 2, 3]', 'Error', '[1, 2, 3, 2]'],
    correctAnswer: 1,
    explanation: 'In Python, multiplying a list by an integer repeats the list that many times. So [1, 2, 3] * 2 creates [1, 2, 3, 1, 2, 3].',
    xpReward: 75,
    coinReward: 15,
    hint: 'In Python, multiplying a list doesn\'t multiply the elements - it repeats the entire list!'
  },
  {
    id: '14',
    subject: 'html',
    difficulty: 'advanced',
    question: 'Which HTML5 semantic element represents the main content of a document?',
    options: ['<content>', '<main>', '<primary>', '<section>'],
    correctAnswer: 1,
    explanation: 'The <main> element represents the dominant content of the <body> of a document. It excludes content that is repeated across documents like navigation, headers, footers.',
    xpReward: 100,
    coinReward: 25,
    hint: 'Think about what you\'d call the primary, central content of a webpage. The tag name is exactly what you\'d expect!'
  },
  {
    id: '15',
    subject: 'css',
    difficulty: 'advanced',
    question: 'What does the CSS property "justify-content: space-between" do in flexbox?',
    options: [
      'Centers items with equal space around them',
      'Distributes items evenly with first item at start, last at end',
      'Aligns items to the start of the container',
      'Stretches items to fill the container'
    ],
    correctAnswer: 1,
    explanation: 'justify-content: space-between distributes flex items evenly along the main axis, with the first item at the start and the last item at the end, and equal space between items.',
    xpReward: 100,
    coinReward: 25,
    hint: 'The key word is "between" - think about what goes between the items, and where the first and last items are positioned!'
  },
  {
    id: '16',
    subject: 'javascript',
    difficulty: 'advanced',
    question: 'What is a closure in JavaScript?',
    options: [
      'A way to close browser windows',
      'A function that has access to variables in its outer scope',
      'A method to end function execution',
      'A type of loop structure'
    ],
    correctAnswer: 1,
    explanation: 'A closure is a function that has access to variables in its outer (enclosing) scope even after the outer function has returned. This allows for data privacy and function factories.',
    xpReward: 100,
    coinReward: 25,
    hint: 'Think about a function that "closes over" variables from its surrounding environment, keeping them accessible!'
  },
  {
    id: '17',
    subject: 'python',
    difficulty: 'advanced',
    question: 'What does the @property decorator do in Python?',
    options: [
      'Creates a private variable',
      'Allows a method to be accessed like an attribute',
      'Defines a class property',
      'Creates a static method'
    ],
    correctAnswer: 1,
    explanation: 'The @property decorator allows you to define a method that can be accessed like an attribute, providing a way to implement getters and setters in a Pythonic way.',
    xpReward: 100,
    coinReward: 25,
    hint: 'This decorator makes a method behave like a simple attribute - you can access it without parentheses!'
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
  // BEGINNER LEVEL GAMES
  {
    id: '1',
    title: 'Math Basics',
    description: 'Learn fundamental arithmetic operations and basic mathematical concepts.',
    subject: 'mathematics',
    difficulty: 'basic',
    type: 'quiz',
    minBet: 10,
    maxBet: 100,
    icon: '🧮'
  },
  {
    id: '7',
    title: 'HTML Fundamentals',
    description: 'Master the building blocks of the web with HTML structure and semantics.',
    subject: 'html',
    difficulty: 'basic',
    type: 'challenge',
    minBet: 15,
    maxBet: 150,
    icon: '🌐'
  },
  {
    id: '13',
    title: 'Physics Basics',
    description: 'Explore fundamental physics concepts like motion, forces, and energy.',
    subject: 'physics',
    difficulty: 'basic',
    type: 'quiz',
    minBet: 15,
    maxBet: 150,
    icon: '⚡'
  },
  {
    id: '14',
    title: 'Chemistry Basics',
    description: 'Learn about atoms, molecules, and basic chemical reactions.',
    subject: 'chemistry',
    difficulty: 'basic',
    type: 'quiz',
    minBet: 15,
    maxBet: 150,
    icon: '🧪'
  },
  {
    id: '15',
    title: 'Python Basics',
    description: 'Start your programming journey with Python fundamentals and syntax.',
    subject: 'python',
    difficulty: 'basic',
    type: 'quiz',
    minBet: 20,
    maxBet: 200,
    icon: '🐍'
  },
  {
    id: '16',
    title: 'CSS Fundamentals',
    description: 'Learn styling basics, colors, fonts, and simple layouts.',
    subject: 'css',
    difficulty: 'basic',
    type: 'quiz',
    minBet: 15,
    maxBet: 150,
    icon: '🎨'
  },

  // INTERMEDIATE LEVEL GAMES
  {
    id: '2',
    title: 'Algebra & Geometry',
    description: 'Solve equations, work with functions, and explore geometric relationships.',
    subject: 'mathematics',
    difficulty: 'intermediate',
    type: 'challenge',
    minBet: 30,
    maxBet: 300,
    icon: '📐'
  },
  {
    id: '3',
    title: 'Physics Challenge',
    description: 'Test your physics knowledge with mechanics, thermodynamics, and waves.',
    subject: 'physics',
    difficulty: 'intermediate',
    type: 'challenge',
    minBet: 25,
    maxBet: 250,
    icon: '⚡'
  },
  {
    id: '5',
    title: 'Organic Chemistry',
    description: 'Explore molecular structures, reactions, and chemical bonding.',
    subject: 'chemistry',
    difficulty: 'intermediate',
    type: 'puzzle',
    minBet: 30,
    maxBet: 300,
    icon: '🧪'
  },
  {
    id: '8',
    title: 'CSS Styling Master',
    description: 'Master flexbox, grid layouts, and responsive design principles.',
    subject: 'css',
    difficulty: 'intermediate',
    type: 'challenge',
    minBet: 25,
    maxBet: 250,
    icon: '🎨'
  },
  {
    id: '10',
    title: 'Python Programming',
    description: 'Learn data structures, functions, and object-oriented programming.',
    subject: 'python',
    difficulty: 'intermediate',
    type: 'quiz',
    minBet: 30,
    maxBet: 300,
    icon: '🐍'
  },
  {
    id: '17',
    title: 'JavaScript Essentials',
    description: 'Master DOM manipulation, events, and asynchronous programming.',
    subject: 'javascript',
    difficulty: 'intermediate',
    type: 'challenge',
    minBet: 35,
    maxBet: 350,
    icon: '⚡'
  },

  // ADVANCED LEVEL GAMES
  {
    id: '4',
    title: 'Calculus & Advanced Math',
    description: 'Tackle derivatives, integrals, and complex mathematical analysis.',
    subject: 'mathematics',
    difficulty: 'advanced',
    type: 'challenge',
    minBet: 50,
    maxBet: 500,
    icon: '📐'
  },
  {
    id: '18',
    title: 'Quantum Physics Quest',
    description: 'Dive deep into quantum mechanics, relativity, and particle physics.',
    subject: 'physics',
    difficulty: 'advanced',
    type: 'puzzle',
    minBet: 75,
    maxBet: 750,
    icon: '🔬'
  },
  {
    id: '6',
    title: 'Advanced Chemistry Lab',
    description: 'Master complex reactions, thermodynamics, and molecular synthesis.',
    subject: 'chemistry',
    difficulty: 'advanced',
    type: 'challenge',
    minBet: 60,
    maxBet: 600,
    icon: '⚗️'
  },
  {
    id: '9',
    title: 'JavaScript Mastery',
    description: 'Advanced concepts: closures, prototypes, design patterns, and frameworks.',
    subject: 'javascript',
    difficulty: 'advanced',
    type: 'challenge',
    minBet: 50,
    maxBet: 500,
    icon: '⚡'
  },
  {
    id: '11',
    title: 'Advanced CSS Techniques',
    description: 'CSS animations, custom properties, advanced selectors, and performance.',
    subject: 'css',
    difficulty: 'advanced',
    type: 'challenge',
    minBet: 45,
    maxBet: 450,
    icon: '🎨'
  },
  {
    id: '12',
    title: 'Python Data Science',
    description: 'Advanced algorithms, data analysis, and machine learning fundamentals.',
    subject: 'python',
    difficulty: 'advanced',
    type: 'puzzle',
    minBet: 60,
    maxBet: 600,
    icon: '📊'
  },
  {
    id: '19',
    title: 'Full-Stack Web Development',
    description: 'Complex web applications combining HTML, CSS, JavaScript, and APIs.',
    subject: 'html',
    difficulty: 'advanced',
    type: 'challenge',
    minBet: 70,
    maxBet: 700,
    icon: '💻'
  }
];