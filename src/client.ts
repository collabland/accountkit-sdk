import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiResponse, ClientConfig, Environment } from './types';
import { Logger } from './utils/logger';

/**
 * Base client with common functionality for all API versions
 */
export class BaseClient {
  protected apiKey: string;
  protected baseUrl: string;
  protected client: AxiosInstance;
  protected logger: Logger;

  constructor(config: ClientConfig) {
    this.apiKey = config.apiKey;
    this.logger = new Logger('accountkit', config.debug || false);

    // Set base URL based on environment
    if (config.baseUrl) {
      this.baseUrl = config.baseUrl;
    } else {
      this.baseUrl =
        config.environment === Environment.PROD
          ? 'https://api.collab.land'
          : 'https://api-qa.collab.land';
    }

    // Initialize Axios client
    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: config.timeout || 10000,
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': config.apiKey,
        ...config.headers,
      },
    });

    // Add request/response interceptors for logging
    this.setupInterceptors();
  }

  /**
   * Set up Axios interceptors for logging
   */
  private setupInterceptors(): void {
    // Log requests
    this.client.interceptors.request.use(
      request => {
        this.logger.trace('API Request', {
          method: request.method,
          url: request.url,
          headers: this.redactSensitiveHeaders(request.headers),
          data: request.data,
        });
        return request;
      },
      error => {
        this.logger.error('Request Error', error);
        return Promise.reject(error);
      },
    );

    // Log responses
    this.client.interceptors.response.use(
      response => {
        this.logger.trace('API Response', {
          status: response.status,
          headers: response.headers,
          data: response.data,
        });
        return response;
      },
      error => {
        this.logger.error('Response Error', error.response || error);
        return Promise.reject(error);
      },
    );
  }

  /**
   * Redact sensitive headers for logging
   */
  private redactSensitiveHeaders(headers: Record<string, unknown>): Record<string, unknown> {
    const sensitiveHeaders = ['authorization', 'x-api-key'];
    const redactedHeaders = { ...headers };

    for (const header of sensitiveHeaders) {
      if (redactedHeaders[header]) {
        redactedHeaders[header] = '********';
      }
    }

    return redactedHeaders;
  }

  /**
   * Make a GET request
   */
  public async get<T>(path: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.get<T>(path, config);
    return this.formatResponse(response);
  }

  /**
   * Make a POST request
   */
  public async post<T>(
    path: string,
    data?: Record<string, unknown>,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    const response = await this.client.post<T>(path, data, config);
    return this.formatResponse(response);
  }

  /**
   * Make a PUT request
   */
  public async put<T>(
    path: string,
    data?: Record<string, unknown>,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    const response = await this.client.put<T>(path, data, config);
    return this.formatResponse(response);
  }

  /**
   * Make a DELETE request
   */
  public async delete<T>(path: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.delete<T>(path, config);
    return this.formatResponse(response);
  }

  /**
   * Format the Axios response into our standard API response
   */
  private formatResponse<T>(response: AxiosResponse<T>): ApiResponse<T> {
    return {
      data: response.data,
      status: response.status,
      headers: response.headers as Record<string, string>,
    };
  }
}

/**
 * Account Kit V1 API Client
 */
export class AccountKitV1Client extends BaseClient {
  constructor(config: ClientConfig) {
    super(config);
  }

  /**
   * Get status of a user operation
   * @param userOpHash User operation hash
   */
  public async getUserOperationStatus(
    userOpHash: string,
  ): Promise<ApiResponse<Record<string, unknown>>> {
    return this.get<Record<string, unknown>>(`/accountkit/v1/userOps/${userOpHash}/status`);
  }

  /**
   * Get accounts for a Telegram bot user
   * @param botToken Telegram bot token
   */
  public async getTelegramBotAccounts(
    botToken: string,
  ): Promise<ApiResponse<Record<string, unknown>>> {
    return this.get<Record<string, unknown>>('/accountkit/v1/telegrambot/accounts', {
      headers: {
        'X-TG-BOT-TOKEN': botToken,
      },
    });
  }

  /**
   * Submit a Solana transaction
   * @param botToken Telegram bot token
   * @param serializedTransactionBase64 Base64 encoded serialized transaction
   * @param network Solana network ('SOL' or 'SOL_DEVNET')
   */
  public async submitSolanaTransaction(
    botToken: string,
    serializedTransactionBase64: string,
    network: string,
  ): Promise<ApiResponse<Record<string, unknown>>> {
    return this.post<Record<string, unknown>>(
      `/accountkit/v1/telegrambot/solana/submitTransaction?network=${network}`,
      { serializedTransactionBase64 },
      {
        headers: {
          'X-TG-BOT-TOKEN': botToken,
        },
      },
    );
  }

  /**
   * Get Solana transaction response
   * @param botToken Telegram bot token
   * @param signature Transaction signature
   * @param network Solana network ('SOL' or 'SOL_DEVNET')
   */
  public async getSolanaTransactionResponse(
    botToken: string,
    signature: string,
    network: string,
  ): Promise<ApiResponse<Record<string, unknown>>> {
    return this.get<Record<string, unknown>>(
      `/accountkit/v1/telegrambot/solana/transactions/${signature}?network=${network}`,
      {
        headers: {
          'X-TG-BOT-TOKEN': botToken,
        },
      },
    );
  }

  /**
   * Submit an EVM user operation
   * @param botToken Telegram bot token
   * @param userOp User operation object
   * @param chainId EVM chain ID
   */
  public async submitEvmUserOperation(
    botToken: string,
    userOp: Record<string, unknown>,
    chainId: number,
  ): Promise<ApiResponse<Record<string, unknown>>> {
    return this.post<Record<string, unknown>>(
      `/accountkit/v1/telegrambot/evm/submitUserOperation?chainId=${chainId}`,
      userOp,
      {
        headers: {
          'X-TG-BOT-TOKEN': botToken,
        },
      },
    );
  }

