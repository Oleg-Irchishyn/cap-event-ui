import { exchangeCodeForToken, getOneLoginConfig, OneLoginConfig } from '../oneloginAuth';
import ProcessEnv = NodeJS.ProcessEnv;

// Mock fetch
global.fetch = jest.fn();

describe('oneloginAuth', () => {
  const mockConfig: OneLoginConfig = {
    clientId: 'test-client-id',
    subdomain: 'testcompany',
    redirectUri: 'http://localhost:3000/auth/callback',
    region: 'us',
    resource: 'resource',
    scope: 'cap-event',
  };

  beforeEach(() => {
    sessionStorage.clear();
    jest.clearAllMocks();
  });

  it('should exchange authorization code for token successfully', async () => {
    const mockCode = 'test-auth-code-123';
    const mockCodeVerifier = 'test-code-verifier';
    const mockTokenResponse = {
      access_token: 'test-access-token',
      token_type: 'Bearer',
      expires_in: 3600,
      refresh_token: 'test-refresh-token',
      id_token: 'test-id-token',
    };

    sessionStorage.setItem('onelogin_code_verifier', mockCodeVerifier);
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockTokenResponse,
    });

    const result = await exchangeCodeForToken(mockCode, mockConfig);

    expect(result).toEqual(mockTokenResponse);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/oidc/2/token'),
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }),
    );
    expect(sessionStorage.getItem('onelogin_code_verifier')).toBeNull();
  });

  it('should throw error when code verifier is missing or token exchange fails', async () => {
    const mockCode = 'test-auth-code-123';

    // Test missing code verifier
    await expect(exchangeCodeForToken(mockCode, mockConfig)).rejects.toThrow(
      'Code verifier not found',
    );

    // Test failed token exchange
    sessionStorage.setItem('onelogin_code_verifier', 'test-verifier');
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 400,
    });

    await expect(exchangeCodeForToken(mockCode, mockConfig)).rejects.toThrow(
      'Token exchange failed (400)',
    );
  });

  it('should get OneLogin config from environment variables or throw error', () => {
    const originalEnv = process.env;

    // Test with missing config
    process.env = {} as ProcessEnv;
    expect(() => getOneLoginConfig()).toThrow('Missing OneLogin configuration');

    // Test with valid config
    process.env = {
      NEXT_PUBLIC_ONELOGIN_CLIENT_ID: 'test-client-id',
      NEXT_PUBLIC_ONELOGIN_SUBDOMAIN: 'testcompany',
      NEXT_PUBLIC_ONELOGIN_REDIRECT_URI: 'http://localhost:3000/auth/callback',
      NEXT_PUBLIC_ONELOGIN_REGION: 'us',
      NEXT_PUBLIC_ONELOGIN_RESOURCE: 'resource',
      NEXT_PUBLIC_ONELOGIN_SCOPE: 'cap-event',
    } as unknown as ProcessEnv;

    const config = getOneLoginConfig();
    expect(config).toEqual({
      clientId: 'test-client-id',
      subdomain: 'testcompany',
      redirectUri: 'http://localhost:3000/auth/callback',
      region: 'us',
      scope: 'cap-event',
      resource: 'resource',
    });

    process.env = originalEnv;
  });
});
