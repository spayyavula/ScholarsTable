import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Header } from './components/Layout/Header';
import { CasinoTable } from './components/Casino/CasinoTable';
import { GameCard } from './components/Casino/GameCard';
import { TournamentCard } from './components/Tournament/TournamentCard';
import { BobTheBot } from './components/Bot/BobTheBot';
import { StatCard } from './components/Dashboard/StatCard';
import { QuizInterface } from './components/Quiz/QuizInterface';
import { mockUser, mockGames, mockTournaments, mockQuestions } from './data/mockData';
import { Game, Tournament, Question } from './types';
import { Trophy, Users, Gamepad2, Target, BookOpen, Award, Zap, TrendingUp } from 'lucide-react';

function App() {
  const [currentView, setCurrentView] = useState<'lobby' | 'quiz'>('lobby');
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [user, setUser] = useState(mockUser);
  const [bobActivity, setBobActivity] = useState<string>('');

  const handlePlayGame = (game: Game) => {
    setSelectedGame(game);
    setCurrentView('quiz');
    setBobActivity('Starting game: ' + game.title);
  };

  const handleJoinTournament = (tournament: Tournament) => {
    console.log('Joining tournament:', tournament.title);
    setBobActivity('Joined tournament: ' + tournament.title);
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
    
    setBobActivity(`Quiz completed! ${results.correctAnswers} correct answers`);
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
    return (
      <QuizInterface
        questions={mockQuestions}
        onComplete={handleQuizComplete}
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
            {/* Scholar Games */}
            <CasinoTable className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-casino-gold-500 rounded-xl">
                    <Gamepad2 className="w-8 h-8 text-gray-900" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-heading font-bold text-white">
                      Scholar Games
                    </h2>
                    <p className="text-casino-green-200">
                      Choose your subject and start learning!
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-casino-green-200 text-sm">Available Games</p>
                  <p className="text-2xl font-bold text-white">{mockGames.length}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mockGames.map((game, index) => (
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
            </CasinoTable>

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

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {['Mathematics', 'Physics', 'Chemistry'].map((subject, index) => (
                  <motion.div
                    key={subject}
                    className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/30"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-3">
                        {subject === 'Mathematics' ? '🧮' : 
                         subject === 'Physics' ? '⚡' : '🧪'}
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">{subject}</h3>
                      <div className="bg-gray-700 rounded-full h-2 mb-2">
                        <div 
                          className={`h-full rounded-full ${
                            subject === 'Mathematics' ? 'bg-green-500' :
                            subject === 'Physics' ? 'bg-blue-500' : 'bg-purple-500'
                          }`}
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
        recentActivity={bobActivity}
      />
    </div>
  );
}

export default App;