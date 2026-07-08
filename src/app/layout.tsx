import type { Metadata } from 'next';
import { Space_Grotesk, Inter } from 'next/font/google';
import { LenisProvider } from '@/components/providers/LenisProvider';
import { CursorGlow } from '@/components/effects/CursorGlow';
import { AuthSessionProvider } from '@/components/auth/AuthSessionProvider';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Codebuff — AI Developer Platform',
  description:
    'Ship production-grade code, faster. The AI developer platform for modern teams.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} font-body bg-gradient-dark antialiased`}
      >
        <AuthSessionProvider>
          <LenisProvider>
            <CursorGlow />
            {children}
          </LenisProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
