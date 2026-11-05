'use client';

import { ReactNode, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import StyledComponentsRegistry from '@/lib/registry';
import { ThemeProvider } from 'styled-components';
import { IrchishynThemeProvider } from '@oleg-irchishyn/irchishyn-ui-library';
import { theme } from '@/ui/globalStyles';
import { ibm_plex_sans } from '@/ui/fonts';
import ToastProvider from '@/providers/ToastProvider';
import { initializeSessionId } from '@/utils/sessionIdStorage';
import { getAccessTokenWithRefresh } from '@/utils/tokenStorage';
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

  // Initialize sessionId on app load (from URL or storage)
  useEffect(() => {
    initializeSessionId();
  }, []);

  // Check authentication for protected routes before rendering
  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname?.startsWith(route));

      // Local development only: skip the OneLogin check (never active in production builds)
      const isAuthDisabled =
        process.env.NODE_ENV !== 'production' && process.env.NEXT_PUBLIC_AUTH_DISABLED === 'true';

      if (isPublicRoute || isAuthDisabled) {
        if (!isMounted) return;
        setShouldRenderChildren(true);
        setIsAuthChecked(true);
        return;
      }

      const token = await getAccessTokenWithRefresh();

      if (!isMounted) return;

      if (token) {
        setShouldRenderChildren(true);
        setIsAuthChecked(true);
      } else {
        setShouldRenderChildren(false);
        setIsAuthChecked(true);
        router.push(ROUTES.LOGIN.path);
      }
    };

    setIsAuthChecked(false);
    setShouldRenderChildren(false);
    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [pathname, router]);

  // Show loading state while checking authentication or when redirecting unauthenticated users
  if (!isAuthChecked || !shouldRenderChildren) {
    return (
      <html lang="en">
        <body
          className={`${ibm_plex_sans.className} ${ibm_plex_sans.variable}`}
          suppressHydrationWarning
        >
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
      <body
        className={`${ibm_plex_sans.className} ${ibm_plex_sans.variable}`}
        suppressHydrationWarning
      >
        <StyledComponentsRegistry>
          <ThemeProvider theme={theme}>
            <IrchishynThemeProvider cssBaseline={false}>
              <ToastProvider>{children}</ToastProvider>
            </IrchishynThemeProvider>
          </ThemeProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
