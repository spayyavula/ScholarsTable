import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Database, 
  Table, 
  Key, 
  Link, 
  Download, 
  Upload, 
  Save, 
  Eye, 
  Code, 
  Trash2,
  Edit3,
  Settings,
  BookOpen,
  Lightbulb,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { TableDesigner } from './TableDesigner';
import { RelationshipDesigner } from './RelationshipDesigner';
import { SQLGenerator } from './SQLGenerator';
import { SchemaValidation } from './SchemaValidation';
import { TutorialOverlay } from './TutorialOverlay';
import { Table as TableType, Relationship, Column, ValidationResult } from '../../types/schema';

interface SchemaDesignerProps {
  onClose: () => void;
}

export const SchemaDesigner: React.FC<SchemaDesignerProps> = ({ onClose }) => {
  const [tables, setTables] = useState<TableType[]>([]);
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [selectedTable, setSelectedTable] = useState<TableType | null>(null);
  const [selectedRelationship, setSelectedRelationship] = useState<Relationship | null>(null);
  const [activeTab, setActiveTab] = useState<'design' | 'sql' | 'validation'>('design');
  const [showTutorial, setShowTutorial] = useState(false);
  const [draggedTable, setDraggedTable] = useState<string | null>(null);
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Add new table
  const addTable = useCallback(() => {
    const newTable: TableType = {
      id: `table_${Date.now()}`,
      name: `table_${tables.length + 1}`,
      columns: [
        {
          id: `col_${Date.now()}`,
          name: 'id',
          type: 'UUID',
          isPrimaryKey: true,
          isRequired: true,
          defaultValue: 'gen_random_uuid()',
          description: 'Primary key'
        }
      ],
      position: { x: 100 + tables.length * 50, y: 100 + tables.length * 50 },
      description: '',
      color: '#3B82F6'
    };
    setTables(prev => [...prev, newTable]);
    setSelectedTable(newTable);
  }, [tables.length]);

  // Update table
  const updateTable = useCallback((updatedTable: TableType) => {
    setTables(prev => prev.map(table => 
      table.id === updatedTable.id ? updatedTable : table
    ));
    if (selectedTable?.id === updatedTable.id) {
      setSelectedTable(updatedTable);
    }
  }, [selectedTable]);

  // Delete table
  const deleteTable = useCallback((tableId: string) => {
    setTables(prev => prev.filter(table => table.id !== tableId));
    setRelationships(prev => prev.filter(rel => 
      rel.fromTable !== tableId && rel.toTable !== tableId
    ));
    if (selectedTable?.id === tableId) {
      setSelectedTable(null);
    }
  }, [selectedTable]);

  // Add relationship
  const addRelationship = useCallback((relationship: Relationship) => {
    setRelationships(prev => [...prev, relationship]);
  }, []);

  // Delete relationship
  const deleteRelationship = useCallback((relationshipId: string) => {
    setRelationships(prev => prev.filter(rel => rel.id !== relationshipId));
    if (selectedRelationship?.id === relationshipId) {
      setSelectedRelationship(null);
    }
  }, [selectedRelationship]);

  // Handle table drag
  const handleTableDrag = useCallback((tableId: string, position: { x: number; y: number }) => {
    setTables(prev => prev.map(table => 
      table.id === tableId ? { ...table, position } : table
    ));
  }, []);

  // Export schema
  const exportSchema = useCallback(() => {
    const schema = { tables, relationships };
    const blob = new Blob([JSON.stringify(schema, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'database-schema.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [tables, relationships]);

  // Import schema
  const importSchema = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const schema = JSON.parse(e.target?.result as string);
          setTables(schema.tables || []);
          setRelationships(schema.relationships || []);
        } catch (error) {
          alert('Invalid schema file');
        }
      };
      reader.readAsText(file);
    }
  }, []);

  // Get validation results
  const getValidationResults = useCallback((): ValidationResult[] => {
    const results: ValidationResult[] = [];

    // Check for tables without primary keys
    tables.forEach(table => {
      const hasPrimaryKey = table.columns.some(col => col.isPrimaryKey);
      if (!hasPrimaryKey) {
        results.push({
          type: 'error',
          message: `Table "${table.name}" has no primary key`,
          suggestion: 'Add a primary key column (usually an ID field)',
          tableId: table.id
        });
      }

      // Check for empty table names
      if (!table.name.trim()) {
        results.push({
          type: 'error',
          message: 'Table has no name',
          suggestion: 'Provide a descriptive name for the table',
          tableId: table.id
        });
      }

      // Check for columns without names
      table.columns.forEach(column => {
        if (!column.name.trim()) {
          results.push({
            type: 'error',
            message: `Column in table "${table.name}" has no name`,
            suggestion: 'Provide a name for the column',
            tableId: table.id,
            columnId: column.id
          });
        }
      });
    });

    // Check for orphaned relationships
    relationships.forEach(rel => {
      const fromTable = tables.find(t => t.id === rel.fromTable);
      const toTable = tables.find(t => t.id === rel.toTable);
      
      if (!fromTable || !toTable) {
        results.push({
          type: 'error',
          message: 'Relationship references non-existent table',
          suggestion: 'Remove the invalid relationship',
          relationshipId: rel.id
        });
      }
    });

    // Suggestions for best practices
    if (tables.length > 0) {
      const hasTimestamps = tables.some(table => 
        table.columns.some(col => 
          col.name.toLowerCase().includes('created_at') || 
          col.name.toLowerCase().includes('updated_at')
        )
      );
      
      if (!hasTimestamps) {
        results.push({
          type: 'warning',
          message: 'Consider adding timestamp columns',
          suggestion: 'Add created_at and updated_at columns for audit trails'
        });
      }
    }

    return results;
  }, [tables, relationships]);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <motion.div
        className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl w-full max-w-[95vw] h-[95vh] overflow-hidden"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 rounded-full p-3">
                <Database className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-heading font-bold text-white">
                  Database Schema Designer
                </h2>
                <p className="text-white/80">Visual database design tool for Supabase</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <motion.button
                onClick={() => setShowTutorial(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 rounded-lg transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <BookOpen className="w-4 h-4" />
                <span className="text-sm">Tutorial</span>
              </motion.button>
              
              <div className="flex items-center space-x-2">
                <input
                  type="file"
                  accept=".json"
                  onChange={importSchema}
                  className="hidden"
                  id="import-schema"
                />
                <label
                  htmlFor="import-schema"
                  className="flex items-center space-x-2 px-3 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg cursor-pointer transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  <span className="text-sm">Import</span>
                </label>
                
                <motion.button
                  onClick={exportSchema}
                  className="flex items-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Download className="w-4 h-4" />
                  <span className="text-sm">Export</span>
                </motion.button>
              </div>
              
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 transition-colors"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 mt-4 bg-white/10 rounded-lg p-1">
            {[
              { id: 'design', label: 'Design', icon: Table },
              { id: 'sql', label: 'SQL', icon: Code },
              { id: 'validation', label: 'Validation', icon: CheckCircle }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{tab.label}</span>
                {tab.id === 'validation' && getValidationResults().length > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {getValidationResults().filter(r => r.type === 'error').length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex h-full">
          {activeTab === 'design' && (
            <>
              {/* Toolbar */}
              <div className="w-64 bg-gray-800 border-r border-gray-700 p-4">
                <div className="space-y-4">
                  <motion.button
                    onClick={addTable}
                    className="w-full flex items-center space-x-2 px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Plus className="w-5 h-5" />
                    <span>Add Table</span>
                  </motion.button>

                  <div className="border-t border-gray-700 pt-4">
                    <h3 className="text-white font-semibold mb-3">Tables ({tables.length})</h3>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {tables.map(table => (
                        <motion.div
                          key={table.id}
                          onClick={() => setSelectedTable(table)}
                          className={`p-3 rounded-lg cursor-pointer transition-colors ${
                            selectedTable?.id === table.id
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                          }`}
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Table className="w-4 h-4" />
                              <span className="text-sm font-medium">{table.name}</span>
                            </div>
                            <span className="text-xs opacity-70">
                              {table.columns.length} cols
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-gray-700 pt-4">
                    <h3 className="text-white font-semibold mb-3">Relationships ({relationships.length})</h3>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {relationships.map(rel => {
                        const fromTable = tables.find(t => t.id === rel.fromTable);
                        const toTable = tables.find(t => t.id === rel.toTable);
                        return (
                          <motion.div
                            key={rel.id}
                            onClick={() => setSelectedRelationship(rel)}
                            className={`p-2 rounded-lg cursor-pointer transition-colors ${
                              selectedRelationship?.id === rel.id
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                            }`}
                            whileHover={{ scale: 1.02 }}
                          >
                            <div className="flex items-center space-x-2">
                              <Link className="w-3 h-3" />
                              <span className="text-xs">
                                {fromTable?.name} → {toTable?.name}
                              </span>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Canvas */}
              <div className="flex-1 relative overflow-hidden">
                <div
                  ref={canvasRef}
                  className="w-full h-full bg-gray-900 relative"
                  style={{
                    backgroundImage: `
                      radial-gradient(circle, #374151 1px, transparent 1px)
                    `,
                    backgroundSize: '20px 20px',
                    transform: `scale(${zoom}) translate(${canvasOffset.x}px, ${canvasOffset.y}px)`
                  }}
                >
                  {/* Tables */}
                  {tables.map(table => (
                    <TableDesigner
                      key={table.id}
                      table={table}
                      isSelected={selectedTable?.id === table.id}
                      onUpdate={updateTable}
                      onDelete={deleteTable}
                      onDrag={handleTableDrag}
                      onSelect={setSelectedTable}
                    />
                  ))}

                  {/* Relationships */}
                  {relationships.map(rel => (
                    <RelationshipDesigner
                      key={rel.id}
                      relationship={rel}
                      tables={tables}
                      isSelected={selectedRelationship?.id === rel.id}
                      onSelect={setSelectedRelationship}
                      onDelete={deleteRelationship}
                    />
                  ))}
                </div>

                {/* Canvas Controls */}
                <div className="absolute bottom-4 right-4 flex items-center space-x-2">
                  <button
                    onClick={() => setZoom(prev => Math.max(0.5, prev - 0.1))}
                    className="bg-gray-800 text-white p-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    -
                  </button>
                  <span className="bg-gray-800 text-white px-3 py-2 rounded-lg text-sm">
                    {Math.round(zoom * 100)}%
                  </span>
                  <button
                    onClick={() => setZoom(prev => Math.min(2, prev + 0.1))}
                    className="bg-gray-800 text-white p-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Properties Panel */}
              {(selectedTable || selectedRelationship) && (
                <div className="w-80 bg-gray-800 border-l border-gray-700 p-4 overflow-y-auto">
                  {selectedTable && (
                    <div>
                      <h3 className="text-white font-semibold mb-4 flex items-center space-x-2">
                        <Settings className="w-5 h-5" />
                        <span>Table Properties</span>
                      </h3>
                      {/* Table property editor would go here */}
                    </div>
                  )}
                  
                  {selectedRelationship && (
                    <div>
                      <h3 className="text-white font-semibold mb-4 flex items-center space-x-2">
                        <Link className="w-5 h-5" />
                        <span>Relationship Properties</span>
                      </h3>
                      {/* Relationship property editor would go here */}
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {activeTab === 'sql' && (
            <div className="flex-1">
              <SQLGenerator tables={tables} relationships={relationships} />
            </div>
          )}

          {activeTab === 'validation' && (
            <div className="flex-1">
              <SchemaValidation 
                validationResults={getValidationResults()}
                tables={tables}
                relationships={relationships}
                onSelectTable={setSelectedTable}
                onSelectRelationship={setSelectedRelationship}
              />
            </div>
          )}
        </div>
      </motion.div>

      {/* Tutorial Overlay */}
      <AnimatePresence>
        {showTutorial && (
          <TutorialOverlay onClose={() => setShowTutorial(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};