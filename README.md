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

Access V1 API methods through the `v1` property of the AccountKit instance.

#### User Operations

```typescript
// Get user operation status
const status = await accountKit.v1.getUserOperationStatus('0xUserOperationHash');
// Returns status, receipt, logs and transaction details

// Get user operation receipt (for Telegram bot)
const receipt = await accountKit.v1.getUserOperationReceipt(
  'your-tg-bot-token',
  '0xUserOperationHash',
  84532, // Chain ID (Base Sepolia)
);
// Returns detailed receipt with userOpHash, entryPoint, sender, logs and transaction details
```

#### Telegram Bot Integration

```typescript
// Get accounts for a Telegram bot
const accounts = await accountKit.v1.getTelegramBotAccounts('your-tg-bot-token');
// Returns:
// {
//   pkpAddress: "0xd3B7C2a20Ed45B33Ac1B6D3ACbA9Bcee258bDAb9",
//   evm: [
//     { chainId: 84532, address: "0xd0D7De4D88843F6f66D0f7053f4b79c6AeAF8F9F" },
//     { chainId: 59141, address: "0xd0D7De4D88843F6f66D0f7053f4b79c6AeAF8F9F" },
//     // More chains...
//   ],
//   solana: [
//     { network: "SOL", address: "AcFn89zzBXQFN3Kx62MXXGSEpivwzBBVhSek2RiT56Ao" },
//     { network: "SOL_DEVNET", address: "AcFn89zzBXQFN3Kx62MXXGSEpivwzBBVhSek2RiT56Ao" }
//   ]
// }

// Submit a Solana transaction
const txResponse = await accountKit.v1.submitSolanaTransaction(
  'your-tg-bot-token',
  'base64-encoded-transaction',
  'SOL', // or 'SOL_DEVNET'
);
// Returns transaction signature

// Get Solana transaction response
const txDetails = await accountKit.v1.getSolanaTransactionResponse(
  'your-tg-bot-token',
  'transaction-signature',
  'SOL',
);
// Returns detailed transaction data including token balances and logs

// Submit an EVM user operation
const evmOpResponse = await accountKit.v1.submitEvmUserOperation(
  'your-tg-bot-token',
  {
    // User operation object
    sender: '0x...',
    nonce: '0x...',
    initCode: '0x...',
    callData: '0x...',
    // ...other fields
  },
  84532, // Chain ID (Base Sepolia)
);
// Returns user operation hash
```

#### Lit Protocol Integration

```typescript
// Execute a Lit Action using PKP
const litActionResponse = await accountKit.v1.executeLitAction(
  'your-tg-bot-token',
  'const response = await Lit.Actions.signEcdsa({ toSign, publicKey, sigName });', // Lit action code
  {
    // JS parameters
    toSign: new Uint8Array([...]),
    publicKey: '0x...',
    sigName: 'sig1'
  },
  {
    // Optional auth sig
    sig: '0x...',
    derivedVia: 'web3.eth.personal.sign',
    signedMessage: '...',
    address: '0x...'
  }
);
// Returns execution results from the Lit Action
```

#### Wow Token Integration

```typescript
// Mint a Wow.XYZ token
const mintResponse = await accountKit.v1.mintWowToken('your-tg-bot-token', '0xRecipientAddress');
// Returns transaction hash and details
```

### V2 API

Access V2 API methods through the `v2` property of the AccountKit instance.

#### Account Management

```typescript
// Calculate account address counterfactually
const accountAddress = await accountKit.v2.calculateAccountAddress('twitter', '1234567890');
// Returns:
// {
//   pkpAddress: "0xBeCb7fEFd3Ec5bF831d09bE9a9C2650748AC5FC6",
//   evm: [
//     { chainId: 84532, address: "0x99518fBaa6adFb877A48BA1fe64a46F9a19F1b65" },
//     { chainId: 59141, address: "0x99518fBaa6adFb877A48BA1fe64a46F9a19F1b65" },
//     // More chains...
//   ],
//   solana: []
// }

// Get smart account details
const accountDetails = await accountKit.v2.getSmartAccountDetails('user-id', 'discord');

// Get accounts using platform authentication
const platformAccounts = await accountKit.v2.getAccounts(
  'twitter', // Supports 'twitter', 'github', 'telegram'
  'platform-access-token',
);
// Returns similar account structure as above
```

