import React from 'react';
import { User, Coins, Trophy, Settings, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { User as UserType } from '../../types';

interface HeaderProps {
  user: UserType;
  onOpenSATResources?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onOpenSATResources }) => {
  return (
    <motion.header 
      className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-2xl border-b border-casino-gold-600/30"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-casino-gold-400 to-casino-gold-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-2xl">📚</span>
            </div>
            <div>
              <h1 className="text-2xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-casino-gold-400 to-casino-gold-200">
                Scholars Table
              </h1>
              <p className="text-xs text-gray-400 font-body">Where Education Meets Gaming</p>
            </div>
          </motion.div>

          {/* User Info */}
          <div className="flex items-center space-x-6">
            {/* SAT Resources Button */}
            {onOpenSATResources && (
              <motion.button
                onClick={onOpenSATResources}
                className="flex items-center space-x-2 bg-indigo-600/20 px-4 py-2 rounded-full border border-indigo-600/30 hover:bg-indigo-600/30 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <BookOpen className="w-4 h-4 text-indigo-400" />
                <span className="text-indigo-200 font-medium text-sm">SAT Prep</span>
              </motion.button>
            )}
            
            {/* Coins */}
            <motion.div 
              className="flex items-center space-x-2 bg-casino-gold-600/20 px-4 py-2 rounded-full border border-casino-gold-600/30"
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(251, 191, 36, 0.3)' }}
            >
              <Coins className="w-5 h-5 text-casino-gold-400" />
              <span className="text-casino-gold-200 font-semibold font-body">
                {user.coins.toLocaleString()}
              </span>
            </motion.div>

            {/* XP Level */}
            <motion.div 
              className="flex items-center space-x-2 bg-casino-green-600/20 px-4 py-2 rounded-full border border-casino-green-600/30"
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(34, 197, 94, 0.3)' }}
            >
              <Trophy className="w-5 h-5 text-casino-green-400" />
              <span className="text-casino-green-200 font-semibold font-body">
                Level {user.level}
              </span>
            </motion.div>

            {/* User Profile */}
            <motion.div 
              className="flex items-center space-x-3 bg-gray-800/50 px-4 py-2 rounded-full border border-gray-700/50"
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(31, 41, 55, 0.7)' }}
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full border-2 border-casino-gold-400"
              />
              <span className="text-white font-medium font-body">{user.name}</span>
              <Settings className="w-4 h-4 text-gray-400 hover:text-white transition-colors cursor-pointer" />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};