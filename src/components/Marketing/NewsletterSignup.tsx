import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  CheckCircle, 
  AlertTriangle, 
  Gift, 
  Star,
  Zap,
  BookOpen,
  Users,
  Trophy
} from 'lucide-react';

interface NewsletterSignupProps {
  onClose?: () => void;
  inline?: boolean;
  source?: string;
}

export const NewsletterSignup: React.FC<NewsletterSignupProps> = ({ 
  onClose, 
  inline = false,
  source = 'general'
}) => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const interestOptions = [
    { id: 'math', label: 'Mathematics', icon: '🧮' },
    { id: 'physics', label: 'Physics', icon: '⚡' },
    { id: 'chemistry', label: 'Chemistry', icon: '🧪' },
    { id: 'coding', label: 'Programming', icon: '💻' },
    { id: 'tournaments', label: 'Tournaments', icon: '🏆' },
    { id: 'tips', label: 'Study Tips', icon: '💡' }
  ];

  const handleInterestToggle = (interestId: string) => {
    setInterests(prev => 
      prev.includes(interestId)
        ? prev.filter(id => id !== interestId)
        : [...prev, interestId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // In a real implementation, this would integrate with Constant Contact API
      // For demo purposes, we'll simulate the process
      
      const contactData = {
        email,
        firstName,
        interests,
        source,
        subscribedAt: new Date().toISOString(),
        lists: ['newsletter', 'product-updates']
      };

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Simulate successful subscription
      console.log('Newsletter subscription:', contactData);
      
      // In real implementation:
      // 1. Call Constant Contact API to add contact
      // 2. Add to appropriate lists based on interests
      // 3. Send welcome email
      // 4. Track conversion in analytics
      
      setSuccess(true);
      
      // Auto-close after success (if not inline)
      if (!inline && onClose) {
        setTimeout(() => {
          onClose();
        }, 3000);
      }
    } catch (err) {
      setError('Failed to subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    {
      icon: Gift,
      title: 'Exclusive Content',
      description: 'Get access to premium study materials and early feature previews'
    },
    {
      icon: Zap,
      title: 'Weekly Tips',
      description: 'Receive personalized learning tips and study strategies'
    },
    {
      icon: Trophy,
      title: 'Tournament Alerts',
      description: 'Be the first to know about new tournaments and competitions'
    },
    {
      icon: BookOpen,
      title: 'New Subjects',
      description: 'Get notified when we add new subjects and learning paths'
    }
  ];

  if (success) {
    return (
      <motion.div
        className={`${inline ? 'bg-green-50 border border-green-200 rounded-lg p-6' : 'fixed inset-0 bg-black/80 flex items-center justify-center z-50'}`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className={`${inline ? '' : 'bg-white rounded-2xl p-8 max-w-md w-full mx-4'} text-center`}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          </motion.div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Welcome to the Community!</h3>
          <p className="text-gray-600 mb-4">
            Thank you for subscribing! Check your email for a welcome message with exclusive content.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-700">
              🎁 <strong>Bonus:</strong> You'll receive a free study guide within the next 24 hours!
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  const content = (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className="text-center">
        <div className="bg-blue-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <Mail className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          Join 10,000+ Learners
        </h3>
        <p className="text-gray-600">
          Get exclusive study tips, early access to new features, and special offers
        </p>
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {benefits.map((benefit, index) => (
          <motion.div
            key={index}
            className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="bg-blue-100 rounded-lg p-2">
              <benefit.icon className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 text-sm">{benefit.title}</h4>
              <p className="text-gray-600 text-xs">{benefit.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="John"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="john@example.com"
            />
          </div>
        </div>

        {/* Interests */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            What interests you? (Optional)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {interestOptions.map((option) => (
              <motion.button
                key={option.id}
                type="button"
                onClick={() => handleInterestToggle(option.id)}
                className={`flex items-center space-x-2 p-2 rounded-lg border transition-all ${
                  interests.includes(option.id)
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-sm">{option.icon}</span>
                <span className="text-xs font-medium">{option.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <AlertTriangle className="w-4 h-4 text-red-500" />
          <span className="text-sm text-red-700">{error}</span>
        </motion.div>
      )}

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={loading || !email}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
        whileHover={{ scale: loading ? 1 : 1.02 }}
        whileTap={{ scale: loading ? 1 : 0.98 }}
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Subscribing...</span>
          </>
        ) : (
          <>
            <Mail className="w-4 h-4" />
            <span>Join the Community</span>
          </>
        )}
      </motion.button>

      {/* Privacy Notice */}
      <p className="text-xs text-gray-500 text-center">
        We respect your privacy. Unsubscribe at any time. 
        <br />
        By subscribing, you agree to our Privacy Policy.
      </p>
    </motion.form>
  );

  if (inline) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        {content}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <motion.div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="p-6">
          <div className="flex justify-end mb-4">
            {onClose && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
            )}
          </div>
          {content}
        </div>
      </motion.div>
    </div>
  );
};