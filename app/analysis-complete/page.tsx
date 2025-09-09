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
    card.name === typeMeta.nickname || 
    card.name.includes(typeMeta.nickname?.replace('티미', '') || '')
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
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      {/* 닫기 버튼 */}
      <div className="absolute top-4 right-4">
        <button 
          onClick={() => router.push('/')}
          className="w-8 h-8 bg-white text-gray-500 rounded-full flex items-center justify-center text-xl hover:bg-gray-100 transition-colors"
        >
          ✕
        </button>
      </div>

      {/* 카드 영역 */}
      <div className="flex flex-col items-center space-y-6">
        {currentTimiCard ? (
          <div className="w-80 h-96 relative">
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
          </div>
        ) : (
          <div className="w-80 h-96 bg-gray-300 flex items-center justify-center">
            <div className="text-gray-500 text-2xl">?</div>
          </div>
        )}

        {/* 카드 이름 */}
        {currentTimiCard && (
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-1">
              {currentTimiCard.name}
            </h2>
            {typeMeta && (
              <p className="text-sm text-gray-600">
                {typeMeta.subtitle}
              </p>
            )}
          </div>
        )}


        {/* 뒤집기 버튼 */}
        {currentTimiCard && (
          <button 
            onClick={() => setShowBack(!showBack)}
            className="px-6 py-3 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 transition-colors"
          >
            {showBack ? '앞면 보기' : '뒷면 보기'}
          </button>
        )}

        {/* 하단 버튼들 */}
        <div className="space-y-3 w-full max-w-sm">
          <button
            onClick={handleViewDetails}
            className="w-full bg-gray-800 text-white py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
          >
            나의 성향 자세히 보기 →
          </button>
          
          <button
            onClick={handleRetest}
            className="w-full text-gray-500 underline font-medium hover:text-gray-600 transition-colors"
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