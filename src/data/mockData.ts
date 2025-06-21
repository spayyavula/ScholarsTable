import { User, Question, Tournament, Game, Achievement, CodingQuestion } from '../types';

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
    subject: 'react',
    difficulty: 'advanced',
    question: 'What is the purpose of the useEffect hook in React?',
    options: [
      'To manage component state',
      'To perform side effects in functional components',
      'To create class components',
      'To handle form submissions'
    ],
    correctAnswer: 1,
    explanation: 'useEffect is used to perform side effects in functional components, such as data fetching, subscriptions, or manually changing the DOM.',
    xpReward: 100,
    coinReward: 25,
    hint: 'Think about what happens after a component renders - side effects like API calls, timers, or DOM updates!'
  },
  {
    id: '17',
    subject: 'angular',
    difficulty: 'advanced',
    question: 'What is dependency injection in Angular?',
    options: [
      'A way to inject HTML into components',
      'A design pattern for providing dependencies to classes',
      'A method to inject CSS styles',
      'A technique for code injection attacks'
    ],
    correctAnswer: 1,
    explanation: 'Dependency injection is a design pattern where dependencies are provided to a class rather than the class creating them itself. Angular\'s DI system manages this automatically.',
    xpReward: 100,
    coinReward: 25,
    hint: 'Think about how services are provided to components - they are "injected" rather than manually created!'
  },
  {
    id: '18',
    subject: 'vue',
    difficulty: 'intermediate',
    question: 'What is the difference between v-if and v-show in Vue.js?',
    options: [
      'v-if is for loops, v-show is for conditions',
      'v-if conditionally renders, v-show conditionally displays',
      'v-if is faster, v-show is slower',
      'There is no difference'
    ],
    correctAnswer: 1,
    explanation: 'v-if conditionally renders elements (adds/removes from DOM), while v-show conditionally displays elements (toggles CSS display property).',
    xpReward: 75,
    coinReward: 15,
    hint: 'Think about DOM manipulation vs CSS styling - one adds/removes elements, the other just hides/shows them!'
  },
  {
    id: '19',
    subject: 'react-native',
    difficulty: 'basic',
    question: 'Which component is used for scrollable content in React Native?',
    options: [
      '<Scroll>',
      '<ScrollView>',
      '<ScrollableView>',
      '<View scroll={true}>'
    ],
    correctAnswer: 1,
    explanation: 'ScrollView is the React Native component used to create scrollable content areas when content exceeds the screen size.',
    xpReward: 50,
    coinReward: 10,
    hint: 'The component name is very descriptive - it\'s a View that can Scroll!'
  },
  {
    id: '20',
    subject: 'nodejs',
    difficulty: 'basic',
    question: 'Which method is used to create an HTTP server in Node.js?',
    options: [
      'http.createServer()',
      'http.newServer()',
      'http.makeServer()',
      'http.buildServer()'
    ],
    correctAnswer: 0,
    explanation: 'http.createServer() is the method used to create an HTTP server in Node.js. It returns a new instance of http.Server.',
    xpReward: 50,
    coinReward: 10,
    hint: 'Think about the most straightforward way to "create" a server - the method name is very descriptive!'
  },
  {
    id: '21',
    subject: 'react-backend',
    difficulty: 'intermediate',
    question: 'In Next.js API routes, how do you access query parameters?',
    options: [
      'req.params',
      'req.query',
      'req.search',
      'req.queryParams'
    ],
    correctAnswer: 1,
    explanation: 'In Next.js API routes, query parameters are accessed through req.query. This includes both URL query strings and dynamic route parameters.',
    xpReward: 75,
    coinReward: 15,
    hint: 'The property name is the same as what you\'re trying to access - query parameters!'
  }
];

