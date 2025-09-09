'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { TYPE_METADATA } from '@/lib/types';
import { timiCards } from '@/lib/data/timiCards';

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

  const handleRetest = () => {
    router.push('/quiz');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 메인 콘텐츠 */}
      <div className="px-6 py-8">
        {/* 제목과 닫기 버튼 */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-black mb-2">
              성향 분석 완료!
            </h1>
            <p className="text-lg text-gray-600">
              나의 성향이 담긴 티미 확인하기
            </p>
          </div>
          <button 
            onClick={() => router.push('/')}
            className="text-gray-500 text-xl"
          >
            ✕
          </button>
        </div>

        {/* 보라색 카드 */}
        <div className="bg-purple-500 rounded-2xl p-6 mb-8 relative overflow-hidden">
          {/* 배경 퍼즐 조각들 */}
          <div className="absolute top-4 right-4 w-16 h-16 border-2 border-purple-300 rounded-lg opacity-30"></div>
          <div className="absolute bottom-4 left-4 w-12 h-12 border-2 border-purple-300 rounded-lg opacity-30"></div>
          
          {/* MY TEAMI 섹션 */}
          <div className="mb-6">
            <div className="text-white text-sm font-medium mb-2">MY TEAMI</div>
            <div className="text-white text-sm mb-1">
              {typeMeta?.subtitle || "어떤 환경에서도 제 역할을 해내는"}
            </div>
            <div className="text-white text-2xl font-bold">
              {currentTimiCard?.name || "적응티미"}
            </div>
          </div>

          {/* 캐릭터 영역 */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              {/* 퍼즐 조각 캐릭터 */}
              <div className="w-24 h-24 bg-purple-600 rounded-lg relative">
                {/* 얼굴 */}
                <div className="absolute top-3 left-1/2 transform -translate-x-1/2">
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                    <div className="w-4 h-4 bg-black rounded-full"></div>
                  </div>
                </div>
                <div className="absolute top-3 left-1/2 transform -translate-x-1/2 ml-4">
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                    <div className="w-4 h-4 bg-black rounded-full"></div>
                  </div>
                </div>
                {/* 입 */}
                <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-8 h-4 border-2 border-white rounded-full border-t-0"></div>
              </div>
              
              {/* 손 */}
              <div className="absolute -left-2 top-8 w-4 h-6 bg-white rounded-full border-2 border-black"></div>
              <div className="absolute -right-2 top-8 w-4 h-6 bg-white rounded-full border-2 border-black"></div>
              
              {/* 발 */}
              <div className="absolute -left-1 -bottom-2 w-6 h-4 bg-white rounded-full border-2 border-black"></div>
              <div className="absolute -right-1 -bottom-2 w-6 h-4 bg-white rounded-full border-2 border-black"></div>
            </div>
          </div>

          {/* 티미 카드 뒷면 보기 버튼 */}
          <div className="text-center">
            <button className="text-white text-sm underline">
              티미 카드 뒷면 보기 &gt;
            </button>
          </div>
        </div>

        {/* 하단 버튼들 */}
        <div className="space-y-4">
          <button
            onClick={handleViewDetails}
            className="w-full bg-gray-800 text-white py-4 rounded-xl text-lg font-medium hover:bg-gray-700 transition-colors"
          >
            나의 성향 자세히 보기 →
          </button>
          
          <div className="text-center">
            <button
              onClick={handleRetest}
              className="text-gray-500 underline text-lg font-medium hover:text-gray-600 transition-colors"
            >
              테스트 다시하기
            </button>
          </div>
        </div>
      </div>

      {/* 하단 홈 인디케이터 */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-black rounded-full"></div>
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