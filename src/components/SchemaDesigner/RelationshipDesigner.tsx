import React from 'react';
import { motion } from 'framer-motion';
import { Link, Trash2 } from 'lucide-react';
import { Relationship, Table } from '../../types/schema';

interface RelationshipDesignerProps {
  relationship: Relationship;
  tables: Table[];
  isSelected: boolean;
  onSelect: (relationship: Relationship) => void;
  onDelete: (relationshipId: string) => void;
}

export const RelationshipDesigner: React.FC<RelationshipDesignerProps> = ({
  relationship,
  tables,
  isSelected,
  onSelect,
  onDelete
}) => {
  const fromTable = tables.find(t => t.id === relationship.fromTable);
  const toTable = tables.find(t => t.id === relationship.toTable);

  if (!fromTable || !toTable) return null;

  // Calculate connection points
  const fromPoint = {
    x: fromTable.position.x + 128, // Half of table width
    y: fromTable.position.y + 40   // Approximate header height
  };

  const toPoint = {
    x: toTable.position.x + 128,
    y: toTable.position.y + 40
  };

  // Calculate control points for curved line
  const midX = (fromPoint.x + toPoint.x) / 2;
  const midY = (fromPoint.y + toPoint.y) / 2;
  
  const pathData = `M ${fromPoint.x} ${fromPoint.y} Q ${midX} ${midY - 50} ${toPoint.x} ${toPoint.y}`;

  const getRelationshipColor = (type: string) => {
    switch (type) {
      case 'one-to-one': return '#10B981';
      case 'one-to-many': return '#3B82F6';
      case 'many-to-many': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  const getRelationshipSymbol = (type: string) => {
    switch (type) {
      case 'one-to-one': return '1:1';
      case 'one-to-many': return '1:N';
      case 'many-to-many': return 'N:M';
      default: return '?';
    }
  };

  return (
    <g>
      {/* Connection Line */}
      <motion.path
        d={pathData}
        stroke={getRelationshipColor(relationship.type)}
        strokeWidth={isSelected ? 3 : 2}
        fill="none"
        strokeDasharray={relationship.type === 'many-to-many' ? '5,5' : 'none'}
        className="cursor-pointer"
        onClick={() => onSelect(relationship)}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5 }}
      />

      {/* Relationship Label */}
      <motion.g
        transform={`translate(${midX}, ${midY - 25})`}
        className="cursor-pointer"
        onClick={() => onSelect(relationship)}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        <rect
          x="-20"
          y="-10"
          width="40"
          height="20"
          fill={getRelationshipColor(relationship.type)}
          rx="10"
          className={isSelected ? 'stroke-2 stroke-white' : ''}
        />
        <text
          x="0"
          y="4"
          textAnchor="middle"
          className="text-xs font-semibold fill-white"
        >
          {getRelationshipSymbol(relationship.type)}
        </text>
      </motion.g>

      {/* Delete Button (when selected) */}
      {isSelected && (
        <motion.g
          transform={`translate(${midX + 25}, ${midY - 25})`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <circle
            cx="0"
            cy="0"
            r="12"
            fill="#EF4444"
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(relationship.id);
            }}
          />
          <Trash2 
            x="-6" 
            y="-6" 
            width="12" 
            height="12" 
            className="fill-white pointer-events-none"
          />
        </motion.g>
      )}

      {/* Connection Points */}
      <circle
        cx={fromPoint.x}
        cy={fromPoint.y}
        r="4"
        fill={getRelationshipColor(relationship.type)}
        className="cursor-pointer"
        onClick={() => onSelect(relationship)}
      />
      <circle
        cx={toPoint.x}
        cy={toPoint.y}
        r="4"
        fill={getRelationshipColor(relationship.type)}
        className="cursor-pointer"
        onClick={() => onSelect(relationship)}
      />
    </g>
  );
};