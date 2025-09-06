'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { TYPE_METADATA } from '@/lib/types';
import { timiCards } from '@/lib/data/timiCards';
import TimiCard from '@/components/TimiCard';

function AnalysisCompleteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [typeCode, setTypeCode] = useState<string>('');

  useEffect(() => {
    // URL에서 타입 코드 가져오기
    const type = searchParams.get('type');
    if (type) {
      setTypeCode(type);
    }
  }, [searchParams]);

  // 타입 메타데이터와 티미 카드 찾기
  const typeMeta = typeCode ? TYPE_METADATA[typeCode] : null;
  const currentTimiCard = typeMeta ? timiCards.find(card => 
    card.name === typeMeta.nickname || 
    card.name.includes(typeMeta.nickname?.replace('티미', '') || '')
  ) : null;

  const handleViewDetails = () => {
    if (typeCode) {
      router.push(`/result/${encodeURIComponent(typeCode)}`);
    }
  };

  const handleShareCard = () => {
    // 카드 공유 기능 (추후 구현)
    console.log('카드 공유');
  };

  const handleSaveCard = () => {
    // 카드 저장 기능 (추후 구현)
    console.log('카드 저장');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 상단 상태바 */}
      <div className="bg-white px-4 py-2 flex items-center justify-between text-black text-sm">
        <span className="font-medium">9:41</span>
        <div className="flex items-center space-x-1">
          <div className="w-4 h-2 bg-black rounded-sm"></div>
          <div className="w-4 h-2 bg-black rounded-sm"></div>
          <div className="w-4 h-2 bg-black rounded-sm"></div>
          <div className="w-6 h-3 border border-black rounded-sm">
            <div className="w-4 h-2 bg-black rounded-sm m-0.5"></div>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="px-6 py-8">
        {/* 닫기 버튼 */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => router.push('/')}
            className="w-8 h-8 bg-white text-black rounded-full flex items-center justify-center text-lg font-bold"
            aria-label="닫기"
          >
            ×
          </button>
        </div>

        {/* 제목 */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-black mb-2">
            성향 분석 완료!
          </h1>
          <p className="text-lg text-gray-600">
            나의 성향이 담긴 티미 확인하기
          </p>
        </div>

        {/* 카드 영역 */}
        <div className="mb-8 flex justify-center">
          {currentTimiCard ? (
            <div className="w-48 h-64">
              <TimiCard
                name={currentTimiCard.name}
                front={currentTimiCard.front}
                back={currentTimiCard.back}
                initialFace="front"
              />
            </div>
          ) : (
            <div className="bg-gray-200 rounded-xl h-64 w-48 flex items-center justify-center">
              <div className="w-16 h-16 bg-white rounded-full border-2 border-blue-300 flex items-center justify-center">
                <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
              </div>
            </div>
          )}
        </div>

        {/* 티미 이름 표시 */}
        {currentTimiCard && (
          <div className="text-center mb-4">
            <h2 className="text-xl font-bold text-black">
              {currentTimiCard.name}
            </h2>
            {typeMeta && (
              <p className="text-sm text-gray-600 mt-1">
                {typeMeta.subtitle}
              </p>
            )}
          </div>
        )}

        {/* 액션 버튼들 */}
        <div className="space-y-4 mb-6">
          <div className="flex space-x-3">
            <button
              onClick={handleShareCard}
              className="flex-1 bg-gray-200 text-black py-3 rounded-lg font-medium flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
              </svg>
              <span>카드 공유</span>
            </button>
            <button
              onClick={handleSaveCard}
              className="flex-1 bg-orange-500 text-white py-3 rounded-lg font-medium flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l4-4m0 0l4 4m-4-4v12" />
              </svg>
              <span>카드 저장</span>
            </button>
          </div>
        </div>

        {/* 자세히 보기 링크 */}
        <div className="text-center">
          <button
            onClick={handleViewDetails}
            className="text-black underline text-lg font-medium hover:text-gray-600 transition-colors"
          >
            나의 성향 자세히 보기
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AnalysisCompletePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">결과를 불러오는 중...</p>
        </div>
      </div>
    }>
      <AnalysisCompleteContent />
    </Suspense>
  );
}
