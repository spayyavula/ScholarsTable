import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Database, 
  Table, 
  Link, 
  Code, 
  CheckCircle,
  Play,
  Lightbulb
} from 'lucide-react';

interface TutorialOverlayProps {
  onClose: () => void;
}

const tutorialSteps = [
  {
    title: 'Welcome to Schema Designer',
    content: 'Learn how to design professional database schemas visually. This tool helps you understand database fundamentals while creating Supabase-ready SQL.',
    icon: Database,
    image: '🎯'
  },
  {
    title: 'Creating Tables',
    content: 'Click "Add Table" to create a new table. Each table represents an entity in your database. Give it a meaningful name and add columns to define its structure.',
    icon: Table,
    image: '📋'
  },
  {
    title: 'Defining Columns',
    content: 'Add columns to your tables by clicking the + button. Choose appropriate data types (UUID, TEXT, INTEGER, etc.) and set constraints like PRIMARY KEY and NOT NULL.',
    icon: Database,
    image: '📝'
  },
  {
    title: 'Creating Relationships',
    content: 'Connect tables by creating relationships. Drag from one table to another to establish foreign key relationships. Choose between one-to-one, one-to-many, or many-to-many.',
    icon: Link,
    image: '🔗'
  },
  {
    title: 'Generating SQL',
    content: 'Switch to the SQL tab to see your schema converted to Supabase-ready SQL. The generated code includes table creation, foreign keys, indexes, and RLS policies.',
    icon: Code,
    image: '⚡'
  },
  {
    title: 'Validation & Best Practices',
    content: 'Use the Validation tab to check your schema against database best practices. Get suggestions for improvements and ensure your design follows industry standards.',
    icon: CheckCircle,
    image: '✅'
  },
  {
    title: 'Database Design Principles',
    content: 'Remember the key principles: Normalization reduces redundancy, proper indexing improves performance, and RLS policies ensure security. Start simple and iterate.',
    icon: Lightbulb,
    image: '💡'
  }
];

export const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentTutorial = tutorialSteps[currentStep];

  return (
    <motion.div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full mx-4 overflow-hidden"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 rounded-full p-2">
                <currentTutorial.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{currentTutorial.title}</h3>
                <p className="text-blue-100 text-sm">
                  Step {currentStep + 1} of {tutorialSteps.length}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 bg-white/20 rounded-full h-2 overflow-hidden">
            <motion.div
              className="bg-white h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / tutorialSteps.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <div className="text-6xl mb-6">{currentTutorial.image}</div>
              <p className="text-gray-300 text-lg leading-relaxed mb-8">
                {currentTutorial.content}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                currentStep === 0
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <div className="flex space-x-2">
              {tutorialSteps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentStep
                      ? 'bg-blue-500'
                      : index < currentStep
                      ? 'bg-green-500'
                      : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>

            {currentStep === tutorialSteps.length - 1 ? (
              <motion.button
                onClick={onClose}
                className="flex items-center space-x-2 px-6 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Play className="w-4 h-4" />
                <span>Start Designing</span>
              </motion.button>
            ) : (
              <button
                onClick={nextStep}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Tips Section */}
        <div className="bg-gray-800/50 p-4 border-t border-gray-700">
          <div className="flex items-start space-x-3">
            <Lightbulb className="w-5 h-5 text-yellow-400 mt-0.5" />
            <div>
              <h4 className="text-yellow-400 font-semibold text-sm">Pro Tip</h4>
              <p className="text-gray-400 text-sm mt-1">
                {currentStep === 0 && "Start with your main entities (users, products, orders) and then add supporting tables."}
                {currentStep === 1 && "Use descriptive table names in snake_case (e.g., user_profiles, order_items)."}
                {currentStep === 2 && "Always include an ID column as primary key and consider adding created_at/updated_at timestamps."}
                {currentStep === 3 && "Foreign keys should reference primary keys. Use consistent naming (user_id, product_id)."}
                {currentStep === 4 && "The generated SQL includes Row Level Security policies for better data protection."}
                {currentStep === 5 && "Fix errors first, then warnings, and finally consider suggestions for optimization."}
                {currentStep === 6 && "Practice with simple schemas first. You can always refactor and improve your design later."}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};