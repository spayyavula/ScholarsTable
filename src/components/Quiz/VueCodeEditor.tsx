import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, CheckCircle, XCircle, Eye, Code, Terminal, Lightbulb, BookOpen, Search, Copy } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { CodingQuestion, BobMessage } from '../../types';

interface VueCodeEditorProps {
  question: CodingQuestion;
  onComplete: (isCorrect: boolean, userCode: string) => void;
  onTriggerBobMessage: (type: BobMessage['type'], customMessage?: string) => void;
  onClose: () => void;
}

// Vue concepts and patterns organized by category
const vueReference = {
  'Template Syntax': {
    'Interpolation': ['{{ message }}', '{{ count + 1 }}', '{{ user.name }}'],
    'Directives': ['v-if="condition"', 'v-for="item in items"', 'v-show="visible"', 'v-model="data"'],
    'Event Handling': ['@click="method"', '@submit.prevent="onSubmit"', '@keyup.enter="search"'],
    'Attribute Binding': [':class="{ active: isActive }"', ':style="{ color: textColor }"', ':href="url"']
  },
  'Composition API': {
    'Reactive Data': ['ref()', 'reactive()', 'computed()', 'watch()'],
    'Lifecycle': ['onMounted()', 'onUnmounted()', 'onUpdated()', 'onBeforeMount()'],
    'Setup Function': ['setup() { return { } }', 'const count = ref(0)', 'const state = reactive({})']
  },
  'Options API': {
    'Data': ['data() { return {} }', 'props: ["title"]', 'computed: { fullName() {} }'],
    'Methods': ['methods: { onClick() {} }', 'this.property', 'this.$emit("event")'],
    'Lifecycle Hooks': ['mounted() {}', 'created() {}', 'beforeDestroy() {}', 'updated() {}']
  },
  'Components': {
    'Registration': ['components: { MyComponent }', 'app.component("my-component", {})', 'defineComponent({})'],
    'Props': ['props: { title: String }', 'props: { count: { type: Number, default: 0 } }'],
    'Emits': ['emits: ["update"]', 'this.$emit("update", value)', 'defineEmits(["update"])'],
    'Slots': ['<slot></slot>', '<slot name="header"></slot>', 'v-slot:header']
  },
  'Reactivity': {
    'Refs': ['ref(0)', 'isRef()', 'unref()', 'toRef()', 'toRefs()'],
    'Reactive': ['reactive({})', 'readonly()', 'shallowReactive()', 'markRaw()'],
    'Computed': ['computed(() => {})', 'computed({ get() {}, set() {} })'],
    'Watch': ['watch(source, callback)', 'watchEffect(() => {})', 'watch([a, b], callback)']
  },
  'Directives': {
    'Built-in': ['v-text', 'v-html', 'v-show', 'v-if', 'v-else', 'v-for', 'v-on', 'v-bind', 'v-model'],
    'Modifiers': ['.prevent', '.stop', '.capture', '.self', '.once', '.passive'],
    'Custom': ['app.directive("focus", {})', 'v-focus', 'directive hooks: mounted, updated']
  },
  'Router': {
    'Navigation': ['this.$router.push("/path")', 'router.push({ name: "Home" })', '<router-link to="/about">'],
    'Route Object': ['this.$route.params', 'this.$route.query', 'this.$route.path'],
    'Guards': ['beforeRouteEnter', 'beforeRouteUpdate', 'beforeRouteLeave', 'router.beforeEach']
  }
};

