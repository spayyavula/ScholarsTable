import React from 'react';
import { motion } from 'framer-motion';

interface CasinoTableProps {
  children: React.ReactNode;
  className?: string;
}

export const CasinoTable: React.FC<CasinoTableProps> = ({ children, className = '' }) => {
  return (
    <motion.div
      className={`relative bg-gradient-to-br from-casino-green-800 to-casino-green-900 rounded-3xl shadow-2xl border-8 border-yellow-600 overflow-hidden ${className}`}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Table felt texture */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-casino-green-700/30 to-casino-green-900/50 pointer-events-none" />
      
      {/* Decorative border pattern */}
      <div className="absolute inset-0 border-4 border-casino-gold-400/20 rounded-3xl pointer-events-none" />
      
      {/* Casino chips scattered decoration */}
      <div className="absolute top-4 left-4 w-6 h-6 bg-casino-red-500 rounded-full shadow-lg border-2 border-white opacity-60" />
      <div className="absolute top-8 right-8 w-5 h-5 bg-casino-gold-500 rounded-full shadow-lg border-2 border-white opacity-40" />
      <div className="absolute bottom-6 left-8 w-4 h-4 bg-blue-500 rounded-full shadow-lg border-2 border-white opacity-50" />
      
      {/* Content */}
      <div className="relative z-10 p-8">
        {children}
      </div>
    </motion.div>
  );
};