import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, CheckCircle, XCircle, Eye, Code, Terminal, Lightbulb, BookOpen, Search, Copy, Smartphone } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { CodingQuestion, BobMessage } from '../../types';

interface ReactNativeCodeEditorProps {
  question: CodingQuestion;
  onComplete: (isCorrect: boolean, userCode: string) => void;
  onTriggerBobMessage: (type: BobMessage['type'], customMessage?: string) => void;
  onClose: () => void;
}

// React Native concepts and patterns organized by category
const reactNativeReference = {
  'Core Components': {
    'Views': ['<View>', '<ScrollView>', '<SafeAreaView>', '<KeyboardAvoidingView>'],
    'Text': ['<Text>', '<TextInput>', 'numberOfLines', 'ellipsizeMode'],
    'Images': ['<Image source={{uri: "url"}}>', '<Image source={require("./image.png")}>', 'resizeMode'],
    'Buttons': ['<TouchableOpacity>', '<TouchableHighlight>', '<Pressable>', '<Button>']
  },
  'Styling': {
    'StyleSheet': ['StyleSheet.create({})', 'styles.container', 'flex: 1'],
    'Flexbox': ['flexDirection: "row"', 'justifyContent: "center"', 'alignItems: "center"', 'flex: 1'],
    'Dimensions': ['width: "100%"', 'height: 200', 'position: "absolute"', 'top: 0'],
    'Colors': ['backgroundColor: "#fff"', 'color: "#000"', 'borderColor: "#ccc"']
  },
  'Navigation': {
    'Stack Navigator': ['createStackNavigator()', 'navigation.navigate("Screen")', 'navigation.goBack()'],
    'Tab Navigator': ['createBottomTabNavigator()', 'tabBarIcon', 'tabBarLabel'],
    'Drawer Navigator': ['createDrawerNavigator()', 'navigation.openDrawer()', 'navigation.closeDrawer()']
  },
  'Hooks & State': {
    'React Hooks': ['useState()', 'useEffect()', 'useContext()', 'useReducer()'],
    'Navigation Hooks': ['useNavigation()', 'useRoute()', 'useFocusEffect()'],
    'Custom Hooks': ['useCallback()', 'useMemo()', 'useRef()']
  },
  'Platform APIs': {
    'Device Info': ['Platform.OS', 'Dimensions.get("window")', 'StatusBar.setBarStyle()'],
    'Storage': ['AsyncStorage.setItem()', 'AsyncStorage.getItem()', '@react-native-async-storage/async-storage'],
    'Permissions': ['PermissionsAndroid.request()', 'check()', 'request()']
  },
  'Lists & Data': {
    'FlatList': ['<FlatList data={} renderItem={}>', 'keyExtractor', 'onEndReached'],
    'SectionList': ['<SectionList sections={} renderItem={}>', 'renderSectionHeader'],
    'Data Handling': ['map()', 'filter()', 'find()', 'reduce()']
  },
  'Animations': {
    'Animated API': ['Animated.Value()', 'Animated.timing()', 'Animated.spring()', 'Animated.View'],
    'Layout Animation': ['LayoutAnimation.configureNext()', 'LayoutAnimation.easeInEaseOut()'],
    'Reanimated': ['useSharedValue()', 'useAnimatedStyle()', 'withTiming()']
  }
};

