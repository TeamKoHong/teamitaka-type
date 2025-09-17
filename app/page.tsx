'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import HeroMascot from './(components)/HeroMascot';

export default function HomePage() {
  const router = useRouter();
  const [showToast, setShowToast] = useState(false);

  // 디버깅용 로그
  console.log('HomePage rendered');

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
    <div className="min-h-screen safe-top safe-bottom main-page" style={{
      backgroundColor: '#323030',
      color: '#FFFFFF'
    }}>
      <div 
        className="mx-auto max-w-[420px] px-5 py-8 flex flex-col justify-center min-h-screen"
        style={{ color: '#FFFFFF' }}
      >
        
        {/* Headline block */}
        <div className="text-center mb-8" style={{ color: '#FFFFFF' }}>
          <p 
            className="mb-2"
            style={{ 
              fontFamily: 'Pretendard, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans KR", sans-serif',
              fontWeight: 600, // Semibold
              fontSize: 'clamp(16px, calc(20px * (100vw / 390px)), 24px)',
              color: '#FFFDFC',
              lineHeight: 1.4
            }}
            aria-describedby="headline"
          >
            프로젝트 가치관으로 알아보는
          </p>
          <h1 
            id="headline"
            className="tracking-tight leading-tight"
            style={{ 
              fontFamily: 'Pretendard, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans KR", sans-serif',
              fontWeight: 700, // Bold
              fontSize: 'clamp(24px, calc(32px * (100vw / 390px)), 40px)',
              color: '#FFFFFF',
              lineHeight: 1.2
            }}
          >
            티미타카 <span style={{ color: '#F76241' }}>캐릭터</span> 찾기
          </h1>
        </div>

        {/* Hero mascot with stars and float animation */}
        <HeroMascot />

        {/* Social proof image */}
        <div className="text-center mb-4">
          <img 
            src="/assets/main/2358.png" 
            alt="2,358명이 나의 티미를 찾았어요!"
            className="h-auto"
            style={{ 
              width: '63.1%', // 226/358 = 0.631
              height: '50px', // 48.14/54 * 56px = 49.9px ≈ 50px
              objectFit: 'contain',
              margin: '0 auto' // 가운데 정렬
            }}
          />
        </div>

        {/* CTAs */}
        <div className="space-y-4">
          {/* Primary CTA */}
          <button
            onClick={handleStartTest}
            className="w-full h-14 font-medium text-responsive-button rounded-2xl shadow-lg 
                       transition-all duration-200 hover:brightness-110 active:scale-[0.98]
                       focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60"
            style={{ 
              backgroundColor: '#F76241',
              color: '#FFFFFF'
            }}
            aria-label="캐릭터 테스트 시작하기"
          >
            테스트 시작하기
          </button>

          {/* Secondary CTA */}
          <button
            onClick={handleShare}
            className="w-full h-14 font-medium text-responsive-button rounded-2xl border
                       transition-all duration-200 hover:bg-white/90 active:scale-[0.98]
                       focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60"
            style={{ 
              backgroundColor: '#FFFFFF',
              color: '#222222',
              borderColor: 'rgba(255,255,255,0.2)'
            }}
            aria-label="테스트 공유하기"
          >
            테스트 공유하기
          </button>

          {/* Tertiary link */}
          <div className="text-center pt-2">
            <button
              onClick={handleLater}
              className="text-responsive-small hover:underline focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-white/60"
              style={{ color: '#B5B5B8' }}
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