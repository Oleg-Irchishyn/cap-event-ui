'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { getOneLoginAuthUrl, getOneLoginConfig } from '@/utils/oneloginAuth';
import { isAuthenticated } from '@/utils/tokenStorage';
import { ROUTES } from '@/const/routes';
import { useEffect } from 'react';
import { Loader } from '@/app/new/LineItems/styles';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleLogin = async () => {
      // If already authenticated, redirect to main page
      if (isAuthenticated()) {
        router.push(ROUTES.MAIN.path);
        return;
      }

      try {
        const config = getOneLoginConfig();
        // Check if we're coming from a logout (prompt_login=true in query params)
        // This forces OneLogin to show login screen even if "remember my login" was checked
        const promptLogin = searchParams.get('prompt_login') === 'true';
        // Redirect to OneLogin SSO
        window.location.href = await getOneLoginAuthUrl(config, promptLogin);
      } catch (error) {
        console.error('Failed to initiate OneLogin authentication:', error);
      }
    };

    handleLogin();
  }, [router, searchParams]);

  // Show loading state while redirecting
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
      <Loader />
    </div>
  );
}
