'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { TYPE_METADATA } from '@/lib/types';
import { timiCards } from '@/lib/data/timiCards';

function AnalysisCompleteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [typeCode, setTypeCode] = useState<string>('');
  const [showBack, setShowBack] = useState<boolean>(false);

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
    card.name === typeMeta.nickname
  ) : null;

  const handleViewDetails = () => {
    if (typeCode) {
      router.push(`/result/${encodeURIComponent(typeCode)}`);
    }
  };

  const handleRetest = () => {
    router.push('/quiz');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 sm:p-6">
      {/* 닫기 버튼 */}
      <div className="absolute top-4 right-4">
        <button 
          onClick={() => router.push('/')}
          className="w-8 h-8 bg-white text-gray-500 rounded-full flex items-center justify-center text-xl hover:bg-gray-100 transition-colors"
        >
          ✕
        </button>
      </div>

      {/* 제목 영역 */}
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">성향 분석 완료!</h1>
        <p className="text-base sm:text-lg text-gray-600 px-4">나의 성향이 담긴 티미 확인하기</p>
      </div>

      {/* 카드 영역 */}
      <div className="flex flex-col items-center space-y-6">
        {currentTimiCard ? (
          <button
            type="button"
            className="w-72 h-80 sm:w-80 sm:h-96 relative cursor-pointer transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-xl"
            onClick={() => setShowBack(!showBack)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setShowBack(!showBack);
              }
            }}
            aria-label={`티미 카드 ${showBack ? '앞면' : '뒷면'} 보기`}
            aria-pressed={showBack}
            title="카드를 클릭하여 뒤집기"
          >
            {/* 앞면 */}
            <div 
              className={`absolute inset-0 transition-all duration-500 ease-in-out ${
                showBack ? 'opacity-0 [transform:rotateY(180deg)]' : 'opacity-100 [transform:rotateY(0deg)]'
              }`}
            >
              <img
                src={currentTimiCard.front}
                alt={`${currentTimiCard.name} 앞면`}
                className="w-full h-full object-contain"
              />
            </div>
            
            {/* 뒷면 */}
            <div 
              className={`absolute inset-0 transition-all duration-500 ease-in-out ${
                showBack ? 'opacity-100 [transform:rotateY(0deg)]' : 'opacity-0 [transform:rotateY(-180deg)]'
              }`}
            >
              <img
                src={currentTimiCard.back}
                alt={`${currentTimiCard.name} 뒷면`}
                className="w-full h-full object-contain"
              />
            </div>
          </button>
        ) : (
          <div className="w-72 h-80 sm:w-80 sm:h-96 bg-gray-300 flex items-center justify-center rounded-xl">
            <div className="text-gray-500 text-2xl">?</div>
          </div>
        )}




        {/* 하단 버튼들 */}
        <div className="flex flex-col items-center space-y-4">
          <button
            onClick={handleViewDetails}
            className="bg-gray-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
          >
            나의 성향 자세히 보기 →
          </button>
          
          <button
            onClick={handleRetest}
            className="text-sm text-gray-600 underline hover:text-gray-700 transition-colors"
          >
            테스트 다시하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AnalysisCompletePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
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