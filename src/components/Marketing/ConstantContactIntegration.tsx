import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Users, 
  TrendingUp, 
  Calendar, 
  Target,
  BarChart3,
  Send,
  Eye,
  MousePointer,
  UserPlus
} from 'lucide-react';

interface ConstantContactIntegrationProps {
  onClose: () => void;
}

interface CampaignStats {
  id: string;
  name: string;
  subject: string;
  sentDate: string;
  recipients: number;
  opens: number;
  clicks: number;
  openRate: number;
  clickRate: number;
  status: 'sent' | 'scheduled' | 'draft';
}

interface ContactList {
  id: string;
  name: string;
  contactCount: number;
  description: string;
  tags: string[];
}

export const ConstantContactIntegration: React.FC<ConstantContactIntegrationProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'campaigns' | 'contacts' | 'automation'>('dashboard');
  const [campaigns] = useState<CampaignStats[]>([
    {
      id: '1',
      name: 'Welcome Series - New Subscribers',
      subject: 'Welcome to Scholars Table! 🎓',
      sentDate: '2024-01-15',
      recipients: 1250,
      opens: 875,
      clicks: 234,
      openRate: 70,
      clickRate: 18.7,
      status: 'sent'
    },
    {
      id: '2',
      name: 'Weekly Study Tips #47',
      subject: 'Master Calculus in 5 Steps',
      sentDate: '2024-01-12',
      recipients: 8500,
      opens: 5950,
      clicks: 1190,
      openRate: 70,
      clickRate: 14,
      status: 'sent'
    },
    {
      id: '3',
      name: 'Tournament Announcement',
      subject: 'New Physics Tournament Starting Soon!',
      sentDate: '2024-01-18',
      recipients: 3200,
      opens: 0,
      clicks: 0,
      openRate: 0,
      clickRate: 0,
      status: 'scheduled'
    }
  ]);

  const [contactLists] = useState<ContactList[]>([
    {
      id: '1',
      name: 'Newsletter Subscribers',
      contactCount: 12500,
      description: 'General newsletter subscribers',
      tags: ['newsletter', 'general']
    },
    {
      id: '2',
      name: 'Pro Subscribers',
      contactCount: 2800,
      description: 'Paid subscribers to Scholar Pro',
      tags: ['paid', 'pro', 'premium']
    },
    {
      id: '3',
      name: 'Coding Enthusiasts',
      contactCount: 4200,
      description: 'Users interested in programming content',
      tags: ['coding', 'programming', 'tech']
    },
    {
      id: '4',
      name: 'Tournament Participants',
      contactCount: 1900,
      description: 'Active tournament participants',
      tags: ['tournaments', 'competitive', 'active']
    }
  ]);

  const totalContacts = contactLists.reduce((sum, list) => sum + list.contactCount, 0);
  const avgOpenRate = campaigns.filter(c => c.status === 'sent').reduce((sum, c) => sum + c.openRate, 0) / campaigns.filter(c => c.status === 'sent').length;
  const avgClickRate = campaigns.filter(c => c.status === 'sent').reduce((sum, c) => sum + c.clickRate, 0) / campaigns.filter(c => c.status === 'sent').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
        <div className="bg-gradient-to-r from-orange-500 to-red-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 rounded-full p-3">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Marketing Dashboard</h2>
                <p className="text-orange-100">Powered by Constant Contact</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 mt-6 bg-white/10 rounded-lg p-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'campaigns', label: 'Campaigns', icon: Send },
              { id: 'contacts', label: 'Contacts', icon: Users },
              { id: 'automation', label: 'Automation', icon: Target }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-orange-600 shadow-sm'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 h-full overflow-y-auto">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <motion.div
                  className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm">Total Contacts</p>
                      <p className="text-2xl font-bold">{totalContacts.toLocaleString()}</p>
                    </div>
                    <Users className="w-8 h-8 text-blue-200" />
                  </div>
                  <div className="mt-2 flex items-center text-blue-100 text-sm">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +12% this month
                  </div>
                </motion.div>

                <motion.div
                  className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm">Avg Open Rate</p>
                      <p className="text-2xl font-bold">{avgOpenRate.toFixed(1)}%</p>
                    </div>
                    <Eye className="w-8 h-8 text-green-200" />
                  </div>
                  <div className="mt-2 flex items-center text-green-100 text-sm">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    Above industry avg
                  </div>
                </motion.div>

                <motion.div
                  className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm">Avg Click Rate</p>
                      <p className="text-2xl font-bold">{avgClickRate.toFixed(1)}%</p>
                    </div>
                    <MousePointer className="w-8 h-8 text-purple-200" />
                  </div>
                  <div className="mt-2 flex items-center text-purple-100 text-sm">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +2.3% vs last month
                  </div>
                </motion.div>

                <motion.div
                  className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-sm">New Subscribers</p>
                      <p className="text-2xl font-bold">847</p>
                    </div>
                    <UserPlus className="w-8 h-8 text-orange-200" />
                  </div>
                  <div className="mt-2 flex items-center text-orange-100 text-sm">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    This month
                  </div>
                </motion.div>
              </div>

              {/* Recent Campaigns */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Campaigns</h3>
                <div className="space-y-4">
                  {campaigns.slice(0, 3).map((campaign, index) => (
                    <motion.div
                      key={campaign.id}
                      className="bg-white rounded-lg p-4 border border-gray-200"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-800">{campaign.subject}</h4>
                          <p className="text-sm text-gray-600">{campaign.name}</p>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                            {campaign.status}
                          </span>
                          <p className="text-sm text-gray-600 mt-1">{campaign.sentDate}</p>
                        </div>
                      </div>
                      {campaign.status === 'sent' && (
                        <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Recipients</p>
                            <p className="font-semibold">{campaign.recipients.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Open Rate</p>
                            <p className="font-semibold text-green-600">{campaign.openRate}%</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Click Rate</p>
                            <p className="font-semibold text-blue-600">{campaign.clickRate}%</p>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'campaigns' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-800">Email Campaigns</h3>
                <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors">
                  Create Campaign
                </button>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Campaign</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Subject</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Recipients</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Open Rate</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Click Rate</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {campaigns.map((campaign, index) => (
                        <motion.tr
                          key={campaign.id}
                          className="border-t border-gray-200 hover:bg-gray-50"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-medium text-gray-800">{campaign.name}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-600">{campaign.subject}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                              {campaign.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-600">{campaign.recipients.toLocaleString()}</td>
                          <td className="py-3 px-4">
                            {campaign.status === 'sent' ? (
                              <span className="text-green-600 font-medium">{campaign.openRate}%</span>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            {campaign.status === 'sent' ? (
                              <span className="text-blue-600 font-medium">{campaign.clickRate}%</span>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-gray-600">{campaign.sentDate}</td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'contacts' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-800">Contact Lists</h3>
                <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors">
                  Create List
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {contactLists.map((list, index) => (
                  <motion.div
                    key={list.id}
                    className="bg-white rounded-xl border border-gray-200 p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-gray-800">{list.name}</h4>
                      <span className="text-2xl font-bold text-orange-600">
                        {list.contactCount.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{list.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {list.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'automation' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-800">Email Automation</h3>
                <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors">
                  Create Automation
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    name: 'Welcome Series',
                    description: 'Onboard new subscribers with a 5-email sequence',
                    status: 'Active',
                    subscribers: 1250,
                    emails: 5
                  },
                  {
                    name: 'Course Completion',
                    description: 'Congratulate users who complete courses',
                    status: 'Active',
                    subscribers: 890,
                    emails: 3
                  },
                  {
                    name: 'Re-engagement',
                    description: 'Win back inactive subscribers',
                    status: 'Paused',
                    subscribers: 2100,
                    emails: 4
                  }
                ].map((automation, index) => (
                  <motion.div
                    key={index}
                    className="bg-white rounded-xl border border-gray-200 p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-800">{automation.name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        automation.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {automation.status}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{automation.description}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Subscribers</p>
                        <p className="font-semibold">{automation.subscribers.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Emails</p>
                        <p className="font-semibold">{automation.emails}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};