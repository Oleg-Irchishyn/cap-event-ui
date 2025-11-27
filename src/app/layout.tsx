'use client';

import { ReactNode, useEffect } from 'react';
import StyledComponentsRegistry from '@/lib/registry';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/ui/globalStyles';
import { ibm_plex_sans } from '@/ui/fonts';
import ToastProvider from '@/providers/ToastProvider';
import { initializeSessionId } from '@/utils/sessionIdStorage';

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  // Initialize sessionId on app load (from URL, storage, or endpoint)
  useEffect(() => {
    initializeSessionId();
  }, []);

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