export const mockCodingQuestions: CodingQuestion[] = [
  {
    id: 'html-1',
    subject: 'html',
    difficulty: 'basic',
    question: 'Create a simple HTML page with a heading, paragraph, and a link to "https://example.com"',
    options: [], // Not used for coding questions
    correctAnswer: 0, // Not used for coding questions
    explanation: 'HTML uses semantic tags to structure content. The <h1> tag creates headings, <p> for paragraphs, and <a> with href attribute for links.',
    xpReward: 75,
    coinReward: 15,
    hint: 'Remember to use <h1> for headings, <p> for paragraphs, and <a href="..."> for links!',
    language: 'html',
    codeTemplate: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Page</title>
</head>
<body>
    <!-- Create your HTML structure here -->
    
</body>
</html>`,
    expectedOutput: 'A page with a heading, paragraph, and link to example.com'
  },
  {
    id: 'css-1',
    subject: 'css',
    difficulty: 'basic',
    question: 'Style the sample elements: make the heading red, the paragraph blue, and the button have a green background',
    options: [],
    correctAnswer: 0,
    explanation: 'CSS uses selectors to target HTML elements. Use element selectors (h1, p, button) and the color and background-color properties.',
    xpReward: 75,
    coinReward: 15,
    hint: 'Use h1 { color: red; }, p { color: blue; }, and button { background-color: green; }',
    language: 'css',
    codeTemplate: `/* Style the elements below */

h1 {
    /* Make the heading red */
}

p {
    /* Make the paragraph blue */
}

button {
    /* Give the button a green background */
}`,
    expectedOutput: 'Red heading, blue paragraph, green button background'
  },
  {
    id: 'css-2',
    subject: 'css',
    difficulty: 'intermediate',
    question: 'Create a flexbox layout that centers content both horizontally and vertically',
    options: [],
    correctAnswer: 0,
    explanation: 'Flexbox provides powerful alignment capabilities. Use display: flex, justify-content: center for horizontal centering, and align-items: center for vertical centering.',
    xpReward: 100,
    coinReward: 20,
    hint: 'Use display: flex, justify-content: center, and align-items: center on the container!',
    language: 'css',
    codeTemplate: `.container {
    height: 100vh;
    /* Add flexbox properties here */
    
}

.content {
    padding: 20px;
    background-color: lightblue;
    border-radius: 8px;
}`,
    expectedOutput: 'Content centered both horizontally and vertically'
  },
  {
    id: 'js-1',
    subject: 'javascript',
    difficulty: 'basic',
    question: 'Create a function that takes two numbers and returns their sum',
    options: [],
    correctAnswer: 0,
    explanation: 'Functions in JavaScript are defined using the function keyword, followed by parameters in parentheses and the function body in curly braces.',
    xpReward: 75,
    coinReward: 15,
    hint: 'Use function addNumbers(a, b) { return a + b; }',
    language: 'javascript',
    codeTemplate: `// Create a function that adds two numbers
function addNumbers(a, b) {
    // Your code here
    
}

// Test your function
console.log(addNumbers(5, 3)); // Should output 8`,
    expectedOutput: '8',
    testCases: [
      { input: 'addNumbers(5, 3)', expectedOutput: '8', description: 'Adding 5 and 3' },
      { input: 'addNumbers(10, -2)', expectedOutput: '8', description: 'Adding 10 and -2' },
      { input: 'addNumbers(0, 0)', expectedOutput: '0', description: 'Adding 0 and 0' }
    ]
  },
  {
    id: 'js-2',
    subject: 'javascript',
    difficulty: 'intermediate',
    question: 'Create a function that filters an array to return only even numbers',
    options: [],
    correctAnswer: 0,
    explanation: 'Use the filter() method with a callback function that checks if a number is even using the modulo operator (%).',
    xpReward: 100,
    coinReward: 20,
    hint: 'Use array.filter() with a condition that checks if number % 2 === 0',
    language: 'javascript',
    codeTemplate: `// Create a function that returns only even numbers from an array
function getEvenNumbers(numbers) {
    // Your code here
    
}

// Test your function
const testArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
console.log(getEvenNumbers(testArray)); // Should output [2, 4, 6, 8, 10]`,
    expectedOutput: '[2, 4, 6, 8, 10]',
    testCases: [
      { input: 'getEvenNumbers([1,2,3,4,5,6])', expectedOutput: '[2,4,6]', description: 'Filter even numbers from 1-6' },
      { input: 'getEvenNumbers([1,3,5,7])', expectedOutput: '[]', description: 'No even numbers' },
      { input: 'getEvenNumbers([2,4,6,8])', expectedOutput: '[2,4,6,8]', description: 'All even numbers' }
    ]
  },
  {
    id: 'js-3',
    subject: 'javascript',
    difficulty: 'advanced',
    question: 'Create a closure that maintains a private counter and returns an object with increment, decrement, and getValue methods',
    options: [],
    correctAnswer: 0,
    explanation: 'Closures allow functions to access variables from their outer scope even after the outer function has returned. This enables data privacy and encapsulation.',
    xpReward: 150,
    coinReward: 30,
    hint: 'Create a function that returns an object with methods that access a private variable in the outer scope',
    language: 'javascript',
    codeTemplate: `// Create a counter with closure
function createCounter() {
    // Private variable here
    
    // Return object with methods
    return {
        increment: function() {
            // Your code here
        },
        decrement: function() {
            // Your code here
        },
        getValue: function() {
            // Your code here
        }
    };
}

// Test your counter
const counter = createCounter();
counter.increment();
counter.increment();
console.log(counter.getValue()); // Should output 2`,
    expectedOutput: '2'
  },
  {
    id: 'html-2',
    subject: 'html',
    difficulty: 'intermediate',
    question: 'Create a form with input fields for name, email, and a submit button. Include proper labels and form validation attributes.',
    options: [],
    correctAnswer: 0,
    explanation: 'HTML forms use the <form> element with <input> elements for user input. Labels improve accessibility, and validation attributes provide client-side validation.',
    xpReward: 100,
    coinReward: 20,
    hint: 'Use <form>, <label>, <input> with type and required attributes, and a submit button',
    language: 'html',
    codeTemplate: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contact Form</title>
</head>
<body>
    <h1>Contact Form</h1>
    <!-- Create your form here -->
    
</body>
</html>`,
    expectedOutput: 'A form with name, email inputs and submit button'
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
    title: 'React.js Mastery',
    description: 'Master React hooks, state management, and component architecture.',
    subject: 'react',
    difficulty: 'advanced',
    type: 'challenge',
    minBet: 70,
    maxBet: 700,
    icon: '⚛️'
  },
  {
    id: '20',
    title: 'Angular Development',
    description: 'Build enterprise applications with Angular framework and TypeScript.',
    subject: 'angular',
    difficulty: 'intermediate',
    type: 'challenge',
    minBet: 40,
    maxBet: 400,
    icon: '🅰️'
  },
  {
    id: '21',
    title: 'Vue.js Fundamentals',
    description: 'Learn Vue.js reactive programming and component composition.',
    subject: 'vue',
    difficulty: 'basic',
    type: 'quiz',
    minBet: 25,
    maxBet: 250,
    icon: '💚'
  },
  {
    id: '22',
    title: 'React Native Apps',
    description: 'Build cross-platform mobile applications with React Native.',
    subject: 'react-native',
    difficulty: 'intermediate',
    type: 'challenge',
    minBet: 50,
    maxBet: 500,
    icon: '📱'
  },
  {
    id: '23',
    title: 'Node.js Backend',
    description: 'Build scalable server-side applications with Node.js and Express.',
    subject: 'nodejs',
    difficulty: 'intermediate',
    type: 'challenge',
    minBet: 40,
    maxBet: 400,
    icon: '🚀'
  },
  {
    id: '24',
    title: 'React Backend APIs',
    description: 'Create powerful backend APIs with Next.js and server-side React.',
    subject: 'react-backend',
    difficulty: 'advanced',
    type: 'challenge',
    minBet: 60,
    maxBet: 600,
    icon: '⚛️'
  }
];