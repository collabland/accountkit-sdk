// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyType = any;
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
 * Supported platforms for the SDK
 */
export enum Platform {
  /**
   * Telegram platform
   */
  TELEGRAM = 'telegram',
  /**
   * Twitter platform
   */
  TWITTER = 'twitter',
  /**
   * GitHub platform
   */
  GITHUB = 'github',
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

/**
 * EVM account structure
 */
export interface EVMAccount {
  /**
   * EVM account address
   */
  address: string;
  /**
   * EVM chain ID
   */
  chainId: number;
}

export interface SolanaAccount {
  /**
   * Solana account address
   */
  address: string;
  /**
   * Solana network
   */
  network: 'SOL' | 'SOL_DEVNET';
}

/**
 * Response structure for getting smart account addresses
 */
export interface GetSmartAccountAddressResponse {
  /**
   * PKP address
   */
  pkpAddress: string;
  /**
   * EVM accounts
   */
  evm: EVMAccount[];
  /**
   * Solana accounts
   */
  solana: SolanaAccount[];
}

/**
 * Request structure for submitting EVM user operations
 */
export interface SubmitEvmUserOpRequest {
  /**
   * Target address for the user operation
   */
  target: string;

  /**
   * Call data for the user operation
   */
  callData: string;

  /**
   * Value to be sent with the user operation
   */
  value: string;
}

/**
 * Response structure for submitting EVM user operations
 */
export interface SubmitEvmUserOpResponse {
  /**
   * Hash of the submitted user operation
   */
  userOperationHash: string;

