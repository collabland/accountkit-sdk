/**
 * Environment options for the SDK
 */
export enum Environment {
  /**
   * Production environment - uses https://api.collab.land
   */
  PROD = 'PROD',
  /**
   * QA environment - uses https://api-qa.collab.land
   */
  QA = 'QA',
}

/**
 * Client configuration
 */
export interface ClientConfig {
  /**
   * API key for authentication
   */
  apiKey: string;

  /**
   * Target environment
   */
  environment: Environment;

  /**
   * Optional base URL override
   */
  baseUrl?: string;

  /**
   * Request timeout in milliseconds
   */
  timeout?: number;

  /**
   * Enable debug mode
   */
  debug?: boolean;

  /**
   * Additional headers
   */
  headers?: Record<string, string>;
}

/**
 * API response structure
 */
export interface ApiResponse<T> {
  /**
   * Response data
   */
  data: T;

  /**
   * HTTP status code
   */
  status: number;

  /**
   * Response headers
   */
  headers: Record<string, string>;
}
