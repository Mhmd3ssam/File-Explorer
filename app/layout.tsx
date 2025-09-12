import type { ReactNode } from 'react';
import './globals.css';
import { Sidebar } from '@/components/business/Sidebar';
import { Navbar } from '@/components/business/Navbar';

export const metadata = {
  title: 'File Explorer',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="h-full flex bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col relative">
          <Navbar />
          <main className="flex-1 px-2 py-4 relative z-10 bg-gray-50">{children}</main>
        </div>
      </body>
    </html>
  );
}
