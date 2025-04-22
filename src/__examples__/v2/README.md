# Calculate Account Address Example

This example demonstrates how to use the AccountKit SDK to calculate account addresses for users on different platforms (Twitter, GitHub, etc).

## Setup

1. Create a `.env` file based on the provided `.env.example`:

   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file and add your AccountKit API key.

3. Install dependencies (if you haven't already):

   ```bash
   # From the root of the accountkit-sdk project
   yarn install
   ```

4. Build the project:
   ```bash
   # From the root of the accountkit-sdk project
   yarn build
   ```

## Run the Example

```bash
# From the root of the accountkit-sdk project
node dist/examples/v2/calculate-account-address.js
```

## Expected Output

When run successfully, you should see account information including:

- PKP address
- EVM addresses for different chains
- Solana addresses (if applicable)

## Troubleshooting

- If you get authentication errors, check that your API key is correct in the `.env` file
- Make sure the environment is set correctly (QA or PROD)
- Enable debug logs by setting `DEBUG=accountkit:*` in your `.env` file