export const ReactNativeCodeEditor: React.FC<ReactNativeCodeEditorProps> = ({
  question,
  onComplete,
  onTriggerBobMessage,
  onClose
}) => {
  const [userCode, setUserCode] = useState(question.codeTemplate || getDefaultReactNativeTemplate());
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<Array<{passed: boolean, input: string, expected: string, actual: string}>>([]);
  const [showPreview, setShowPreview] = useState(true);
  const [showReference, setShowReference] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Core Components');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const editorRef = useRef<any>(null);

  function getDefaultReactNativeTemplate(): string {
    return `import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList
} from 'react-native';

const MyComponent = () => {
  const [count, setCount] = useState(0);
  const [items, setItems] = useState([
    { id: '1', title: 'Item 1' },
    { id: '2', title: 'Item 2' },
    { id: '3', title: 'Item 3' }
  ]);

  const increment = () => {
    setCount(count + 1);
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.itemText}>{item.title}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>React Native App</Text>
        <Text style={styles.counter}>Count: {count}</Text>
        <TouchableOpacity style={styles.button} onPress={increment}>
          <Text style={styles.buttonText}>Increment</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.list}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  counter: {
    fontSize: 18,
    color: '#666',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  list: {
    flex: 1,
    padding: 20,
  },
  item: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
});

export default MyComponent;`;
  }

  const setupMonacoReactNativeIntelliSense = (editor: any, monaco: any) => {
    // Register React Native completion provider
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

        // Add React Native-specific suggestions
        Object.entries(reactNativeReference).forEach(([category, subcategories]) => {
          Object.entries(subcategories).forEach(([subcategory, patterns]) => {
            patterns.forEach((pattern) => {
              if (pattern.toLowerCase().includes(word.word.toLowerCase())) {
                suggestions.push({
                  label: pattern,
                  kind: monaco.languages.CompletionItemKind.Snippet,
                  insertText: pattern,
                  range: range,
                  detail: `${category} - ${subcategory}`,
                  documentation: `React Native pattern: ${pattern}`
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
      // For React Native, create a mobile-like preview
      if (iframeRef.current) {
        const doc = iframeRef.current.contentDocument;
        if (doc) {
          // Create a React Native-like preview
          const reactNativePreview = `
            <!DOCTYPE html>
            <html>
            <head>
              <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
              <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
              <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
              <style>
                body { 
                  margin: 0; 
                  padding: 20px; 
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                  background: #f0f0f0;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  min-height: 100vh;
                }
                .phone-container {
                  width: 375px;
                  height: 667px;
                  background: #000;
                  border-radius: 25px;
                  padding: 10px;
                  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                }
                .phone-screen {
                  width: 100%;
                  height: 100%;
                  background: #fff;
                  border-radius: 20px;
                  overflow: hidden;
                  position: relative;
                }
                .status-bar {
                  height: 44px;
                  background: #f8f8f8;
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  padding: 0 20px;
                  font-size: 14px;
                  font-weight: 600;
                }
                .app-content {
                  height: calc(100% - 44px);
                  overflow-y: auto;
                }
                .error { 
                  color: red; 
                  padding: 20px; 
                  background: #fee; 
                  border: 1px solid #fcc; 
                  border-radius: 4px; 
                  margin: 20px;
                }
                .rn-view {
                  display: flex;
                  flex-direction: column;
                }
                .rn-text {
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                }
                .rn-touchable {
                  cursor: pointer;
                  user-select: none;
                }
                .rn-button {
                  background: #007AFF;
                  color: white;
                  padding: 10px 20px;
                  border-radius: 8px;
                  text-align: center;
                  font-weight: 600;
                }
              </style>
            </head>
            <body>
              <div class="phone-container">
                <div class="phone-screen">
                  <div class="status-bar">
                    <span>9:41</span>
                    <span>📶 📶 📶 🔋</span>
                  </div>
                  <div class="app-content">
                    <div id="root"></div>
                  </div>
                </div>
              </div>
              <script type="text/babel">
                try {
                  // Simulate React Native components with web equivalents
                  const View = ({ style, children, ...props }) => 
                    React.createElement('div', { 
                      style: { display: 'flex', flexDirection: 'column', ...style }, 
                      className: 'rn-view',
                      ...props 
                    }, children);
                  
                  const Text = ({ style, children, ...props }) => 
                    React.createElement('span', { 
                      style: { fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', ...style }, 
                      className: 'rn-text',
                      ...props 
                    }, children);
                  
                  const TouchableOpacity = ({ style, onPress, children, ...props }) => 
                    React.createElement('div', { 
                      style: { cursor: 'pointer', userSelect: 'none', ...style }, 
                      className: 'rn-touchable',
                      onClick: onPress,
                      ...props 
                    }, children);
                  
                  const SafeAreaView = ({ style, children, ...props }) => 
                    React.createElement('div', { 
                      style: { height: '100%', display: 'flex', flexDirection: 'column', ...style },
                      ...props 
                    }, children);
                  
                  const FlatList = ({ data, renderItem, keyExtractor, style, ...props }) => 
                    React.createElement('div', { 
                      style: { flex: 1, overflow: 'auto', ...style },
                      ...props 
                    }, data?.map((item, index) => 
                      React.createElement('div', { 
                        key: keyExtractor ? keyExtractor(item) : index 
                      }, renderItem({ item, index }))
                    ));
                  
                  const StyleSheet = {
                    create: (styles) => styles
                  };

                  ${userCode.replace(/export default.*?;/g, '')}
                  
                  // Try to render the component
                  const container = document.getElementById('root');
                  const root = ReactDOM.createRoot(container);
                  
                  // Look for the component
                  const ComponentToRender = typeof MyComponent !== 'undefined' ? MyComponent : 
                                           typeof App !== 'undefined' ? App :
                                           () => React.createElement(View, { 
                                             style: { padding: 20, alignItems: 'center' } 
                                           }, React.createElement(Text, { 
                                             style: { fontSize: 18, color: '#666' } 
                                           }, 'Component not found'));
                  
                  root.render(React.createElement(ComponentToRender));
                } catch (error) {
                  document.getElementById('root').innerHTML = 
                    '<div class="error">Error: ' + error.message + '</div>';
                }
              </script>
            </body>
            </html>
          `;
          
          doc.open();
          doc.write(reactNativePreview);
          doc.close();
        }
      }
      
      setOutput('✅ React Native component rendered successfully! Check the mobile preview to see your app.');
      
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
        // Simple test case validation for React Native components
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
    setUserCode(question.codeTemplate || getDefaultReactNativeTemplate());
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
      onTriggerBobMessage('encouragement', 'Make sure to run your React Native component first to test it!');
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

  const insertReactNativePattern = (pattern: string) => {
    if (editorRef.current) {
      const editor = editorRef.current;
      const selection = editor.getSelection();
      const range = selection || {
        startLineNumber: 1,
        startColumn: 1,
        endLineNumber: 1,
        endColumn: 1
      };

      editor.executeEdits('insert-react-native-pattern', [{
        range: range,
        text: pattern
      }]);
      
      editor.focus();
    }
  };

  const filteredReference = React.useMemo(() => {
    if (!searchTerm) return reactNativeReference;
    
    const filtered: typeof reactNativeReference = {};
    Object.entries(reactNativeReference).forEach(([category, subcategories]) => {
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
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 rounded-full p-3">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-heading font-bold text-white">
                  📱 React Native Challenge
                </h2>
                <p className="text-white/80">Interactive Mobile Development Environment</p>
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
                <span className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  REACT NATIVE
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
                  <span className="text-white font-semibold">React Native Code Editor</span>
                  <span className="text-xs text-gray-400">(React Native IntelliSense Enabled)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <motion.button
                    onClick={() => setShowReference(!showReference)}
                    className="flex items-center space-x-2 px-3 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors"
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
                    setupMonacoReactNativeIntelliSense(editor, monaco);
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

          {/* Middle Panel - React Native Reference (Collapsible) */}
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
                    <BookOpen className="w-5 h-5 text-purple-400" />
                    <span>React Native Reference</span>
                  </h3>
                  
                  {/* Search */}
                  <div className="relative mb-4">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search patterns..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
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
                            ? 'bg-purple-600 text-white'
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
                          <h4 className="text-purple-400 font-medium text-sm mb-2">{subcategory}</h4>
                          <div className="grid grid-cols-1 gap-1">
                            {patterns.map((pattern) => (
                              <motion.button
                                key={pattern}
                                onClick={() => insertReactNativePattern(pattern)}
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
                    ? 'bg-gray-700 text-white border-b-2 border-purple-400' 
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
                    ? 'bg-gray-700 text-white border-b-2 border-purple-400' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-4 h-4 inline mr-2" />
                Mobile Preview
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
              {!showPreview ? (
                <div className="h-full flex flex-col">
                  {/* Output */}
                  <div className="flex-1 p-4 bg-gray-900 overflow-y-auto">
                    <h4 className="text-purple-400 font-semibold mb-3">Output:</h4>
                    <pre className="text-gray-300 font-mono text-sm whitespace-pre-wrap mb-4">
                      {output || 'Click "Run Code" to see output...'}
                    </pre>

                    {/* Test Results */}
                    {testResults.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-purple-400 font-semibold mb-3">Test Results:</h4>
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
                      className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Submit Solution
                    </motion.button>
                  </div>
                </div>
              ) : (
                <div className="h-full bg-gray-100 relative flex items-center justify-center">
                  <div className="absolute top-2 left-2 bg-black/80 text-white px-2 py-1 rounded text-xs z-10">
                    React Native Mobile Preview
                  </div>
                  <iframe
                    ref={iframeRef}
                    className="w-full h-full border-none"
                    title="React Native Mobile Preview"
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