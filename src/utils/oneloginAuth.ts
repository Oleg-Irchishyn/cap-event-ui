/**
 * OneLogin SSO Authentication Utility
 *
 * This module handles the OAuth 2.0 / OIDC authentication flow with OneLogin
 * to obtain bearer tokens for API requests.
 */

export interface OneLoginConfig {
  clientId: string;
  subdomain: string; // e.g., "yourcompany" for https://yourcompany.onelogin.com
  redirectUri: string; // Must match the redirect URI configured in OneLogin app
  region?: 'us' | 'eu'; // OneLogin region, defaults to 'us'
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  id_token?: string;
}

/**
 * Generates a random state parameter for OAuth flow to prevent CSRF attacks
 */
export const generateState = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
};

/**
 * Generates a PKCE code verifier and challenge
 */
export const generatePKCE = async (): Promise<{ codeVerifier: string; codeChallenge: string }> => {
  const codeVerifier = generateState();
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  const codeChallenge = btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');

  return { codeVerifier, codeChallenge };
};

/**
 * Gets the OneLogin authorization URL
 */
export const getOneLoginAuthUrl = async (config: OneLoginConfig): Promise<string> => {
  const state = generateState();
  const { codeVerifier, codeChallenge } = await generatePKCE();

  // Store state and code verifier in sessionStorage for later verification
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('onelogin_state', state);
    sessionStorage.setItem('onelogin_code_verifier', codeVerifier);
  }

  const region = config.region ?? 'us';
  const baseUrl =
    region === 'eu'
      ? `https://${config.subdomain}.onelogin.eu`
      : `https://${config.subdomain}.onelogin.com`;

  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: 'code',
    scope: 'openid profile email',
    state: state,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  });

  return `${baseUrl}/oidc/2/auth?${params.toString()}`;
};

/**
 * Exchanges authorization code for access token
 */
export const exchangeCodeForToken = async (
  code: string,
  config: OneLoginConfig,
): Promise<TokenResponse> => {
  const codeVerifier =
    typeof window !== 'undefined' ? sessionStorage.getItem('onelogin_code_verifier') : null;

  if (!codeVerifier) {
    throw new Error('Code verifier not found. Please restart the login process.');
  }

  const region = config.region ?? 'us';
  const baseUrl =
    region === 'eu'
      ? `https://${config.subdomain}.onelogin.eu`
      : `https://${config.subdomain}.onelogin.com`;

  const tokenUrl = `${baseUrl}/oidc/2/token`;

  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: config.redirectUri, // CRITICAL: Must exactly match auth request and OneLogin config
    code_verifier: codeVerifier,
    client_id: config.clientId,
  });

  // Prepare headers
  const headers: Record<string, string> = {
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  let response: Response;
  try {
    response = await fetch(tokenUrl, {
      method: 'POST',
      headers,
      body: params.toString(),
    });
  } catch (networkError) {
    // Network error (CORS, connection failed, etc.)
    const errorMessage =
      networkError instanceof Error
        ? `Network error during token exchange: ${networkError.message}`
        : 'Network error during token exchange. Please check your connection and CORS settings.';
    console.error('Token exchange network error:', networkError);
    throw new Error(errorMessage);
  }

  // Check if response is OK before parsing
  if (!response.ok) {
    const status = response.status;
    const errorMessage = `Token exchange failed (${status})`;

    // DO NOT clean up sessionStorage on error - allow retry
    throw new Error(errorMessage);
  }

  // Parse successful response
  let tokenData: TokenResponse;
  try {
    tokenData = await response.json();
  } catch (parseError) {
    const errorMessage =
      parseError instanceof Error
        ? `Failed to parse token response: ${parseError.message}`
        : 'Failed to parse token response. Invalid JSON received.';
    console.error('Token response parse error:', parseError);
    throw new Error(errorMessage);
  }

  // Clean up sessionStorage only on success
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('onelogin_state');
    sessionStorage.removeItem('onelogin_code_verifier');
  }

  return tokenData;
};

/**
 * Refreshes an access token using refresh token
 */
export const refreshAccessToken = async (
  refreshToken: string,
  config: OneLoginConfig,
): Promise<TokenResponse> => {
  const region = config.region ?? 'us';
  const baseUrl =
    region === 'eu'
      ? `https://${config.subdomain}.onelogin.eu`
      : `https://${config.subdomain}.onelogin.com`;

  const tokenUrl = `${baseUrl}/oidc/2/token`;

  const params = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: config.clientId,
    refresh_token: refreshToken,
  });

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Token refresh failed: ${error}`);
  }

  return response.json();
};

/**
 * Gets OneLogin configuration from environment variables
 */
export const getOneLoginConfig = (): OneLoginConfig => {
  const clientId = process.env.NEXT_PUBLIC_ONELOGIN_CLIENT_ID;
  const subdomain = process.env.NEXT_PUBLIC_ONELOGIN_SUBDOMAIN;
  const redirectUri = process.env.NEXT_PUBLIC_ONELOGIN_REDIRECT_URI;
  const region = (process.env.NEXT_PUBLIC_ONELOGIN_REGION as 'us' | 'eu' | undefined) || 'us';

  if (!clientId || !subdomain || !redirectUri) {
    throw new Error(
      'Missing OneLogin configuration. Please set NEXT_PUBLIC_ONELOGIN_CLIENT_ID, ' +
        'NEXT_PUBLIC_ONELOGIN_SUBDOMAIN, and NEXT_PUBLIC_ONELOGIN_REDIRECT_URI environment variables.',
    );
  }

  return {
    clientId,
    subdomain,
    redirectUri,
    region,
  };
};
