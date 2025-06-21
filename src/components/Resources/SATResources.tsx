import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  ExternalLink, 
  Star, 
  Clock, 
  Target, 
  Users,
  Award,
  TrendingUp,
  FileText,
  Video,
  Headphones,
  Calculator,
  PenTool,
  Globe,
  Smartphone,
  X
} from 'lucide-react';

interface SATResourcesProps {
  onClose: () => void;
}

const primaryResources = [
  {
    name: 'Khan Academy SAT',
    description: 'Free, personalized SAT practice with official College Board partnership',
    url: 'https://www.khanacademy.org/sat',
    icon: '🎯',
    features: ['Personalized practice', 'Official questions', 'Progress tracking', 'Video lessons'],
    rating: 4.8,
    type: 'Practice Platform'
  },
  {
    name: 'College Board SAT',
    description: 'Official SAT information, practice tests, and registration',
    url: 'https://satsuite.collegeboard.org/sat',
    icon: '📋',
    features: ['Official practice tests', 'Test registration', 'Score reports', 'Test day info'],
    rating: 4.9,
    type: 'Official Source'
  }
];

const additionalResources = [
  {
    category: 'Practice Tests & Questions',
    resources: [
      {
        name: 'PrepScholar SAT',
        description: 'Comprehensive SAT prep with adaptive learning',
        url: 'https://www.prepscholar.com/sat/',
        icon: '📚',
        type: 'Prep Course',
        features: ['Adaptive learning', 'Score guarantee', 'Expert strategies']
      },
      {
        name: 'Magoosh SAT',
        description: 'Video lessons and practice questions with detailed explanations',
        url: 'https://magoosh.com/sat/',
        icon: '🎥',
        type: 'Video Course',
        features: ['Video lessons', 'Mobile app', 'Score improvement']
      },
      {
        name: 'UWorld SAT',
        description: 'High-quality practice questions with detailed explanations',
        url: 'https://www.uworld.com/sat/',
        icon: '💡',
        type: 'Question Bank',
        features: ['Detailed explanations', 'Performance tracking', 'Realistic questions']
      }
    ]
  },
  {
    category: 'Free Study Materials',
    resources: [
      {
        name: 'Varsity Tutors SAT',
        description: 'Free SAT practice tests and diagnostic exams',
        url: 'https://www.varsitytutors.com/sat',
        icon: '🔬',
        type: 'Practice Tests',
        features: ['Diagnostic tests', 'Flashcards', 'Study guides']
      },
      {
        name: 'Kaplan SAT',
        description: 'Free SAT practice and prep resources',
        url: 'https://www.kaptest.com/sat',
        icon: '📖',
        type: 'Study Materials',
        features: ['Practice questions', 'Study tips', 'Test strategies']
      },
      {
        name: 'Princeton Review SAT',
        description: 'SAT prep books, practice tests, and strategies',
        url: 'https://www.princetonreview.com/college/sat-test-prep',
        icon: '🏆',
        type: 'Test Prep',
        features: ['Strategy guides', 'Practice tests', 'Score improvement tips']
      }
    ]
  },
  {
    category: 'Subject-Specific Help',
    resources: [
      {
        name: 'Purplemath',
        description: 'Algebra and math help for SAT Math section',
        url: 'https://www.purplemath.com/',
        icon: '🧮',
        type: 'Math Help',
        features: ['Step-by-step solutions', 'Math tutorials', 'Practice problems']
      },
      {
        name: 'Grammarly',
        description: 'Writing and grammar help for SAT Writing section',
        url: 'https://www.grammarly.com/',
        icon: '✍️',
        type: 'Writing Help',
        features: ['Grammar checker', 'Writing tips', 'Style suggestions']
      },
      {
        name: 'SparkNotes',
        description: 'Literature guides and reading comprehension help',
        url: 'https://www.sparknotes.com/',
        icon: '📝',
        type: 'Reading Help',
        features: ['Literature guides', 'Study guides', 'Practice quizzes']
      }
    ]
  },
  {
    category: 'Mobile Apps',
    resources: [
      {
        name: 'Daily Practice for SAT',
        description: 'Official College Board daily practice app',
        url: 'https://collegereadiness.collegeboard.org/sat/practice/daily-practice-app',
        icon: '📱',
        type: 'Mobile App',
        features: ['Daily questions', 'Official content', 'Progress tracking']
      },
      {
        name: 'SAT Prep by Magoosh',
        description: 'Mobile SAT prep with video lessons',
        url: 'https://magoosh.com/sat/mobile/',
        icon: '📲',
        type: 'Mobile App',
        features: ['Video lessons', 'Practice questions', 'Study schedules']
      }
    ]
  },
  {
    category: 'YouTube Channels',
    resources: [
      {
        name: 'Khan Academy SAT',
        description: 'Free SAT prep videos and tutorials',
        url: 'https://www.youtube.com/user/khanacademy',
        icon: '🎬',
        type: 'Video Content',
        features: ['Free videos', 'Expert instruction', 'All subjects covered']
      },
      {
        name: 'Scalar Learning',
        description: 'SAT Math strategies and problem solving',
        url: 'https://www.youtube.com/c/ScalarLearning',
        icon: '🎯',
        type: 'Math Videos',
        features: ['Math strategies', 'Problem solving', 'Test tips']
      },
      {
        name: 'SupertutorTV',
        description: 'SAT prep strategies and tips',
        url: 'https://www.youtube.com/c/SupertutorTV',
        icon: '🌟',
        type: 'Strategy Videos',
        features: ['Test strategies', 'Study tips', 'Score improvement']
      }
    ]
  }
];

