import React from 'react';
import { motion } from 'framer-motion';
import { Play, Coins, Star } from 'lucide-react';
import { Game } from '../../types';

interface GameCardProps {
  game: Game;
  onPlay: (game: Game) => void;
}

export const GameCard: React.FC<GameCardProps> = ({ game, onPlay }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'basic': return 'text-green-400 bg-green-400/20 border border-green-400/30';
      case 'intermediate': return 'text-yellow-400 bg-yellow-400/20 border border-yellow-400/30';
      case 'advanced': return 'text-red-400 bg-red-400/20 border border-red-400/30';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'basic': return 'BEGINNER';
      case 'intermediate': return 'INTERMEDIATE';
      case 'advanced': return 'ADVANCED';
      default: return difficulty.toUpperCase();
    }
  };

  const getSubjectEmoji = (subject: string) => {
    switch (subject) {
      case 'mathematics': return '🧮';
      case 'physics': return '⚡';
      case 'chemistry': return '🧪';
      case 'html': return '🌐';
      case 'css': return '🎨';
      case 'javascript': return '⚡';
      case 'python': return '🐍';
      default: return '📚';
    }
  };

  return (
    <motion.div
      className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-xl border border-gray-700/50 overflow-hidden hover:border-casino-gold-500/50 transition-all duration-300"
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Card Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="text-4xl">{game.icon}</div>
            <div className="text-2xl">{getSubjectEmoji(game.subject)}</div>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(game.difficulty)}`}>
            {getDifficultyLabel(game.difficulty)}
          </div>
        </div>

        <h3 className="text-xl font-heading font-semibold text-white mb-2">
          {game.title}
        </h3>
        <p className="text-gray-400 text-sm font-body leading-relaxed mb-4">
          {game.description}
        </p>

        {/* Game Stats */}
        <div className="flex items-center justify-between text-sm text-gray-300 mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Coins className="w-4 h-4 text-casino-gold-400" />
              <span>{game.minBet}-{game.maxBet}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="capitalize">{game.subject}</span>
            </div>
          </div>
        </div>

        {/* Play Button */}
        <motion.button
          onClick={() => onPlay(game)}
          className="w-full bg-gradient-to-r from-casino-gold-500 to-casino-gold-600 hover:from-casino-gold-400 hover:to-casino-gold-500 text-gray-900 font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Play className="w-5 h-5" />
          <span>Play Now</span>
        </motion.button>
      </div>
    </motion.div>
  );
};