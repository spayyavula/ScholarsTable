import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Table as TableIcon, 
  Plus, 
  Trash2, 
  Edit3, 
  Key, 
  Link,
  Type,
  Settings,
  Check,
  X
} from 'lucide-react';
import { Table, Column } from '../../types/schema';

interface TableDesignerProps {
  table: Table;
  isSelected: boolean;
  onUpdate: (table: Table) => void;
  onDelete: (tableId: string) => void;
  onDrag: (tableId: string, position: { x: number; y: number }) => void;
  onSelect: (table: Table) => void;
}

export const TableDesigner: React.FC<TableDesignerProps> = ({
  table,
  isSelected,
  onUpdate,
  onDelete,
  onDrag,
  onSelect
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(table.name);
  const [showColumnForm, setShowColumnForm] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === tableRef.current || (e.target as HTMLElement).closest('.table-header')) {
      const rect = tableRef.current!.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setIsDragging(true);
      onSelect(table);
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newPosition = {
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        };
        onDrag(table.id, newPosition);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, table.id, onDrag]);

  const handleNameSave = () => {
    onUpdate({ ...table, name: editedName });
    setIsEditingName(false);
  };

  const handleNameCancel = () => {
    setEditedName(table.name);
    setIsEditingName(false);
  };

  const addColumn = () => {
    const newColumn: Column = {
      id: `col_${Date.now()}`,
      name: `column_${table.columns.length + 1}`,
      type: 'TEXT',
      isRequired: false,
      isPrimaryKey: false,
      isForeignKey: false,
      description: ''
    };
    onUpdate({
      ...table,
      columns: [...table.columns, newColumn]
    });
  };

  const updateColumn = (columnId: string, updates: Partial<Column>) => {
    onUpdate({
      ...table,
      columns: table.columns.map(col =>
        col.id === columnId ? { ...col, ...updates } : col
      )
    });
  };

  const deleteColumn = (columnId: string) => {
    onUpdate({
      ...table,
      columns: table.columns.filter(col => col.id !== columnId)
    });
  };

  const getColumnIcon = (column: Column) => {
    if (column.isPrimaryKey) return <Key className="w-3 h-3 text-yellow-400" />;
    if (column.isForeignKey) return <Link className="w-3 h-3 text-blue-400" />;
    return <Type className="w-3 h-3 text-gray-400" />;
  };

  const getColumnTypeColor = (type: string) => {
    switch (type.toUpperCase()) {
      case 'UUID': return 'text-purple-400';
      case 'TEXT': case 'VARCHAR': return 'text-green-400';
      case 'INTEGER': case 'BIGINT': case 'SMALLINT': return 'text-blue-400';
      case 'BOOLEAN': return 'text-orange-400';
      case 'TIMESTAMPTZ': case 'TIMESTAMP': return 'text-pink-400';
      case 'JSONB': case 'JSON': return 'text-cyan-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <motion.div
      ref={tableRef}
      className={`absolute bg-white rounded-lg shadow-lg border-2 min-w-64 ${
        isSelected ? 'border-blue-500 shadow-blue-500/20' : 'border-gray-300'
      } ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      style={{
        left: table.position.x,
        top: table.position.y,
        borderLeftColor: table.color
      }}
      onMouseDown={handleMouseDown}
      onClick={() => onSelect(table)}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      {/* Table Header */}
      <div 
        className="table-header bg-gray-50 p-3 rounded-t-lg border-b border-gray-200 flex items-center justify-between"
        style={{ borderLeftColor: table.color, borderLeftWidth: '4px' }}
      >
        <div className="flex items-center space-x-2 flex-1">
          <TableIcon className="w-4 h-4 text-gray-600" />
          {isEditingName ? (
            <div className="flex items-center space-x-1 flex-1">
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="text-sm font-semibold bg-white border border-gray-300 rounded px-2 py-1 flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleNameSave();
                  if (e.key === 'Escape') handleNameCancel();
                }}
                autoFocus
              />
              <button
                onClick={handleNameSave}
                className="text-green-600 hover:text-green-700"
              >
                <Check className="w-3 h-3" />
              </button>
              <button
                onClick={handleNameCancel}
                className="text-red-600 hover:text-red-700"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <h3 
              className="text-sm font-semibold text-gray-800 flex-1 cursor-pointer hover:text-blue-600"
              onClick={(e) => {
                e.stopPropagation();
                setIsEditingName(true);
              }}
            >
              {table.name}
            </h3>
          )}
        </div>
        
        <div className="flex items-center space-x-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              addColumn();
            }}
            className="text-green-600 hover:text-green-700 p-1 rounded hover:bg-green-50"
            title="Add Column"
          >
            <Plus className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(table.id);
            }}
            className="text-red-600 hover:text-red-700 p-1 rounded hover:bg-red-50"
            title="Delete Table"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Columns */}
      <div className="p-2">
        {table.columns.map((column, index) => (
          <ColumnRow
            key={column.id}
            column={column}
            onUpdate={(updates) => updateColumn(column.id, updates)}
            onDelete={() => deleteColumn(column.id)}
            getColumnIcon={getColumnIcon}
            getColumnTypeColor={getColumnTypeColor}
          />
        ))}
        
        {table.columns.length === 0 && (
          <div className="text-center py-4 text-gray-500 text-sm">
            No columns yet. Click + to add one.
          </div>
        )}
      </div>

      {/* Table Footer */}
      <div className="px-3 py-2 bg-gray-50 rounded-b-lg border-t border-gray-200 text-xs text-gray-500">
        {table.columns.length} column{table.columns.length !== 1 ? 's' : ''}
      </div>
    </motion.div>
  );
};

interface ColumnRowProps {
  column: Column;
  onUpdate: (updates: Partial<Column>) => void;
  onDelete: () => void;
  getColumnIcon: (column: Column) => React.ReactNode;
  getColumnTypeColor: (type: string) => string;
}

const ColumnRow: React.FC<ColumnRowProps> = ({
  column,
  onUpdate,
  onDelete,
  getColumnIcon,
  getColumnTypeColor
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedColumn, setEditedColumn] = useState(column);

  const handleSave = () => {
    onUpdate(editedColumn);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedColumn(column);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded p-2 mb-1">
        <div className="space-y-2">
          <input
            type="text"
            value={editedColumn.name}
            onChange={(e) => setEditedColumn({ ...editedColumn, name: e.target.value })}
            className="w-full text-xs border border-gray-300 rounded px-2 py-1"
            placeholder="Column name"
          />
          
          <select
            value={editedColumn.type}
            onChange={(e) => setEditedColumn({ ...editedColumn, type: e.target.value })}
            className="w-full text-xs border border-gray-300 rounded px-2 py-1"
          >
            <option value="UUID">UUID</option>
            <option value="TEXT">TEXT</option>
            <option value="VARCHAR">VARCHAR</option>
            <option value="INTEGER">INTEGER</option>
            <option value="BIGINT">BIGINT</option>
            <option value="BOOLEAN">BOOLEAN</option>
            <option value="TIMESTAMPTZ">TIMESTAMPTZ</option>
            <option value="JSONB">JSONB</option>
          </select>

          <div className="flex items-center space-x-2 text-xs">
            <label className="flex items-center space-x-1">
              <input
                type="checkbox"
                checked={editedColumn.isRequired}
                onChange={(e) => setEditedColumn({ ...editedColumn, isRequired: e.target.checked })}
                className="w-3 h-3"
              />
              <span>Required</span>
            </label>
            
            <label className="flex items-center space-x-1">
              <input
                type="checkbox"
                checked={editedColumn.isPrimaryKey}
                onChange={(e) => setEditedColumn({ ...editedColumn, isPrimaryKey: e.target.checked })}
                className="w-3 h-3"
              />
              <span>Primary Key</span>
            </label>
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={handleSave}
              className="text-green-600 hover:text-green-700 p-1"
            >
              <Check className="w-3 h-3" />
            </button>
            <button
              onClick={handleCancel}
              className="text-red-600 hover:text-red-700 p-1"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="flex items-center justify-between p-2 hover:bg-gray-50 rounded group"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center space-x-2 flex-1">
        {getColumnIcon(column)}
        <div className="flex-1">
          <div className="text-xs font-medium text-gray-800">{column.name}</div>
          <div className={`text-xs ${getColumnTypeColor(column.type)}`}>
            {column.type}
            {column.isRequired && <span className="text-red-500 ml-1">*</span>}
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => setIsEditing(true)}
          className="text-blue-600 hover:text-blue-700 p-1"
          title="Edit Column"
        >
          <Edit3 className="w-3 h-3" />
        </button>
        <button
          onClick={onDelete}
          className="text-red-600 hover:text-red-700 p-1"
          title="Delete Column"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    </motion.div>
  );
};