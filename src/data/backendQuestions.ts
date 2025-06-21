import { CodingQuestion } from '../types';

export const nodeJSQuestions: CodingQuestion[] = [
  {
    id: 'nodejs-1',
    subject: 'javascript',
    difficulty: 'basic',
    question: 'Create a simple Express.js server with basic CRUD operations for a users API.',
    options: [],
    correctAnswer: 0,
    explanation: 'This challenge teaches Express.js fundamentals, routing, middleware, and RESTful API design.',
    xpReward: 150,
    coinReward: 30,
    hint: 'Use express.Router() for organizing routes, express.json() for parsing JSON, and proper HTTP status codes.',
    language: 'javascript',
    codeTemplate: `const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Sample data
let users = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
];

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Users API!' });
});

// TODO: Implement CRUD operations
// GET /api/users - Get all users
// GET /api/users/:id - Get user by ID
// POST /api/users - Create new user
// PUT /api/users/:id - Update user
// DELETE /api/users/:id - Delete user

app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});`,
    expectedOutput: 'A complete REST API with GET, POST, PUT, DELETE endpoints',
    testCases: [
      { input: 'app.get', expectedOutput: 'Found', description: 'Has GET routes' },
      { input: 'app.post', expectedOutput: 'Found', description: 'Has POST routes' },
      { input: 'app.put', expectedOutput: 'Found', description: 'Has PUT routes' },
      { input: 'app.delete', expectedOutput: 'Found', description: 'Has DELETE routes' }
    ]
  },
  {
    id: 'nodejs-2',
    subject: 'javascript',
    difficulty: 'intermediate',
    question: 'Build a Node.js authentication system with JWT tokens, password hashing, and protected routes.',
    options: [],
    correctAnswer: 0,
    explanation: 'This challenge covers authentication, JWT tokens, bcrypt password hashing, and middleware for route protection.',
    xpReward: 200,
    coinReward: 40,
    hint: 'Use bcrypt for password hashing, jsonwebtoken for JWT creation/verification, and middleware for route protection.',
    language: 'javascript',
    codeTemplate: `const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();

app.use(express.json());

// Mock user database
const users = [];
const JWT_SECRET = 'your-secret-key';

// Authentication middleware
const authenticateToken = (req, res, next) => {
  // TODO: Implement JWT verification middleware
};

// Routes
app.post('/register', async (req, res) => {
  // TODO: Implement user registration with password hashing
});

app.post('/login', async (req, res) => {
  // TODO: Implement user login with JWT token generation
});

app.get('/protected', authenticateToken, (req, res) => {
  // TODO: Implement protected route
});

app.listen(3000, () => {
  console.log('Auth server running on port 3000');
});`,
    expectedOutput: 'Authentication system with registration, login, and protected routes'
  },
  {
    id: 'nodejs-3',
    subject: 'javascript',
    difficulty: 'advanced',
    question: 'Create a real-time chat application using Socket.io with rooms, user authentication, and message history.',
    options: [],
    correctAnswer: 0,
    explanation: 'This advanced challenge combines WebSockets, real-time communication, room management, and persistent message storage.',
    xpReward: 300,
    coinReward: 60,
    hint: 'Use Socket.io for real-time communication, implement room joining/leaving, and store message history.',
    language: 'javascript',
    codeTemplate: `const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Message storage (in production, use a database)
const messageHistory = {};
const activeUsers = {};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // TODO: Implement socket event handlers
  // - user authentication
  // - joining/leaving rooms
  // - sending/receiving messages
  // - typing indicators
  // - user disconnect handling

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    // TODO: Handle user disconnect
  });
});

server.listen(3000, () => {
  console.log('Chat server running on port 3000');
});`,
    expectedOutput: 'Real-time chat application with rooms and message history'
  }
];

