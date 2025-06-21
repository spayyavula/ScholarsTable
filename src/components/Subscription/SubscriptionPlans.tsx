import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Crown, 
  Star, 
  Zap, 
  Check, 
  X, 
  CreditCard, 
  Shield, 
  Infinity,
  Users,
  Trophy,
  BookOpen,
  Code,
  Sparkles
} from 'lucide-react';

interface SubscriptionPlansProps {
  onSelectPlan: (planId: string, priceId: string) => void;
  onClose: () => void;
}

const plans = [
  {
    id: 'free',
    name: 'Scholar',
    price: 0,
    period: 'forever',
    description: 'Perfect for getting started with learning',
    color: 'from-gray-500 to-gray-600',
    icon: BookOpen,
    features: [
      '5 quiz attempts per day',
      'Basic subjects (Math, Physics, Chemistry)',
      'Community tournaments',
      'Basic progress tracking',
      'Mobile responsive design'
    ],
    limitations: [
      'No coding challenges',
      'Limited tournament access',
      'Basic support only',
      'No advanced analytics'
    ],
    popular: false,
    priceId: null
  },
  {
    id: 'pro',
    name: 'Scholar Pro',
    price: 9.99,
    period: 'month',
    description: 'Unlock your full learning potential',
    color: 'from-blue-500 to-indigo-600',
    icon: Star,
    features: [
      'Unlimited quiz attempts',
      'All subjects including coding',
      'Interactive code editors',
      'Priority tournament access',
      'Advanced progress analytics',
      'Personalized learning paths',
      'Bob AI tutor assistance',
      'Schema designer tool',
      'Export progress reports'
    ],
    limitations: [
      'Single user account',
      'Standard support'
    ],
    popular: true,
    priceId: 'price_pro_monthly'
  },
  {
    id: 'premium',
    name: 'Scholar Elite',
    price: 19.99,
    period: 'month',
    description: 'For serious learners and educators',
    color: 'from-purple-500 to-pink-600',
    icon: Crown,
    features: [
      'Everything in Scholar Pro',
      'Create custom tournaments',
      'Team collaboration features',
      'Advanced AI tutoring',
      'Custom learning modules',
      'White-label options',
      'API access for integrations',
      'Priority customer support',
      'Monthly 1-on-1 coaching calls',
      'Certificate generation'
    ],
    limitations: [],
    popular: false,
    priceId: 'price_premium_monthly'
  },
  {
    id: 'enterprise',
    name: 'Scholar Enterprise',
    price: 'Custom',
    period: 'contact us',
    description: 'For schools and large organizations',
    color: 'from-emerald-500 to-teal-600',
    icon: Users,
    features: [
      'Everything in Scholar Elite',
      'Unlimited team members',
      'Custom branding',
      'SSO integration',
      'Advanced reporting & analytics',
      'Dedicated account manager',
      'Custom integrations',
      'On-premise deployment options',
      'Training & onboarding',
      'SLA guarantees'
    ],
    limitations: [],
    popular: false,
    priceId: null
  }
];

