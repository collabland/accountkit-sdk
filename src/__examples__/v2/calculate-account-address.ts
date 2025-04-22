/**
 * Example demonstrating how to use the AccountKit SDK to calculate account addresses
 *
 * To run this example:
 * 1. Create a .env file in this directory with your API key (see .env.example)
 * 2. Run `node src/examples/v2/calculate-account-address/index.js`
 */

// Load environment variables from .env file
import { config } from 'dotenv';
config();
// Import the AccountKit SDK using relative paths since we're in src
import { AccountKit } from '../../client';
import { Environment, Platform } from '../../types';
import { isAxiosError } from 'axios';

// Define async main function to use async/await
async function main(): Promise<void> {
  try {
    // Get the API key from environment variables
    const apiKey = process.env.ACCOUNTKIT_API_KEY;
    if (!apiKey) {
      throw new Error('ACCOUNTKIT_API_KEY is not set in environment variables');
    }

    // Create an instance of the AccountKit client
    // You can use Environment.PROD for production, Environment.QA for testing
    const accountKit = new AccountKit(apiKey, Environment.QA, { debug: true });

    // Example 1: Calculate account address for Twitter user
    console.log('\n🔍 Calculating account address for Twitter user...');
    const twitterUserId = '44196397'; // Example Twitter user ID
    const twitterResult = await accountKit.v2.calculateAccountAddress(
      Platform.TWITTER,
      twitterUserId,
    );
    console.log('✅ Twitter Result:', twitterResult);
    console.log(JSON.stringify(twitterResult.data, null, 2));

    // Example 2: Calculate account address for GitHub user
    console.log('\n🔍 Calculating account address for GitHub user...');
    const githubUserId = '583231'; // Example GitHub user ID
    const githubResult = await accountKit.v2.calculateAccountAddress(Platform.GITHUB, githubUserId);
    console.log('✅ GitHub Result:', githubResult);
    console.log(JSON.stringify(githubResult.data, null, 2));
  } catch (error) {
    console.error('❌ Error:', (error as Error)?.message);
    // If the error has a response from the API, log the response data
    if (isAxiosError(error)) {
      console.error('API Response:', error.response?.data);
    }
  }
}

// Run the main function
main().catch(error => {
  console.error('❌ Error:', error.message);
  // If the error has a response from the API, log the response data
  if (error.response && error.response.data) {
    console.error('API Response:', error.response.data);
  }
});
