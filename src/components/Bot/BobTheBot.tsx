import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Lightbulb, Heart, Trophy } from 'lucide-react';
import { BobMessage } from '../../types';

interface BobTheBotProps {
  currentContext?: string;
  userLevel: number;
  currentMessage: BobMessage | null;
  messageHistory: BobMessage[];
  onTriggerMessage: (type: BobMessage['type'], customMessage?: string) => void;
}

export const BobTheBot: React.FC<BobTheBotProps> = ({ 
  currentContext = 'lobby', 
  userLevel,
  currentMessage,
  messageHistory,
  onTriggerMessage
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const getIconForMessageType = (type: BobMessage['type']) => {
    switch (type) {
      case 'tips': return <Lightbulb className="w-4 h-4 text-yellow-400" />;
      case 'encouragement': return <Heart className="w-4 h-4 text-red-400" />;
      case 'celebration': return <Trophy className="w-4 h-4 text-casino-gold-400" />;
      case 'hints': return <MessageCircle className="w-4 h-4 text-blue-400" />;
      default: return <MessageCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <>
      {/* Bob's Avatar - Always Visible */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 200 }}
      >
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="w-16 h-16 bg-gradient-to-br from-casino-gold-400 to-casino-gold-600 rounded-full shadow-2xl flex items-center justify-center text-2xl hover:scale-110 transition-transform duration-300 border-4 border-white"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          animate={{
            boxShadow: [
              '0 0 20px rgba(251, 191, 36, 0.5)',
              '0 0 30px rgba(251, 191, 36, 0.8)',
              '0 0 20px rgba(251, 191, 36, 0.5)'
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          🤖
        </motion.button>

        {/* Current Message Bubble */}
        <AnimatePresence>
          {currentMessage && !isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: 20 }}
              className="absolute bottom-20 right-0 bg-gray-900 text-white p-4 rounded-2xl shadow-xl max-w-xs border border-casino-gold-600/30"
            >
              <div className="flex items-start space-x-2">
                {getIconForMessageType(currentMessage.type)}
                <p className="text-sm font-body leading-relaxed">{currentMessage.message}</p>
              </div>
              <div className="absolute -bottom-2 right-6 w-4 h-4 bg-gray-900 transform rotate-45 border-r border-b border-casino-gold-600/30"></div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: 50 }}
            className="fixed bottom-24 right-6 w-80 bg-gray-900 rounded-2xl shadow-2xl border border-gray-700/50 z-40 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-casino-gold-500 to-casino-gold-600 p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl">
                  🤖
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Bob the Bot</h3>
                  <p className="text-xs text-gray-700">Your Learning Companion</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-700 hover:text-gray-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="p-4 max-h-80 overflow-y-auto space-y-4">
              {messageHistory.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start space-x-3"
                >
                  <div className="w-6 h-6 bg-casino-gold-500 rounded-full flex items-center justify-center flex-shrink-0">
                    {getIconForMessageType(message.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-200 leading-relaxed">{message.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="p-4 border-t border-gray-700/50">
              <div className="grid grid-cols-2 gap-2">
                <motion.button
                  onClick={() => {
                    onTriggerMessage('tips');
                  }}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs py-2 px-3 rounded-lg transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  💡 Get Tip
                </motion.button>
                <motion.button
                  onClick={() => {
                    onTriggerMessage('hints');
                  }}
                  className="bg-green-600 hover:bg-green-500 text-white text-xs py-2 px-3 rounded-lg transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  🔍 Need Help
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};