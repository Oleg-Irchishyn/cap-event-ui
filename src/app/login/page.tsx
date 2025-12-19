'use client';

import { useRouter } from 'next/navigation';
import { getOneLoginAuthUrl, getOneLoginConfig } from '@/utils/oneloginAuth';
import { isAuthenticated } from '@/utils/tokenStorage';
import { ROUTES } from '@/const/routes';
import { useEffect } from 'react';
import { Loader } from '@/app/new/LineItems/styles';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    const handleLogin = async () => {
      // If already authenticated, redirect to main page
      if (isAuthenticated()) {
        router.push(ROUTES.MAIN.path);
        return;
      }

      try {
        const config = getOneLoginConfig();
        const authUrl = await getOneLoginAuthUrl(config);

        // Redirect to OneLogin SSO
        window.location.href = authUrl;
      } catch (error) {
        console.error('Failed to initiate OneLogin authentication:', error);
        // You might want to show an error message to the user here
      }
    };

    handleLogin();
  }, [router]);

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
