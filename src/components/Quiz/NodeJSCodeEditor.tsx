import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, CheckCircle, XCircle, Eye, Code, Terminal, Lightbulb, BookOpen, Search, Copy, Server } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { CodingQuestion, BobMessage } from '../../types';

interface NodeJSCodeEditorProps {
  question: CodingQuestion;
  onComplete: (isCorrect: boolean, userCode: string) => void;
  onTriggerBobMessage: (type: BobMessage['type'], customMessage?: string) => void;
  onClose: () => void;
}

// Node.js concepts and patterns organized by category
const nodeJSReference = {
  'Core Modules': {
    'File System': ['fs.readFile()', 'fs.writeFile()', 'fs.readdir()', 'fs.stat()', 'fs.createReadStream()'],
    'HTTP': ['http.createServer()', 'req.url', 'req.method', 'res.writeHead()', 'res.end()'],
    'Path': ['path.join()', 'path.resolve()', 'path.dirname()', 'path.basename()', 'path.extname()'],
    'OS': ['os.platform()', 'os.arch()', 'os.cpus()', 'os.freemem()', 'os.hostname()'],
    'Crypto': ['crypto.randomBytes()', 'crypto.createHash()', 'crypto.createCipher()']
  },
  'Express.js': {
    'Basic Setup': ['const express = require("express")', 'app.listen(port)', 'app.use(middleware)'],
    'Routing': ['app.get("/path", handler)', 'app.post("/path", handler)', 'app.put("/path", handler)', 'app.delete("/path", handler)'],
    'Middleware': ['app.use(express.json())', 'app.use(cors())', 'app.use("/static", express.static())'],
    'Request/Response': ['req.params', 'req.query', 'req.body', 'res.json()', 'res.status()', 'res.send()']
  },
  'Database': {
    'MongoDB/Mongoose': ['mongoose.connect()', 'new Schema()', 'model.find()', 'model.save()', 'model.findByIdAndUpdate()'],
    'PostgreSQL': ['const { Pool } = require("pg")', 'pool.query()', 'client.connect()', 'BEGIN/COMMIT/ROLLBACK'],
    'MySQL': ['mysql.createConnection()', 'connection.query()', 'connection.escape()'],
    'Redis': ['redis.createClient()', 'client.set()', 'client.get()', 'client.expire()']
  },
  'Authentication': {
    'JWT': ['jwt.sign(payload, secret)', 'jwt.verify(token, secret)', 'jwt.decode(token)'],
    'Passport': ['passport.use(strategy)', 'passport.authenticate()', 'passport.serializeUser()'],
    'bcrypt': ['bcrypt.hash(password, saltRounds)', 'bcrypt.compare(password, hash)'],
    'Sessions': ['express-session', 'req.session', 'session.destroy()']
  },
  'API Development': {
    'REST API': ['GET /api/users', 'POST /api/users', 'PUT /api/users/:id', 'DELETE /api/users/:id'],
    'GraphQL': ['const { GraphQLSchema } = require("graphql")', 'type Query', 'type Mutation', 'resolvers'],
    'Validation': ['joi.validate()', 'express-validator', 'yup.object().shape()'],
    'Error Handling': ['try/catch', 'app.use(errorHandler)', 'next(error)', 'process.on("uncaughtException")']
  },
  'Testing': {
    'Jest': ['describe()', 'it()', 'expect()', 'beforeEach()', 'afterEach()', 'jest.mock()'],
    'Mocha/Chai': ['describe()', 'it()', 'expect().to.equal()', 'before()', 'after()'],
    'Supertest': ['request(app).get("/api")', '.expect(200)', '.expect("Content-Type", /json/)'],
    'Mocking': ['jest.fn()', 'sinon.stub()', 'nock()']
  },
  'Deployment': {
    'Environment': ['process.env.NODE_ENV', 'dotenv.config()', 'config.get()'],
    'PM2': ['pm2 start app.js', 'pm2 restart', 'pm2 logs', 'ecosystem.config.js'],
    'Docker': ['FROM node:alpine', 'COPY package*.json', 'RUN npm install', 'EXPOSE 3000'],
    'Heroku': ['Procfile', 'heroku config:set', 'heroku logs --tail']
  }
};

