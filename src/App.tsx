import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Header } from './components/Layout/Header';
import { CasinoTable } from './components/Casino/CasinoTable';
import { GameCard } from './components/Casino/GameCard';
import { TournamentCard } from './components/Tournament/TournamentCard';
import { BobTheBot } from './components/Bot/BobTheBot';
import { StatCard } from './components/Dashboard/StatCard';
import { QuizInterface } from './components/Quiz/QuizInterface';
import { mockUser, mockGames, mockTournaments, mockQuestions, mockCodingQuestions } from './data/mockData';
import { Game, Tournament, Question, BobMessage } from './types';
import { Trophy, Users, Gamepad2, Target, BookOpen, Award, Zap, TrendingUp } from 'lucide-react';

function App() {
  const [currentView, setCurrentView] = useState<'lobby' | 'quiz'>('lobby');
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [user, setUser] = useState(mockUser);
  const [currentBobMessage, setCurrentBobMessage] = useState<BobMessage | null>(null);
  const [bobMessageHistory, setBobMessageHistory] = useState<BobMessage[]>([]);

  const triggerBobMessage = (type: BobMessage['type'], customMessage?: string) => {
    const bobMessages = {
      welcome: [
        "Welcome back to Scholars Table! Ready to win some knowledge?",
        "Hey there, scholar! I see you're level " + user.level + ". Impressive!",
        "The tables are hot tonight! Which subject calls to you?",
        "Ready to code your way to victory? Our programming challenges await!",
        "From HTML to Python, we've got all the coding skills you need!"
      ],
      encouragement: [
        "Don't worry about that wrong answer - every mistake is a learning opportunity!",
        "You're getting better with each question. Keep it up!",
        "Remember, even Einstein made mistakes. What matters is that you keep trying!",
        "Debugging is just another word for learning! Keep coding!",
        "Every programmer started with their first 'Hello World' - you're doing great!"
      ],
      celebration: [
        "Fantastic! You're on fire! 🔥",
        "That's what I call a winning streak! Well done!",
        "You just earned some serious bragging rights!",
        "Your code is as clean as your answers! Excellent work!",
        "You're coding like a pro! Keep up the amazing work!"
      ],
      tips: [
        "Pro tip: Take your time to read each question carefully before answering.",
        "Did you know? Playing different difficulty levels helps reinforce concepts!",
        "Tournament strategy: Focus on accuracy over speed for better scores.",
        "Coding tip: Practice makes perfect - try different programming languages!",
        "Remember: Good code is readable code. Think about clarity and structure!"
      ],
      hints: [
        "Having trouble? Try breaking the problem into smaller parts.",
        "Remember to check the units in physics problems - they often hold clues!",
        "For chemistry questions, think about electron configurations step by step.",
        "For coding questions, think about the syntax and logic step by step.",
        "HTML tip: Remember that structure comes first, then styling with CSS!"
      ]
    };

    const messages = bobMessages[type] || bobMessages.welcome;
    const messageText = customMessage || messages[Math.floor(Math.random() * messages.length)];
    
    const newMessage: BobMessage = {
      id: Date.now().toString(),
      type,
      message: messageText,
      timestamp: new Date()
    };

    setCurrentBobMessage(newMessage);
    setBobMessageHistory(prev => [newMessage, ...prev.slice(0, 4)]);
  };

  // Initialize Bob with a welcome message
  React.useEffect(() => {
    triggerBobMessage('tips');
  }, []);

  const handlePlayGame = (game: Game) => {
    setSelectedGame(game);
    setCurrentView('quiz');
    triggerBobMessage('tips', `Starting ${game.title}! Remember to read each question carefully. Good luck!`);
  };

  const handleJoinTournament = (tournament: Tournament) => {
    console.log('Joining tournament:', tournament.title);
    triggerBobMessage('celebration', `Joined tournament: ${tournament.title}! Show them what you've got!`);
  };

  const handleQuizComplete = (results: any) => {
    setUser(prev => ({
      ...prev,
      coins: prev.coins + results.totalCoins,
      xp: prev.xp + results.totalXp,
      stats: {
        ...prev.stats,
        gamesPlayed: prev.stats.gamesPlayed + 1,
        questionsAnswered: prev.stats.questionsAnswered + results.totalQuestions,
        correctAnswers: prev.stats.correctAnswers + results.correctAnswers
      }
    }));
    
    const accuracy = Math.round((results.correctAnswers / results.totalQuestions) * 100);
    const message = accuracy >= 80 ? 
      `Outstanding! ${results.correctAnswers}/${results.totalQuestions} correct (${accuracy}%)! You're a true scholar! 🏆` :
      `Good effort! ${results.correctAnswers}/${results.totalQuestions} correct (${accuracy}%). Keep practicing and you'll improve! 💪`;
    triggerBobMessage(accuracy >= 80 ? 'celebration' : 'encouragement', message);
    setCurrentView('lobby');
    setSelectedGame(null);
  };

  const stats = [
    {
      title: 'Total XP',
      value: user.xp,
      icon: Zap,
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
      trend: { value: 12, isPositive: true }
    },
    {
      title: 'Games Played',
      value: user.stats.gamesPlayed,
      icon: Gamepad2,
      color: 'bg-gradient-to-r from-green-500 to-green-600',
      trend: { value: 8, isPositive: true }
    },
    {
      title: 'Accuracy',
      value: `${Math.round((user.stats.correctAnswers / user.stats.questionsAnswered) * 100)}%`,
      icon: Target,
      color: 'bg-gradient-to-r from-casino-gold-500 to-casino-gold-600'
    },
    {
      title: 'Best Streak',
      value: user.stats.streakRecord,
      icon: TrendingUp,
      color: 'bg-gradient-to-r from-purple-500 to-purple-600',
      trend: { value: 15, isPositive: true }
    }
  ];

  if (currentView === 'quiz' && selectedGame) {
    // Use coding questions for coding subjects, regular questions for others
    const questionsToUse = ['html', 'css', 'javascript', 'python'].includes(selectedGame.subject) 
      ? mockCodingQuestions.filter(q => q.subject === selectedGame.subject)
      : mockQuestions.filter(q => q.subject === selectedGame.subject);

    return (
      <QuizInterface
        questions={questionsToUse}
        onComplete={handleQuizComplete}
        onTriggerBobMessage={triggerBobMessage}
        onClose={() => {
          setCurrentView('lobby');
          setSelectedGame(null);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Header user={user} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-casino-gold-400 via-casino-gold-300 to-casino-gold-500 mb-4">
            Welcome to Scholars Table
          </h1>
          <p className="text-xl text-gray-300 font-body max-w-2xl mx-auto">
            Where knowledge meets excitement! Play educational games, join tournaments, and compete with students worldwide.
          </p>
        </motion.div>

        {/* Statistics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <StatCard {...stat} />
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Gaming Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Difficulty Categories */}
            {['basic', 'intermediate', 'advanced'].map((difficulty, categoryIndex) => {
              const categoryGames = mockGames.filter(game => game.difficulty === difficulty);
              const categoryColors = {
                basic: { bg: 'bg-green-500', text: 'text-green-400', border: 'border-green-500/30' },
                intermediate: { bg: 'bg-yellow-500', text: 'text-yellow-400', border: 'border-yellow-500/30' },
                advanced: { bg: 'bg-red-500', text: 'text-red-400', border: 'border-red-500/30' }
              };
              const categoryIcons = {
                basic: '🌱',
                intermediate: '🚀',
                advanced: '🏆'
              };
              const categoryTitles = {
                basic: 'Beginners',
                intermediate: 'Intermediate',
                advanced: 'Advanced'
              };
              const categoryDescriptions = {
                basic: 'Perfect for starting your learning journey',
                intermediate: 'Ready to take on more challenges',
                advanced: 'Master-level content for experts'
              };

              return (
                <motion.div
                  key={difficulty}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: categoryIndex * 0.2 }}
                >
                  <CasinoTable className="p-8">
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center space-x-4">
                        <div className={`p-4 ${categoryColors[difficulty as keyof typeof categoryColors].bg} rounded-xl shadow-lg`}>
                          <span className="text-3xl">{categoryIcons[difficulty as keyof typeof categoryIcons]}</span>
                        </div>
                        <div>
                          <h2 className="text-3xl font-heading font-bold text-white">
                            {categoryTitles[difficulty as keyof typeof categoryTitles]}
                          </h2>
                          <p className="text-casino-green-200">
                            {categoryDescriptions[difficulty as keyof typeof categoryDescriptions]}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-casino-green-200 text-sm">Available Games</p>
                        <p className="text-2xl font-bold text-white">{categoryGames.length}</p>
                      </div>
                    </div>

                    {categoryGames.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {categoryGames.map((game, index) => (
                          <motion.div
                            key={game.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                          >
                            <GameCard
                              game={game}
                              onPlay={handlePlayGame}
                            />
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="text-6xl mb-4">🚧</div>
                        <h3 className="text-xl font-semibold text-gray-300 mb-2">
                          Coming Soon!
                        </h3>
                        <p className="text-gray-400">
                          More {difficulty} level games are being prepared for you.
                        </p>
                      </div>
                    )}
                  </CasinoTable>
                </motion.div>
              );
            })}

            {/* Learning Progress */}
            <CasinoTable className="p-8">
              <div className="flex items-center space-x-3 mb-8">
                <div className="p-3 bg-blue-500 rounded-xl">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-heading font-bold text-white">
                    Learning Progress
                  </h2>
                  <p className="text-casino-green-200">
                    Track your educational journey
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { name: 'Mathematics', emoji: '🧮', color: 'bg-green-500' },
                  { name: 'Physics', emoji: '⚡', color: 'bg-blue-500' },
                  { name: 'Chemistry', emoji: '🧪', color: 'bg-purple-500' },
                  { name: 'HTML', emoji: '🌐', color: 'bg-orange-500' },
                  { name: 'CSS', emoji: '🎨', color: 'bg-blue-600' },
                  { name: 'JavaScript', emoji: '⚡', color: 'bg-yellow-500' },
                  { name: 'Python', emoji: '🐍', color: 'bg-green-600' }
                ].map((subject, index) => (
                  <motion.div
                    key={subject.name}
                    className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/30"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-3">
                        {subject.emoji}
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">{subject.name}</h3>
                      <div className="bg-gray-700 rounded-full h-2 mb-2">
                        <div 
                          className={`h-full rounded-full ${subject.color}`}
                          style={{ width: `${Math.random() * 80 + 20}%` }}
                        />
                      </div>
                      <p className="text-sm text-gray-400">
                        Level {Math.floor(Math.random() * 10) + 1}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CasinoTable>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Active Tournaments */}
            <CasinoTable className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-casino-red-500 rounded-lg">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-heading font-bold text-white">
                    Live Tournaments
                  </h3>
                  <p className="text-casino-green-200 text-sm">
                    Compete for prizes!
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {mockTournaments.slice(0, 2).map((tournament, index) => (
                  <motion.div
                    key={tournament.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <TournamentCard
                      tournament={tournament}
                      onJoin={handleJoinTournament}
                    />
                  </motion.div>
                ))}
              </div>
            </CasinoTable>

            {/* Recent Achievements */}
            <CasinoTable className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-casino-gold-500 rounded-lg">
                  <Award className="w-6 h-6 text-gray-900" />
                </div>
                <div>
                  <h3 className="text-xl font-heading font-bold text-white">
                    Achievements
                  </h3>
                  <p className="text-casino-green-200 text-sm">
                    Your latest wins
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {user.achievements.filter(a => a.earned).slice(0, 3).map((achievement, index) => (
                  <motion.div
                    key={achievement.id}
                    className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700/30"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="text-2xl">{achievement.icon}</div>
                    <div>
                      <h4 className="text-white font-semibold text-sm">
                        {achievement.title}
                      </h4>
                      <p className="text-gray-400 text-xs">
                        {achievement.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CasinoTable>
          </div>
        </div>
      </main>

      {/* Bob the Bot */}
      <BobTheBot
        currentContext="lobby"
        userLevel={user.level}
        currentMessage={currentBobMessage}
        messageHistory={bobMessageHistory}
        onTriggerMessage={triggerBobMessage}
      />
    </div>
  );
}

export default App;