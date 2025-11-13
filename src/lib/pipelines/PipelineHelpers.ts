/// <reference lib="dom" />

const prefix = '[PipelineHelpers]';

// Logging flags
const LOG_GENERAL = false;

/**
 * PipelineHelpers - Utility functions for pipeline operations
 * Shared helper functions that can be used across different pipelines
 */
export class PipelineHelpers {
  /**
   * Validate message format
   * Ensures messages have required fields and valid roles
   * 
   * @param messages - Array of messages to validate
   * @returns True if valid, false otherwise
   */
  static validateMessages(messages: Array<{ role: string; content: string }>): boolean {
    if (!Array.isArray(messages)) {
      if (LOG_GENERAL) {
        console.error(prefix, '[validateMessages] Messages is not an array');
      }
      return false;
    }

    const validRoles = ['system', 'user', 'assistant'];

    for (const msg of messages) {
      if (!msg.role || !msg.content) {
        if (LOG_GENERAL) {
          console.error(prefix, '[validateMessages] Message missing role or content:', msg);
        }
        return false;
      }

      if (!validRoles.includes(msg.role)) {
        if (LOG_GENERAL) {
          console.error(prefix, '[validateMessages] Invalid role:', msg.role);
        }
        return false;
      }

      if (typeof msg.content !== 'string') {
        if (LOG_GENERAL) {
          console.error(prefix, '[validateMessages] Content is not a string:', msg);
        }
        return false;
      }
    }

    return true;
  }

  /**
   * Clean whitespace from messages
   * Trims excessive whitespace and normalizes line breaks
   * 
   * @param messages - Array of messages
   * @returns Messages with cleaned content
   */
  static cleanMessages(
    messages: Array<{ role: string; content: string }>
  ): Array<{ role: string; content: string }> {
    return messages.map((msg) => ({
      ...msg,
      content: msg.content
        .trim()
        .replace(/\n{3,}/g, '\n\n') // Max 2 consecutive newlines
        .replace(/[ \t]+/g, ' '), // Normalize spaces/tabs
    }));
  }

  /**
   * Add system message if not present
   * 
   * @param messages - Array of messages
   * @param systemPrompt - System prompt to add
   * @returns Messages with system prompt
   */
  static ensureSystemPrompt(
    messages: Array<{ role: string; content: string }>,
    systemPrompt: string
  ): Array<{ role: string; content: string }> {
    const hasSystemMessage = messages.some((msg) => msg.role === 'system');

    if (!hasSystemMessage && systemPrompt && systemPrompt.trim().length > 0) {
      return [{ role: 'system', content: systemPrompt }, ...messages];
    }

    return messages;
  }
}

