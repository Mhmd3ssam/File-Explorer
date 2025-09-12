import type { ReactNode } from 'react';
import './globals.css';
import { Sidebar } from '@/components/business/Sidebar';

export const metadata = {
  title: 'File Explorer',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="h-full flex">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <main className="flex-1 p-4">{children}</main>
        </div>
      </body>
    </html>
  );
}
