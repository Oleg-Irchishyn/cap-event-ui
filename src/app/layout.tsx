'use client';

import { ReactNode } from 'react';
import StyledComponentsRegistry from '@/lib/registry';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/ui/globalStyles';
import { ibm_plex_sans } from '@/ui/fonts';

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${ibm_plex_sans.className} ${ibm_plex_sans.variable}`}>
        <StyledComponentsRegistry>
          <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
