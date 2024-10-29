import GlobalContextProvider from '@/components/composites/global-context-provider';
import Header from '@/components/composites/header';
import { Toaster } from '@/components/ui/sonner';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'Momo Essenslotterie',
  description: 'vom Momo für Momos',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <GlobalContextProvider>
      <html lang="en" className="h-dvh flex-1">
        <head>
          <link
            rel="icon"
            type="image/png"
            href="/assets/favicon/favicon-96x96.png"
            sizes="96x96"
          />
          <link
            rel="icon"
            type="image/svg+xml"
            href="/assets/favicon/favicon.svg"
          />
          <link rel="shortcut icon" href="/assets/favicon/favicon.ico" />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/assets/favicon/apple-touch-icon.png"
          />
          <link rel="manifest" href="/assets/favicon/site.webmanifest" />
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased flex bg-secondary flex-1 flex-col max-h-screen overflow-hidden min-h-screen`}
        >
          <Header />
          <main className="flex-1 flex overflow-auto p-2 sm:p-8 max-w-7xl w-full  mx-auto">
            {children}
          </main>
          <Toaster />
        </body>
      </html>
    </GlobalContextProvider>
  );
}
