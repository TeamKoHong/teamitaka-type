'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { notFound } from 'next/navigation';
import ResultCard from '@/components/ResultCard';
import ShareBar from '@/components/ShareBar';
import { TYPE_METADATA } from '@/lib/types';

type ViewMode = 'light-card' | 'dark-fullscreen';

export default function ResultPage() {
  const router = useRouter();
  const params = useParams();
  const typeCode = params.type as string;
  
  const [viewMode, setViewMode] = useState<ViewMode>('light-card');
  const [isLoading, setIsLoading] = useState(true);

  const typeMeta = TYPE_METADATA[typeCode?.toUpperCase()];

  useEffect(() => {
    // 타입 유효성 검사
    if (!typeMeta) {
      notFound();
      return;
    }

    // 결과 표시 이벤트
    if (typeof window !== 'undefined' && (window as any).plausible) {
      (window as any).plausible('Result Viewed', { 
        props: { 
          type: typeCode.toUpperCase(),
          nickname: typeMeta.nickname 
        } 
      });
    }

    setIsLoading(false);
  }, [typeMeta, typeCode]);

  const handleRetest = () => {
    if (typeof window !== 'undefined' && (window as any).plausible) {
      (window as any).plausible('Retest Started');
    }
    router.push('/');
  };

  const toggleViewMode = () => {
    setViewMode(prev => prev === 'light-card' ? 'dark-fullscreen' : 'light-card');
  };

  if (isLoading || !typeMeta) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">결과를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 다크 풀스크린 모드
  if (viewMode === 'dark-fullscreen') {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-4">
        {/* 헤더 */}
        <header className="flex items-center justify-between mb-8 max-w-md mx-auto">
          <button
            onClick={toggleViewMode}
            className="p-2 hover:bg-gray-800 rounded-full transition-colors"
            aria-label="라이트 모드로 변경"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </button>
          
          <h1 className="text-lg font-semibold">성향 분석 완료!</h1>
          
          <button
            onClick={() => router.push('/')}
            className="p-2 hover:bg-gray-800 rounded-full transition-colors"
            aria-label="홈으로"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        {/* 다크 테마 결과 카드 */}
        <ResultCard 
          typeMeta={typeMeta} 
          isDark={true}
          className="mb-8"
        />

        {/* 하단 액션 버튼들 */}
        <div className="max-w-md mx-auto space-y-4">
          <ShareBar
            typeCode={typeCode.toUpperCase()}
            nickname={typeMeta.nickname}
            onRetest={handleRetest}
          />
        </div>
      </div>
    );
  }

  // 라이트 카드형 모드 (기본)
  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg">
      {/* 상단 헤더 */}
      <header className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <button
            onClick={() => router.push('/')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            aria-label="홈으로"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <h1 className="text-lg font-semibold text-light-text dark:text-dark-text">
            나의 성향이 담긴 티미 확인하기
          </h1>
          
          <button
            onClick={toggleViewMode}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            aria-label="다크 모드로 변경"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </button>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="p-4 pb-32">
        <div className="max-w-lg mx-auto">
          {/* 완료 메시지 */}
          <div className="text-center mb-8 mt-4">
            <h2 className="text-2xl font-bold mb-2 text-light-text dark:text-dark-text">
              🎉 성향 분석 완료!
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              당신의 협업 타입을 확인해보세요
            </p>
          </div>

          {/* 라이트 테마 결과 카드 */}
          <ResultCard 
            typeMeta={typeMeta} 
            isDark={false}
            captureMode={false}
          />

          {/* 상세 정보 링크 */}
          <div className="text-center mt-6">
            <button
              onClick={toggleViewMode}
              className="text-primary hover:text-primary/80 underline transition-colors"
            >
              나의 성향 자세히 보기
            </button>
          </div>
        </div>
      </main>

      {/* 하단 고정 액션 바 */}
      <div className="fixed bottom-0 left-0 right-0">
        <ShareBar
          typeCode={typeCode.toUpperCase()}
          nickname={typeMeta.nickname}
          onRetest={handleRetest}
          className="bg-white dark:bg-dark-card border-t border-gray-200 dark:border-gray-700 p-4"
        />
      </div>
    </div>
  );
}