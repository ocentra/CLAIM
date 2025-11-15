export interface R2Config {
  workerUrl: string;
  bucketName: string;
}

export class R2Service {
  private config: R2Config;
  private readonly MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB per spec line 4314
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY_MS = 1000;

  constructor(config: R2Config) {
    this.config = config;
  }

  /**
   * Uploads a match record with retry logic and size validation.
   * Per critique Phase 6.2: Add error handling, retry logic, size validation.
   */
  async uploadMatchRecord(matchId: string, canonicalJSON: string): Promise<string> {
    // Per critique Phase 6.2: Size validation (10MB limit per spec)
    const sizeBytes = new TextEncoder().encode(canonicalJSON).length;
    if (sizeBytes > this.MAX_SIZE_BYTES) {
      throw new Error(
        `Match record exceeds size limit: ${sizeBytes} bytes (max ${this.MAX_SIZE_BYTES} bytes)`
      );
    }

    const url = `${this.config.workerUrl}/api/matches/${matchId}`;
    
    // Per critique Phase 6.2: Retry logic
    let lastError: Error | null = null;
    for (let attempt = 0; attempt < this.MAX_RETRIES; attempt++) {
      try {
        const response = await fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: canonicalJSON,
        });

        if (!response.ok) {
          // Check for rate limiting (429)
          const isRateLimit = response.status === 429;
          
          // Try to get error message from response
          let errorMsg = `${response.status} ${response.statusText}`;
          try {
            const errorText = await response.text();
            if (errorText && errorText !== '[object Blob]') {
              errorMsg = errorText;
            }
          } catch {
            // Ignore error reading response
          }
          
          // Include rate limit indicator in error message
          if (isRateLimit) {
            errorMsg = `Rate limit exceeded: ${errorMsg}`;
          }
          
          throw new Error(`Failed to upload match record: ${errorMsg}`);
        }

        // Handle response - Worker should return application/json
        // CRITICAL FIX: Always use .text() first, then parse JSON
        // This avoids the "[object Blob]" issue in Node.js/Vitest environments
        let result: { success?: boolean; matchId?: string; url?: string };
        
        try {
          // Get raw text first
          const text = await response.text();
          
          // Debug logging
          if (text === '[object Blob]' || text.includes('[object')) {
            throw new Error(
              `Worker returned invalid response: "${text}". ` +
              `Worker must return proper JSON with Content-Type: application/json. ` +
              `Check Worker implementation.`
            );
          }
          
          // Check if response is empty
          if (!text || text.trim().length === 0) {
            throw new Error(
              `Worker returned empty response. ` +
              `Expected JSON with {success, matchId, url}. ` +
              `Check Worker implementation.`
            );
          }
          
          // Parse JSON
          result = JSON.parse(text);
          
          // Validate response structure
          if (typeof result !== 'object' || result === null) {
            throw new Error(
              `Worker returned invalid JSON structure. ` +
              `Expected object with {success, matchId, url}, got: ${typeof result}`
            );
          }
          
        } catch (error) {
          const errMsg = error instanceof Error ? error.message : String(error);
          throw new Error(`Failed to parse Worker response: ${errMsg}`);
        }
        
        return result.url || url;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        // Check if it's a rate limit error (429)
        const isRateLimit = error instanceof Error && (
          error.message.includes('Rate limit') ||
          error.message.includes('429') ||
          error.message.includes('Too Many Requests')
        );
        
        // Don't retry on client errors (4xx) except rate limits
        if (error instanceof Error && error.message.includes('40') && !isRateLimit) {
          throw error;
        }

        if (attempt < this.MAX_RETRIES - 1) {
          // For rate limits, use longer exponential backoff
          const backoffDelay = isRateLimit 
            ? this.RETRY_DELAY_MS * Math.pow(2, attempt + 1) * 2 // Longer backoff for rate limits
            : this.RETRY_DELAY_MS * (attempt + 1);
          await new Promise(resolve => setTimeout(resolve, backoffDelay));
        }
      }
    }

    throw new Error(
      `Failed to upload match record after ${this.MAX_RETRIES} attempts: ${lastError?.message || 'Unknown error'}`
    );
  }

  /**
   * Gets a match record with retry logic.
   * Per critique Phase 6.2: Add error handling and retry logic.
   */
  async getMatchRecord(matchId: string): Promise<string | null> {
    const url = `${this.config.workerUrl}/api/matches/${matchId}`;
    
    let lastError: Error | null = null;
    for (let attempt = 0; attempt < this.MAX_RETRIES; attempt++) {
      try {
        const response = await fetch(url, {
          method: 'GET',
        });

        if (response.status === 404) {
          return null; // Match not found - return null instead of throwing
        }

        if (!response.ok) {
          throw new Error(`Failed to get match record: ${response.status} ${response.statusText}`);
        }

        return await response.text();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        // Don't retry on 404 or client errors
        if (error instanceof Error && (error.message.includes('404') || error.message.includes('40'))) {
          throw error;
        }

        if (attempt < this.MAX_RETRIES - 1) {
          await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY_MS * (attempt + 1)));
        }
      }
    }

    throw new Error(
      `Failed to get match record after ${this.MAX_RETRIES} attempts: ${lastError?.message || 'Unknown error'}`
    );
  }

  async generateSignedUrl(matchId: string, expiresIn: number = 3600): Promise<string> {
    const url = `${this.config.workerUrl}/api/signed-url/${matchId}?expires=${expiresIn}`;
    const response = await fetch(url, { method: 'GET' });
    
    if (!response.ok) {
      throw new Error(`Failed to generate signed URL: ${response.statusText}`);
    }
    
    const result = await response.json();
    return result.signedUrl;
  }

  async deleteMatchRecord(matchId: string): Promise<void> {
    const url = `${this.config.workerUrl}/api/matches/${matchId}`;
    
    const response = await fetch(url, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete match record: ${response.statusText}`);
    }
  }
}

