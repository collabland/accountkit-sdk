import debug from 'debug';

/**
 * Logger utility for AccountKit SDK
 */
export class Logger {
  private namespace: string;
  private enabled: boolean;

  constructor(namespace = 'accountkit', enabled = false) {
    this.namespace = namespace;
    this.enabled = enabled;

    if (enabled) {
      debug.enable(`${namespace}:*`);
    }
  }

  /**
   * Creates a scoped logger
   * @param scope Scope to add to the namespace
   * @returns Scoped logger instance
   */
  scope(scope: string): Logger {
    return new Logger(`${this.namespace}:${scope}`, this.enabled);
  }

  /**
   * Log trace level message
   * @param message Message to log
   * @param data Optional data to log
   */
  trace(message: string, data?: unknown): void {
    const logger = debug(`${this.namespace}:trace`);
    logger(message, data ? JSON.stringify(data, this.safeStringify) : '');
  }

  /**
   * Log debug level message
   * @param message Message to log
   * @param data Optional data to log
   */
  debug(message: string, data?: unknown): void {
    const logger = debug(`${this.namespace}:debug`);
    logger(message, data ? JSON.stringify(data, this.safeStringify) : '');
  }

  /**
   * Log info level message
   * @param message Message to log
   * @param data Optional data to log
   */
  info(message: string, data?: unknown): void {
    const logger = debug(`${this.namespace}:info`);
    logger(message, data ? JSON.stringify(data, this.safeStringify) : '');
  }

  /**
   * Log warn level message
   * @param message Message to log
   * @param data Optional data to log
   */
  warn(message: string, data?: unknown): void {
    const logger = debug(`${this.namespace}:warn`);
    logger(message, data ? JSON.stringify(data, this.safeStringify) : '');
  }

  /**
   * Log error level message
   * @param message Message to log
   * @param data Optional data to log
   */
  error(message: string, data?: unknown): void {
    const logger = debug(`${this.namespace}:error`);
    logger(message, data ? JSON.stringify(data, this.safeStringify) : '');
  }

  /**
   * Safe JSON stringify that handles circular references
   */
  private safeStringify(key: string, value: unknown): unknown {
    const cache: unknown[] = [];
    if (typeof value === 'object' && value !== null) {
      if (cache.includes(value)) {
        return '[Circular]';
      }
      cache.push(value);
    }
    return value;
  }
}
