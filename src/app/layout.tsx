'use client';

import { ReactNode } from 'react';
import StyledComponentsRegistry from '@/lib/registry';
import { ibm_plex_sans } from '@/ui/fonts';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/ui/globalStyles';

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={ibm_plex_sans.className}>
        <StyledComponentsRegistry>
          <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
