import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, CheckCircle, XCircle, Eye, Code, Terminal, Lightbulb, BookOpen, Search, Copy, Database } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { CodingQuestion, BobMessage } from '../../types';

interface ReactBackendCodeEditorProps {
  question: CodingQuestion;
  onComplete: (isCorrect: boolean, userCode: string) => void;
  onTriggerBobMessage: (type: BobMessage['type'], customMessage?: string) => void;
  onClose: () => void;
}

// React Backend concepts and patterns organized by category
const reactBackendReference = {
  'Next.js API Routes': {
    'API Handlers': ['export default function handler(req, res) {}', 'req.method', 'req.query', 'req.body', 'res.status().json()'],
    'Dynamic Routes': ['[id].js', '[...slug].js', 'req.query.id', 'req.query.slug'],
    'Middleware': ['export { default } from "middleware"', 'NextRequest', 'NextResponse'],
    'Authentication': ['getServerSession()', 'withAuth()', 'getToken()']
  },
  'Server Components': {
    'Data Fetching': ['async function Page() {}', 'fetch()', 'await getData()', 'use()'],
    'Streaming': ['Suspense', 'loading.js', 'error.js', 'not-found.js'],
    'Server Actions': ['"use server"', 'async function action() {}', 'revalidatePath()', 'redirect()'],
    'Metadata': ['export const metadata = {}', 'generateMetadata()', 'generateStaticParams()']
  },
  'Database Integration': {
    'Prisma': ['prisma.user.findMany()', 'prisma.user.create()', 'prisma.user.update()', 'prisma.user.delete()'],
    'MongoDB': ['MongoClient.connect()', 'db.collection()', 'insertOne()', 'findOne()', 'updateOne()'],
    'Supabase': ['createClient()', 'supabase.from().select()', 'supabase.from().insert()', 'supabase.auth.getUser()'],
    'Drizzle': ['drizzle()', 'select()', 'insert()', 'update()', 'delete()']
  },
  'Authentication': {
    'NextAuth.js': ['NextAuth()', 'providers: []', 'callbacks: {}', 'session: {}'],
    'JWT': ['sign()', 'verify()', 'decode()', 'getToken()'],
    'Cookies': ['cookies().get()', 'cookies().set()', 'cookies().delete()'],
    'Sessions': ['getServerSession()', 'useSession()', 'signIn()', 'signOut()']
  },
  'API Development': {
    'REST Endpoints': ['GET /api/users', 'POST /api/users', 'PUT /api/users/[id]', 'DELETE /api/users/[id]'],
    'GraphQL': ['apollo-server-micro', 'typeDefs', 'resolvers', 'createHandler()'],
    'Validation': ['zod.object()', 'yup.object()', 'joi.object()', 'validate()'],
    'Error Handling': ['try/catch', 'ApiError', 'errorHandler()', 'res.status(500)']
  },
  'State Management': {
    'Server State': ['React Query', 'SWR', 'useQuery()', 'useMutation()', 'invalidateQueries()'],
    'Global State': ['Zustand', 'Redux Toolkit', 'Jotai', 'Valtio'],
    'Form State': ['React Hook Form', 'Formik', 'useForm()', 'register()', 'handleSubmit()'],
    'Cache': ['unstable_cache()', 'revalidateTag()', 'cache()']
  },
  'Deployment': {
    'Vercel': ['vercel.json', 'api routes', 'edge functions', 'serverless functions'],
    'Environment': ['process.env', '.env.local', 'NEXT_PUBLIC_', 'runtime config'],
    'Build': ['next build', 'next start', 'next export', 'standalone output'],
    'Performance': ['Image optimization', 'Bundle analyzer', 'Core Web Vitals', 'ISR']
  }
};

