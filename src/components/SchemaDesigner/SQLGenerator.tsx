import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Copy, 
  Download, 
  Play, 
  Database, 
  Code, 
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';
import { Table, Relationship } from '../../types/schema';

interface SQLGeneratorProps {
  tables: Table[];
  relationships: Relationship[];
}

export const SQLGenerator: React.FC<SQLGeneratorProps> = ({ tables, relationships }) => {
  const [activeTab, setActiveTab] = useState<'create' | 'migrate' | 'seed'>('create');
  const [copied, setCopied] = useState(false);

  const generateCreateTableSQL = (table: Table): string => {
    const columns = table.columns.map(column => {
      let sql = `  ${column.name} ${column.type}`;
      
      if (column.isPrimaryKey) {
        sql += ' PRIMARY KEY';
      }
      
      if (column.isRequired && !column.isPrimaryKey) {
        sql += ' NOT NULL';
      }
      
      if (column.defaultValue) {
        sql += ` DEFAULT ${column.defaultValue}`;
      }
      
      return sql;
    }).join(',\n');

    return `CREATE TABLE ${table.name} (\n${columns}\n);`;
  };

  const generateRelationshipSQL = (relationship: Relationship): string => {
    const fromTable = tables.find(t => t.id === relationship.fromTable);
    const toTable = tables.find(t => t.id === relationship.toTable);
    
    if (!fromTable || !toTable) return '';

    return `ALTER TABLE ${fromTable.name} 
ADD CONSTRAINT fk_${fromTable.name}_${toTable.name} 
FOREIGN KEY (${relationship.fromColumn}) 
REFERENCES ${toTable.name}(${relationship.toColumn});`;
  };

  const generateRLSPolicies = (table: Table): string => {
    return `-- Enable Row Level Security
ALTER TABLE ${table.name} ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users to read their own data
CREATE POLICY "${table.name}_select_policy" ON ${table.name}
  FOR SELECT USING (auth.uid() = user_id);

-- Policy for authenticated users to insert their own data
CREATE POLICY "${table.name}_insert_policy" ON ${table.name}
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy for authenticated users to update their own data
CREATE POLICY "${table.name}_update_policy" ON ${table.name}
  FOR UPDATE USING (auth.uid() = user_id);

-- Policy for authenticated users to delete their own data
CREATE POLICY "${table.name}_delete_policy" ON ${table.name}
  FOR DELETE USING (auth.uid() = user_id);`;
  };

  const generateIndexes = (table: Table): string => {
    const indexes = table.columns
      .filter(col => col.isForeignKey || col.name.includes('_id') || col.name.includes('email'))
      .map(col => `CREATE INDEX idx_${table.name}_${col.name} ON ${table.name}(${col.name});`)
      .join('\n');
    
    return indexes;
  };

  const generateMigrationSQL = (): string => {
    const timestamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0];
    const filename = `${timestamp}_create_schema.sql`;
    
    let sql = `-- Migration: ${filename}\n`;
    sql += `-- Created: ${new Date().toISOString()}\n\n`;
    
    // Create tables
    sql += "-- Create Tables\n";
    tables.forEach(table => {
      sql += generateCreateTableSQL(table) + '\n\n';
    });
    
    // Add relationships
    if (relationships.length > 0) {
      sql += "-- Add Foreign Key Constraints\n";
      relationships.forEach(rel => {
        sql += generateRelationshipSQL(rel) + '\n\n';
      });
    }
    
    // Add indexes
    sql += "-- Create Indexes\n";
    tables.forEach(table => {
      const indexes = generateIndexes(table);
      if (indexes) {
        sql += indexes + '\n\n';
      }
    });
    
    // Add RLS policies
    sql += "-- Row Level Security Policies\n";
    tables.forEach(table => {
      if (table.columns.some(col => col.name === 'user_id')) {
        sql += generateRLSPolicies(table) + '\n\n';
      }
    });
    
    return sql;
  };

  const generateSeedSQL = (): string => {
    let sql = "-- Seed Data\n";
    sql += "-- Insert sample data for testing\n\n";
    
    tables.forEach(table => {
      sql += `-- Sample data for ${table.name}\n`;
      sql += `INSERT INTO ${table.name} (`;
      
      const nonAutoColumns = table.columns.filter(col => 
        !col.defaultValue?.includes('gen_random_uuid()') && 
        !col.defaultValue?.includes('now()')
      );
      
      sql += nonAutoColumns.map(col => col.name).join(', ');
      sql += ') VALUES\n';
      sql += `  -- Add your sample data here\n`;
      sql += `  -- Example: ('value1', 'value2', 'value3')\n;\n\n`;
    });
    
    return sql;
  };

  const sqlContent = useMemo(() => {
    switch (activeTab) {
      case 'create':
        return generateMigrationSQL();
      case 'migrate':
        return generateMigrationSQL();
      case 'seed':
        return generateSeedSQL();
      default:
        return '';
    }
  }, [activeTab, tables, relationships]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(sqlContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const downloadSQL = () => {
    const blob = new Blob([sqlContent], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `schema_${activeTab}_${Date.now()}.sql`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getValidationIssues = () => {
    const issues = [];
    
    if (tables.length === 0) {
      issues.push({ type: 'warning', message: 'No tables defined' });
    }
    
    tables.forEach(table => {
      if (!table.columns.some(col => col.isPrimaryKey)) {
        issues.push({ type: 'error', message: `Table "${table.name}" has no primary key` });
      }
      
      if (table.columns.length === 0) {
        issues.push({ type: 'error', message: `Table "${table.name}" has no columns` });
      }
    });
    
    return issues;
  };

  const validationIssues = getValidationIssues();

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-600 rounded-full p-2">
              <Code className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">SQL Generator</h3>
              <p className="text-gray-400">Generate Supabase-ready SQL from your schema</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <motion.button
              onClick={copyToClipboard}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span className="text-sm">{copied ? 'Copied!' : 'Copy'}</span>
            </motion.button>
            
            <motion.button
              onClick={downloadSQL}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Download className="w-4 h-4" />
              <span className="text-sm">Download</span>
            </motion.button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mt-4 bg-gray-800 rounded-lg p-1">
          {[
            { id: 'create', label: 'Create Schema', icon: Database },
            { id: 'migrate', label: 'Migration', icon: Play },
            { id: 'seed', label: 'Seed Data', icon: Info }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Validation Issues */}
      {validationIssues.length > 0 && (
        <div className="p-4 border-b border-gray-700">
          <div className="space-y-2">
            {validationIssues.map((issue, index) => (
              <div
                key={index}
                className={`flex items-center space-x-2 p-2 rounded-lg ${
                  issue.type === 'error' 
                    ? 'bg-red-900/20 border border-red-500/30' 
                    : 'bg-yellow-900/20 border border-yellow-500/30'
                }`}
              >
                {issue.type === 'error' ? (
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                ) : (
                  <Info className="w-4 h-4 text-yellow-400" />
                )}
                <span className={`text-sm ${
                  issue.type === 'error' ? 'text-red-300' : 'text-yellow-300'
                }`}>
                  {issue.message}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SQL Content */}
      <div className="flex-1 p-6">
        <div className="h-full bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">
          <div className="h-full overflow-auto">
            <pre className="p-4 text-sm text-gray-300 font-mono leading-relaxed">
              <code>{sqlContent}</code>
            </pre>
          </div>
        </div>
      </div>

      {/* Footer with Instructions */}
      <div className="p-4 border-t border-gray-700 bg-gray-800/50">
        <div className="text-sm text-gray-400">
          <p className="mb-2">
            <strong className="text-white">Instructions:</strong>
          </p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Copy the generated SQL or download the file</li>
            <li>Open your Supabase project dashboard</li>
            <li>Go to the SQL Editor</li>
            <li>Paste and run the SQL commands</li>
            <li>Your database schema will be created with proper RLS policies</li>
          </ol>
        </div>
      </div>
    </div>
  );
};