const studyTips = [
  {
    title: 'Create a Study Schedule',
    description: 'Plan your SAT prep with consistent daily practice',
    icon: Clock,
    tips: [
      'Study 30-60 minutes daily',
      'Focus on weak areas',
      'Take practice tests weekly',
      'Review mistakes thoroughly'
    ]
  },
  {
    title: 'Master Test Strategies',
    description: 'Learn proven techniques for each section',
    icon: Target,
    tips: [
      'Process of elimination',
      'Time management',
      'Question prioritization',
      'Educated guessing'
    ]
  },
  {
    title: 'Track Your Progress',
    description: 'Monitor improvement and adjust study plan',
    icon: TrendingUp,
    tips: [
      'Take diagnostic tests',
      'Log practice scores',
      'Identify patterns',
      'Celebrate improvements'
    ]
  }
];

export const SATResources: React.FC<SATResourcesProps> = ({ onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleResourceClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <motion.div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] overflow-hidden"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 rounded-full p-3">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">SAT Preparation Resources</h2>
                <p className="text-blue-100">Comprehensive study materials and practice resources</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 h-full overflow-y-auto">
          {/* Primary Resources */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <span>Official & Recommended Resources</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {primaryResources.map((resource, index) => (
                <motion.div
                  key={index}
                  className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 cursor-pointer hover:shadow-lg transition-all duration-300"
                  onClick={() => handleResourceClick(resource.url)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-3xl">{resource.icon}</div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-800">{resource.name}</h4>
                        <span className="text-sm text-blue-600 font-medium">{resource.type}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium text-gray-700">{resource.rating}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{resource.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {resource.features.map((feature, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-green-600 font-semibold">FREE</span>
                    <ExternalLink className="w-4 h-4 text-blue-600" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Study Tips */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Study Tips & Strategies</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {studyTips.map((tip, index) => (
                <motion.div
                  key={index}
                  className="bg-gray-50 rounded-xl p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-green-100 rounded-lg p-2">
                      <tip.icon className="w-5 h-5 text-green-600" />
                    </div>
                    <h4 className="font-semibold text-gray-800">{tip.title}</h4>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{tip.description}</p>
                  <ul className="space-y-2">
                    {tip.tips.map((item, idx) => (
                      <li key={idx} className="flex items-center space-x-2 text-sm text-gray-700">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Additional Resources */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Additional Study Resources</h3>
            
            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              {additionalResources.map((category) => (
                <button
                  key={category.category}
                  onClick={() => setSelectedCategory(
                    selectedCategory === category.category ? null : category.category
                  )}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCategory === category.category
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.category}
                </button>
              ))}
            </div>

            {/* Resources Grid */}
            <AnimatePresence>
              {selectedCategory && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {additionalResources
                      .find(cat => cat.category === selectedCategory)
                      ?.resources.map((resource, index) => (
                        <motion.div
                          key={index}
                          className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition-all duration-300"
                          onClick={() => handleResourceClick(resource.url)}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div className="text-2xl">{resource.icon}</div>
                              <div>
                                <h5 className="font-semibold text-gray-800">{resource.name}</h5>
                                <span className="text-xs text-blue-600">{resource.type}</span>
                              </div>
                            </div>
                            <ExternalLink className="w-4 h-4 text-gray-400" />
                          </div>
                          
                          <p className="text-gray-600 text-sm mb-3">{resource.description}</p>
                          
                          <div className="flex flex-wrap gap-1">
                            {resource.features.map((feature, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                              >
                                {feature}
                              </span>
                            ))}
                          </div>
                        </motion.div>
                      ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Show All Resources Button */}
            {!selectedCategory && (
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  Click on a category above to explore specific resources
                </p>
                <motion.button
                  onClick={() => setSelectedCategory(additionalResources[0].category)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Explore All Resources
                </motion.button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">💡 Pro Tip</h4>
              <p className="text-blue-700 text-sm">
                Start with Khan Academy and College Board for official practice, then supplement with additional resources based on your specific needs. 
                Consistency is key - aim for daily practice sessions rather than cramming!
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};