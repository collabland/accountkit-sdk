import axios, { AxiosInstance } from 'axios';
import dotenv from 'dotenv';
import { AccountKit } from '../../client';
import { Environment } from '../../types';

// Load environment variables
dotenv.config();

// Mock axios
jest.mock('axios');
const mockAxios = axios as jest.Mocked<typeof axios>;

describe('AccountKitV2Client.calculateAccountAddress', () => {
  let accountKit: AccountKit;
  let apiKey: string;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.DEBUG = process.env.DEBUG || 'accountkit:*';

    // Get API key from environment or use fallback for testing
    apiKey = process.env.ACCOUNTKIT_API_KEY || 'test-api-key';

    // Get environment from env var or default to QA
    const environment =
      process.env.ACCOUNTKIT_ENVIRONMENT === 'PROD' ? Environment.PROD : Environment.QA;

    mockAxios.create.mockReturnValue(mockAxios as unknown as AxiosInstance);
    accountKit = new AccountKit(apiKey, environment, { debug: true });
  });

  afterEach(() => {
    // Only delete DEBUG if we set it in the test
    if (!process.env.DEBUG) {
      delete process.env.DEBUG;
    }
  });

  it('should call the correct endpoint with correct parameters for Twitter', async () => {
    // Arrange
    const platform = 'twitter';
    const userId = '1868670033850941440'; // Twitter numeric user ID

    const mockResponse = {
      data: {
        pkpAddress: '0xC1709E27b4AF7bF9df9E1c711CfCaA99a958Fe9B',
        evm: [
          {
            chainId: 84532,
            address: '0x112dce5153F0Fc8EbFE6738A9d326AC3be89B419',
          },
          {
            chainId: 59141,
            address: '0x112dce5153F0Fc8EbFE6738A9d326AC3be89B419',
          },
          {
            chainId: 11155111,
            address: '0x112dce5153F0Fc8EbFE6738A9d326AC3be89B419',
          },
          {
            chainId: 8453,
            address: '0x112dce5153F0Fc8EbFE6738A9d326AC3be89B419',
          },
        ],
        solana: [],
      },
      status: 200,
      headers: {},
    };

    // Mock the axios post method
    mockAxios.post.mockResolvedValueOnce(mockResponse);

    // Act
    const result = await accountKit.v2.calculateAccountAddress(platform, userId);

    // Assert
    expect(mockAxios.post).toHaveBeenCalledWith(
      '/accountkit/v2/evm/calculateAccountAddress',
      {
        platform,
        userId,
      },
      undefined,
    );
    expect(result.data).toEqual(mockResponse.data);
    expect(result.status).toBe(200);
  });

  it('should call the correct endpoint with correct parameters for GitHub', async () => {
    // Arrange
    const platform = 'github';
    const userId = '54375111'; // GitHub numeric user ID

    const mockResponse = {
      data: {
        pkpAddress: '0xC1709E27b4AF7bF9df9E1c711CfCaA99a958Fe9B',
        evm: [
          {
            chainId: 84532,
            address: '0x112dce5153F0Fc8EbFE6738A9d326AC3be89B419',
          },
          {
            chainId: 59141,
            address: '0x112dce5153F0Fc8EbFE6738A9d326AC3be89B419',
          },
          {
            chainId: 11155111,
            address: '0x112dce5153F0Fc8EbFE6738A9d326AC3be89B419',
          },
          {
            chainId: 8453,
            address: '0x112dce5153F0Fc8EbFE6738A9d326AC3be89B419',
          },
        ],
        solana: [],
      },
      status: 200,
      headers: {},
    };

    // Mock the axios post method
    mockAxios.post.mockResolvedValueOnce(mockResponse);

    // Act
    const result = await accountKit.v2.calculateAccountAddress(platform, userId);

    // Assert
    expect(mockAxios.post).toHaveBeenCalledWith(
      '/accountkit/v2/evm/calculateAccountAddress',
      {
        platform,
        userId,
      },
      undefined,
    );
    expect(result.data).toEqual(mockResponse.data);
    expect(result.status).toBe(200);
  });

  it('should handle API errors correctly', async () => {
    // Arrange
    const platform = 'twitter';
    const userId = 'invalid-user';

    const errorResponse = {
      response: {
        data: { error: 'User not found' },
        status: 404,
        headers: {},
      },
    };

    // Mock the axios post method to reject with an error
    mockAxios.post.mockRejectedValueOnce(errorResponse);

    // Act & Assert
    await expect(accountKit.v2.calculateAccountAddress(platform, userId)).rejects.toMatchObject({
      response: {
        data: { error: 'User not found' },
        status: 404,
      },
    });
  });

  it('should make requests with the correct headers', async () => {
    // Arrange
    const platform = 'twitter';
    const userId = '1868670033850941440';

    const mockResponse = {
      data: {
        pkpAddress: '0xC1709E27b4AF7bF9df9E1c711CfCaA99a958Fe9B',
        evm: [
          {
            chainId: 84532,
            address: '0x112dce5153F0Fc8EbFE6738A9d326AC3be89B419',
          },
          {
            chainId: 59141,
            address: '0x112dce5153F0Fc8EbFE6738A9d326AC3be89B419',
          },
          {
            chainId: 11155111,
            address: '0x112dce5153F0Fc8EbFE6738A9d326AC3be89B419',
          },
          {
            chainId: 8453,
            address: '0x112dce5153F0Fc8EbFE6738A9d326AC3be89B419',
          },
        ],
        solana: [],
      },
      status: 200,
      headers: {},
    };

    mockAxios.post.mockResolvedValueOnce(mockResponse);

    // Act
    await accountKit.v2.calculateAccountAddress(platform, userId);

    // Assert
    expect(mockAxios.create).toHaveBeenCalledWith(
      expect.objectContaining({
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          'X-API-KEY': apiKey,
        }),
      }),
    );
  });
});
