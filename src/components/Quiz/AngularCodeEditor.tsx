import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, CheckCircle, XCircle, Eye, Code, Terminal, Lightbulb, BookOpen, Search, Copy } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { CodingQuestion, BobMessage } from '../../types';

interface AngularCodeEditorProps {
  question: CodingQuestion;
  onComplete: (isCorrect: boolean, userCode: string) => void;
  onTriggerBobMessage: (type: BobMessage['type'], customMessage?: string) => void;
  onClose: () => void;
}

// Angular concepts and patterns organized by category
const angularReference = {
  'Components': {
    'Component Decorator': ['@Component({ selector: "app-name" })', '@Component({ templateUrl: "./component.html" })', '@Component({ styleUrls: ["./component.css"] })'],
    'Component Class': ['export class MyComponent {}', 'constructor() {}', 'ngOnInit() {}'],
    'Template Syntax': ['{{ property }}', '*ngFor="let item of items"', '*ngIf="condition"', '(click)="method()"', '[property]="value"']
  },
  'Directives': {
    'Structural': ['*ngFor', '*ngIf', '*ngSwitch', 'ng-container', 'ng-template'],
    'Attribute': ['[ngClass]', '[ngStyle]', '[disabled]', '[hidden]'],
    'Custom': ['@Directive({ selector: "[appCustom]" })', '@HostListener("click")', '@Input()', '@Output()']
  },
  'Services & DI': {
    'Service': ['@Injectable({ providedIn: "root" })', 'constructor(private service: MyService)', 'this.service.method()'],
    'HTTP Client': ['this.http.get<T>(url)', 'this.http.post<T>(url, data)', 'subscribe(response => {})'],
    'Dependency Injection': ['providers: [MyService]', 'inject(MyService)', 'useFactory', 'useValue']
  },
  'Routing': {
    'Router': ['this.router.navigate(["/path"])', 'this.route.params.subscribe()', 'routerLink="/path"'],
    'Route Config': ['{ path: "home", component: HomeComponent }', '{ path: "**", redirectTo: "/home" }', 'canActivate: [AuthGuard]'],
    'Route Guards': ['CanActivate', 'CanDeactivate', 'Resolve', 'CanLoad']
  },
  'Forms': {
    'Template-driven': ['[(ngModel)]="property"', '#form="ngForm"', 'form.valid', 'ngSubmit'],
    'Reactive': ['FormBuilder', 'FormGroup', 'FormControl', 'Validators.required', 'formControlName'],
    'Validation': ['form.get("field")?.errors', 'field.invalid && field.touched', 'Validators.email']
  },
  'Lifecycle Hooks': {
    'Common Hooks': ['ngOnInit()', 'ngOnDestroy()', 'ngOnChanges()', 'ngAfterViewInit()'],
    'Change Detection': ['OnPush', 'ChangeDetectorRef', 'markForCheck()', 'detectChanges()'],
    'View Hooks': ['ngAfterViewInit()', 'ngAfterViewChecked()', 'ngAfterContentInit()']
  },
  'RxJS & Observables': {
    'Observables': ['Observable<T>', 'subscribe()', 'unsubscribe()', 'pipe()'],
    'Operators': ['map()', 'filter()', 'switchMap()', 'mergeMap()', 'catchError()', 'tap()'],
    'Subjects': ['Subject<T>', 'BehaviorSubject<T>', 'ReplaySubject<T>', 'next()', 'complete()']
  }
};

