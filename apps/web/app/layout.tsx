import './global.css';

import { Inter as FontSans } from 'next/font/google';

import { cn } from '@verity/utils';

export const metadata = {
  title: 'Verity',
};

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={cn('min-h-screen bg-background font-sans antialiased', fontSans.variable)}>
        {children}
      </body>
    </html>
  );
}
