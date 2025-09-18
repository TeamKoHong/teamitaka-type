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
      {/* 상단 상태바 영역 */}
      <div className="absolute top-0 left-0 w-full h-12 z-20">
        <div className="flex justify-between items-center px-4 pt-3">
          <div className="text-black font-semibold text-sm">9:41</div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-2 bg-black rounded-sm"></div>
            <div className="w-4 h-3 bg-black rounded-sm"></div>
            <div className="w-4 h-3 bg-black rounded-sm"></div>
          </div>
        </div>
      </div>

      {/* 상단 X 버튼 */}
      <div className="absolute top-16 left-4 z-10">
        <button
          onClick={() => router.push('/')}
          className="w-4 h-4 bg-transparent hover:bg-gray-300 rounded-full transition-all duration-200 flex items-center justify-center"
          title="메인 페이지로 이동"
        >
          <span className="text-black text-lg font-bold">×</span>
        </button>
      </div>
      
      {/* 제목 영역 */}
      <div className="text-center pt-20 pb-4 px-4">
        <h1 className="text-2xl font-bold text-black mb-2">
          성향 분석 완료!
        </h1>
        <p className="text-base text-black">
          나의 성향이 담긴 <span className="text-black">티미 확인하기</span>
        </p>
      </div>

      {/* 메인 카드 영역 - 가운데 정렬 */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div 
          className="relative"
          style={{
            width: '358px',
            height: '517px'
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
      </div>

      {/* 카드 뒷면 보기 버튼 */}
      <div className="flex justify-center mb-8">
        <button
          onClick={() => setShowBack(true)}
          className="text-black text-sm font-medium hover:text-gray-600 transition-colors flex items-center gap-2"
        >
          티미 카드 뒷면 보기
          <div className="w-1.5 h-2.5 bg-black"></div>
        </button>
      </div>

      {/* 하단 버튼 영역 */}
      <div className="w-full px-4 pb-8">
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

      {/* 카드 뒷면 모달 */}
      {showBack && currentTimiCard && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full relative">
            {/* 모달 닫기 버튼 */}
            <button
              onClick={() => setShowBack(false)}
              className="absolute top-4 right-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
            >
              <span className="text-gray-600 text-xl">×</span>
            </button>
            
            {/* 카드 뒷면 이미지 */}
            <div className="text-center">
              <img
                src={`/assets/timi-cards/${currentTimiCard.name}카드_뒤.png`}
                alt={`${currentTimiCard.name} 뒷면`}
                className="w-full h-auto object-contain rounded-xl"
                onError={(e) => {
                  console.error('Back image loading failed:', e.currentTarget.src);
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          </div>
        </div>
      )}
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