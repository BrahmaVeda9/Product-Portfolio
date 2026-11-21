import type { Metadata } from 'next';
import { Inter, JetBrains_Mono, Cormorant_Garamond, Manrope } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-body',
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
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} ${cormorant.variable} ${manrope.variable} dark`}>
      <body className="font-sans antialiased">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#15130F',
              color: '#F2EDE4',
              border: '1px solid rgba(201,169,110,0.25)',
              borderRadius: '6px',
              fontSize: '14px',
            },
            success: {
              iconTheme: { primary: '#C9A96E', secondary: '#0B0A09' },
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
