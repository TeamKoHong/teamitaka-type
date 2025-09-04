import type { Metadata } from 'next';
import { getDefaultOGMeta } from '@/lib/og';
import './globals.css';

const ogMeta = getDefaultOGMeta();

export const metadata: Metadata = {
  title: ogMeta.title,
  description: ogMeta.description,
  keywords: ['MBTI', '성격유형', '팀워크', '협업', '성향테스트', 'TEAMITAKA'],
  authors: [{ name: 'TEAMITAKA' }],
  creator: 'TEAMITAKA',
  publisher: 'TEAMITAKA',
  
  openGraph: {
    title: ogMeta.title,
    description: ogMeta.description,
    images: [
      {
        url: ogMeta.image!,
        width: 1200,
        height: 630,
        alt: 'TEAMITAKA 타입 테스트',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
    siteName: 'TEAMITAKA',
  },
  
  twitter: {
    card: 'summary_large_image',
    title: ogMeta.title,
    description: ogMeta.description,
    images: [ogMeta.image!],
  },
  
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  alternates: {
    canonical: 'https://type.teamitaka.com',
  },
  
  other: {
    'theme-color': '#F76241',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="format-detection" content="telephone=no" />
        
        {/* Plausible Analytics (예시) */}
        {/* <script defer data-domain="type.teamitaka.com" src="https://plausible.io/js/script.js"></script> */}
      </head>
      <body className="antialiased min-h-screen bg-light-bg dark:bg-dark-bg transition-colors">
        <div className="min-h-screen flex flex-col">
          <main className="flex-1">
            {children}
          </main>
          
          {/* 글로벌 푸터 */}
          <footer className="py-6 text-center text-xs text-gray-500 dark:text-gray-400">
            <p>© 2024 TEAMITAKA. 개인정보 없이 진행되는 재미있는 테스트입니다.</p>
            <p className="mt-1">유형은 절대적 기준이 아니라 참고 지표예요.</p>
          </footer>
        </div>
      </body>
    </html>
  );
}