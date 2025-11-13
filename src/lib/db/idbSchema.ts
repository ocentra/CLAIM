// idbSchema.ts
// Adapted from TabAgent for Claim AI model management

export const DBNames = Object.freeze({
  DB_MODELS: 'ClaimAIModels',
  // Note: Only AI-related DBs. Chat/message storage can be added later if needed for AI history
});

export enum NodeType {
  Chat = 'chat',
  Message = 'message',
  Embedding = 'embedding',
  Attachment = 'attachment',
  Summary = 'summary',
}

export enum LogLevel {
  Info = 'info',
  Log = 'log',
  Warn = 'warn',
  Error = 'error',
  Debug = 'debug',
}

export const schema = {
  [DBNames.DB_MODELS]: {
    version: 1,
    stores: {
      files: {
        keyPath: 'url',
        indexes: []
      },
      manifest: {
        keyPath: 'repo',
        indexes: []
      },
      inferenceSettings: {
        keyPath: 'id',
        indexes: []
      }
    }
  },
};

// Note: Removed BroadcastChannel as Claim uses EventBus instead