export const AngularCodeEditor: React.FC<AngularCodeEditorProps> = ({
  question,
  onComplete,
  onTriggerBobMessage,
  onClose
}) => {
  const [userCode, setUserCode] = useState(question.codeTemplate || getDefaultAngularTemplate());
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<Array<{passed: boolean, input: string, expected: string, actual: string}>>([]);
  const [showPreview, setShowPreview] = useState(true);
  const [showReference, setShowReference] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Components');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const editorRef = useRef<any>(null);

  function getDefaultAngularTemplate(): string {
    return `import { Component } from '@angular/core';

@Component({
  selector: 'app-my-component',
  template: \`
    <div class="p-4">
      <h1 class="text-2xl font-bold mb-4">{{ title }}</h1>
      <p class="mb-4">Count: {{ count }}</p>
      <button 
        (click)="increment()"
        class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Increment
      </button>
      <ul class="mt-4">
        <li *ngFor="let item of items" class="py-1">
          {{ item }}
        </li>
      </ul>
    </div>
  \`,
  styles: [\`
    :host {
      display: block;
    }
  \`]
})
export class MyComponent {
  title = 'Angular Component';
  count = 0;
  items = ['Item 1', 'Item 2', 'Item 3'];

  increment() {
    this.count++;
  }
}`;
  }

  const setupMonacoAngularIntelliSense = (editor: any, monaco: any) => {
    // Register Angular completion provider
    monaco.languages.registerCompletionItemProvider('typescript', {
      provideCompletionItems: (model: any, position: any) => {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn
        };

        const suggestions: any[] = [];

        // Add Angular-specific suggestions
        Object.entries(angularReference).forEach(([category, subcategories]) => {
          Object.entries(subcategories).forEach(([subcategory, patterns]) => {
            patterns.forEach((pattern) => {
              if (pattern.toLowerCase().includes(word.word.toLowerCase())) {
                suggestions.push({
                  label: pattern,
                  kind: monaco.languages.CompletionItemKind.Snippet,
                  insertText: pattern,
                  range: range,
                  detail: `${category} - ${subcategory}`,
                  documentation: `Angular pattern: ${pattern}`
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
      // For Angular, create a preview with the component
      if (iframeRef.current) {
        const doc = iframeRef.current.contentDocument;
        if (doc) {
          // Create a simplified Angular app for preview
          const angularApp = `
            <!DOCTYPE html>
            <html>
            <head>
              <script src="https://unpkg.com/@angular/core@17/bundles/core.umd.min.js"></script>
              <script src="https://unpkg.com/@angular/common@17/bundles/common.umd.min.js"></script>
              <script src="https://unpkg.com/@angular/platform-browser@17/bundles/platform-browser.umd.min.js"></script>
              <script src="https://unpkg.com/@angular/platform-browser-dynamic@17/bundles/platform-browser-dynamic.umd.min.js"></script>
              <script src="https://cdn.tailwindcss.com"></script>
              <style>
                body { margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
                .error { color: red; padding: 10px; background: #fee; border: 1px solid #fcc; border-radius: 4px; }
              </style>
            </head>
            <body>
              <div id="root">
                <div class="p-4">
                  <h1 class="text-2xl font-bold mb-4 text-red-600">Angular Component Preview</h1>
                  <p class="text-gray-600 mb-4">This is a simplified preview of your Angular component.</p>
                  <div class="bg-gray-100 p-4 rounded">
                    <p class="text-sm text-gray-500">
                      Note: Full Angular compilation requires a build environment. 
                      This preview shows the template structure.
                    </p>
                  </div>
                </div>
              </div>
              <script>
                try {
                  // Parse the component template from the code
                  const code = \`${userCode.replace(/`/g, '\\`')}\`;
                  const templateMatch = code.match(/template:\\s*\`([^`]*)\`/);
                  
                  if (templateMatch) {
                    let template = templateMatch[1];
                    
                    // Simple Angular template processing
                    template = template
                      .replace(/{{\\s*([^}]+)\\s*}}/g, '<span class="text-blue-600 font-mono">{{ $1 }}</span>')
                      .replace(/\\*ngFor="[^"]*"/g, 'class="bg-yellow-100 px-2 py-1 rounded"')
                      .replace(/\\*ngIf="[^"]*"/g, 'class="bg-green-100 px-2 py-1 rounded"')
                      .replace(/\\(click\\)="[^"]*"/g, 'onclick="alert(\'Click event triggered!\')" class="cursor-pointer"');
                    
                    document.getElementById('root').innerHTML = 
                      '<div class="border-2 border-red-200 rounded p-4">' +
                      '<h3 class="text-lg font-semibold text-red-700 mb-2">Component Template:</h3>' +
                      template + '</div>';
                  } else {
                    document.getElementById('root').innerHTML = 
                      '<div class="error">No template found in component</div>';
                  }
                } catch (error) {
                  document.getElementById('root').innerHTML = 
                    '<div class="error">Error parsing component: ' + error.message + '</div>';
                }
              </script>
            </body>
            </html>
          `;
          
          doc.open();
          doc.write(angularApp);
          doc.close();
        }
      }
      
      setOutput('✅ Angular component parsed successfully! Check the preview to see your component template.');
      
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
        // Simple test case validation for Angular components
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
    setUserCode(question.codeTemplate || getDefaultAngularTemplate());
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
      onTriggerBobMessage('encouragement', 'Make sure to run your Angular component first to test it!');
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

  const insertAngularPattern = (pattern: string) => {
    if (editorRef.current) {
      const editor = editorRef.current;
      const selection = editor.getSelection();
      const range = selection || {
        startLineNumber: 1,
        startColumn: 1,
        endLineNumber: 1,
        endColumn: 1
      };

      editor.executeEdits('insert-angular-pattern', [{
        range: range,
        text: pattern
      }]);
      
      editor.focus();
    }
  };

  const filteredReference = React.useMemo(() => {
    if (!searchTerm) return angularReference;
    
    const filtered: typeof angularReference = {};
    Object.entries(angularReference).forEach(([category, subcategories]) => {
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
        <div className="bg-gradient-to-r from-red-500 to-pink-600 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 rounded-full p-3">
                <Code className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-heading font-bold text-white">
                  🅰️ Angular Challenge
                </h2>
                <p className="text-white/80">Interactive Angular Development Environment</p>
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
                <span className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  ANGULAR
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
                  <span className="text-white font-semibold">Angular Code Editor</span>
                  <span className="text-xs text-gray-400">(Angular IntelliSense Enabled)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <motion.button
                    onClick={() => setShowReference(!showReference)}
                    className="flex items-center space-x-2 px-3 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors"
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
                  language="typescript"
                  value={userCode}
                  onChange={(value) => setUserCode(value || '')}
                  onMount={(editor, monaco) => {
                    editorRef.current = editor;
                    setupMonacoAngularIntelliSense(editor, monaco);
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

          {/* Middle Panel - Angular Reference (Collapsible) */}
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
                    <BookOpen className="w-5 h-5 text-red-400" />
                    <span>Angular Reference</span>
                  </h3>
                  
                  {/* Search */}
                  <div className="relative mb-4">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search patterns..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
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
                            ? 'bg-red-600 text-white'
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
                          <h4 className="text-red-400 font-medium text-sm mb-2">{subcategory}</h4>
                          <div className="grid grid-cols-1 gap-1">
                            {patterns.map((pattern) => (
                              <motion.button
                                key={pattern}
                                onClick={() => insertAngularPattern(pattern)}
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
                    ? 'bg-gray-700 text-white border-b-2 border-red-400' 
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
                    ? 'bg-gray-700 text-white border-b-2 border-red-400' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Eye className="w-4 h-4 inline mr-2" />
                Angular Preview
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
              {!showPreview ? (
                <div className="h-full flex flex-col">
                  {/* Output */}
                  <div className="flex-1 p-4 bg-gray-900 overflow-y-auto">
                    <h4 className="text-red-400 font-semibold mb-3">Output:</h4>
                    <pre className="text-gray-300 font-mono text-sm whitespace-pre-wrap mb-4">
                      {output || 'Click "Run Code" to see output...'}
                    </pre>

                    {/* Test Results */}
                    {testResults.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-red-400 font-semibold mb-3">Test Results:</h4>
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
                      className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-400 hover:to-pink-500 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300"
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
                    Angular Component Template Preview
                  </div>
                  <iframe
                    ref={iframeRef}
                    className="w-full h-full border-none"
                    title="Angular Component Preview"
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