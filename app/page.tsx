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
    <div 
      className={isSafari ? 'safari-dynamic-height' : ''}
      style={{
        backgroundColor: '#403E3E',
        color: '#FFFFFF',
        minHeight: '100vh',
        width: '100%',
        ...(isSafari && {
          height: 'calc(var(--vh, 1vh) * 100)',
          minHeight: 'calc(var(--vh, 1vh) * 100)'
        })
      }}
    >
      <div 
        style={{ 
          color: '#FFFFFF',
          maxWidth: '420px',
          margin: '0 auto',
          padding: '2rem 1.25rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          minHeight: '100vh'
        }}
      >
        
        {/* Headline block */}
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '2rem',
          color: '#FFFFFF'
        }}>
          <p 
            style={{ 
              color: '#B5B5B8',
              fontSize: 'clamp(12px, calc(14px * (100vw / 390px)), 18px)',
              marginBottom: '0.5rem'
            }}
            aria-describedby="headline"
          >
            프로젝트 가치관으로 알아보는
          </p>
          <h1 
            id="headline"
            style={{ 
              fontSize: 'clamp(24px, calc(30px * (100vw / 390px)), 36px)',
              color: '#FFFFFF',
              fontWeight: 'bold',
              letterSpacing: '-0.025em',
              lineHeight: '1.2'
            }}
          >
            티미타카 <span style={{ color: '#F76241' }}>캐릭터</span> 찾기
          </h1>
        </div>

        {/* Hero mascot with stars and float animation */}
        <HeroMascot />

        {/* Social proof pill */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div 
            style={{ 
              display: 'inline-flex',
              alignItems: 'center',
              padding: '0.5rem 1rem',
              borderRadius: '9999px',
              backgroundColor: 'rgba(0,0,0,0.25)',
              color: 'rgba(255,255,255,0.9)',
              border: '1px solid rgba(255,255,255,0.1)',
              fontSize: 'clamp(12px, calc(14px * (100vw / 390px)), 18px)',
              backdropFilter: 'blur(4px)'
            }}
          >
            현재 2,358명이 나의 티미를 찾았어요!
          </div>
        </div>

        {/* CTAs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Primary CTA */}
          <button
            onClick={handleStartTest}
            style={{ 
              width: '100%',
              height: '3.5rem',
              backgroundColor: '#F76241',
              color: '#FFFFFF',
              fontSize: 'clamp(16px, calc(18px * (100vw / 390px)), 22px)',
              fontWeight: '500',
              borderRadius: '1rem',
              border: 'none',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            aria-label="캐릭터 테스트 시작하기"
          >
            테스트 시작하기
          </button>

          {/* Secondary CTA */}
          <button
            onClick={handleShare}
            style={{ 
              width: '100%',
              height: '3.5rem',
              backgroundColor: '#FFFFFF',
              color: '#222222',
              fontSize: 'clamp(16px, calc(18px * (100vw / 390px)), 22px)',
              fontWeight: '500',
              borderRadius: '1rem',
              border: '1px solid rgba(255,255,255,0.2)',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            aria-label="테스트 공유하기"
          >
            테스트 공유하기
          </button>

          {/* Tertiary link */}
          <div style={{ textAlign: 'center', paddingTop: '0.5rem' }}>
            <button
              onClick={handleLater}
              style={{ 
                color: '#B5B5B8',
                fontSize: 'clamp(12px, calc(14px * (100vw / 390px)), 18px)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
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