import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, CheckCircle, XCircle, Eye, Code, Terminal, Lightbulb, BookOpen, Search, Copy } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { CodingQuestion, BobMessage } from '../../types';

interface TailwindCodeEditorProps {
  question: CodingQuestion;
  onComplete: (isCorrect: boolean, userCode: string) => void;
  onTriggerBobMessage: (type: BobMessage['type'], customMessage?: string) => void;
  onClose: () => void;
}

// Tailwind CSS classes organized by category for reference panel
const tailwindReference = {
  'Layout': {
    'Container': ['container', 'mx-auto'],
    'Display': ['block', 'inline-block', 'inline', 'flex', 'inline-flex', 'grid', 'inline-grid', 'hidden'],
    'Position': ['static', 'fixed', 'absolute', 'relative', 'sticky'],
    'Float': ['float-right', 'float-left', 'float-none', 'clear-left', 'clear-right', 'clear-both']
  },
  'Flexbox & Grid': {
    'Flex Direction': ['flex-row', 'flex-row-reverse', 'flex-col', 'flex-col-reverse'],
    'Flex Wrap': ['flex-wrap', 'flex-wrap-reverse', 'flex-nowrap'],
    'Justify Content': ['justify-start', 'justify-end', 'justify-center', 'justify-between', 'justify-around', 'justify-evenly'],
    'Align Items': ['items-start', 'items-end', 'items-center', 'items-baseline', 'items-stretch'],
    'Grid Template': ['grid-cols-1', 'grid-cols-2', 'grid-cols-3', 'grid-cols-4', 'grid-cols-6', 'grid-cols-12']
  },
  'Spacing': {
    'Padding': ['p-0', 'p-1', 'p-2', 'p-3', 'p-4', 'p-6', 'p-8', 'px-4', 'py-2', 'pt-4', 'pb-4', 'pl-2', 'pr-2'],
    'Margin': ['m-0', 'm-1', 'm-2', 'm-3', 'm-4', 'm-6', 'm-8', 'mx-auto', 'my-4', 'mt-4', 'mb-4', 'ml-2', 'mr-2'],
    'Space Between': ['space-x-1', 'space-x-2', 'space-x-4', 'space-y-1', 'space-y-2', 'space-y-4']
  },
  'Sizing': {
    'Width': ['w-auto', 'w-full', 'w-1/2', 'w-1/3', 'w-2/3', 'w-1/4', 'w-3/4', 'w-screen'],
    'Height': ['h-auto', 'h-full', 'h-screen', 'h-32', 'h-48', 'h-64'],
    'Min/Max Width': ['min-w-0', 'min-w-full', 'max-w-xs', 'max-w-sm', 'max-w-md', 'max-w-lg', 'max-w-xl']
  },
  'Typography': {
    'Font Size': ['text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl', 'text-4xl'],
    'Font Weight': ['font-thin', 'font-light', 'font-normal', 'font-medium', 'font-semibold', 'font-bold'],
    'Text Align': ['text-left', 'text-center', 'text-right', 'text-justify'],
    'Text Color': ['text-black', 'text-white', 'text-gray-500', 'text-red-500', 'text-blue-500', 'text-green-500']
  },
  'Backgrounds': {
    'Background Color': ['bg-transparent', 'bg-black', 'bg-white', 'bg-gray-100', 'bg-red-500', 'bg-blue-500', 'bg-green-500'],
    'Gradients': ['bg-gradient-to-r', 'bg-gradient-to-l', 'bg-gradient-to-t', 'bg-gradient-to-b', 'from-blue-500', 'to-purple-600']
  },
  'Borders': {
    'Border Width': ['border', 'border-0', 'border-2', 'border-4', 'border-t', 'border-r', 'border-b', 'border-l'],
    'Border Color': ['border-gray-200', 'border-gray-300', 'border-red-500', 'border-blue-500'],
    'Border Radius': ['rounded-none', 'rounded-sm', 'rounded', 'rounded-md', 'rounded-lg', 'rounded-xl', 'rounded-full']
  },
  'Effects': {
    'Shadow': ['shadow-sm', 'shadow', 'shadow-md', 'shadow-lg', 'shadow-xl', 'shadow-2xl'],
    'Opacity': ['opacity-0', 'opacity-25', 'opacity-50', 'opacity-75', 'opacity-100'],
    'Transform': ['transform', 'scale-75', 'scale-100', 'scale-125', 'rotate-45', 'rotate-90']
  },
  'Interactivity': {
    'Cursor': ['cursor-auto', 'cursor-default', 'cursor-pointer', 'cursor-wait', 'cursor-text'],
    'User Select': ['select-none', 'select-text', 'select-all', 'select-auto'],
    'Pointer Events': ['pointer-events-none', 'pointer-events-auto']
  }
};

