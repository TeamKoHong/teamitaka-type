'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { notFound } from 'next/navigation';
import ResultCard from '@/components/ResultCard';
import UnifiedAdaptiveResultCard from '@/components/UnifiedAdaptiveResultCard';
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
      <div className="min-h-screen text-white p-4" style={{ backgroundColor: '#323030' }}>
        {/* 보이지 않는 히트박스 - 이미지 중앙을 기준으로 X 위치 계산 */}
        <div className="max-w-md mx-auto relative">
          <button
            onClick={() => router.push('/')}
            className="absolute z-10"
            style={{ 
              width: '63.12px', 
              height: '63.12px',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              top: '20px',
              right: '20px'
            }}
            aria-label="메인으로 이동"
          />
        </div>

        {/* 다크 테마 결과 카드 */}
        <UnifiedAdaptiveResultCard 
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
    <div className="min-h-screen" style={{ backgroundColor: '#323030' }}>
      {/* 보이지 않는 히트박스 - 이미지 중앙을 기준으로 X 위치 계산 */}
      <div className="max-w-sm mx-auto relative">
        <button
          onClick={() => router.push('/')}
          className="absolute z-10"
          style={{ 
            width: '63.12px', 
            height: '63.12px',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            top: '20px',
            right: '20px'
          }}
          aria-label="메인으로 이동"
        />
      </div>

      {/* 메인 콘텐츠 */}
      <main className="pt-4 pb-8">
        <div className="max-w-sm mx-auto">
          {/* 모바일 결과 카드 */}
          <UnifiedAdaptiveResultCard 
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