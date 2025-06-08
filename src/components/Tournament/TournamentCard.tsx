import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Users, Clock, Coins } from 'lucide-react';
import { Tournament } from '../../types';

interface TournamentCardProps {
  tournament: Tournament;
  onJoin: (tournament: Tournament) => void;
}

export const TournamentCard: React.FC<TournamentCardProps> = ({ tournament, onJoin }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-400/20';
      case 'upcoming': return 'text-blue-400 bg-blue-400/20';
      case 'completed': return 'text-gray-400 bg-gray-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getTimeUntilStart = () => {
    const now = new Date();
    const timeDiff = tournament.startTime.getTime() - now.getTime();
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <motion.div
      className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-xl border border-gray-700/50 overflow-hidden relative"
      whileHover={{ scale: 1.02, y: -3 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Sponsored Badge */}
      {tournament.isSponsored && (
        <div className="absolute top-4 right-4 bg-gradient-to-r from-casino-gold-500 to-casino-gold-600 text-gray-900 px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
          SPONSORED
        </div>
      )}

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Trophy className="w-8 h-8 text-casino-gold-400" />
            <div>
              <h3 className="text-lg font-heading font-semibold text-white">
                {tournament.title}
              </h3>
              {tournament.sponsor && (
                <p className="text-xs text-casino-gold-400">
                  Sponsored by {tournament.sponsor}
                </p>
              )}
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(tournament.status)}`}>
            {tournament.status.toUpperCase()}
          </div>
        </div>

        <p className="text-gray-400 text-sm font-body mb-4">
          {tournament.description}
        </p>

        {/* Tournament Info */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2 text-gray-300">
              <Coins className="w-4 h-4 text-casino-gold-400" />
              <span>Prize Pool</span>
            </div>
            <span className="text-casino-gold-400 font-semibold">
              {tournament.prize.toLocaleString()} coins
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2 text-gray-300">
              <Users className="w-4 h-4 text-blue-400" />
              <span>Participants</span>
            </div>
            <span className="text-blue-400 font-semibold">
              {tournament.participants.length}
            </span>
          </div>

          {tournament.status === 'upcoming' && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2 text-gray-300">
                <Clock className="w-4 h-4 text-green-400" />
                <span>Starts in</span>
              </div>
              <span className="text-green-400 font-semibold">
                {getTimeUntilStart()}
              </span>
            </div>
          )}
        </div>

        {/* Leaderboard Preview */}
        {tournament.participants.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-300 mb-2">Top Players</h4>
            <div className="space-y-2">
              {tournament.participants
                .sort((a, b) => b.score - a.score)
                .slice(0, 3)
                .map((participant, index) => (
                  <div key={participant.userId} className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      index === 0 ? 'bg-casino-gold-500 text-gray-900' :
                      index === 1 ? 'bg-gray-400 text-gray-900' :
                      'bg-yellow-600 text-white'
                    }`}>
                      {index + 1}
                    </div>
                    <img
                      src={participant.avatar}
                      alt={participant.name}
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="text-sm text-gray-300 flex-1">{participant.name}</span>
                    <span className="text-sm font-semibold text-casino-gold-400">
                      {participant.score}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Action Button */}
        <motion.button
          onClick={() => onJoin(tournament)}
          disabled={tournament.status === 'completed'}
          className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
            tournament.status === 'completed'
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : tournament.status === 'active'
              ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white'
              : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white'
          }`}
          whileHover={tournament.status !== 'completed' ? { scale: 1.02 } : {}}
          whileTap={tournament.status !== 'completed' ? { scale: 0.98 } : {}}
        >
          {tournament.status === 'active' ? 'Join Now' : 
           tournament.status === 'upcoming' ? 'Register' : 
           'Completed'}
        </motion.button>
      </div>
    </motion.div>
  );
};