  /**
   * Chain ID where the user operation was submitted
   */
  chainId: number;
}

export enum SolanaNetwork {
  SOLANA_MAINNET = 'SOL',
  SOLANA_DEVNET = 'SOL_DEVNET',
}

/**
 * Represents an EVM transaction receipt.
 */
export interface TransactionReceipt {
  /**
   * Hash of the transaction.
   */
  transactionHash?: string;
  /**
   * Integer of the transactions index position in the block.
   */
  transactionIndex?: number;
  /**
   * Hash of the block where this transaction was in.
   */
  blockHash?: string;
  /**
   * Block number where this transaction was in.
   */
  blockNumber?: number;
  /**
   * Address of the sender.
   */
  from?: string;
  /**
   * Address of the receiver. null when it's a contract creation transaction.
   */
  to?: string | null;
  /**
   * Total amount of gas used when this transaction was executed in the block.
   */
  cumulativeGasUsed?: number;
  /**
   * Either 1 (success) or 0 (failure). Only present on post-Byzantium blocks.
   */
  status?: string;
  /**
   * The amount of gas used by this specific transaction alone.
   */
  gasUsed?: number;
  /**
   * The contract address created, if the transaction was a contract creation, otherwise null.
   */
  contractAddress?: string | null;
  /**
   * Bloom filter for light clients to quickly retrieve related logs.
   */
  logsBloom?: string;
  /**
   * The actual value per gas deducted from the senders account. Before EIP-1559, this is equal to the gas price. After, it is equal to baseFeePerGas + min(maxFeePerGas - baseFeePerGas, maxPriorityFeePerGas).
   */
  effectiveGasPrice?: number;
}

/**
 * Represents a log emitted during a user operation.
 */
export interface UserOperationLog {
  /**
   * Contains one or more 32 Bytes non-indexed arguments of the log.
   */
  data?: string;
  /**
   * The block number where this log was in. null when its pending. null when its pending log.
   */
  blockNumber?: number;
  /**
   * Hash of the block where this log was in. null when its pending. null when its pending log.
   */
  blockHash?: string;
  /**
   * Hash of the transaction this log was created from. null when its pending log.
   */
  transactionHash?: string;
  /**
   * Integer of the log index position in the block. null when its pending log.
   */
  logIndex?: number;
  /**
   * Integer of the transactions index position log was created from. null when its pending log.
   */
  transactionIndex?: number;
  /**
   * Address from which this log originated.
   */
  address?: string;
  /**
   * Array of 0 to 4 32 Bytes DATA of indexed log arguments.
   */
  topics?: string[];
}

/**
 * Represents the receipt of a user operation, including transaction details and logs.
 */
export interface UserOperationReceipt {
  /**
   * The hash of the user operation.
   */
  userOpHash?: string;
  /**
   * The entry point address used for the user operation.
   */
  entryPoint?: string;
  /**
   * The sender address of the user operation.
   */
  sender?: string;
  /**
   * The nonce of the user operation.
   */
  nonce?: number;
  /**
   * The paymaster address (if used).
   */
  paymaster?: string;
  /**
   * The actual gas used by the user operation.
   */
  actualGasUsed?: number;
  /**
   * The actual gas cost of the user operation.
   */
  actualGasCost?: number;
  /**
   * Boolean indicating if the user operation was successful.
   */
  success?: boolean;
  /**
   * The underlying EVM transaction receipt.
   */
  receipt?: TransactionReceipt;
  /**
   * An array of logs emitted by this user operation.
   */
  logs?: UserOperationLog[];
}

/**
 * Request structure for submitting Solana transactions
 */
export interface SubmitSolanaTransactionRequest {
  /**
   * Base64 encoded serialized Solana transaction
   */
  serializedTransactionBase64: string;
}

/**
 * Response structure for submitting Solana transactions
 */
export interface SubmitSolanaTransactionResponse {
  /**
   * The signature of the submitted Solana transaction
   */
  txSignature: string;
}

/**
 * Response structure for getting Solana transaction details
 */
export interface GetSolanaTransactionResponse {
  /**
   * The detailed transaction data
   */
  response: Record<string, AnyType>;
}
/**
 * Request structure for executing Lit Actions using PKP
 */
export interface ExecuteLitActionRequest {
  /**
   * IPFS hash of the Lit Action
   */
  actionIpfs: string;
  /**
   * JavaScript parameters for the Lit Action
   */
  actionJsParams: Record<string, AnyType>;
}

/**
 * Response structure for Lit Action execution
 */
export interface ExecuteLitActionResponse {
  /**
   * The response data from the Lit Action execution
   */
  response: Record<string, AnyType>;
}

/**
 * Request structure for minting Wow.XYZ tokens
 */
export interface MintWowTokenRequest {
  /**
   * Name of the token
   */
  name: string;
  /**
   * Symbol of the token
   */
  symbol: string;
  /**
   * Metadata for the token
   */
  metadata: {
    /**
     * Description of the token
     */
    description: string;
    /**
     * Website link of the token
     */
    website_link: string;
    /**
     * Twitter handle of the token
     */
    twitter: string;
    /**
     * Discord link of the token
     */
    discord: string;
    /**
     * Telegram username of the bot handling the token
     */
    telegram: string;
    /**
     * NSFW flag of the token
     */
    nsfw: boolean;
    /**
     * Image of the token, should be uploaded to IPFS
     */
    image: string;
  };
  /**
   * Recipient address
   */
  recipient: string;
}

/**
 * Response structure for minting Wow.XYZ tokens
 */
export interface MintWowTokenResponse {
  /**
   * The response data from minting the token
   */
  response: Record<string, AnyType>;
}

/**
 * Request structure for calculating account address
 */
export interface CalculateAccountAddressRequest {
  /**
   * Platform ('twitter', 'github', 'telegram')
   */
  platform: Platform;
  /**
   * User ID for the platform
   */
  userId: string;
}

export type CalculateAccountAddressResponse = Omit<GetSmartAccountAddressResponse, 'solana'>;

/**
 * Request structure for submitting EVM user operations using platform authentication
 */
export interface PlatformSubmitUserOperationsRequest {
  /**
   * User operations to submit
   */
  userOps: SubmitEvmUserOpRequest[];
}
