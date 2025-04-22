import debug from 'debug';
import util from 'util';

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
    // Use util.inspect for safer logging of complex objects
    logger(message, data ? util.inspect(data, { depth: null, colors: true }) : '');
  }

  /**
   * Log debug level message
   * @param message Message to log
   * @param data Optional data to log
   */
  debug(message: string, data?: unknown): void {
    const logger = debug(`${this.namespace}:debug`);
    // Use util.inspect for safer logging of complex objects
    logger(message, data ? util.inspect(data, { depth: null, colors: true }) : '');
  }

  /**
   * Log info level message
   * @param message Message to log
   * @param data Optional data to log
   */
  info(message: string, data?: unknown): void {
    const logger = debug(`${this.namespace}:info`);
    // Use util.inspect for safer logging of complex objects
    logger(message, data ? util.inspect(data, { depth: null, colors: true }) : '');
  }

  /**
   * Log warn level message
   * @param message Message to log
   * @param data Optional data to log
   */
  warn(message: string, data?: unknown): void {
    const logger = debug(`${this.namespace}:warn`);
    // Use util.inspect for safer logging of complex objects
    logger(message, data ? util.inspect(data, { depth: null, colors: true }) : '');
  }

  /**
   * Log error level message
   * @param message Message to log
   * @param data Optional data to log
   */
  error(message: string, data?: unknown): void {
    const logger = debug(`${this.namespace}:error`);
    // Use util.inspect for safer logging of complex objects
    logger(message, data ? util.inspect(data, { depth: null, colors: true }) : '');
  }
}
