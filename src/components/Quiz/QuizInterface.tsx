import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Star, ArrowRight, CheckCircle, XCircle } from 'lucide-react';
import { Question } from '../../types';

interface QuizInterfaceProps {
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

export const QuizInterface: React.FC<QuizInterfaceProps> = ({ questions, onComplete, onClose }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [isAnswered, setIsAnswered] = useState(false);
  const [startTime] = useState(Date.now());

  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleNextQuestion();
          return 30;
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
    }, 2000);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setIsAnswered(false);
      setTimeRemaining(30);
    } else {
      // Quiz completed
      const results: QuizResults = {
        totalQuestions: questions.length,
        correctAnswers,
        totalXp: correctAnswers * 50,
        totalCoins: correctAnswers * 10,
        timeSpent: Math.floor((Date.now() - startTime) / 1000)
      };
      onComplete(results);
    }
  };

  const getProgressPercentage = () => {
    return ((currentQuestionIndex + 1) / questions.length) * 100;
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <motion.div
        className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full mx-4 overflow-hidden"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-casino-green-600 to-casino-green-700 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 rounded-full p-3">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-heading font-bold text-white">
                  Quiz Challenge
                </h2>
                <p className="text-casino-green-100">
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
              className="bg-casino-gold-400 h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${getProgressPercentage()}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Question Content */}
        <div className="p-8">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-4">
                <span className="bg-casino-gold-500 text-gray-900 px-3 py-1 rounded-full text-sm font-semibold">
                  {currentQuestion.subject.toUpperCase()}
                </span>
                <span className="bg-gray-700 text-gray-200 px-3 py-1 rounded-full text-sm">
                  {currentQuestion.difficulty}
                </span>
              </div>
              
              <h3 className="text-2xl font-heading text-white mb-2">
                {currentQuestion.question}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
                    <span className="font-body">{option}</span>
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
                  <p className="text-gray-300 font-body leading-relaxed">
                    {currentQuestion.explanation}
                  </p>
                  <div className="flex items-center space-x-4 mt-4 text-sm">
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
      </motion.div>
    </div>
  );
};