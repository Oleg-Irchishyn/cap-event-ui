'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { exchangeCodeForToken, getOneLoginConfig } from '@/utils/oneloginAuth';
import { storeToken, clearTokens } from '@/utils/tokenStorage';
import { ROUTES } from '@/const/routes';
import Button, { BUTTON_THEMES } from '@/app/components/Button';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const errorParam = searchParams.get('error');

      if (errorParam) {
        clearTokens();
        setError(`Authentication failed: ${errorParam}`);
        return;
      }

      if (typeof window !== 'undefined') {
        const storedState = sessionStorage.getItem('onelogin_state');
        if (!storedState || storedState !== state) {
          clearTokens();
          setError('Invalid state parameter. Please try logging in again.');
          return;
        }
      }

      if (!code) {
        clearTokens();
        setError('No authorization code received. Please try logging in again.');
        return;
      }

      try {
        const config = getOneLoginConfig();
        const tokenResponse = await exchangeCodeForToken(code, config);

        if (!tokenResponse?.access_token) {
          throw new Error('Invalid token response: access_token is missing');
        }

        storeToken(
          tokenResponse.access_token,
          tokenResponse.expires_in,
          tokenResponse.refresh_token,
          tokenResponse.id_token,
        );

        router.push(ROUTES.MAIN.path);
      } catch (err) {
        // Clear any existing tokens on error to prevent stale authentication
        clearTokens();
        console.error('Token exchange failed:', err);
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to complete authentication. Please try again.',
        );
      }
    };

    handleCallback();
  }, [searchParams, router]);

  if (error) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <div>{error}</div>
        <Button
          testId="try-again"
          onClick={() => router.push('/login')}
          buttonTheme={BUTTON_THEMES.primary}
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        gap: '1rem',
      }}
    >
      <div>Completing authentication...</div>
    </div>
  );
}