export const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({ onSelectPlan, onClose }) => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const handleSelectPlan = (plan: typeof plans[0]) => {
    if (plan.id === 'enterprise') {
      // Handle enterprise contact form
      window.open('mailto:enterprise@scholarstable.com?subject=Enterprise Plan Inquiry', '_blank');
      return;
    }
    
    if (plan.id === 'free') {
      // Handle free plan signup
      onSelectPlan(plan.id, '');
      return;
    }

    setSelectedPlan(plan.id);
    const priceId = billingCycle === 'yearly' ? `${plan.priceId}_yearly` : plan.priceId;
    onSelectPlan(plan.id, priceId || '');
  };

  const getYearlyPrice = (monthlyPrice: number) => {
    return monthlyPrice * 12 * 0.8; // 20% discount for yearly
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <motion.div
        className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 rounded-full p-3">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-heading font-bold text-white">
                  Choose Your Learning Journey
                </h2>
                <p className="text-white/80">Unlock your potential with the perfect plan</p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center mt-6">
            <div className="bg-white/10 rounded-lg p-1 flex">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all relative ${
                  billingCycle === 'yearly'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                Yearly
                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  20% OFF
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                className={`relative bg-gradient-to-br ${plan.color} rounded-xl shadow-xl overflow-hidden ${
                  plan.popular ? 'ring-4 ring-yellow-400 ring-opacity-50' : ''
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute top-4 right-4 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                    <Sparkles className="w-3 h-3" />
                    <span>POPULAR</span>
                  </div>
                )}

                <div className="p-6 text-white">
                  {/* Plan Header */}
                  <div className="text-center mb-6">
                    <div className="bg-white/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <plan.icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                    <p className="text-white/80 text-sm">{plan.description}</p>
                  </div>

                  {/* Pricing */}
                  <div className="text-center mb-6">
                    {typeof plan.price === 'number' ? (
                      <div>
                        <div className="text-3xl font-bold">
                          ${billingCycle === 'yearly' && plan.price > 0 
                            ? getYearlyPrice(plan.price).toFixed(2) 
                            : plan.price === 0 
                            ? 'Free' 
                            : plan.price.toFixed(2)
                          }
                        </div>
                        {plan.price > 0 && (
                          <div className="text-white/70 text-sm">
                            per {billingCycle === 'yearly' ? 'year' : 'month'}
                            {billingCycle === 'yearly' && (
                              <div className="text-xs text-green-300">
                                Save ${(plan.price * 12 * 0.2).toFixed(2)}/year
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div>
                        <div className="text-2xl font-bold">{plan.price}</div>
                        <div className="text-white/70 text-sm">{plan.period}</div>
                      </div>
                    )}
                  </div>

                  {/* Features */}
                  <div className="space-y-3 mb-6">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start space-x-2">
                        <Check className="w-4 h-4 text-green-300 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-white/90">{feature}</span>
                      </div>
                    ))}
                    
                    {plan.limitations.map((limitation, idx) => (
                      <div key={idx} className="flex items-start space-x-2">
                        <X className="w-4 h-4 text-red-300 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-white/60">{limitation}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <motion.button
                    onClick={() => handleSelectPlan(plan)}
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                      plan.id === 'free'
                        ? 'bg-white/20 hover:bg-white/30 text-white'
                        : plan.id === 'enterprise'
                        ? 'bg-white/20 hover:bg-white/30 text-white'
                        : 'bg-white text-gray-900 hover:bg-gray-100'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={selectedPlan === plan.id}
                  >
                    {selectedPlan === plan.id ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        <span>Processing...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        {plan.id === 'free' ? (
                          <>
                            <span>Get Started Free</span>
                          </>
                        ) : plan.id === 'enterprise' ? (
                          <>
                            <span>Contact Sales</span>
                          </>
                        ) : (
                          <>
                            <CreditCard className="w-4 h-4" />
                            <span>Subscribe Now</span>
                          </>
                        )}
                      </div>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Features Comparison */}
          <div className="mt-12 bg-gray-800/50 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-6 text-center">Feature Comparison</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4 text-gray-300">Features</th>
                    {plans.map(plan => (
                      <th key={plan.id} className="text-center py-3 px-4 text-gray-300">
                        {plan.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-gray-300">
                  {[
                    { feature: 'Quiz Attempts', values: ['5/day', 'Unlimited', 'Unlimited', 'Unlimited'] },
                    { feature: 'Coding Challenges', values: [false, true, true, true] },
                    { feature: 'AI Tutor', values: [false, true, true, true] },
                    { feature: 'Custom Tournaments', values: [false, false, true, true] },
                    { feature: 'Team Features', values: [false, false, false, true] },
                    { feature: 'API Access', values: [false, false, true, true] },
                    { feature: 'Support Level', values: ['Basic', 'Standard', 'Priority', 'Dedicated'] }
                  ].map((row, idx) => (
                    <tr key={idx} className="border-b border-gray-700/50">
                      <td className="py-3 px-4 font-medium">{row.feature}</td>
                      {row.values.map((value, valueIdx) => (
                        <td key={valueIdx} className="text-center py-3 px-4">
                          {typeof value === 'boolean' ? (
                            value ? (
                              <Check className="w-4 h-4 text-green-400 mx-auto" />
                            ) : (
                              <X className="w-4 h-4 text-red-400 mx-auto" />
                            )
                          ) : (
                            value
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800/50 rounded-lg p-4 text-center">
              <Shield className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <h4 className="text-white font-semibold mb-1">Secure Payments</h4>
              <p className="text-gray-400 text-sm">Powered by Stripe with bank-level security</p>
            </div>
            
            <div className="bg-gray-800/50 rounded-lg p-4 text-center">
              <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <h4 className="text-white font-semibold mb-1">Instant Access</h4>
              <p className="text-gray-400 text-sm">Start learning immediately after subscription</p>
            </div>
            
            <div className="bg-gray-800/50 rounded-lg p-4 text-center">
              <Trophy className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <h4 className="text-white font-semibold mb-1">Cancel Anytime</h4>
              <p className="text-gray-400 text-sm">No long-term commitments or hidden fees</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};