import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Star, ArrowRight, CheckCircle, XCircle, Code, Play, Terminal } from 'lucide-react';
import { Question } from '../../types';

interface CodingQuizInterfaceProps {
  questions: Question[];
  onComplete: (results: QuizResults) => void;
  onClose: () => void;
}

interface QuizResults {
  totalQuestions: number;
  correctAnswers: number;
  totalXp: number;
  totalCoins: number;
  timeSpent: number;
}

export const CodingQuizInterface: React.FC<CodingQuizInterfaceProps> = ({ 
  questions, 
  onComplete, 
  onClose 
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(45); // More time for coding questions
  const [isAnswered, setIsAnswered] = useState(false);
  const [startTime] = useState(Date.now());
  const [showCodeExample, setShowCodeExample] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleNextQuestion();
          return 45;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestionIndex]);

  const handleAnswerSelect = (answerIndex: number) => {
    if (isAnswered) return;
    
    setSelectedAnswer(answerIndex);
    setIsAnswered(true);
    setShowResult(true);

    if (answerIndex === currentQuestion.correctAnswer) {
      setCorrectAnswers(prev => prev + 1);
    }

    setTimeout(() => {
      handleNextQuestion();
    }, 3000); // More time to read coding explanations
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setIsAnswered(false);
      setShowCodeExample(false);
      setTimeRemaining(45);
    } else {
      const results: QuizResults = {
        totalQuestions: questions.length,
        correctAnswers,
        totalXp: correctAnswers * 75, // Higher XP for coding
        totalCoins: correctAnswers * 15, // Higher coins for coding
        timeSpent: Math.floor((Date.now() - startTime) / 1000)
      };
      onComplete(results);
    }
  };

  const getProgressPercentage = () => {
    return ((currentQuestionIndex + 1) / questions.length) * 100;
  };

  const getLanguageColor = (subject: string) => {
    switch (subject) {
      case 'html': return 'from-orange-500 to-orange-600';
      case 'css': return 'from-blue-500 to-blue-600';
      case 'javascript': return 'from-yellow-500 to-yellow-600';
      case 'python': return 'from-green-500 to-green-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getLanguageIcon = (subject: string) => {
    switch (subject) {
      case 'html': return '🌐';
      case 'css': return '🎨';
      case 'javascript': return '⚡';
      case 'python': return '🐍';
      default: return '💻';
    }
  };

  const getCodeExample = (subject: string, question: string) => {
    const examples: Record<string, string> = {
      'html': `<!-- Example HTML Structure -->
<a href="https://example.com">Click here</a>
<select>
  <option value="1">Option 1</option>
  <option value="2">Option 2</option>
</select>
<main>
  <h1>Main Content</h1>
  <p>This is the primary content.</p>
</main>`,
      'css': `/* Example CSS Styles */
.text-red {
  color: red;
}

.flex-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.grid-layout {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: 20px;
}`,
      'javascript': `// Example JavaScript Code
const fruits = ['apple', 'banana'];
fruits.push('orange'); // [apple, banana, orange]

console.log(typeof null); // "object"

// Closure example
function outer(x) {
  return function inner(y) {
    return x + y; // inner has access to x
  };
}`,
      'python': `# Example Python Code
def greet(name):
    return f"Hello, {name}!"

numbers = [1, 2, 3]
doubled = numbers * 2  # [1, 2, 3, 1, 2, 3]

@decorator
def my_function():
    pass  # Decorator modifies this function`
    };

    return examples[subject] || '// Code example not available';
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <motion.div
        className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl max-w-5xl w-full mx-4 overflow-hidden"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className={`bg-gradient-to-r ${getLanguageColor(currentQuestion.subject)} p-6`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 rounded-full p-3">
                <Code className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-heading font-bold text-white">
                  {getLanguageIcon(currentQuestion.subject)} {currentQuestion.subject.toUpperCase()} Challenge
                </h2>
                <p className="text-white/80">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2">
                <Clock className="w-5 h-5 text-white" />
                <span className="text-white font-semibold">{timeRemaining}s</span>
              </div>
              <button
                onClick={() => setShowCodeExample(!showCodeExample)}
                className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-colors"
                title="Show code example"
              >
                <Terminal className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 transition-colors"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 bg-white/20 rounded-full h-2 overflow-hidden">
            <motion.div
              className="bg-white h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${getProgressPercentage()}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Question Content */}
        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Question Section */}
            <div className="lg:col-span-2">
              <motion.div
                key={currentQuestionIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <span className={`bg-gradient-to-r ${getLanguageColor(currentQuestion.subject)} text-white px-3 py-1 rounded-full text-sm font-semibold`}>
                      {currentQuestion.subject.toUpperCase()}
                    </span>
                    <span className="bg-gray-700 text-gray-200 px-3 py-1 rounded-full text-sm">
                      {currentQuestion.difficulty}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-heading text-white mb-4">
                    {currentQuestion.question}
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-4 mb-6">
                  {currentQuestion.options.map((option, index) => (
                    <motion.button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      disabled={isAnswered}
                      className={`p-4 rounded-xl border-2 text-left transition-all duration-300 ${
                        selectedAnswer === index
                          ? index === currentQuestion.correctAnswer
                            ? 'border-green-500 bg-green-500/20 text-green-300'
                            : 'border-red-500 bg-red-500/20 text-red-300'
                          : showResult && index === currentQuestion.correctAnswer
                          ? 'border-green-500 bg-green-500/20 text-green-300'
                          : 'border-gray-600 bg-gray-800 text-gray-200 hover:border-casino-gold-500 hover:bg-casino-gold-500/10'
                      }`}
                      whileHover={!isAnswered ? { scale: 1.02 } : {}}
                      whileTap={!isAnswered ? { scale: 0.98 } : {}}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-body font-mono text-sm">{option}</span>
                        {showResult && selectedAnswer === index && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2 }}
                          >
                            {index === currentQuestion.correctAnswer ? (
                              <CheckCircle className="w-6 h-6 text-green-400" />
                            ) : (
                              <XCircle className="w-6 h-6 text-red-400" />
                            )}
                          </motion.div>
                        )}
                        {showResult && index === currentQuestion.correctAnswer && selectedAnswer !== index && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2 }}
                          >
                            <CheckCircle className="w-6 h-6 text-green-400" />
                          </motion.div>
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>

                {/* Explanation */}
                <AnimatePresence>
                  {showResult && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-gray-800 rounded-xl p-4 border border-gray-700"
                    >
                      <h4 className="text-casino-gold-400 font-semibold mb-2">Explanation:</h4>
                      <p className="text-gray-300 font-body leading-relaxed mb-4">
                        {currentQuestion.explanation}
                      </p>
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-blue-400" />
                          <span className="text-blue-400">+{currentQuestion.xpReward} XP</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="text-casino-gold-400">+{currentQuestion.coinReward} Coins</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>

            {/* Code Example Section */}
            <div className="lg:col-span-1">
              <AnimatePresence>
                {showCodeExample && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="bg-gray-900 rounded-xl p-4 border border-gray-700"
                  >
                    <div className="flex items-center space-x-2 mb-3">
                      <Terminal className="w-5 h-5 text-casino-gold-400" />
                      <h4 className="text-casino-gold-400 font-semibold">Code Examples</h4>
                    </div>
                    <pre className="text-sm text-gray-300 font-mono overflow-x-auto whitespace-pre-wrap">
                      {getCodeExample(currentQuestion.subject, currentQuestion.question)}
                    </pre>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Quick Reference */}
              <motion.div
                className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <h4 className="text-white font-semibold mb-3 flex items-center space-x-2">
                  <span>{getLanguageIcon(currentQuestion.subject)}</span>
                  <span>Quick Tips</span>
                </h4>
                <div className="space-y-2 text-sm text-gray-400">
                  {currentQuestion.subject === 'html' && (
                    <>
                      <p>• Use semantic HTML elements</p>
                      <p>• Always close your tags</p>
                      <p>• Use proper nesting</p>
                    </>
                  )}
                  {currentQuestion.subject === 'css' && (
                    <>
                      <p>• Specificity matters</p>
                      <p>• Use flexbox for layouts</p>
                      <p>• Mobile-first approach</p>
                    </>
                  )}
                  {currentQuestion.subject === 'javascript' && (
                    <>
                      <p>• Use const/let over var</p>
                      <p>• Understand scope</p>
                      <p>• Practice async/await</p>
                    </>
                  )}
                  {currentQuestion.subject === 'python' && (
                    <>
                      <p>• Follow PEP 8 style guide</p>
                      <p>• Use list comprehensions</p>
                      <p>• Handle exceptions properly</p>
                    </>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};