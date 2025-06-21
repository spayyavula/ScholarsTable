import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, CheckCircle, XCircle, Eye, Code, Terminal, Lightbulb } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { CodingQuestion, BobMessage } from '../../types';

interface InteractiveCodeEditorProps {
  question: CodingQuestion;
  onComplete: (isCorrect: boolean, userCode: string) => void;
  onTriggerBobMessage: (type: BobMessage['type'], customMessage?: string) => void;
  onClose: () => void;
}

export const InteractiveCodeEditor: React.FC<InteractiveCodeEditorProps> = ({
  question,
  onComplete,
  onTriggerBobMessage,
  onClose
}) => {
  const [userCode, setUserCode] = useState(question.codeTemplate || getDefaultTemplate(question.language));
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<Array<{passed: boolean, input: string, expected: string, actual: string}>>([]);
  const [showPreview, setShowPreview] = useState(question.language === 'html' || question.language === 'css');
  const [hasRun, setHasRun] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  function getDefaultTemplate(language: string): string {
    switch (language) {
      case 'html':
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Solution</title>
</head>
<body>
    <!-- Write your HTML here -->
    
</body>
</html>`;
      case 'css':
        return `/* Write your CSS here */
body {
    font-family: Arial, sans-serif;
    margin: 20px;
}

/* Your styles below */
`;
      case 'javascript':
        return `// Write your JavaScript here
function solution() {
    // Your code here
    
}

// Test your function
console.log(solution());`;
      default:
        return '// Write your code here';
    }
  }

  const getLanguageColor = (language: string) => {
    switch (language) {
      case 'html': return 'from-orange-500 to-orange-600';
      case 'css': return 'from-blue-500 to-blue-600';
      case 'javascript': return 'from-yellow-500 to-yellow-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getLanguageIcon = (language: string) => {
    switch (language) {
      case 'html': return '🌐';
      case 'css': return '🎨';
      case 'javascript': return '⚡';
      default: return '💻';
    }
  };

  const runCode = async () => {
    setIsRunning(true);
    setHasRun(true);
    setOutput('');
    setTestResults([]);

    try {
      if (question.language === 'html' || question.language === 'css') {
        // For HTML/CSS, update the preview iframe
        if (iframeRef.current) {
          const doc = iframeRef.current.contentDocument;
          if (doc) {
            if (question.language === 'html') {
              doc.open();
              doc.write(userCode);
              doc.close();
            } else {
              // For CSS, wrap in HTML
              doc.open();
              doc.write(`
                <!DOCTYPE html>
                <html>
                <head>
                  <style>${userCode}</style>
                </head>
                <body>
                  <div class="container">
                    <h1>Sample Heading</h1>
                    <p>Sample paragraph text.</p>
                    <button>Sample Button</button>
                    <div class="box">Sample Box</div>
                  </div>
                </body>
                </html>
              `);
              doc.close();
            }
          }
        }
        
        // Check against expected output if available
        if (question.expectedOutput) {
          const isCorrect = checkHTMLCSSOutput();
          setOutput(isCorrect ? '✅ Output matches expected result!' : '❌ Output doesn\'t match expected result');
        } else {
          setOutput('✅ Code executed successfully! Check the preview.');
        }
      } else if (question.language === 'javascript') {
        // For JavaScript, execute in a safe context
        const result = executeJavaScript(userCode);
        setOutput(result.output);
        
        // Run test cases if available
        if (question.testCases && question.testCases.length > 0) {
          const results = runTestCases(userCode, question.testCases);
          setTestResults(results);
        }
      }
    } catch (error) {
      setOutput(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    setIsRunning(false);
  };

  const executeJavaScript = (code: string) => {
    const logs: string[] = [];
    const originalConsoleLog = console.log;
    
    // Capture console.log output
    console.log = (...args) => {
      logs.push(args.map(arg => String(arg)).join(' '));
    };

    try {
      // Create a safe execution context
      const func = new Function('console', code);
      func({ log: (...args: any[]) => logs.push(args.map(arg => String(arg)).join(' ')) });
      
      return {
        output: logs.length > 0 ? logs.join('\n') : '✅ Code executed successfully (no output)',
        success: true
      };
    } catch (error) {
      return {
        output: `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        success: false
      };
    } finally {
      console.log = originalConsoleLog;
    }
  };

  const runTestCases = (code: string, testCases: any[]) => {
    return testCases.map(testCase => {
      try {
        // This is a simplified test runner - in a real implementation,
        // you'd want more sophisticated test case execution
        const func = new Function('return ' + code.replace(/console\.log.*?;/g, ''));
        const result = func();
        const actual = String(result);
        const expected = String(testCase.expectedOutput);
        
        return {
          passed: actual === expected,
          input: testCase.input,
          expected,
          actual
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

  const checkHTMLCSSOutput = (): boolean => {
    // This is a simplified check - in a real implementation,
    // you'd want more sophisticated HTML/CSS validation
    return userCode.toLowerCase().includes(question.expectedOutput?.toLowerCase() || '');
  };

  const resetCode = () => {
    setUserCode(question.codeTemplate || getDefaultTemplate(question.language));
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
      onTriggerBobMessage('encouragement', 'Make sure to run your code first to test it!');
      return;
    }

    const isCorrect = testResults.length > 0 
      ? testResults.every(result => result.passed)
      : output.includes('✅');

    onComplete(isCorrect, userCode);
  };

  const getEditorLanguage = (lang: string) => {
    switch (lang) {
      case 'javascript': return 'javascript';
      case 'html': return 'html';
      case 'css': return 'css';
      default: return 'javascript';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <motion.div
        className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl w-full max-w-7xl h-[90vh] overflow-hidden"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className={`bg-gradient-to-r ${getLanguageColor(question.language)} p-6`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 rounded-full p-3">
                <Code className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-heading font-bold text-white">
                  {getLanguageIcon(question.language)} {question.language.toUpperCase()} Challenge
                </h2>
                <p className="text-white/80">Interactive Coding Environment</p>
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
                <span className={`bg-gradient-to-r ${getLanguageColor(question.language)} text-white px-3 py-1 rounded-full text-sm font-semibold`}>
                  {question.language.toUpperCase()}
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
                  <span className="text-white font-semibold">Code Editor</span>
                </div>
                <div className="flex items-center space-x-2">
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
                    <span className="text-sm">{isRunning ? 'Running...' : 'Run Code'}</span>
                  </motion.button>
                </div>
              </div>

              <div className="flex-1">
                <Editor
                  height="100%"
                  language={getEditorLanguage(question.language)}
                  value={userCode}
                  onChange={(value) => setUserCode(value || '')}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    roundedSelection: false,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 2,
                    wordWrap: 'on'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Right Panel - Output & Preview */}
          <div className="w-1/2 border-l border-gray-700 flex flex-col">
            {/* Tab Headers */}
            <div className="flex bg-gray-800 border-b border-gray-700">
              <button
                onClick={() => setShowPreview(false)}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  !showPreview 
                    ? 'bg-gray-700 text-white border-b-2 border-casino-gold-400' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Terminal className="w-4 h-4 inline mr-2" />
                Console
              </button>
              {(question.language === 'html' || question.language === 'css') && (
                <button
                  onClick={() => setShowPreview(true)}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                    showPreview 
                      ? 'bg-gray-700 text-white border-b-2 border-casino-gold-400' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Eye className="w-4 h-4 inline mr-2" />
                  Preview
                </button>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
              {!showPreview ? (
                <div className="h-full flex flex-col">
                  {/* Output */}
                  <div className="flex-1 p-4 bg-gray-900 overflow-y-auto">
                    <h4 className="text-casino-gold-400 font-semibold mb-3">Output:</h4>
                    <pre className="text-gray-300 font-mono text-sm whitespace-pre-wrap mb-4">
                      {output || 'Click "Run Code" to see output...'}
                    </pre>

                    {/* Test Results */}
                    {testResults.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-casino-gold-400 font-semibold mb-3">Test Results:</h4>
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
                      className="w-full bg-gradient-to-r from-casino-gold-500 to-casino-gold-600 hover:from-casino-gold-400 hover:to-casino-gold-500 text-gray-900 font-semibold py-3 px-4 rounded-lg transition-all duration-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Submit Solution
                    </motion.button>
                  </div>
                </div>
              ) : (
                <div className="h-full bg-white">
                  <iframe
                    ref={iframeRef}
                    className="w-full h-full border-none"
                    title="Code Preview"
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