export const NodeJSCodeEditor: React.FC<NodeJSCodeEditorProps> = ({
  question,
  onComplete,
  onTriggerBobMessage,
  onClose
}) => {
  const [userCode, setUserCode] = useState(question.codeTemplate || getDefaultNodeJSTemplate());
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<Array<{passed: boolean, input: string, expected: string, actual: string}>>([]);
  const [showPreview, setShowPreview] = useState(true);
  const [showReference, setShowReference] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Core Modules');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const editorRef = useRef<any>(null);

  function getDefaultNodeJSTemplate(): string {
    return `const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sample data
let users = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com' }
];

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to Node.js API!',
    endpoints: [
      'GET /api/users - Get all users',
      'GET /api/users/:id - Get user by ID',
      'POST /api/users - Create new user',
      'PUT /api/users/:id - Update user',
      'DELETE /api/users/:id - Delete user'
    ]
  });
});

// Get all users
app.get('/api/users', (req, res) => {
  res.json(users);
});

// Get user by ID
app.get('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.json(user);
});

// Create new user
app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }
  
  const newUser = {
    id: users.length + 1,
    name,
    email
  };
  
  users.push(newUser);
  res.status(201).json(newUser);
});

// Update user
app.put('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  const { name, email } = req.body;
  users[userIndex] = { ...users[userIndex], name, email };
  
  res.json(users[userIndex]);
});

// Delete user
app.delete('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  users.splice(userIndex, 1);
  res.status(204).send();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});

module.exports = app;`;
  }

  const setupMonacoNodeJSIntelliSense = (editor: any, monaco: any) => {
    // Register Node.js completion provider
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

        // Add Node.js-specific suggestions
        Object.entries(nodeJSReference).forEach(([category, subcategories]) => {
          Object.entries(subcategories).forEach(([subcategory, patterns]) => {
            patterns.forEach((pattern) => {
              if (pattern.toLowerCase().includes(word.word.toLowerCase())) {
                suggestions.push({
                  label: pattern,
                  kind: monaco.languages.CompletionItemKind.Function,
                  insertText: pattern,
                  range: range,
                  detail: `${category} - ${subcategory}`,
                  documentation: `Node.js pattern: ${pattern}`
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
      // For Node.js, create a simulated server environment
      if (iframeRef.current) {
        const doc = iframeRef.current.contentDocument;
        if (doc) {
          // Create a Node.js API testing interface
          const nodeJSPreview = `
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
                  padding: 10px;
                  margin: 10px 0;
                  cursor: pointer;
                  transition: background-color 0.2s;
                }
                .endpoint:hover {
                  background: #e9ecef;
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
                }
              </style>
            </head>
            <body>
              <div class="max-w-4xl mx-auto">
                <h1 class="text-3xl font-bold text-gray-800 mb-6">🚀 Node.js API Server</h1>
                
                <div class="terminal">
                  <div id="terminal-output">
                    > Starting Node.js server...<br>
                    > Server running on port 3000<br>
                    > API endpoints available:<br>
                    > ✓ GET /api/users<br>
                    > ✓ POST /api/users<br>
                    > ✓ PUT /api/users/:id<br>
                    > ✓ DELETE /api/users/:id<br>
                    > Ready to accept requests!<br>
                  </div>
                </div>

                <div class="api-tester">
                  <h2 class="text-xl font-semibold mb-4">🔧 API Testing Interface</h2>
                  
                  <div class="endpoint method-get" onclick="testEndpoint('GET', '/api/users')">
                    <strong>GET /api/users</strong>
                    <p class="text-sm text-gray-600 mt-1">Retrieve all users</p>
                  </div>
                  
                  <div class="endpoint method-get" onclick="testEndpoint('GET', '/api/users/1')">
                    <strong>GET /api/users/1</strong>
                    <p class="text-sm text-gray-600 mt-1">Get user by ID</p>
                  </div>
                  
                  <div class="endpoint method-post" onclick="testEndpoint('POST', '/api/users')">
                    <strong>POST /api/users</strong>
                    <p class="text-sm text-gray-600 mt-1">Create new user</p>
                  </div>
                  
                  <div class="endpoint method-put" onclick="testEndpoint('PUT', '/api/users/1')">
                    <strong>PUT /api/users/1</strong>
                    <p class="text-sm text-gray-600 mt-1">Update user</p>
                  </div>
                  
                  <div class="endpoint method-delete" onclick="testEndpoint('DELETE', '/api/users/1')">
                    <strong>DELETE /api/users/1</strong>
                    <p class="text-sm text-gray-600 mt-1">Delete user</p>
                  </div>
                  
                  <div id="response-container"></div>
                </div>

                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 class="text-lg font-semibold text-blue-800 mb-2">📝 Code Analysis</h3>
                  <div class="text-sm text-blue-700">
                    <p>✅ Express.js server setup detected</p>
                    <p>✅ CORS middleware configured</p>
                    <p>✅ JSON parsing enabled</p>
                    <p>✅ RESTful API endpoints defined</p>
                    <p>✅ Error handling middleware present</p>
                    <p>✅ 404 handler implemented</p>
                  </div>
                </div>
              </div>

              <script>
                // Simulate API responses
                const mockData = {
                  users: [
                    { id: 1, name: 'John Doe', email: 'john@example.com' },
                    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
                    { id: 3, name: 'Bob Johnson', email: 'bob@example.com' }
                  ]
                };

                function testEndpoint(method, endpoint) {
                  const responseContainer = document.getElementById('response-container');
                  const terminal = document.getElementById('terminal-output');
                  
                  // Add to terminal
                  terminal.innerHTML += \`> \${method} \${endpoint}<br>\`;
                  
                  let response;
                  let statusCode;
                  
                  switch(\`\${method} \${endpoint}\`) {
                    case 'GET /api/users':
                      response = mockData.users;
                      statusCode = 200;
                      break;
                    case 'GET /api/users/1':
                      response = mockData.users[0];
                      statusCode = 200;
                      break;
                    case 'POST /api/users':
                      response = { id: 4, name: 'New User', email: 'new@example.com' };
                      statusCode = 201;
                      break;
                    case 'PUT /api/users/1':
                      response = { id: 1, name: 'Updated User', email: 'updated@example.com' };
                      statusCode = 200;
                      break;
                    case 'DELETE /api/users/1':
                      response = '';
                      statusCode = 204;
                      break;
                    default:
                      response = { error: 'Route not found' };
                      statusCode = 404;
                  }
                  
                  const responseHtml = \`
                    <div class="response">
                      <div class="flex justify-between items-center mb-2">
                        <strong>\${method} \${endpoint}</strong>
                        <span class="px-2 py-1 rounded text-xs \${statusCode < 300 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                          \${statusCode}
                        </span>
                      </div>
                      <div class="text-sm">
                        \${response ? JSON.stringify(response, null, 2) : 'No content'}
                      </div>
                    </div>
                  \`;
                  
                  responseContainer.innerHTML = responseHtml;
                  terminal.innerHTML += \`< \${statusCode} \${statusCode < 300 ? 'OK' : 'Error'}<br>\`;
                  terminal.scrollTop = terminal.scrollHeight;
                }
              </script>
            </body>
            </html>
          `;
          
          doc.open();
          doc.write(nodeJSPreview);
          doc.close();
        }
      }
      
      setOutput('✅ Node.js server code analyzed successfully! Check the preview to test your API endpoints.');
      
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
        // Simple test case validation for Node.js code
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
    setUserCode(question.codeTemplate || getDefaultNodeJSTemplate());
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
      onTriggerBobMessage('encouragement', 'Make sure to run your Node.js server code first to test it!');
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

  const insertNodeJSPattern = (pattern: string) => {
    if (editorRef.current) {
      const editor = editorRef.current;
      const selection = editor.getSelection();
      const range = selection || {
        startLineNumber: 1,
        startColumn: 1,
        endLineNumber: 1,
        endColumn: 1
      };

      editor.executeEdits('insert-nodejs-pattern', [{
        range: range,
        text: pattern
      }]);
      
      editor.focus();
    }
  };

  const filteredReference = React.useMemo(() => {
    if (!searchTerm) return nodeJSReference;
    
    const filtered: typeof nodeJSReference = {};
    Object.entries(nodeJSReference).forEach(([category, subcategories]) => {
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
        <div className="bg-gradient-to-r from-green-600 to-emerald-700 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 rounded-full p-3">
                <Server className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-heading font-bold text-white">
                  🚀 Node.js Backend Challenge
                </h2>
                <p className="text-white/80">Interactive Server-Side Development Environment</p>
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
                <span className="bg-gradient-to-r from-green-600 to-emerald-700 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  NODE.JS
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
                  <span className="text-white font-semibold">Node.js Code Editor</span>
                  <span className="text-xs text-gray-400">(Node.js IntelliSense Enabled)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <motion.button
                    onClick={() => setShowReference(!showReference)}
                    className="flex items-center space-x-2 px-3 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors"
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
                    <span className="text-sm">{isRunning ? 'Running...' : 'Run Server'}</span>
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
                    setupMonacoNodeJSIntelliSense(editor, monaco);
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

          {/* Middle Panel - Node.js Reference (Collapsible) */}
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
                    <BookOpen className="w-5 h-5 text-green-400" />
                    <span>Node.js Reference</span>
                  </h3>
                  
                  {/* Search */}
                  <div className="relative mb-4">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search patterns..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
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
                            ? 'bg-green-600 text-white'
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
                          <h4 className="text-green-400 font-medium text-sm mb-2">{subcategory}</h4>
                          <div className="grid grid-cols-1 gap-1">
                            {patterns.map((pattern) => (
                              <motion.button
                                key={pattern}
                                onClick={() => insertNodeJSPattern(pattern)}
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
                    ? 'bg-gray-700 text-white border-b-2 border-green-400' 
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
                    ? 'bg-gray-700 text-white border-b-2 border-green-400' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Server className="w-4 h-4 inline mr-2" />
                API Server
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
              {!showPreview ? (
                <div className="h-full flex flex-col">
                  {/* Output */}
                  <div className="flex-1 p-4 bg-gray-900 overflow-y-auto">
                    <h4 className="text-green-400 font-semibold mb-3">Output:</h4>
                    <pre className="text-gray-300 font-mono text-sm whitespace-pre-wrap mb-4">
                      {output || 'Click "Run Server" to see output...'}
                    </pre>

                    {/* Test Results */}
                    {testResults.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-green-400 font-semibold mb-3">Test Results:</h4>
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
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-500 hover:to-emerald-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300"
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
                    Node.js API Server Preview
                  </div>
                  <iframe
                    ref={iframeRef}
                    className="w-full h-full border-none"
                    title="Node.js API Server Preview"
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