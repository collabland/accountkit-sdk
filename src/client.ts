import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, isAxiosError } from 'axios';
import {
  AnyType,
  ApiResponse,
  CalculateAccountAddressRequest,
  CalculateAccountAddressResponse,
  ClientConfig,
  Environment,
  ExecuteLitActionRequest,
  ExecuteLitActionResponse,
  GetSmartAccountAddressResponse,
  GetSolanaTransactionResponse,
  MintWowTokenRequest,
  MintWowTokenResponse,
  Platform,
  PlatformSubmitUserOperationsRequest,
  SolanaNetwork,
  SubmitEvmUserOpRequest,
  SubmitEvmUserOpResponse,
  SubmitSolanaTransactionRequest,
  SubmitSolanaTransactionResponse,
  UserOperationReceipt,
} from './types';
import { Logger } from './utils/logger';

/**
 * Base client with common functionality for all API versions
 */
export class BaseClient {
  protected apiKey: string;
  protected baseUrl: string;
  protected client: AxiosInstance;
  protected logger: Logger;
  protected config: ClientConfig;

  constructor(config: ClientConfig) {
    this.config = config;
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
      timeout: config.timeout || 60000,
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
        this.logger.trace('⏳ API Request:', {
          method: request.method,
          url: request.url,
          headers: this.redactSensitiveHeaders(request.headers),
          data: request.data,
        });
        return request;
      },
      error => {
        if (isAxiosError(error)) {
          this.logger.error('⚠️ Request Error: ', error.toJSON());
        } else {
          this.logger.error('⚠️ Request Error: ', error);
        }
        return Promise.reject(error);
      },
    );

    // Log responses
    this.client.interceptors.response.use(
      response => {
        this.logger.trace('🥳 API Response: ', {
          status: response.status,
          headers: response.headers,
          data: response.data,
        });
        return response;
      },
      error => {
        if (isAxiosError(error)) {
          this.logger.error('⚠️ Response Error: ', error.toJSON());
        } else {
          this.logger.error('⚠️ Response Error: ', error);
        }
        return Promise.reject(error);
      },
    );
  }

  /**
   * Redact sensitive headers for logging
   */
  private redactSensitiveHeaders(headers: Record<string, unknown>): Record<string, unknown> {
    // Combine values from environment and config headers for redaction comparison
    const sensitiveValues = [
      ...Object.values(process.env),
      ...Object.values(this.config.headers ?? {}),
    ];
    const redactedHeaders = { ...headers };

    for (const [key, value] of Object.entries(headers)) {
      if (sensitiveValues.includes(value as string)) {
        redactedHeaders[key] = '********';
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
  public async post<REQ, RES>(
    path: string,
    data: REQ,
    config?: AxiosRequestConfig<REQ>,
  ): Promise<ApiResponse<RES>> {
    const response = await this.client.post<RES, AxiosResponse<RES>, REQ>(path, data, config);
    return this.formatResponse(response);
  }

  /**
   * Make a PUT request
   */
  public async put<REQ, RES>(
    path: string,
    data: REQ,
    config?: AxiosRequestConfig<REQ>,
  ): Promise<ApiResponse<RES>> {
    const response = await this.client.put<RES, AxiosResponse<RES>, REQ>(path, data, config);
    return this.formatResponse(response);
  }

  /**
   * Make a DELETE request
   */
  public async delete<RES>(path: string, config?: AxiosRequestConfig): Promise<ApiResponse<RES>> {
    const response = await this.client.delete<RES, AxiosResponse<RES>>(path, config);
    return this.formatResponse(response);
  }

  /**
   * Format the Axios response into our standard API response
   */
  private formatResponse<RES>(response: AxiosResponse<RES>): ApiResponse<RES> {
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
   * (Telegram Bot Auth) Get accounts for a Telegram bot user
   * @param botToken Telegram bot token
   * @returns The smart account addresses of the Telegram bot user
   */
  public async telegramBotGetSmartAccounts(
    botToken: string,
  ): Promise<ApiResponse<GetSmartAccountAddressResponse>> {
    return this.get<GetSmartAccountAddressResponse>('/accountkit/v1/telegrambot/accounts', {
      headers: {
        'X-TG-BOT-TOKEN': botToken,
      },
    });
  }

  /**
   * (Telegram Bot Auth) Submit a Solana transaction
   * @param botToken Telegram bot token
   * @param serializedTransactionBase64 Base64 encoded serialized transaction
   * @param network Solana network ('SOL' or 'SOL_DEVNET')
   */
  public async telegramBotSubmitSolanaTransaction(
    botToken: string,
    serializedTransactionBase64: string,
    network: SolanaNetwork,
  ): Promise<ApiResponse<SubmitSolanaTransactionResponse>> {
    return this.post<SubmitSolanaTransactionRequest, SubmitSolanaTransactionResponse>(
      `/accountkit/v1/telegrambot/solana/submitTransaction`,
      { serializedTransactionBase64 },
      {
        headers: {
          'X-TG-BOT-TOKEN': botToken,
        },
        params: {
          network,
        },
      },
    );
  }

  /**
   * (Telegram Bot Auth) Get Solana transaction response
   * @param botToken Telegram bot token
   * @param signature Transaction signature
   * @param network Solana network ('SOL' or 'SOL_DEVNET')
   */
  public async telegramBotGetSolanaTransactionResponse(
    botToken: string,
    signature: string,
    network: SolanaNetwork,
  ): Promise<ApiResponse<GetSolanaTransactionResponse>> {
    return this.get<GetSolanaTransactionResponse>(
      `/accountkit/v1/telegrambot/solana/transactionResponse`,
      {
        headers: {
          'X-TG-BOT-TOKEN': botToken,
        },
        params: {
          network,
          txSignatureBase64: signature,
        },
      },
    );
  }

  /**
   * (Telegram Bot Auth) Submit an EVM user operation
   * @param botToken Telegram bot token
   * @param userOp User operation object
   * @param chainId EVM chain ID
   */
  public async telegramBotSubmitEvmUserOperation(
    botToken: string,
    userOp: SubmitEvmUserOpRequest,
    chainId: number,
  ): Promise<ApiResponse<SubmitEvmUserOpResponse>> {
    return this.post<SubmitEvmUserOpRequest, SubmitEvmUserOpResponse>(
      `/accountkit/v1/telegrambot/evm/submitUserOperation`,
      userOp,
      {
        headers: {
          'X-TG-BOT-TOKEN': botToken,
        },
        params: {
          chainId,
        },
      },
    );
  }

  /**
   * (Telegram Bot Auth) Get EVM user operation receipt
   * @param botToken Telegram bot token
   * @param userOpHash User operation hash
   * @param chainId EVM chain ID
   */
  public async telegramBotGetEvmUserOperationReceipt(
    botToken: string,
    userOpHash: string,
    chainId: number,
  ): Promise<ApiResponse<UserOperationReceipt>> {
    return this.get<UserOperationReceipt>(`/accountkit/v1/telegrambot/evm/userOperationReceipt`, {
      headers: {
        'X-TG-BOT-TOKEN': botToken,
      },
      params: {
        chainId,
        userOperationHash: userOpHash,
      },
    });
  }

  /**
   * (Telegram Bot Auth) Execute a Lit Action using PKP
   * @param botToken Telegram bot token
   * @param actionIpfs Lit Action IPFS hash
   * @param actionJsParams JavaScript parameters for the Lit Action
   * @param chainId EVM chain ID
   */
  public async executeLitAction(
    botToken: string,
    actionIpfs: string,
    actionJsParams: Record<string, AnyType>,
    chainId: number,
  ): Promise<ApiResponse<ExecuteLitActionResponse>> {
    return this.post<ExecuteLitActionRequest, ExecuteLitActionResponse>(
      '/accountkit/v1/telegrambot/executeActionUsingPKP',
      {
        actionIpfs,
        actionJsParams,
      },
      {
        headers: {
          'X-TG-BOT-TOKEN': botToken,
        },
        params: {
          chainId,
        },
      },
    );
  }

  /**
   * (Telegram Bot Auth) Mint a Wow.XYZ token
   * @param botToken Telegram bot token
   * @param tokenData Token data
   * @param chainId EVM chain ID
   */
  public async mintWowToken(
    botToken: string,
    tokenData: MintWowTokenRequest,
    chainId: number,
  ): Promise<ApiResponse<MintWowTokenResponse>> {
    return this.post<MintWowTokenRequest, MintWowTokenResponse>(
      '/accountkit/v1/telegrambot/wow/mint',
      tokenData,
      {
        headers: {
          'X-TG-BOT-TOKEN': botToken,
        },
        params: {
          chainId,
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
   * @param platform Platform (e.g., 'twitter', 'github', 'telegram')
   * @param accessToken Access token for the platform
   */
  public async getSmartAccountDetails(
    platform: Platform,
    accessToken: string,
  ): Promise<ApiResponse<GetSmartAccountAddressResponse>> {
    return this.get<GetSmartAccountAddressResponse>(`/accountkit/v2/platform/accounts`, {
      params: {
        platform,
      },
      headers: {
        'X-ACCESS-TOKEN': accessToken,
      },
    });
  }

  /**
   * Calculate a smart account address counterfactually
   * @param platform Platform ('twitter', 'github', etc.)
   * @param userId Platform-specific user ID
   */
  public async calculateAccountAddress(
    platform: Platform,
    userId: string,
  ): Promise<ApiResponse<CalculateAccountAddressResponse>> {
    return this.post<CalculateAccountAddressRequest, CalculateAccountAddressResponse>(
      '/accountkit/v2/evm/calculateAccountAddress',
      {
        platform,
        userId,
      },
    );
  }

  /**
   * Submit an EVM user operation using platform authentication
   * @param platform Platform ('twitter', 'github', 'telegram')
   * @param accessToken Access token for the platform
   * @param userOp User operation object
   * @param chainId EVM chain ID
   */
  public async submitEvmUserOperation(
    platform: Platform,
    accessToken: string,
    userOp: PlatformSubmitUserOperationsRequest,
    chainId: number,
  ): Promise<ApiResponse<SubmitEvmUserOpResponse>> {
    return this.post<PlatformSubmitUserOperationsRequest, SubmitEvmUserOpResponse>(
      `/accountkit/v2/platform/evm/submitUserOperation`,
      userOp,
      {
        headers: {
          'X-ACCESS-TOKEN': accessToken,
        },
        params: {
          chainId,
          platform,
        },
      },
    );
  }

  /**
   * Submit a Solana transaction using platform authentication
   * @param platform Platform ('twitter', 'github', 'telegram')
   * @param accessToken Access token for the platform
   * @param network Solana network ('SOL' or 'SOL_DEVNET')
   * @param serializedTransactionBase64 Base64 encoded serialized transaction
   */
  public async submitSolanaTransaction(
    platform: Platform,
    accessToken: string,
    network: SolanaNetwork,
    serializedTransactionBase64: string,
  ): Promise<ApiResponse<SubmitSolanaTransactionResponse>> {
    return this.post<SubmitSolanaTransactionRequest, SubmitSolanaTransactionResponse>(
      `/accountkit/v2/platform/solana/submitTransaction`,
      { serializedTransactionBase64 },
      {
        headers: {
          'X-ACCESS-TOKEN': accessToken,
        },
        params: {
          platform,
          network,
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