export const VueCodeEditor: React.FC<VueCodeEditorProps> = ({
  question,
  onComplete,
  onTriggerBobMessage,
  onClose
}) => {
  const [userCode, setUserCode] = useState(question.codeTemplate || getDefaultVueTemplate());
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<Array<{passed: boolean, input: string, expected: string, actual: string}>>([]);
  const [showPreview, setShowPreview] = useState(true);
  const [showReference, setShowReference] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Template Syntax');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const editorRef = useRef<any>(null);

  function getDefaultVueTemplate(): string {
    return `<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">{{ title }}</h1>
    <p class="mb-4">Count: {{ count }}</p>
    <button 
      @click="increment"
      class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mr-2"
    >
      Increment
    </button>
    <button 
      @click="reset"
      class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
    >
      Reset
    </button>
    <ul class="mt-4">
      <li v-for="item in items" :key="item.id" class="py-1">
        {{ item.name }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'MyComponent',
  data() {
    return {
      title: 'Vue Component',
      count: 0,
      items: [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
        { id: 3, name: 'Item 3' }
      ]
    }
  },
  methods: {
    increment() {
      this.count++;
    },
    reset() {
      this.count = 0;
    }
  }
}
</script>

<style scoped>
/* Component styles */
</style>`;
  }

  const setupMonacoVueIntelliSense = (editor: any, monaco: any) => {
    // Register Vue completion provider
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

        // Add Vue-specific suggestions
        Object.entries(vueReference).forEach(([category, subcategories]) => {
          Object.entries(subcategories).forEach(([subcategory, patterns]) => {
            patterns.forEach((pattern) => {
              if (pattern.toLowerCase().includes(word.word.toLowerCase())) {
                suggestions.push({
                  label: pattern,
                  kind: monaco.languages.CompletionItemKind.Snippet,
                  insertText: pattern,
                  range: range,
                  detail: `${category} - ${subcategory}`,
                  documentation: `Vue pattern: ${pattern}`
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
      // For Vue, create a preview with the component
      if (iframeRef.current) {
        const doc = iframeRef.current.contentDocument;
        if (doc) {
          // Create a Vue app for preview
          const vueApp = `
            <!DOCTYPE html>
            <html>
            <head>
              <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
              <script src="https://cdn.tailwindcss.com"></script>
              <style>
                body { margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
                .error { color: red; padding: 10px; background: #fee; border: 1px solid #fcc; border-radius: 4px; }
              </style>
            </head>
            <body>
              <div id="app"></div>
              <script>
                try {
                  const code = \`${userCode.replace(/`/g, '\\`')}\`;
                  
                  // Extract template, script, and style sections
                  const templateMatch = code.match(/<template>([\\s\\S]*?)<\\/template>/);
                  const scriptMatch = code.match(/<script>([\\s\\S]*?)<\\/script>/);
                  const styleMatch = code.match(/<style[^>]*>([\\s\\S]*?)<\\/style>/);
                  
                  if (templateMatch && scriptMatch) {
                    let template = templateMatch[1].trim();
                    let script = scriptMatch[1].trim();
                    
                    // Simple Vue template processing
                    template = template
                      .replace(/{{\\s*([^}]+)\\s*}}/g, '<span class="text-green-600 font-mono">{{ $1 }}</span>')
                      .replace(/v-for="[^"]*"/g, 'class="bg-yellow-100 px-2 py-1 rounded"')
                      .replace(/v-if="[^"]*"/g, 'class="bg-blue-100 px-2 py-1 rounded"')
                      .replace(/@click="[^"]*"/g, 'onclick="alert(\'Click event triggered!\')" class="cursor-pointer"');
                    
                    // Extract component definition
                    const componentDefMatch = script.match(/export default\\s*{([\\s\\S]*)}/);
                    
                    if (componentDefMatch) {
                      const { createApp } = Vue;
                      
                      // Create a simplified component
                      const app = createApp({
                        template: \`<div class="border-2 border-green-200 rounded p-4">
                          <h3 class="text-lg font-semibold text-green-700 mb-2">Vue Component Template:</h3>
                          \${template}
                        </div>\`,
                        data() {
                          return {
                            title: 'Vue Component',
                            count: 0,
                            items: [
                              { id: 1, name: 'Item 1' },
                              { id: 2, name: 'Item 2' },
                              { id: 3, name: 'Item 3' }
                            ]
                          }
                        },
                        methods: {
                          increment() {
                            this.count++;
                          },
                          reset() {
                            this.count = 0;
                          }
                        }
                      });
                      
                      app.mount('#app');
                    } else {
                      document.getElementById('app').innerHTML = 
                        '<div class="error">Invalid component structure</div>';
                    }
                  } else {
                    document.getElementById('app').innerHTML = 
                      '<div class="error">Template or script section not found</div>';
                  }
                } catch (error) {
                  document.getElementById('app').innerHTML = 
                    '<div class="error">Error parsing component: ' + error.message + '</div>';
                }
              </script>
            </body>
            </html>
          `;
          
          doc.open();
          doc.write(vueApp);
          doc.close();
        }
      }
      
      setOutput('✅ Vue component parsed successfully! Check the preview to see your component.');
      
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
        // Simple test case validation for Vue components
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
    setUserCode(question.codeTemplate || getDefaultVueTemplate());
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
      onTriggerBobMessage('encouragement', 'Make sure to run your Vue component first to test it!');
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

  const insertVuePattern = (pattern: string) => {
    if (editorRef.current) {
      const editor = editorRef.current;
      const selection = editor.getSelection();
      const range = selection || {
        startLineNumber: 1,
        startColumn: 1,
        endLineNumber: 1,
        endColumn: 1
      };

      editor.executeEdits('insert-vue-pattern', [{
        range: range,
        text: pattern
      }]);
      
      editor.focus();
    }
  };

  const filteredReference = React.useMemo(() => {
    if (!searchTerm) return vueReference;
    
    const filtered: typeof vueReference = {};
    Object.entries(vueReference).forEach(([category, subcategories]) => {
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
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 rounded-full p-3">
                <Code className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-heading font-bold text-white">
                  💚 Vue.js Challenge
                </h2>
                <p className="text-white/80">Interactive Vue Development Environment</p>
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
                <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  VUE.JS
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
                  <span className="text-white font-semibold">Vue Code Editor</span>
                  <span className="text-xs text-gray-400">(Vue IntelliSense Enabled)</span>
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
                    <span className="text-sm">{isRunning ? 'Running...' : 'Run Code'}</span>
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
                    setupMonacoVueIntelliSense(editor, monaco);
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

          {/* Middle Panel - Vue Reference (Collapsible) */}
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
                    <span>Vue Reference</span>
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
                                onClick={() => insertVuePattern(pattern)}
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
                <Eye className="w-4 h-4 inline mr-2" />
                Vue Preview
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
                      {output || 'Click "Run Code" to see output...'}
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
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300"
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
                    Vue Component Preview
                  </div>
                  <iframe
                    ref={iframeRef}
                    className="w-full h-full border-none"
                    title="Vue Component Preview"
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