export const reactBackendQuestions: CodingQuestion[] = [
  {
    id: 'react-backend-1',
    subject: 'javascript',
    difficulty: 'basic',
    question: 'Create Next.js API routes for a blog application with posts CRUD operations and basic validation.',
    options: [],
    correctAnswer: 0,
    explanation: 'This challenge teaches Next.js API routes, request handling, data validation, and RESTful design patterns.',
    xpReward: 150,
    coinReward: 30,
    hint: 'Use Next.js API routes structure, implement proper HTTP methods, and add input validation.',
    language: 'javascript',
    codeTemplate: `// pages/api/posts/index.js
export default async function handler(req, res) {
  const { method } = req;

  // Mock posts data
  const posts = [
    { id: 1, title: 'First Post', content: 'Hello World!', author: 'John' },
    { id: 2, title: 'Second Post', content: 'Learning Next.js', author: 'Jane' }
  ];

  switch (method) {
    case 'GET':
      // TODO: Implement GET all posts with pagination
      break;
    case 'POST':
      // TODO: Implement POST new post with validation
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(\`Method \${method} Not Allowed\`);
  }
}

// pages/api/posts/[id].js
export default async function handler(req, res) {
  const { id, method } = req.query;

  // TODO: Implement GET, PUT, DELETE for individual posts
}`,
    expectedOutput: 'Complete blog API with CRUD operations and validation',
    testCases: [
      { input: 'export default async function handler', expectedOutput: 'Found', description: 'Has API handler' },
      { input: 'req.method', expectedOutput: 'Found', description: 'Handles HTTP methods' },
      { input: 'res.status', expectedOutput: 'Found', description: 'Sets status codes' }
    ]
  },
  {
    id: 'react-backend-2',
    subject: 'javascript',
    difficulty: 'intermediate',
    question: 'Build a Next.js application with server-side authentication using NextAuth.js and protected API routes.',
    options: [],
    correctAnswer: 0,
    explanation: 'This challenge covers NextAuth.js integration, session management, and API route protection in Next.js.',
    xpReward: 200,
    coinReward: 40,
    hint: 'Use NextAuth.js for authentication, getServerSession for server-side session access, and middleware for protection.',
    language: 'javascript',
    codeTemplate: `// pages/api/auth/[...nextauth].js
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        // TODO: Implement user authentication logic
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      // TODO: Implement JWT callback
    },
    async session({ session, token }) {
      // TODO: Implement session callback
    }
  },
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup'
  }
});

// pages/api/protected/profile.js
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // TODO: Implement protected profile endpoint
}`,
    expectedOutput: 'Authentication system with NextAuth.js and protected routes'
  },
  {
    id: 'react-backend-3',
    subject: 'javascript',
    difficulty: 'advanced',
    question: 'Create a Next.js e-commerce API with product management, shopping cart, and payment integration using Stripe.',
    options: [],
    correctAnswer: 0,
    explanation: 'This advanced challenge combines e-commerce logic, payment processing, inventory management, and complex API design.',
    xpReward: 300,
    coinReward: 60,
    hint: 'Use Stripe for payments, implement cart management, product inventory, and order processing.',
    language: 'javascript',
    codeTemplate: `// pages/api/products/index.js
export default async function handler(req, res) {
  // TODO: Implement product CRUD operations
}

// pages/api/cart/index.js
export default async function handler(req, res) {
  // TODO: Implement shopping cart management
}

// pages/api/checkout/session.js
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // TODO: Create Stripe checkout session
      const session = await stripe.checkout.sessions.create({
        // TODO: Configure checkout session
      });
      
      res.status(200).json({ sessionId: session.id });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

// pages/api/webhooks/stripe.js
export default async function handler(req, res) {
  // TODO: Handle Stripe webhooks for payment confirmation
}`,
    expectedOutput: 'Complete e-commerce API with payment processing'
  }
];

export const allBackendQuestions = [
  ...nodeJSQuestions,
  ...reactBackendQuestions
];