  /**
   * Get EVM user operation receipt
   * @param botToken Telegram bot token
   * @param userOpHash User operation hash
   * @param chainId EVM chain ID
   */
  public async getUserOperationReceipt(
    botToken: string,
    userOpHash: string,
    chainId: number,
  ): Promise<ApiResponse<Record<string, unknown>>> {
    return this.get<Record<string, unknown>>(
      `/accountkit/v1/telegrambot/evm/userOperationReceipt?chainId=${chainId}&userOperationHash=${userOpHash}`,
      {
        headers: {
          'X-TG-BOT-TOKEN': botToken,
        },
      },
    );
  }

  /**
   * Execute a Lit Action using PKP
   * @param botToken Telegram bot token
   * @param litActionCode Lit Action JavaScript code
   * @param jsParams JavaScript parameters for the Lit Action
   * @param authSig Authentication signature for the Lit Action
   */
  public async executeLitAction(
    botToken: string,
    litActionCode: string,
    jsParams: Record<string, unknown>,
    authSig?: Record<string, unknown>,
  ): Promise<ApiResponse<Record<string, unknown>>> {
    return this.post<Record<string, unknown>>(
      '/accountkit/v1/telegrambot/lit/executeAction',
      {
        litActionCode,
        jsParams,
        authSig,
      },
      {
        headers: {
          'X-TG-BOT-TOKEN': botToken,
        },
      },
    );
  }

  /**
   * Mint a Wow.XYZ token
   * @param botToken Telegram bot token
   * @param recipient Recipient address
   */
  public async mintWowToken(
    botToken: string,
    recipient: string,
  ): Promise<ApiResponse<Record<string, unknown>>> {
    return this.post<Record<string, unknown>>(
      '/accountkit/v1/telegrambot/wow/mint',
      {
        recipient,
      },
      {
        headers: {
          'X-TG-BOT-TOKEN': botToken,
        },
      },
    );
  }
}

/**
 * Account Kit V2 API Client
 */
export class AccountKitV2Client extends BaseClient {
  constructor(config: ClientConfig) {
    super(config);
  }

  /**
   * Get smart account details
   * @param userId User ID
   * @param platform Platform (e.g., 'discord', 'telegram')
   */
  public async getSmartAccountDetails(
    userId: string,
    platform: string,
  ): Promise<ApiResponse<Record<string, unknown>>> {
    return this.get<Record<string, unknown>>(`/accountkit/v2/accounts/${platform}/${userId}`);
  }

  /**
   * Calculate a smart account address counterfactually
   * @param platform Platform ('twitter', 'github', etc.)
   * @param userId Platform-specific user ID
   */
  public async calculateAccountAddress(
    platform: string,
    userId: string,
  ): Promise<ApiResponse<Record<string, unknown>>> {
    return this.post<Record<string, unknown>>('/accountkit/v2/evm/calculateAccountAddress', {
      platform,
      userId,
    });
  }

  /**
   * Get accounts using platform authentication
   * @param platform Platform ('twitter', 'github', 'telegram')
   * @param platformAccessToken Access token for the platform
   */
  public async getAccounts(
    platform: string,
    platformAccessToken: string,
  ): Promise<ApiResponse<Record<string, unknown>>> {
    return this.get<Record<string, unknown>>('/accountkit/v2/accounts', {
      headers: {
        'X-PLATFORM': platform,
        'X-PLATFORM-ACCESS-TOKEN': platformAccessToken,
      },
    });
  }

  /**
   * Submit an EVM user operation using platform authentication
   * @param platform Platform ('twitter', 'github', 'telegram')
   * @param platformAccessToken Access token for the platform
   * @param userOp User operation object
   * @param chainId EVM chain ID
   */
  public async submitEvmUserOperation(
    platform: string,
    platformAccessToken: string,
    userOp: Record<string, unknown>,
    chainId: number,
  ): Promise<ApiResponse<Record<string, unknown>>> {
    return this.post<Record<string, unknown>>(
      `/accountkit/v2/evm/submitUserOperation?chainId=${chainId}`,
      userOp,
      {
        headers: {
          'X-PLATFORM': platform,
          'X-PLATFORM-ACCESS-TOKEN': platformAccessToken,
        },
      },
    );
  }

  /**
   * Submit a Solana transaction using platform authentication
   * @param platform Platform ('twitter', 'github', 'telegram')
   * @param platformAccessToken Access token for the platform
   * @param serializedTransactionBase64 Base64 encoded serialized transaction
   * @param network Solana network ('SOL' or 'SOL_DEVNET')
   */
  public async submitSolanaTransaction(
    platform: string,
    platformAccessToken: string,
    serializedTransactionBase64: string,
    network: string,
  ): Promise<ApiResponse<Record<string, unknown>>> {
    return this.post<Record<string, unknown>>(
      `/accountkit/v2/solana/submitTransaction?network=${network}`,
      { serializedTransactionBase64 },
      {
        headers: {
          'X-PLATFORM': platform,
          'X-PLATFORM-ACCESS-TOKEN': platformAccessToken,
        },
      },
    );
  }
}

/**
 * Main AccountKit SDK class with versioned client access
 */
export class AccountKit {
  public readonly v1: AccountKitV1Client;
  public readonly v2: AccountKitV2Client;

  constructor(
    apiKey: string,
    environment: Environment,
    options: Omit<ClientConfig, 'apiKey' | 'environment'> = {},
  ) {
    const config: ClientConfig = {
      apiKey,
      environment,
      ...options,
    };

    this.v1 = new AccountKitV1Client(config);
    this.v2 = new AccountKitV2Client(config);
  }
}
