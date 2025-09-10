'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { notFound } from 'next/navigation';
import ResultCard from '@/components/ResultCard';
import ShareBar from '@/components/ShareBar';
import TimiCard from '@/components/TimiCard';
import { TYPE_METADATA } from '@/lib/types';
import { timiCards } from '@/lib/data/timiCards';

type ViewMode = 'light-card' | 'dark-fullscreen';

export default function ResultPage() {
  const router = useRouter();
  const params = useParams();
  const rawTypeCode = params.type as string;
  
  // URL 디코딩 처리
  const typeCode = rawTypeCode ? decodeURIComponent(rawTypeCode) : '';
  
  const [viewMode, setViewMode] = useState<ViewMode>('light-card');
  const [isLoading, setIsLoading] = useState(true);

  const typeMeta = TYPE_METADATA[typeCode];
  
  // 현재 티미의 카드 찾기
  const currentTimiCard = timiCards.find(card => 
    card.name === typeMeta?.nickname || 
    card.name.includes(typeMeta?.nickname?.replace('티미', '') || '')
  );

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
          type: typeCode,
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
            typeCode={typeCode}
            nickname={typeMeta.nickname}
            onRetest={handleRetest}
          />
        </div>
      </div>
    );
  }

  // 모바일 카드형 모드 (기본)
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#333131' }}>
      {/* 상단 닫기 버튼 */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={() => router.push('/')}
          className="w-8 h-8 text-white rounded-full flex items-center justify-center text-lg font-bold"
          style={{ backgroundColor: '#505050' }}
          aria-label="닫기"
        >
          ×
        </button>
      </div>

      {/* 메인 콘텐츠 */}
      <main className="pt-4 pb-8">
        <div className="max-w-sm mx-auto">
          {/* 모바일 결과 카드 */}
          <ResultCard 
            typeMeta={typeMeta} 
            isDark={true}
            captureMode={false}
            onRetest={handleRetest}
          />
          
        </div>
      </main>
    </div>
  );
}