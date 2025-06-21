export interface Table {
  id: string;
  name: string;
  columns: Column[];
  position: { x: number; y: number };
  description?: string;
  color: string;
}

export interface Column {
  id: string;
  name: string;
  type: string;
  isPrimaryKey: boolean;
  isForeignKey: boolean;
  isRequired: boolean;
  isUnique?: boolean;
  defaultValue?: string;
  description?: string;
  referencedTable?: string;
  referencedColumn?: string;
}

export interface Relationship {
  id: string;
  type: 'one-to-one' | 'one-to-many' | 'many-to-many';
  fromTable: string;
  toTable: string;
  fromColumn: string;
  toColumn: string;
  onDelete?: 'CASCADE' | 'SET NULL' | 'RESTRICT';
  onUpdate?: 'CASCADE' | 'SET NULL' | 'RESTRICT';
}

export interface ValidationResult {
  type: 'error' | 'warning' | 'suggestion';
  message: string;
  suggestion?: string;
  tableId?: string;
  columnId?: string;
  relationshipId?: string;
}

export interface SchemaExport {
  tables: Table[];
  relationships: Relationship[];
  metadata: {
    version: string;
    createdAt: string;
    description?: string;
  };
}