import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Info, 
  Lightbulb,
  Database,
  Table as TableIcon,
  Link,
  Key,
  Shield
} from 'lucide-react';
import { ValidationResult, Table, Relationship } from '../../types/schema';

interface SchemaValidationProps {
  validationResults: ValidationResult[];
  tables: Table[];
  relationships: Relationship[];
  onSelectTable: (table: Table) => void;
  onSelectRelationship: (relationship: Relationship) => void;
}

export const SchemaValidation: React.FC<SchemaValidationProps> = ({
  validationResults,
  tables,
  relationships,
  onSelectTable,
  onSelectRelationship
}) => {
  const errors = validationResults.filter(r => r.type === 'error');
  const warnings = validationResults.filter(r => r.type === 'warning');
  const suggestions = validationResults.filter(r => r.type === 'suggestion');

  const getIcon = (type: string) => {
    switch (type) {
      case 'error': return <XCircle className="w-5 h-5 text-red-400" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'suggestion': return <Lightbulb className="w-5 h-5 text-blue-400" />;
      default: return <Info className="w-5 h-5 text-gray-400" />;
    }
  };

  const getBackgroundColor = (type: string) => {
    switch (type) {
      case 'error': return 'bg-red-900/20 border-red-500/30';
      case 'warning': return 'bg-yellow-900/20 border-yellow-500/30';
      case 'suggestion': return 'bg-blue-900/20 border-blue-500/30';
      default: return 'bg-gray-900/20 border-gray-500/30';
    }
  };

  const handleResultClick = (result: ValidationResult) => {
    if (result.tableId) {
      const table = tables.find(t => t.id === result.tableId);
      if (table) onSelectTable(table);
    }
    if (result.relationshipId) {
      const relationship = relationships.find(r => r.id === result.relationshipId);
      if (relationship) onSelectRelationship(relationship);
    }
  };

  const getBestPracticeScore = () => {
    let score = 100;
    score -= errors.length * 20;
    score -= warnings.length * 10;
    score -= suggestions.length * 5;
    return Math.max(0, score);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const bestPractices = [
    {
      title: 'Primary Keys',
      description: 'Every table should have a primary key',
      check: () => tables.every(table => table.columns.some(col => col.isPrimaryKey)),
      icon: Key
    },
    {
      title: 'Naming Convention',
      description: 'Use consistent naming (snake_case recommended)',
      check: () => tables.every(table => 
        /^[a-z][a-z0-9_]*$/.test(table.name) &&
        table.columns.every(col => /^[a-z][a-z0-9_]*$/.test(col.name))
      ),
      icon: TableIcon
    },
    {
      title: 'Foreign Key Constraints',
      description: 'All relationships should have proper foreign key constraints',
      check: () => relationships.length === 0 || relationships.every(rel => rel.fromColumn && rel.toColumn),
      icon: Link
    },
    {
      title: 'Audit Columns',
      description: 'Include created_at and updated_at timestamps',
      check: () => tables.some(table => 
        table.columns.some(col => col.name.includes('created_at')) &&
        table.columns.some(col => col.name.includes('updated_at'))
      ),
      icon: Database
    },
    {
      title: 'Security Considerations',
      description: 'Consider Row Level Security for user data',
      check: () => tables.some(table => 
        table.columns.some(col => col.name === 'user_id')
      ),
      icon: Shield
    }
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-green-600 rounded-full p-2">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">Schema Validation</h3>
              <p className="text-gray-400">Analyze your database design for best practices</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-white">
              <span className={getScoreColor(getBestPracticeScore())}>
                {getBestPracticeScore()}%
              </span>
            </div>
            <div className="text-sm text-gray-400">Design Score</div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Summary */}
        <div className="p-6 border-b border-gray-700">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <XCircle className="w-5 h-5 text-red-400" />
                <span className="text-red-300 font-semibold">Errors</span>
              </div>
              <div className="text-2xl font-bold text-red-400 mt-2">{errors.length}</div>
            </div>
            
            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-300 font-semibold">Warnings</span>
              </div>
              <div className="text-2xl font-bold text-yellow-400 mt-2">{warnings.length}</div>
            </div>
            
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Lightbulb className="w-5 h-5 text-blue-400" />
                <span className="text-blue-300 font-semibold">Suggestions</span>
              </div>
              <div className="text-2xl font-bold text-blue-400 mt-2">{suggestions.length}</div>
            </div>
          </div>
        </div>

        {/* Validation Results */}
        {validationResults.length > 0 && (
          <div className="p-6 border-b border-gray-700">
            <h4 className="text-lg font-semibold text-white mb-4">Validation Results</h4>
            <div className="space-y-3">
              {validationResults.map((result, index) => (
                <motion.div
                  key={index}
                  className={`border rounded-lg p-4 cursor-pointer hover:bg-opacity-80 transition-colors ${getBackgroundColor(result.type)}`}
                  onClick={() => handleResultClick(result)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-start space-x-3">
                    {getIcon(result.type)}
                    <div className="flex-1">
                      <div className="text-white font-medium">{result.message}</div>
                      {result.suggestion && (
                        <div className="text-gray-400 text-sm mt-1">{result.suggestion}</div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Best Practices Checklist */}
        <div className="p-6">
          <h4 className="text-lg font-semibold text-white mb-4">Best Practices Checklist</h4>
          <div className="space-y-3">
            {bestPractices.map((practice, index) => {
              const passed = practice.check();
              return (
                <motion.div
                  key={index}
                  className={`border rounded-lg p-4 ${
                    passed 
                      ? 'bg-green-900/20 border-green-500/30' 
                      : 'bg-gray-900/20 border-gray-500/30'
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${
                      passed ? 'bg-green-600' : 'bg-gray-600'
                    }`}>
                      <practice.icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-white font-medium">{practice.title}</span>
                        {passed ? (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        ) : (
                          <XCircle className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                      <div className="text-gray-400 text-sm mt-1">{practice.description}</div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Database Design Tips */}
        <div className="p-6 border-t border-gray-700">
          <h4 className="text-lg font-semibold text-white mb-4">Database Design Tips</h4>
          <div className="space-y-4 text-sm text-gray-300">
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
              <h5 className="font-semibold text-blue-300 mb-2">Normalization</h5>
              <p>Organize data to reduce redundancy and improve data integrity. Follow the normal forms (1NF, 2NF, 3NF) to structure your tables properly.</p>
            </div>
            
            <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
              <h5 className="font-semibold text-green-300 mb-2">Indexing</h5>
              <p>Create indexes on frequently queried columns, especially foreign keys and columns used in WHERE clauses. This improves query performance significantly.</p>
            </div>
            
            <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
              <h5 className="font-semibold text-purple-300 mb-2">Security</h5>
              <p>Implement Row Level Security (RLS) policies to control data access. Use proper authentication and authorization patterns for your application.</p>
            </div>
            
            <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-4">
              <h5 className="font-semibold text-orange-300 mb-2">Performance</h5>
              <p>Consider query patterns when designing your schema. Denormalization might be beneficial for read-heavy applications, but maintain data consistency.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};