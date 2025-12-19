'use client';

import { ReactNode, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import StyledComponentsRegistry from '@/lib/registry';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/ui/globalStyles';
import { ibm_plex_sans } from '@/ui/fonts';
import ToastProvider from '@/providers/ToastProvider';
import { initializeSessionId } from '@/utils/sessionIdStorage';
import { isAuthenticated } from '@/utils/tokenStorage';
import { ROUTES } from '@/const/routes';
import { Loader } from '@/app/new/LineItems/styles';

const PUBLIC_ROUTES = ['/login', '/auth/callback'];

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [shouldRenderChildren, setShouldRenderChildren] = useState(false);

  // Initialize sessionId on app load (from URL, storage, or endpoint)
  useEffect(() => {
    initializeSessionId();
  }, []);

  // Check authentication for protected routes before rendering
  useEffect(() => {
    const checkAuth = () => {
      const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname?.startsWith(route));

      if (isPublicRoute) {
        // Public routes can render immediately
        setShouldRenderChildren(true);
        setIsAuthChecked(true);
      } else {
        // For protected routes, check authentication
        if (isAuthenticated()) {
          setShouldRenderChildren(true);
          setIsAuthChecked(true);
        } else {
          // Not authenticated, redirect to login
          // Don't render children - will re-check when pathname changes to /login
          setShouldRenderChildren(false);
          setIsAuthChecked(true);
          router.push(ROUTES.LOGIN.path);
        }
      }
    };

    // Reset auth check state when pathname changes
    setIsAuthChecked(false);
    setShouldRenderChildren(false);
    checkAuth();
  }, [pathname, router]);

  // Show loading state while checking authentication or when redirecting unauthenticated users
  if (!isAuthChecked || !shouldRenderChildren) {
    return (
      <html lang="en">
        <body className={`${ibm_plex_sans.className} ${ibm_plex_sans.variable}`}>
          <StyledComponentsRegistry>
            <ThemeProvider theme={theme}>
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
            </ThemeProvider>
          </StyledComponentsRegistry>
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body className={`${ibm_plex_sans.className} ${ibm_plex_sans.variable}`}>
        <StyledComponentsRegistry>
          <ThemeProvider theme={theme}>
            <ToastProvider>{children}</ToastProvider>
          </ThemeProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
