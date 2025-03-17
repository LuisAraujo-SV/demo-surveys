import './globals.css';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { ReactNode } from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Survey Rewards Platform',
  description: 'Earn rewards by completing surveys',
};

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gray-800 text-white p-4">
        <h1 className="text-xl">Survey App</h1>
      </header>
      <main className="flex-grow p-4">
        {children}
      </main>
      <footer className="bg-gray-800 text-white p-4 text-center">
        &copy; 2025 Survey App
      </footer>
    </div>
  );
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Layout>{children}</Layout>
        </Providers>
      </body>
    </html>
  );
}