#### Transaction Submission

```typescript
// Submit an EVM user operation with platform auth
const evmOpResponse = await accountKit.v2.submitEvmUserOperation(
  'twitter', // Supports 'twitter', 'github', 'telegram'
  'platform-access-token',
  {
    // User operation object
    sender: '0x...',
    nonce: '0x...',
    initCode: '0x...',
    callData: '0x...',
    // ...other fields
  },
  1, // Chain ID (Ethereum Mainnet)
);
// Returns user operation hash

// Submit a Solana transaction with platform auth
const solTxResponse = await accountKit.v2.submitSolanaTransaction(
  'github', // Supports 'twitter', 'github', 'telegram'
  'platform-access-token',
  'base64-encoded-transaction',
  'SOL', // or 'SOL_DEVNET'
);
// Returns transaction signature
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

Enable debug mode to see detailed logs of API requests and responses:

```typescript
const accountKit = new AccountKit('your-api-key', Environment.PROD, {
  debug: true,
});
```

Debug output includes:

- Request URL, method, headers (with sensitive data redacted), and body
- Response status code, headers, and body
- Any errors that occur during the request

## 🌐 Environment Configuration

Use the `Environment` enum to specify the target environment:

```typescript
// Production environment
const prodClient = new AccountKit('your-api-key', Environment.PROD);

// QA environment
const qaClient = new AccountKit('your-api-key', Environment.QA);
```

### Postman Variables

When using the Postman collection, set these variables in your environment:

- `CL_API_KEY`: Your Collab.Land API Key
- `TG_BOT_TOKEN`: Your Telegram Bot Token
- `PLATFORM`: The platform (e.g., "twitter", "github", "telegram")
- `PLATFORM_ACCESS_TOKEN`: OAuth2 access token or Telegram bot token
- `SOL_NETWORK`: Solana network ("SOL" or "SOL_DEVNET")

### Additional Configuration Options

```typescript
const accountKit = new AccountKit('your-api-key', Environment.PROD, {
  // Custom timeout in milliseconds (default: 10000)
  timeout: 15000,

  // Enable debug mode
  debug: true,

  // Custom base URL (override the environment-based URL)
  baseUrl: 'https://custom-api.example.com',

  // Additional headers to include in all requests
  headers: {
    'X-Custom-Header': 'custom-value',
  },
});
```

## 📝 Examples

### Creating and Managing Web3 Accounts

```typescript
// Calculate a new account address
const accountAddress = await accountKit.v2.calculateAccountAddress('twitter', twitterUserId);

// Get account details
const accountDetails = await accountKit.v2.getSmartAccountDetails(userId, 'discord');

// Get all accounts associated with a platform user
const accounts = await accountKit.v2.getAccounts('twitter', twitterAccessToken);
```

### Submitting Transactions

```typescript
// Submit an EVM transaction
const evmTxResponse = await accountKit.v2.submitEvmUserOperation(
  'twitter',
  twitterAccessToken,
  userOpPayload,
  1, // Ethereum Mainnet
);

// Submit a Solana transaction
const solTxResponse = await accountKit.v2.submitSolanaTransaction(
  'twitter',
  twitterAccessToken,
  serializedTxBase64,
  'SOL',
);
```

### Telegram Bot Integration

```typescript
// Get accounts for a Telegram bot user
const accounts = await accountKit.v1.getTelegramBotAccounts(telegramBotToken);

// Execute a Lit Action
const litResponse = await accountKit.v1.executeLitAction(telegramBotToken, litActionCode, jsParams);

// Mint a Wow token
const mintResponse = await accountKit.v1.mintWowToken(telegramBotToken, recipientAddress);
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
