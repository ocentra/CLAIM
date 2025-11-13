// idbBase.ts
// Copied from TabAgent - Base CRUD class

// NOTE: All DB worker messages should use { action: ... } not { type: ... } for action property.

export abstract class BaseCRUD<T> {
  public id: string;
  public label: string;
  protected dbWorker?: Worker;

  constructor(id: string, label: string, dbWorker?: Worker) {
    this.id = id;
    this.label = label;
    this.dbWorker = dbWorker;
  }

  static async create(..._args: unknown[]): Promise<string> {
    void _args;
    throw new Error('Static create() not implemented');
  }

  static async read(_id: string, ..._args: unknown[]): Promise<unknown> {
    void _id;
    void _args;
    throw new Error('Static read() not implemented');
  }

  // UPDATE (static, optional)
  static async update(
    _id: string,
    _updates: Partial<Record<string, unknown>>,
    ..._args: unknown[]
  ): Promise<void> {
    void _id;
    void _updates;
    void _args;
    throw new Error('Static update() not implemented');
  }

  // DELETE (static, optional)
  static async delete(_id: string, ..._args: unknown[]): Promise<void> {
    void _id;
    void _args;
    throw new Error('Static delete() not implemented');
  }

  // --- Instance CRUD ---

  abstract update(updates: Partial<T>): Promise<void>;
  abstract delete(): Promise<void>;
  abstract saveToDB(): Promise<string>;

  abstract toJSON(): unknown;

  static fromJSON(_obj: unknown, _dbWorker: Worker): unknown {
    void _obj;
    void _dbWorker;
    throw new Error('fromJSON must be implemented by subclasses');
  }
}

// Generic Manifest interface for any asset type
export interface Manifest {
  id: string;
  fileName: string;
  fileType: string;
  status: string;
  addedAt?: number;
}

export const DB_ENTITY_TYPES = {
  Chat: 'Chat',
  Message: 'Message',
  Attachment: 'Attachment',
  Summary: 'Summary',
  LogEntry: 'LogEntry',
  KnowledgeGraphNode: 'KnowledgeGraphNode',
  KnowledgeGraphEdge: 'KnowledgeGraphEdge',
  Embedding: 'Embedding',
  // ...add more as needed
} as const;

export type DBEntityType = typeof DB_ENTITY_TYPES[keyof typeof DB_ENTITY_TYPES];
