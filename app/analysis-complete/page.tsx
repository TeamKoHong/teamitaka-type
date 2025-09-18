'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { TYPE_METADATA } from '@/lib/types';
import { timiCards } from '@/lib/data/timiCards';

function AnalysisCompleteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [typeCode, setTypeCode] = useState<string>('');
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  useEffect(() => {
    const type = searchParams.get('type');
    if (type) {
      setTypeCode(type);
    }
  }, [searchParams]);

  const typeMeta = typeCode ? TYPE_METADATA[typeCode] : null;
  const currentTimiCard = typeMeta ? timiCards.find(card => 
    card.name === typeMeta.nickname
  ) : null;

  const handleViewDetails = () => {
    if (!typeCode) {
      console.error('Type code is missing');
      alert('결과 정보를 불러올 수 없습니다. 다시 시도해주세요.');
      return;
    }
    
    try {
      router.push(`/result/${encodeURIComponent(typeCode)}`);
    } catch (error) {
      console.error('Navigation failed:', error);
      alert('페이지 이동 중 오류가 발생했습니다.');
    }
  };

  const handleRetest = () => {
    try {
      router.push('/quiz');
    } catch (error) {
      console.error('Navigation to quiz failed:', error);
      alert('퀴즈 페이지로 이동 중 오류가 발생했습니다.');
    }
  };

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{ 
        fontFamily: 'Pretendard, sans-serif',
        height: '100vh',
        maxHeight: '100vh',
        backgroundColor: '#f2f2f2 !important'
      }}
    >

      
      {/* 상단 이미지 */}
      <div className="flex justify-center relative">
        <img
          src="/assets/analysis-complete/01.png"
          alt="성향 분석 완료"
          className="w-auto h-auto object-contain"
          onError={(e) => {
            console.error('Top image loading failed:', e.currentTarget.src);
            e.currentTarget.style.display = 'none';
          }}
        />
        {/* X 버튼 영역 - 이미지 우측 상단 */}
        <button
          onClick={() => router.push('/')}
          className="absolute top-4 right-4 w-8 h-8 bg-transparent hover:bg-gray-200 hover:bg-opacity-20 rounded-full transition-all duration-200 flex items-center justify-center"
          title="메인 페이지로 이동"
          style={{
            top: '16px',
            right: '16px'
          }}
        >
          <span className="text-transparent text-lg font-bold">×</span>
        </button>
      </div>

      {/* 메인 카드 영역 - 가운데 정렬 */}
      <div className="flex-1 flex items-center justify-center px-4 py-2">
        <div 
          className="relative"
          style={{
            width: '358px',
            height: '517px'
          }}
        >
          <div 
            className="relative cursor-pointer"
            style={{
              width: '100%',
              height: '100%',
              perspective: '1000px'
            }}
            onClick={() => {
              console.log('Card clicked, current isFlipped:', isFlipped);
              setIsFlipped(!isFlipped);
            }}
          >
            <div
              className="relative w-full h-full transition-transform duration-700 ease-in-out"
              style={{
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                transformStyle: 'preserve-3d'
              }}
            >
              {/* 카드 앞면 */}
              <div 
                className="absolute inset-0 w-full h-full"
                style={{
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden'
                }}
              >
                {currentTimiCard ? (
                  <img
                    src={`/assets/timi-cards/${currentTimiCard.name}카드_앞.png`}
                    alt={`${currentTimiCard.name} 캐릭터`}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      console.error('Character image loading failed:', e.currentTarget.src);
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300 rounded-2xl flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl mb-2">🎴</div>
                      <div className="text-gray-600">카드를 불러올 수 없습니다</div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* 카드 뒷면 */}
              <div 
                className="absolute inset-0 w-full h-full"
                style={{
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)'
                }}
              >
                {currentTimiCard ? (
                  <img
                    src={`/assets/timi-cards/${currentTimiCard.name}카드_뒤.png`}
                    alt={`${currentTimiCard.name} 뒷면`}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      console.error('Back image loading failed:', e.currentTarget.src);
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300 rounded-2xl flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl mb-2">🎴</div>
                      <div className="text-gray-600">카드 뒷면을 불러올 수 없습니다</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 하단 버튼 영역 */}
      <div className="w-full px-4 pt-8 pb-8">
        {/* 나의 성향 자세히 보기 버튼 */}
        <div className="w-full mb-4">
          <button
            onClick={handleViewDetails}
            disabled={!typeCode || !typeMeta}
            className="w-full bg-gray-800 text-white py-4 px-6 rounded-lg font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
          >
            나의 성향 자세히 보기 →
          </button>
        </div>
        
        {/* 테스트 다시하기 링크 */}
        <div className="text-center">
          <button
            onClick={handleRetest}
            className="text-gray-600 underline hover:text-gray-800 transition-colors text-sm font-medium"
          >
            테스트 다시하기
          </button>
        </div>
      </div>

      {/* 하단 홈 인디케이터 */}
      <div className="flex justify-center pb-2">
        <div className="w-32 h-1 bg-black rounded-full"></div>
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
          <p className="text-gray-600">결과를 불러오는 중...</p>
        </div>
      </div>
    }>
      <AnalysisCompleteContent />
    </Suspense>
  );
}