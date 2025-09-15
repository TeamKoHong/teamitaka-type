'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import HeroMascot from './(components)/HeroMascot';
import { useSafariViewport } from '@/lib/hooks/useSafariViewport';

export default function HomePage() {
  const router = useRouter();
  const [showToast, setShowToast] = useState(false);
  const { isSafari } = useSafariViewport();

  const handleStartTest = () => {
    router.push('/quiz');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: '티미타카 캐릭터 찾기',
          text: '프로젝트 가치관으로 알아보는 캐릭터 테스트',
          url: window.location.href,
        });
      } catch (error) {
        // User cancelled share
      }
    } else {
      // Fallback: copy URL
      await navigator.clipboard.writeText(window.location.href);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }
  };

  const handleLater = () => {
    // No-op for now
  };

  return (
    <div className={`min-h-screen bg-[var(--bg)] text-[var(--text)] safe-top safe-bottom ${
      isSafari ? 'safari-dynamic-height' : ''
    }`} style={{
      ...(isSafari && {
        height: 'calc(var(--vh, 1vh) * 100)',
        minHeight: 'calc(var(--vh, 1vh) * 100)'
      })
    }}>
      <div className="mx-auto max-w-[420px] px-5 py-8 flex flex-col justify-center min-h-screen">
        
        {/* Headline block */}
        <div className="text-center mb-8">
          <p 
            className="text-responsive-small text-[var(--muted)] mb-2"
            aria-describedby="headline"
          >
            프로젝트 가치관으로 알아보는
          </p>
          <h1 
            id="headline"
            className="font-bold tracking-tight leading-tight text-responsive-question"
            style={{ fontSize: 'clamp(24px, calc(30px * (100vw / 390px)), 36px)' }}
          >
            티미타카 <span className="text-[var(--brand)]">캐릭터</span> 찾기
          </h1>
        </div>

        {/* Hero mascot with stars and float animation */}
        <HeroMascot />

        {/* Social proof pill */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-[var(--elev)]/50 backdrop-blur-sm text-responsive-small text-white/90 border border-white/10">
            현재 2,358명이 나의 티미를 찾았어요!
          </div>
        </div>

        {/* CTAs */}
        <div className="space-y-4">
          {/* Primary CTA */}
          <button
            onClick={handleStartTest}
            className="w-full h-14 bg-[var(--brand)] text-white font-medium text-responsive-button rounded-2xl shadow-lg 
                       transition-all duration-200 hover:brightness-110 active:scale-[0.98]
                       focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60"
            aria-label="캐릭터 테스트 시작하기"
          >
            테스트 시작하기
          </button>

          {/* Secondary CTA */}
          <button
            onClick={handleShare}
            className="w-full h-14 bg-white text-gray-900 font-medium text-responsive-button rounded-2xl border border-white/20 
                       transition-all duration-200 hover:bg-white/90 active:scale-[0.98]
                       focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60"
            aria-label="테스트 공유하기"
          >
            테스트 공유하기
          </button>

          {/* Tertiary link */}
          <div className="text-center pt-2">
            <button
              onClick={handleLater}
              className="text-responsive-small text-[var(--muted)] hover:underline focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-white/60"
            >
              나중에 할래요
            </button>
          </div>
        </div>

        {/* Toast notification */}
        {showToast && (
          <div 
            className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg z-50 text-responsive-small"
            role="status"
            aria-live="polite"
          >
            URL이 클립보드에 복사되었습니다!
          </div>
        )}
      </div>
    </div>
  );
}