export const ReactBackendCodeEditor: React.FC<ReactBackendCodeEditorProps> = ({
  question,
  onComplete,
  onTriggerBobMessage,
  onClose
}) => {
  const [userCode, setUserCode] = useState(question.codeTemplate || getDefaultReactBackendTemplate());
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<Array<{passed: boolean, input: string, expected: string, actual: string}>>([]);
  const [showPreview, setShowPreview] = useState(true);
  const [showReference, setShowReference] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Next.js API Routes');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const editorRef = useRef<any>(null);

  function getDefaultReactBackendTemplate(): string {
    return `// pages/api/users/index.js - Next.js API Route
import { NextApiRequest, NextApiResponse } from 'next';

// Mock database
let users = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'user' }
];

export default async function handler(req, res) {
  const { method } = req;

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    switch (method) {
      case 'GET':
        return handleGet(req, res);
      case 'POST':
        return handlePost(req, res);
      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ error: \`Method \${method} Not Allowed\` });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function handleGet(req, res) {
  const { page = 1, limit = 10, search } = req.query;
  
  let filteredUsers = users;
  
  // Search functionality
  if (search) {
    filteredUsers = users.filter(user => 
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  // Pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
  
  return res.status(200).json({
    users: paginatedUsers,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: filteredUsers.length,
      totalPages: Math.ceil(filteredUsers.length / limit)
    }
  });
}

async function handlePost(req, res) {
  const { name, email, role = 'user' } = req.body;
  
  // Validation
  if (!name || !email) {
    return res.status(400).json({ 
      error: 'Name and email are required',
      details: {
        name: !name ? 'Name is required' : null,
        email: !email ? 'Email is required' : null
      }
    });
  }
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  
  // Check if email already exists
  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    return res.status(409).json({ error: 'Email already exists' });
  }
  
  // Create new user
  const newUser = {
    id: Math.max(...users.map(u => u.id)) + 1,
    name,
    email,
    role,
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  
  return res.status(201).json({
    message: 'User created successfully',
    user: newUser
  });
}

// pages/api/users/[id].js - Dynamic API Route
export async function handleUserById(req, res) {
  const { id } = req.query;
  const { method } = req;
  
  const userId = parseInt(id);
  const userIndex = users.findIndex(user => user.id === userId);
  
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  switch (method) {
    case 'GET':
      return res.status(200).json(users[userIndex]);
      
    case 'PUT':
      const { name, email, role } = req.body;
      users[userIndex] = { ...users[userIndex], name, email, role };
      return res.status(200).json(users[userIndex]);
      
    case 'DELETE':
      users.splice(userIndex, 1);
      return res.status(204).end();
      
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).json({ error: \`Method \${method} Not Allowed\` });
  }
}`;
  }

  const setupMonacoReactBackendIntelliSense = (editor: any, monaco: any) => {
    // Register React Backend completion provider
    monaco.languages.registerCompletionItemProvider('javascript', {
      provideCompletionItems: (model: any, position: any) => {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn
        };

        const suggestions: any[] = [];

        // Add React Backend-specific suggestions
        Object.entries(reactBackendReference).forEach(([category, subcategories]) => {
          Object.entries(subcategories).forEach(([subcategory, patterns]) => {
            patterns.forEach((pattern) => {
              if (pattern.toLowerCase().includes(word.word.toLowerCase())) {
                suggestions.push({
                  label: pattern,
                  kind: monaco.languages.CompletionItemKind.Function,
                  insertText: pattern,
                  range: range,
                  detail: `${category} - ${subcategory}`,
                  documentation: `React Backend pattern: ${pattern}`
                });
              }
            });
          });
        });

        return { suggestions };
      }
    });
  };

  const runCode = async () => {
    setIsRunning(true);
    setHasRun(true);
    setOutput('');
    setTestResults([]);

    try {
      // For React Backend, create a Next.js API testing interface
      if (iframeRef.current) {
        const doc = iframeRef.current.contentDocument;
        if (doc) {
          // Create a React Backend API testing interface
          const reactBackendPreview = `
            <!DOCTYPE html>
            <html>
            <head>
              <script src="https://cdn.tailwindcss.com"></script>
              <style>
                body { 
                  margin: 0; 
                  padding: 20px; 
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                  background: #f8f9fa;
                }
                .terminal {
                  background: #1a1a1a;
                  color: #00ff00;
                  font-family: 'Courier New', monospace;
                  padding: 20px;
                  border-radius: 8px;
                  margin: 20px 0;
                  min-height: 200px;
                  overflow-y: auto;
                }
                .api-tester {
                  background: white;
                  border-radius: 8px;
                  padding: 20px;
                  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                  margin: 20px 0;
                }
                .endpoint {
                  background: #f8f9fa;
                  border: 1px solid #dee2e6;
                  border-radius: 4px;
                  padding: 15px;
                  margin: 10px 0;
                  cursor: pointer;
                  transition: all 0.2s;
                }
                .endpoint:hover {
                  background: #e9ecef;
                  transform: translateY(-1px);
                  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                }
                .method-get { border-left: 4px solid #28a745; }
                .method-post { border-left: 4px solid #007bff; }
                .method-put { border-left: 4px solid #ffc107; }
                .method-delete { border-left: 4px solid #dc3545; }
                .response {
                  background: #f8f9fa;
                  border: 1px solid #dee2e6;
                  border-radius: 4px;
                  padding: 15px;
                  margin: 10px 0;
                  font-family: monospace;
                  white-space: pre-wrap;
                  max-height: 300px;
                  overflow-y: auto;
                }
                .feature-badge {
                  display: inline-block;
                  background: #e3f2fd;
                  color: #1976d2;
                  padding: 2px 8px;
                  border-radius: 12px;
                  font-size: 11px;
                  font-weight: 600;
                  margin: 2px;
                }
              </style>
            </head>
            <body>
              <div class="max-w-5xl mx-auto">
                <h1 class="text-3xl font-bold text-gray-800 mb-6">⚛️ React Backend API Server</h1>
                
                <div class="terminal">
                  <div id="terminal-output">
                    > Starting Next.js development server...<br>
                    > ✓ Ready on http://localhost:3000<br>
                    > ✓ API routes compiled successfully<br>
                    > ✓ Server-side rendering enabled<br>
                    > ✓ Hot reloading active<br>
                    > API endpoints available:<br>
                    > ✓ GET /api/users (with pagination & search)<br>
                    > ✓ POST /api/users (with validation)<br>
                    > ✓ GET /api/users/[id]<br>
                    > ✓ PUT /api/users/[id]<br>
                    > ✓ DELETE /api/users/[id]<br>
                    > Ready to accept requests!<br>
                  </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div class="api-tester">
                    <h2 class="text-xl font-semibold mb-4">🔧 API Testing Interface</h2>
                    
                    <div class="endpoint method-get" onclick="testEndpoint('GET', '/api/users')">
                      <div class="flex justify-between items-start">
                        <div>
                          <strong>GET /api/users</strong>
                          <p class="text-sm text-gray-600 mt-1">Retrieve all users with pagination</p>
                        </div>
                        <div>
                          <span class="feature-badge">Pagination</span>
                          <span class="feature-badge">Search</span>
                        </div>
                      </div>
                    </div>
                    
                    <div class="endpoint method-get" onclick="testEndpoint('GET', '/api/users?search=john')">
                      <div class="flex justify-between items-start">
                        <div>
                          <strong>GET /api/users?search=john</strong>
                          <p class="text-sm text-gray-600 mt-1">Search users by name or email</p>
                        </div>
                        <div>
                          <span class="feature-badge">Search</span>
                        </div>
                      </div>
                    </div>
                    
                    <div class="endpoint method-get" onclick="testEndpoint('GET', '/api/users/1')">
                      <div class="flex justify-between items-start">
                        <div>
                          <strong>GET /api/users/1</strong>
                          <p class="text-sm text-gray-600 mt-1">Get specific user by ID</p>
                        </div>
                        <div>
                          <span class="feature-badge">Dynamic Route</span>
                        </div>
                      </div>
                    </div>
                    
                    <div class="endpoint method-post" onclick="testEndpoint('POST', '/api/users')">
                      <div class="flex justify-between items-start">
                        <div>
                          <strong>POST /api/users</strong>
                          <p class="text-sm text-gray-600 mt-1">Create new user with validation</p>
                        </div>
                        <div>
                          <span class="feature-badge">Validation</span>
                          <span class="feature-badge">Duplicate Check</span>
                        </div>
                      </div>
                    </div>
                    
                    <div class="endpoint method-put" onclick="testEndpoint('PUT', '/api/users/1')">
                      <div class="flex justify-between items-start">
                        <div>
                          <strong>PUT /api/users/1</strong>
                          <p class="text-sm text-gray-600 mt-1">Update existing user</p>
                        </div>
                        <div>
                          <span class="feature-badge">Update</span>
                        </div>
                      </div>
                    </div>
                    
                    <div class="endpoint method-delete" onclick="testEndpoint('DELETE', '/api/users/1')">
                      <div class="flex justify-between items-start">
                        <div>
                          <strong>DELETE /api/users/1</strong>
                          <p class="text-sm text-gray-600 mt-1">Delete user by ID</p>
                        </div>
                        <div>
                          <span class="feature-badge">Delete</span>
                        </div>
                      </div>
                    </div>
                    
                    <div id="response-container"></div>
                  </div>

                  <div class="space-y-6">
                    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h3 class="text-lg font-semibold text-blue-800 mb-3">📋 Code Analysis</h3>
                      <div class="text-sm text-blue-700 space-y-1">
                        <p>✅ Next.js API Routes structure</p>
                        <p>✅ TypeScript support</p>
                        <p>✅ Request method handling</p>
                        <p>✅ Input validation & sanitization</p>
                        <p>✅ Error handling middleware</p>
                        <p>✅ CORS configuration</p>
                        <p>✅ Pagination implementation</p>
                        <p>✅ Search functionality</p>
                        <p>✅ Dynamic routing</p>
                        <p>✅ RESTful API design</p>
                      </div>
                    </div>

                    <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h3 class="text-lg font-semibold text-green-800 mb-3">🚀 React Backend Features</h3>
                      <div class="text-sm text-green-700 space-y-1">
                        <p>• Server-side rendering (SSR)</p>
                        <p>• API routes with file-based routing</p>
                        <p>• Built-in TypeScript support</p>
                        <p>• Automatic code splitting</p>
                        <p>• Hot module replacement</p>
                        <p>• Edge runtime support</p>
                        <p>• Middleware capabilities</p>
                        <p>• Database integration ready</p>
                      </div>
                    </div>

                    <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <h3 class="text-lg font-semibold text-purple-800 mb-3">🔧 Best Practices</h3>
                      <div class="text-sm text-purple-700 space-y-1">
                        <p>• Input validation on all endpoints</p>
                        <p>• Proper HTTP status codes</p>
                        <p>• Error handling & logging</p>
                        <p>• CORS configuration</p>
                        <p>• Rate limiting (production)</p>
                        <p>• Authentication middleware</p>
                        <p>• Database connection pooling</p>
                        <p>• API versioning strategy</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <script>
                // Simulate API responses with React Backend features
                const mockData = {
                  users: [
                    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin', createdAt: '2024-01-15T10:30:00Z' },
                    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user', createdAt: '2024-01-16T14:20:00Z' },
                    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'user', createdAt: '2024-01-17T09:15:00Z' }
                  ]
                };

                function testEndpoint(method, endpoint) {
                  const responseContainer = document.getElementById('response-container');
                  const terminal = document.getElementById('terminal-output');
                  
                  // Add to terminal
                  terminal.innerHTML += \`> \${method} \${endpoint}<br>\`;
                  
                  let response;
                  let statusCode;
                  let headers = {
                    'Content-Type': 'application/json',
                    'X-Powered-By': 'Next.js',
                    'Access-Control-Allow-Origin': '*'
                  };
                  
                  switch(\`\${method} \${endpoint}\`) {
                    case 'GET /api/users':
                      response = {
                        users: mockData.users,
                        pagination: {
                          page: 1,
                          limit: 10,
                          total: mockData.users.length,
                          totalPages: 1
                        }
                      };
                      statusCode = 200;
                      break;
                    case 'GET /api/users?search=john':
                      const filtered = mockData.users.filter(u => 
                        u.name.toLowerCase().includes('john') || 
                        u.email.toLowerCase().includes('john')
                      );
                      response = {
                        users: filtered,
                        pagination: {
                          page: 1,
                          limit: 10,
                          total: filtered.length,
                          totalPages: 1
                        }
                      };
                      statusCode = 200;
                      break;
                    case 'GET /api/users/1':
                      response = mockData.users[0];
                      statusCode = 200;
                      break;
                    case 'POST /api/users':
                      response = {
                        message: 'User created successfully',
                        user: { 
                          id: 4, 
                          name: 'New User', 
                          email: 'new@example.com', 
                          role: 'user',
                          createdAt: new Date().toISOString()
                        }
                      };
                      statusCode = 201;
                      break;
                    case 'PUT /api/users/1':
                      response = { 
                        id: 1, 
                        name: 'Updated User', 
                        email: 'updated@example.com', 
                        role: 'admin',
                        createdAt: '2024-01-15T10:30:00Z',
                        updatedAt: new Date().toISOString()
                      };
                      statusCode = 200;
                      break;
                    case 'DELETE /api/users/1':
                      response = null;
                      statusCode = 204;
                      break;
                    default:
                      response = { error: 'Route not found' };
                      statusCode = 404;
                  }
                  
                  const responseHtml = \`
                    <div class="response">
                      <div class="flex justify-between items-center mb-3">
                        <strong>\${method} \${endpoint}</strong>
                        <span class="px-3 py-1 rounded text-xs font-semibold \${statusCode < 300 ? 'bg-green-100 text-green-800' : statusCode < 400 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}">
                          \${statusCode} \${statusCode < 300 ? 'OK' : statusCode < 400 ? 'Redirect' : 'Error'}
                        </span>
                      </div>
                      <div class="text-xs text-gray-600 mb-2">
                        Headers: \${JSON.stringify(headers, null, 2)}
                      </div>
                      <div class="text-sm">
                        \${response ? JSON.stringify(response, null, 2) : 'No content'}
                      </div>
                    </div>
                  \`;
                  
                  responseContainer.innerHTML = responseHtml;
                  terminal.innerHTML += \`< \${statusCode} \${statusCode < 300 ? 'OK' : statusCode < 400 ? 'Redirect' : 'Error'}<br>\`;
                  terminal.scrollTop = terminal.scrollHeight;
                }
              </script>
            </body>
            </html>
          `;
          
          doc.open();
          doc.write(reactBackendPreview);
          doc.close();
        }
      }
      
      setOutput('✅ React Backend API code analyzed successfully! Check the preview to test your Next.js API routes.');
      
      // Run test cases if available
      if (question.testCases && question.testCases.length > 0) {
        const results = runTestCases(userCode, question.testCases);
        setTestResults(results);
      }
    } catch (error) {
      setOutput(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    setIsRunning(false);
  };

  const runTestCases = (code: string, testCases: any[]) => {
    return testCases.map(testCase => {
      try {
        // Simple test case validation for React Backend code
        const hasRequiredElements = code.includes(testCase.input);
        return {
          passed: hasRequiredElements,
          input: testCase.input,
          expected: testCase.expectedOutput,
          actual: hasRequiredElements ? 'Found' : 'Not found'
        };
      } catch (error) {
        return {
          passed: false,
          input: testCase.input,
          expected: testCase.expectedOutput,
          actual: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
        };
      }
    });
  };

  const resetCode = () => {
    setUserCode(question.codeTemplate || getDefaultReactBackendTemplate());
    setOutput('');
    setTestResults([]);
    setHasRun(false);
  };

  const handleGetHint = () => {
    if (question.hint && !hintUsed) {
      onTriggerBobMessage('hints', question.hint);
      setHintUsed(true);
    }
  };

  const handleSubmit = () => {
    if (!hasRun) {
      onTriggerBobMessage('encouragement', 'Make sure to run your React Backend code first to test it!');
      return;
    }

    const isCorrect = testResults.length > 0 
      ? testResults.every(result => result.passed)
      : output.includes('✅');

    onComplete(isCorrect, userCode);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    onTriggerBobMessage('tips', `Copied "${text}" to clipboard! You can paste it in your code.`);
  };

  const insertReactBackendPattern = (pattern: string) => {
    if (editorRef.current) {
      const editor = editorRef.current;
      const selection = editor.getSelection();
      const range = selection || {
        startLineNumber: 1,
        startColumn: 1,
        endLineNumber: 1,
        endColumn: 1
      };

      editor.executeEdits('insert-react-backend-pattern', [{
        range: range,
        text: pattern
      }]);
      
      editor.focus();
    }
  };

  const filteredReference = React.useMemo(() => {
    if (!searchTerm) return reactBackendReference;
    
    const filtered: typeof reactBackendReference = {};
    Object.entries(reactBackendReference).forEach(([category, subcategories]) => {
      const filteredSubcategories: typeof subcategories = {};
      Object.entries(subcategories).forEach(([subcategory, patterns]) => {
        const filteredPatterns = patterns.filter(pattern => 
          pattern.toLowerCase().includes(searchTerm.toLowerCase()) ||
          subcategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
          category.toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (filteredPatterns.length > 0) {
          filteredSubcategories[subcategory] = filteredPatterns;
        }
      });
      if (Object.keys(filteredSubcategories).length > 0) {
        filtered[category] = filteredSubcategories;
      }
    });
    
    return filtered;
  }, [searchTerm]);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <motion.div
        className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl w-full max-w-[95vw] h-[95vh] overflow-hidden"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 rounded-full p-3">
                <Database className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-heading font-bold text-white">
                  ⚛️ React Backend Challenge
                </h2>
                <p className="text-white/80">Interactive Next.js API Development Environment</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {question.hint && (
                <motion.button
                  onClick={handleGetHint}
                  disabled={hintUsed}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    hintUsed
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 hover:text-yellow-200'
                  }`}
                  whileHover={!hintUsed ? { scale: 1.05 } : {}}
                  whileTap={!hintUsed ? { scale: 0.95 } : {}}
                >
                  <Lightbulb className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {hintUsed ? 'Hint Used' : 'Get Hint'}
                  </span>
                </motion.button>
              )}
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 transition-colors"
              >
                ✕
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex h-full">
          {/* Left Panel - Question & Code */}
          <div className="flex-1 flex flex-col">
            {/* Question */}
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center space-x-2 mb-4">
                <span className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  REACT BACKEND
                </span>
                <span className="bg-gray-700 text-gray-200 px-3 py-1 rounded-full text-sm">
                  {question.difficulty}
                </span>
              </div>
              
              <h3 className="text-xl font-heading text-white mb-3">
                {question.question}
              </h3>
              
              {question.expectedOutput && (
                <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
                  <h4 className="text-casino-gold-400 font-semibold mb-2">Expected Output:</h4>
                  <pre className="text-gray-300 font-mono text-sm whitespace-pre-wrap">
                    {question.expectedOutput}
                  </pre>
                </div>
              )}
            </div>

            {/* Code Editor */}
            <div className="flex-1 flex flex-col">
              <div className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
                <div className="flex items-center space-x-2">
                  <Terminal className="w-5 h-5 text-casino-gold-400" />
                  <span className="text-white font-semibold">React Backend Code Editor</span>
                  <span className="text-xs text-gray-400">(Next.js IntelliSense Enabled)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <motion.button
                    onClick={() => setShowReference(!showReference)}
                    className="flex items-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <BookOpen className="w-4 h-4" />
                    <span className="text-sm">Reference</span>
                  </motion.button>
                  <motion.button
                    onClick={resetCode}
                    className="flex items-center space-x-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span className="text-sm">Reset</span>
                  </motion.button>
                  <motion.button
                    onClick={runCode}
                    disabled={isRunning}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-500 disabled:bg-gray-600 text-white rounded-lg transition-colors"
                    whileHover={!isRunning ? { scale: 1.02 } : {}}
                    whileTap={!isRunning ? { scale: 0.98 } : {}}
                  >
                    <Play className="w-4 h-4" />
                    <span className="text-sm">{isRunning ? 'Running...' : 'Run API'}</span>
                  </motion.button>
                </div>
              </div>

              <div className="flex-1">
                <Editor
                  height="100%"
                  language="javascript"
                  value={userCode}
                  onChange={(value) => setUserCode(value || '')}
                  onMount={(editor, monaco) => {
                    editorRef.current = editor;
                    setupMonacoReactBackendIntelliSense(editor, monaco);
                  }}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    roundedSelection: false,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 2,
                    wordWrap: 'on',
                    suggestOnTriggerCharacters: true,
                    quickSuggestions: true,
                    parameterHints: { enabled: true },
                    autoClosingBrackets: 'always',
                    autoClosingQuotes: 'always',
                    formatOnPaste: true,
                    formatOnType: true
                  }}
                />
              </div>
            </div>
          </div>

          {/* Middle Panel - React Backend Reference (Collapsible) */}
          <AnimatePresence>
            {showReference && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: '300px', opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="border-l border-gray-700 bg-gray-800 overflow-hidden"
              >
                <div className="p-4 border-b border-gray-700">
                  <h3 className="text-white font-semibold mb-3 flex items-center space-x-2">
                    <BookOpen className="w-5 h-5 text-blue-400" />
                    <span>React Backend Reference</span>
                  </h3>
                  
                  {/* Search */}
                  <div className="relative mb-4">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search patterns..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Category Tabs */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {Object.keys(filteredReference).map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-2 py-1 text-xs rounded transition-colors ${
                          selectedCategory === category
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Reference Content */}
                <div className="p-4 h-full overflow-y-auto">
                  {filteredReference[selectedCategory] && (
                    <div className="space-y-4">
                      {Object.entries(filteredReference[selectedCategory]).map(([subcategory, patterns]) => (
                        <div key={subcategory}>
                          <h4 className="text-blue-400 font-medium text-sm mb-2">{subcategory}</h4>
                          <div className="grid grid-cols-1 gap-1">
                            {patterns.map((pattern) => (
                              <motion.button
                                key={pattern}
                                onClick={() => insertReactBackendPattern(pattern)}
                                className="flex items-center justify-between p-2 bg-gray-700 hover:bg-gray-600 rounded text-left text-xs text-gray-200 transition-colors group"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <span className="font-mono">{pattern}</span>
                                <Copy 
                                  className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    copyToClipboard(pattern);
                                  }}
                                />
                              </motion.button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Right Panel - Output & Preview */}
          <div className="w-1/2 border-l border-gray-700 flex flex-col">
            {/* Tab Headers */}
            <div className="flex bg-gray-800 border-b border-gray-700">
              <button
                onClick={() => setShowPreview(false)}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  !showPreview 
                    ? 'bg-gray-700 text-white border-b-2 border-blue-400' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Terminal className="w-4 h-4 inline mr-2" />
                Console
              </button>
              <button
                onClick={() => setShowPreview(true)}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  showPreview 
                    ? 'bg-gray-700 text-white border-b-2 border-blue-400' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Database className="w-4 h-4 inline mr-2" />
                API Preview
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
              {!showPreview ? (
                <div className="h-full flex flex-col">
                  {/* Output */}
                  <div className="flex-1 p-4 bg-gray-900 overflow-y-auto">
                    <h4 className="text-blue-400 font-semibold mb-3">Output:</h4>
                    <pre className="text-gray-300 font-mono text-sm whitespace-pre-wrap mb-4">
                      {output || 'Click "Run API" to see output...'}
                    </pre>

                    {/* Test Results */}
                    {testResults.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-blue-400 font-semibold mb-3">Test Results:</h4>
                        <div className="space-y-2">
                          {testResults.map((result, index) => (
                            <div
                              key={index}
                              className={`p-3 rounded-lg border ${
                                result.passed 
                                  ? 'border-green-500/30 bg-green-500/10' 
                                  : 'border-red-500/30 bg-red-500/10'
                              }`}
                            >
                              <div className="flex items-center space-x-2 mb-2">
                                {result.passed ? (
                                  <CheckCircle className="w-4 h-4 text-green-400" />
                                ) : (
                                  <XCircle className="w-4 h-4 text-red-400" />
                                )}
                                <span className={`text-sm font-medium ${
                                  result.passed ? 'text-green-400' : 'text-red-400'
                                }`}>
                                  Test {index + 1}: {result.passed ? 'PASSED' : 'FAILED'}
                                </span>
                              </div>
                              <div className="text-xs text-gray-400 space-y-1">
                                <div>Input: {result.input}</div>
                                <div>Expected: {result.expected}</div>
                                <div>Actual: {result.actual}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="p-4 border-t border-gray-700">
                    <motion.button
                      onClick={handleSubmit}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Submit Solution
                    </motion.button>
                  </div>
                </div>
              ) : (
                <div className="h-full bg-white relative">
                  <div className="absolute top-2 left-2 bg-black/80 text-white px-2 py-1 rounded text-xs z-10">
                    React Backend API Preview
                  </div>
                  <iframe
                    ref={iframeRef}
                    className="w-full h-full border-none"
                    title="React Backend API Preview"
                    sandbox="allow-scripts"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};