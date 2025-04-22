# <img src="https://assets.collab.land/collabland-logo.png" alt="Collab.Land Logo" height="40"> Collab.Land AccountKit APIs

A comprehensive JavaScript/TypeScript SDK for interacting with the Collab.Land AccountKit APIs, providing seamless access to wallet and account management features across multiple blockchains.

## 📋 Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [API Reference](#api-reference)
  - [V1 API](#v1-api)
  - [V2 API](#v2-api)
- [Authentication](#authentication)
- [Error Handling](#error-handling)
- [Debugging](#debugging)
- [Environment Configuration](#environment-configuration)
- [Examples](#examples)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## 🔧 Installation

Install the SDK using npm:

```bash
npm install @collabland/accountkit-sdk
```

Or with Yarn:

```bash
yarn add @collabland/accountkit-sdk
```

## 🚀 Quick Start

Initialize the SDK with your API key:

```typescript
import { AccountKit, Environment } from '@collabland/accountkit-sdk';

// Initialize with API key and environment
const accountKit = new AccountKit('your-api-key', Environment.PROD);

// Make API calls
async function getAccounts() {
  try {
    const accounts = await accountKit.v1.getTelegramBotAccounts('your-telegram-bot-token');
    console.log('Accounts:', accounts.data);
  } catch (error) {
    console.error('Error fetching accounts:', error);
  }
}
```

## 🧪 Testing

This SDK includes a comprehensive test suite. To run the tests:

```bash
# Install dependencies
yarn install

# Run tests
yarn test
```

### Environment Variables for Testing

You can use a `.env` file to configure testing:

```
# .env file
ACCOUNTKIT_API_KEY=your_api_key_here
ACCOUNTKIT_ENVIRONMENT=QA  # or PROD
DEBUG=accountkit:*  # Enable debug logs
```

A `.env.example` file is provided with the required variables.

## 📚 API Reference

### V1 API

Access V1 API methods through the `v1` property of the AccountKit instance. All V1 methods require a Telegram Bot Token for authentication passed via request headers, which the SDK handles automatically if configured.

#### User Operations

```typescript
// Get user operation receipt (for Telegram bot)
// Note: Status is inferred from the receipt details.
const receipt = await accountKit.v1.telegramBotGetUserOperationReceipt(
  '0xUserOperationHash',
  84532, // Chain ID (e.g., Base Sepolia)
);
// Returns detailed receipt: UserOperationReceipt
// { userOpHash, entryPoint, sender, nonce, paymaster, actualGasUsed, actualGasCost, success, receipt, logs }
```

#### Telegram Bot Integration

```typescript
// Get smart accounts for a Telegram bot user
const accounts = await accountKit.v1.telegramBotGetSmartAccounts();
// Returns GetSmartAccountAddressResponse:
// {
//   pkpAddress: string,
//   evm: { chainId: number, address: string }[],
//   solana: { network: 'SOL' | 'SOL_DEVNET', address: string }[]
// }

// Submit a Solana transaction via Telegram Bot Auth
const txResponse = await accountKit.v1.telegramBotSubmitSolanaTransaction(
  'base64-encoded-transaction', // serializedTransactionBase64
  SolanaNetwork.SOLANA_MAINNET, // or SolanaNetwork.SOLANA_DEVNET
);
// Returns SubmitSolanaTransactionResponse: { txSignature: string }

// Get Solana transaction response via Telegram Bot Auth
const txDetails = await accountKit.v1.telegramBotGetSolanaTransactionResponse(
  'transaction-signature', // txSignature
  SolanaNetwork.SOLANA_MAINNET,
);
// Returns GetSolanaTransactionResponse: { response: Record<string, any> }

// Submit an EVM user operation via Telegram Bot Auth
const evmOpResponse = await accountKit.v1.telegramBotSubmitEvmUserOperation(
  {
    // User operation object: SubmitEvmUserOpRequest
    target: '0xContractAddress',
    callData: '0xFunctionSelectorAndArgs',
    value: '0x0',
  },
  84532, // Chain ID
);
// Returns SubmitEvmUserOpResponse: { userOperationHash: string, chainId: number }
```

#### Lit Protocol Integration

```typescript
// Execute a Lit Action using PKP via Telegram Bot Auth
const litActionResponse = await accountKit.v1.telegramBotExecuteLitAction(
  {
    // ExecuteLitActionRequest
    actionIpfs: 'QmActionCid', // IPFS CID of the Lit Action
    actionJsParams: {
      /* JS parameters for the action */
    },
  },
  // Optional authSig can be passed as a second argument
);
// Returns ExecuteLitActionResponse: { response: Record<string, any> }
```

#### Wow Token Integration

```typescript
// Mint a Wow.XYZ token via Telegram Bot Auth
const mintResponse = await accountKit.v1.telegramBotMintWowToken({
  // MintWowTokenRequest
  recipient: '0xRecipientAddress',
  name: 'MyToken',
  symbol: 'MTK',
  metadata: {
    description: 'Token description',
    website_link: 'https://example.com',
    twitter: 'mytwitter',
    discord: 'https://discord.gg/invite',
    telegram: 'mytelegrambot',
    nsfw: false,
    image: 'ipfs://QmImageCid',
  },
});
// Returns MintWowTokenResponse: { response: Record<string, any> }
```

### V2 API

Access V2 API methods through the `v2` property of the AccountKit instance. V2 methods primarily use platform access tokens (e.g., Twitter, GitHub) for authentication.

#### Account Management

```typescript
// Get smart account details using platform authentication
const accountDetails = await accountKit.v2.getSmartAccountDetails(
  Platform.TWITTER, // or Platform.GITHUB, Platform.TELEGRAM
  'platform-access-token',
);
// Returns GetSmartAccountAddressResponse (same structure as V1)

// Calculate account address counterfactually
const accountAddress = await accountKit.v2.calculateAccountAddress(
  Platform.TWITTER, // Platform enum ('twitter', 'github', etc.)
  'platform-user-id',
);
// Returns CalculateAccountAddressResponse (structure might vary, check types.ts)
// Example structure shown previously is from V1 - V2 might differ.
// Generally contains pkpAddress and associated EVM/Solana addresses.
```

#### User Operations (Platform Auth)

```typescript
// Submit an EVM user operation using platform authentication
const evmOpResponse = await accountKit.v2.submitEvmUserOperation(
  Platform.TWITTER,
  'platform-access-token',
  {
    // PlatformSubmitUserOperationsRequest
    userOps: [
      {
        // SubmitEvmUserOpRequest
        target: '0xContractAddress',
        callData: '0xFunctionSelectorAndArgs',
        value: '0x0',
      },
      // Can include multiple user operations
    ],
  },
  84532, // Chain ID
);
// Returns SubmitEvmUserOpResponse: { userOperationHash: string, chainId: number }

// Submit a Solana transaction using platform authentication
const solanaTxResponse = await accountKit.v2.submitSolanaTransaction(
  Platform.GITHUB,
  'platform-access-token',
  SolanaNetwork.SOLANA_DEVNET,
  'base64-encoded-transaction', // serializedTransactionBase64
);
// Returns SubmitSolanaTransactionResponse: { txSignature: string }
```

## 🔐 Authentication

### API Key Authentication

An API key is required to initialize the SDK:

```typescript
const accountKit = new AccountKit('your-api-key', Environment.PROD);
```

### Platform Authentication

For V2 API methods that require platform authentication, you need to provide:

1. Platform identifier:

   - `twitter`: Twitter OAuth2 token
   - `github`: GitHub OAuth token
   - `telegram`: Telegram bot token

2. Platform access token - obtained through the respective platform's OAuth flow

```typescript
await accountKit.v2.getAccounts('twitter', 'platform-access-token');
```

### Telegram Bot Authentication

For V1 API methods that integrate with Telegram bots, provide the bot token in the `X-TG-BOT-TOKEN` header:

```typescript
await accountKit.v1.getTelegramBotAccounts('your-telegram-bot-token');
```

## ⚠️ Error Handling

The SDK throws errors for network issues, API errors, and invalid responses. It's recommended to use try/catch blocks:

```typescript
try {
  const response = await accountKit.v1.getUserOperationStatus('0xUserOpHash');
  console.log('Success:', response.data);
} catch (error) {
  if (error.response) {
    // The request was made and the server responded with an error status
    console.error('API Error:', error.response.status, error.response.data);
  } else if (error.request) {
    // The request was made but no response was received
    console.error('Network Error:', error.request);
  } else {
    // Something happened in setting up the request
    console.error('Request Error:', error.message);
  }
}
```

## 🐞 Debugging

Set the `DEBUG` environment variable to enable debug logs:

```bash
# Enable all AccountKit SDK debug logs
DEBUG=accountkit:* node your-script.js

# Enable only specific modules
DEBUG=accountkit:client node your-script.js
```

You can also enable debugging when initializing the SDK:

```typescript
const accountKit = new AccountKit(apiKey, Environment.PROD, {
  debug: true, // Enables debug logs
});
```

## 📝 Examples

The SDK includes several examples to help you get started:

### Calculate Account Address

The `/src/examples/v2/calculate-account-address` directory contains a complete example showing how to calculate account addresses for users on Twitter and GitHub.

To run this example:

```bash
# Copy and edit the environment file with your API key
cp src/examples/v2/calculate-account-address/.env.example src/examples/v2/calculate-account-address/.env

# Run the example
node src/examples/v2/calculate-account-address/index.js
```

## 🧪 Testing

Run the test suite using:

```bash
yarn test
```

Generate test coverage report:

```bash
yarn test:coverage
```

## 📖 License

This project is licensed under the MIT License - see the LICENSE file for details.
