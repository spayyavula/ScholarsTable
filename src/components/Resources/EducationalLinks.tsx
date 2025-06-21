import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Star, BookOpen, Video, Calculator, Globe, Users, Award } from 'lucide-react';

interface EducationalLink {
  name: string;
  description: string;
  url: string;
  category: string;
  icon: string;
  rating?: number;
  features: string[];
  isPremium?: boolean;
}

const educationalResources: EducationalLink[] = [
  // Math Resources
  {
    name: 'Khan Academy',
    description: 'Free world-class education for anyone, anywhere',
    url: 'https://www.khanacademy.org/',
    category: 'Mathematics',
    icon: '🎯',
    rating: 4.8,
    features: ['Free courses', 'Progress tracking', 'Practice exercises', 'Video lessons'],
    isPremium: false
  },
  {
    name: 'Wolfram Alpha',
    description: 'Computational intelligence for complex math problems',
    url: 'https://www.wolframalpha.com/',
    category: 'Mathematics',
    icon: '🧮',
    rating: 4.7,
    features: ['Step-by-step solutions', 'Graphing', 'Equation solver', 'Math examples'],
    isPremium: true
  },
  {
    name: 'Desmos Graphing Calculator',
    description: 'Advanced online graphing calculator',
    url: 'https://www.desmos.com/calculator',
    category: 'Mathematics',
    icon: '📊',
    rating: 4.9,
    features: ['Free graphing', 'Interactive plots', 'Function analysis', 'Classroom tools'],
    isPremium: false
  },

  // Science Resources
  {
    name: 'Coursera',
    description: 'Online courses from top universities and companies',
    url: 'https://www.coursera.org/',
    category: 'Science',
    icon: '🎓',
    rating: 4.6,
    features: ['University courses', 'Certificates', 'Specializations', 'Degrees'],
    isPremium: true
  },
  {
    name: 'MIT OpenCourseWare',
    description: 'Free MIT course materials online',
    url: 'https://ocw.mit.edu/',
    category: 'Science',
    icon: '🔬',
    rating: 4.8,
    features: ['MIT courses', 'Free access', 'Lecture notes', 'Problem sets'],
    isPremium: false
  },
  {
    name: 'PhET Interactive Simulations',
    description: 'Interactive science and math simulations',
    url: 'https://phet.colorado.edu/',
    category: 'Science',
    icon: '⚗️',
    rating: 4.7,
    features: ['Interactive sims', 'Free access', 'Research-based', 'All grade levels'],
    isPremium: false
  },

  // Programming Resources
  {
    name: 'freeCodeCamp',
    description: 'Learn to code for free with hands-on projects',
    url: 'https://www.freecodecamp.org/',
    category: 'Programming',
    icon: '💻',
    rating: 4.8,
    features: ['Free coding bootcamp', 'Certificates', 'Projects', 'Community'],
    isPremium: false
  },
  {
    name: 'Codecademy',
    description: 'Interactive coding lessons and projects',
    url: 'https://www.codecademy.com/',
    category: 'Programming',
    icon: '⚡',
    rating: 4.5,
    features: ['Interactive lessons', 'Projects', 'Career paths', 'Skill assessments'],
    isPremium: true
  },
  {
    name: 'GitHub',
    description: 'Code hosting and collaboration platform',
    url: 'https://github.com/',
    category: 'Programming',
    icon: '🐙',
    rating: 4.7,
    features: ['Version control', 'Collaboration', 'Open source', 'Portfolio'],
    isPremium: false
  },

  // Language Learning
  {
    name: 'Duolingo',
    description: 'Fun and effective language learning',
    url: 'https://www.duolingo.com/',
    category: 'Languages',
    icon: '🦉',
    rating: 4.6,
    features: ['Gamified learning', 'Multiple languages', 'Progress tracking', 'Stories'],
    isPremium: false
  },
  {
    name: 'Memrise',
    description: 'Learn languages with spaced repetition',
    url: 'https://www.memrise.com/',
    category: 'Languages',
    icon: '🧠',
    rating: 4.4,
    features: ['Spaced repetition', 'Video clips', 'Native speakers', 'Offline mode'],
    isPremium: true
  },

  // General Education
  {
    name: 'TED-Ed',
    description: 'Educational videos and lessons',
    url: 'https://ed.ted.com/',
    category: 'General',
    icon: '🎬',
    rating: 4.7,
    features: ['Animated lessons', 'Think questions', 'Dig deeper', 'Discuss'],
    isPremium: false
  },
  {
    name: 'Crash Course',
    description: 'Educational YouTube channel with engaging content',
    url: 'https://www.youtube.com/user/crashcourse',
    category: 'General',
    icon: '🚀',
    rating: 4.8,
    features: ['Engaging videos', 'Multiple subjects', 'Free content', 'High quality'],
    isPremium: false
  },
  {
    name: 'Quizlet',
    description: 'Study tools including flashcards and games',
    url: 'https://quizlet.com/',
    category: 'Study Tools',
    icon: '📚',
    rating: 4.5,
    features: ['Flashcards', 'Study games', 'Practice tests', 'Collaborative sets'],
    isPremium: true
  }
];

interface EducationalLinksProps {
  selectedCategory?: string;
  showAll?: boolean;
}

export const EducationalLinks: React.FC<EducationalLinksProps> = ({ 
  selectedCategory = 'all',
  showAll = true 
}) => {
  const categories = ['all', ...Array.from(new Set(educationalResources.map(r => r.category)))];
  const [activeCategory, setActiveCategory] = React.useState(selectedCategory);

  const filteredResources = activeCategory === 'all' 
    ? educationalResources 
    : educationalResources.filter(r => r.category === activeCategory);

  const handleResourceClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      {showAll && (
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                activeCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((resource, index) => (
          <motion.div
            key={index}
            className="bg-white border border-gray-200 rounded-xl p-6 cursor-pointer hover:shadow-lg transition-all duration-300"
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
                  <span className="text-sm text-blue-600 font-medium">{resource.category}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {resource.rating && (
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium text-gray-700">{resource.rating}</span>
                  </div>
                )}
                <ExternalLink className="w-4 h-4 text-gray-400" />
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
              <span className={`font-semibold ${
                resource.isPremium ? 'text-orange-600' : 'text-green-600'
              }`}>
                {resource.isPremium ? 'PREMIUM' : 'FREE'}
              </span>
              <div className="text-gray-400 text-sm">
                Click to visit →
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Educational Tips */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <h4 className="text-lg font-bold text-blue-800 mb-4 flex items-center space-x-2">
          <BookOpen className="w-5 h-5" />
          <span>Study Tips for Success</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h5 className="font-semibold text-blue-700 mb-2">Effective Learning</h5>
            <ul className="space-y-1 text-sm text-blue-600">
              <li>• Set specific, achievable goals</li>
              <li>• Use active recall techniques</li>
              <li>• Practice spaced repetition</li>
              <li>• Take regular breaks</li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-blue-700 mb-2">Resource Management</h5>
            <ul className="space-y-1 text-sm text-blue-600">
              <li>• Start with free resources</li>
              <li>• Combine multiple learning methods</li>
              <li>• Track your progress</li>
              <li>• Join study communities</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};