export const TailwindCodeEditor: React.FC<TailwindCodeEditorProps> = ({
  question,
  onComplete,
  onTriggerBobMessage,
  onClose
}) => {
  const [userCode, setUserCode] = useState(question.codeTemplate || getDefaultTailwindTemplate(question.language));
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<Array<{passed: boolean, input: string, expected: string, actual: string}>>([]);
  const [showPreview, setShowPreview] = useState(true);
  const [showReference, setShowReference] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Layout');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const editorRef = useRef<any>(null);

  function getDefaultTailwindTemplate(language: string): string {
    switch (language) {
      case 'html':
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tailwind CSS Challenge</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 min-h-screen">
    <!-- Write your Tailwind HTML here -->
    <div class="container mx-auto p-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-4">
            Welcome to Tailwind CSS!
        </h1>
        <p class="text-gray-600">
            Start building with utility-first CSS classes.
        </p>
    </div>
</body>
</html>`;
      case 'css':
        return `/* Tailwind CSS Custom Styles */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Your custom component classes */
@layer components {
  .btn-primary {
    @apply bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded;
  }
  
  .card {
    @apply bg-white shadow-lg rounded-lg p-6 border border-gray-200;
  }
}

/* Your custom utility classes */
@layer utilities {
  .text-shadow {
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  }
}`;
      case 'javascript':
        return `// Tailwind CSS with JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Example: Dynamic class manipulation with Tailwind
    const button = document.querySelector('#dynamic-btn');
    
    if (button) {
        button.addEventListener('click', function() {
            // Toggle Tailwind classes dynamically
            this.classList.toggle('bg-blue-500');
            this.classList.toggle('bg-green-500');
            this.classList.toggle('transform');
            this.classList.toggle('scale-110');
        });
    }
    
    // Example: Creating elements with Tailwind classes
    const container = document.querySelector('#container');
    if (container) {
        const newElement = document.createElement('div');
        newElement.className = 'bg-gradient-to-r from-purple-400 to-pink-400 p-4 rounded-lg shadow-lg text-white font-semibold';
        newElement.textContent = 'Dynamically created with Tailwind!';
        container.appendChild(newElement);
    }
});`;
      default:
        return '// Write your code here';
    }
  }

  const setupMonacoTailwindIntelliSense = (editor: any, monaco: any) => {
    // Register Tailwind CSS completion provider
    monaco.languages.registerCompletionItemProvider('html', {
      provideCompletionItems: (model: any, position: any) => {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn
        };

        const suggestions: any[] = [];

        // Add Tailwind class suggestions
        Object.entries(tailwindReference).forEach(([category, subcategories]) => {
          Object.entries(subcategories).forEach(([subcategory, classes]) => {
            classes.forEach((className) => {
              if (className.toLowerCase().includes(word.word.toLowerCase())) {
                suggestions.push({
                  label: className,
                  kind: monaco.languages.CompletionItemKind.Class,
                  insertText: className,
                  range: range,
                  detail: `${category} - ${subcategory}`,
                  documentation: `Tailwind CSS class: ${className}`
                });
              }
            });
          });
        });

        return { suggestions };
      }
    });

    // Register CSS completion provider for @apply directive
    monaco.languages.registerCompletionItemProvider('css', {
      provideCompletionItems: (model: any, position: any) => {
        const textUntilPosition = model.getValueInRange({
          startLineNumber: 1,
          startColumn: 1,
          endLineNumber: position.lineNumber,
          endColumn: position.column
        });

        if (textUntilPosition.includes('@apply')) {
          const word = model.getWordUntilPosition(position);
          const range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn
          };

          const suggestions: any[] = [];

          Object.entries(tailwindReference).forEach(([category, subcategories]) => {
            Object.entries(subcategories).forEach(([subcategory, classes]) => {
              classes.forEach((className) => {
                suggestions.push({
                  label: className,
                  kind: monaco.languages.CompletionItemKind.Class,
                  insertText: className,
                  range: range,
                  detail: `${category} - ${subcategory}`,
                  documentation: `Tailwind CSS class for @apply: ${className}`
                });
              });
            });
          });

          return { suggestions };
        }

        return { suggestions: [] };
      }
    });
  };

  const runCode = async () => {
    setIsRunning(true);
    setHasRun(true);
    setOutput('');
    setTestResults([]);

    try {
      if (question.language === 'html' || question.language === 'css') {
        // For HTML/CSS, update the preview iframe with Tailwind CSS
        if (iframeRef.current) {
          const doc = iframeRef.current.contentDocument;
          if (doc) {
            if (question.language === 'html') {
              // Ensure Tailwind CSS is included
              let htmlContent = userCode;
              if (!htmlContent.includes('tailwindcss.com') && !htmlContent.includes('@tailwind')) {
                htmlContent = htmlContent.replace(
                  '</head>',
                  '    <script src="https://cdn.tailwindcss.com"></script>\n</head>'
                );
              }
              doc.open();
              doc.write(htmlContent);
              doc.close();
            } else {
              // For CSS, wrap in HTML with Tailwind
              doc.open();
              doc.write(`
                <!DOCTYPE html>
                <html>
                <head>
                  <script src="https://cdn.tailwindcss.com"></script>
                  <style>${userCode}</style>
                </head>
                <body class="p-8 bg-gray-50">
                  <div class="container mx-auto">
                    <h1 class="text-4xl font-bold text-gray-800 mb-6">Tailwind CSS Preview</h1>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div class="card">
                        <h2 class="text-2xl font-semibold mb-4">Sample Card</h2>
                        <p class="text-gray-600 mb-4">This is a sample card to test your styles.</p>
                        <button class="btn-primary">Primary Button</button>
                      </div>
                      <div class="bg-white p-6 rounded-lg shadow-lg">
                        <h3 class="text-xl font-medium mb-3">Another Element</h3>
                        <div class="space-y-2">
                          <div class="h-4 bg-gray-200 rounded"></div>
                          <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div class="h-4 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </body>
                </html>
              `);
              doc.close();
            }
          }
        }
        
        setOutput('✅ Code executed successfully! Check the preview to see your Tailwind styles.');
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
    
    try {
      // Create a mock DOM environment for testing
      const mockDocument = {
        addEventListener: (event: string, callback: Function) => {
          if (event === 'DOMContentLoaded') {
            setTimeout(callback, 0);
          }
        },
        querySelector: (selector: string) => ({
          addEventListener: (event: string, callback: Function) => {
            logs.push(`Event listener added to ${selector} for ${event}`);
          },
          classList: {
            toggle: (className: string) => {
              logs.push(`Toggled class: ${className}`);
            }
          }
        }),
        createElement: (tag: string) => ({
          className: '',
          textContent: '',
          setAttribute: (attr: string, value: string) => {
            logs.push(`Set ${attr}="${value}"`);
          }
        })
      };

      // Create a safe execution context
      const func = new Function('document', 'console', code);
      func(mockDocument, { 
        log: (...args: any[]) => logs.push(args.map(arg => String(arg)).join(' ')) 
      });
      
      return {
        output: logs.length > 0 ? logs.join('\n') : '✅ JavaScript executed successfully with Tailwind integration!',
        success: true
      };
    } catch (error) {
      return {
        output: `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        success: false
      };
    }
  };

  const runTestCases = (code: string, testCases: any[]) => {
    return testCases.map(testCase => {
      try {
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

  const resetCode = () => {
    setUserCode(question.codeTemplate || getDefaultTailwindTemplate(question.language));
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    onTriggerBobMessage('tips', `Copied "${text}" to clipboard! You can paste it in your code.`);
  };

  const insertTailwindClass = (className: string) => {
    if (editorRef.current) {
      const editor = editorRef.current;
      const selection = editor.getSelection();
      const range = selection || {
        startLineNumber: 1,
        startColumn: 1,
        endLineNumber: 1,
        endColumn: 1
      };

      editor.executeEdits('insert-tailwind-class', [{
        range: range,
        text: className
      }]);
      
      editor.focus();
    }
  };

  const getEditorLanguage = (lang: string) => {
    switch (lang) {
      case 'javascript': return 'javascript';
      case 'html': return 'html';
      case 'css': return 'css';
      default: return 'javascript';
    }
  };

  const filteredReference = React.useMemo(() => {
    if (!searchTerm) return tailwindReference;
    
    const filtered: typeof tailwindReference = {};
    Object.entries(tailwindReference).forEach(([category, subcategories]) => {
      const filteredSubcategories: typeof subcategories = {};
      Object.entries(subcategories).forEach(([subcategory, classes]) => {
        const filteredClasses = classes.filter(className => 
          className.toLowerCase().includes(searchTerm.toLowerCase()) ||
          subcategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
          category.toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (filteredClasses.length > 0) {
          filteredSubcategories[subcategory] = filteredClasses;
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
        <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 rounded-full p-3">
                <Code className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-heading font-bold text-white">
                  🎨 Tailwind CSS Challenge
                </h2>
                <p className="text-white/80">Interactive Coding Environment with Tailwind Support</p>
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
                <span className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  TAILWIND CSS
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
                  <span className="text-xs text-gray-400">(Tailwind IntelliSense Enabled)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <motion.button
                    onClick={() => setShowReference(!showReference)}
                    className="flex items-center space-x-2 px-3 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors"
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
                  onMount={(editor, monaco) => {
                    editorRef.current = editor;
                    setupMonacoTailwindIntelliSense(editor, monaco);
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

          {/* Middle Panel - Tailwind Reference (Collapsible) */}
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
                    <BookOpen className="w-5 h-5 text-cyan-400" />
                    <span>Tailwind Reference</span>
                  </h3>
                  
                  {/* Search */}
                  <div className="relative mb-4">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search classes..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
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
                            ? 'bg-cyan-600 text-white'
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
                      {Object.entries(filteredReference[selectedCategory]).map(([subcategory, classes]) => (
                        <div key={subcategory}>
                          <h4 className="text-cyan-400 font-medium text-sm mb-2">{subcategory}</h4>
                          <div className="grid grid-cols-1 gap-1">
                            {classes.map((className) => (
                              <motion.button
                                key={className}
                                onClick={() => insertTailwindClass(className)}
                                className="flex items-center justify-between p-2 bg-gray-700 hover:bg-gray-600 rounded text-left text-xs text-gray-200 transition-colors group"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <span className="font-mono">{className}</span>
                                <Copy 
                                  className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    copyToClipboard(className);
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
                    ? 'bg-gray-700 text-white border-b-2 border-cyan-400' 
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
                    ? 'bg-gray-700 text-white border-b-2 border-cyan-400' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Eye className="w-4 h-4 inline mr-2" />
                Live Preview
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
              {!showPreview ? (
                <div className="h-full flex flex-col">
                  {/* Output */}
                  <div className="flex-1 p-4 bg-gray-900 overflow-y-auto">
                    <h4 className="text-cyan-400 font-semibold mb-3">Output:</h4>
                    <pre className="text-gray-300 font-mono text-sm whitespace-pre-wrap mb-4">
                      {output || 'Click "Run Code" to see output...'}
                    </pre>

                    {/* Test Results */}
                    {testResults.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-cyan-400 font-semibold mb-3">Test Results:</h4>
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
                      className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300"
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
                    Live Preview with Tailwind CSS
                  </div>
                  <iframe
                    ref={iframeRef}
                    className="w-full h-full border-none"
                    title="Tailwind CSS Preview"
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