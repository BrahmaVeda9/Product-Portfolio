import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Product Manager Portfolio',
    template: '%s | PM Portfolio',
  },
  description: 'Senior Product Manager specializing in AI/GenAI, SaaS, ERP, and workflow automation.',
  keywords: ['Product Manager', 'AI', 'GenAI', 'SaaS', 'ERP', 'Workflow Automation', 'Portfolio'],
  authors: [{ name: 'Portfolio Owner' }],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'PM Portfolio',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} dark`}>
      <body className="font-sans antialiased">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#0f0f1a',
              color: '#e8e8f0',
              border: '1px solid rgba(90,79,255,0.2)',
              borderRadius: '12px',
            },
            success: {
              iconTheme: { primary: '#5a4fff', secondary: '#fff' },
            },
            error: {
              iconTheme: { primary: '#dc2626', secondary: '#fff' },
            },
          }}
        />
      </body>
    </html>
  );
}
