'use client';

import { TypeMeta } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { timiCards } from '@/lib/data/timiCards';

interface ResultCardProps {
  typeMeta: TypeMeta;
  isDark?: boolean;
  className?: string;
  captureMode?: boolean;
  onRetest?: () => void;
}

export default function ResultCard({ 
  typeMeta, 
  isDark = false, 
  className = '',
  captureMode = false,
  onRetest
}: ResultCardProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const accentColor = typeMeta.themeAccent || '#C6A5FF';
  
  // 현재 티미의 카드 찾기
  const currentTimiCard = timiCards.find(card => 
    card.name === typeMeta.nickname || 
    card.name.includes(typeMeta.nickname?.replace('티미', '') || '')
  );

  const handleSaveImage = async () => {
    if (isSaving) return;
    
    try {
      setIsSaving(true);
      
      // html2canvas 동적 import
      const html2canvas = (await import('html2canvas')).default;
      
      const cardElement = document.getElementById('result-card');
      if (!cardElement) return;

      // html2canvas 옵션 설정
      const canvas = await html2canvas(cardElement, {
        scale: 2, // 고해상도
        useCORS: true,
        allowTaint: true,
        logging: false,
        width: 375,
        height: 600,
        onclone: (clonedDoc: Document) => {
          // 복제된 문서에서 캡쳐 모드 활성화
          const clonedCard = clonedDoc.getElementById('result-card');
          if (clonedCard) {
            clonedCard.style.boxSizing = 'border-box';
          }
        }
      } as any);
      
      // 이미지 다운로드
      const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
      const link = document.createElement('a');
      link.download = `teamitaka-${typeMeta.nickname}-${today}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
    } catch (error) {
      console.error('이미지 저장 실패:', error);
      alert('이미지 저장에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRetest = () => {
    if (onRetest) {
      onRetest();
    } else {
      router.push('/');
    }
  };

  return (
    <div 
      id="result-card"
      className={`w-full max-w-md mx-auto bg-black text-white font-sans ${className}`}
      style={{
        fontFamily: 'Pretendard, Noto Sans KR, system-ui, sans-serif',
        ...(captureMode && {
          width: '375px',
          minHeight: '600px',
          position: 'relative'
        })
      }}
    >
      {/* 상단 바 */}
      <div className="bg-black px-4 py-2 flex items-center justify-between text-white text-sm">
        <div className="flex items-center space-x-1">
          <span>9:41</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-4 h-2 bg-white rounded-sm"></div>
          <div className="w-4 h-2 bg-white rounded-sm"></div>
          <div className="w-4 h-2 bg-white rounded-sm"></div>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-4 h-2 bg-white rounded-sm"></div>
          <div className="w-4 h-2 bg-white rounded-sm"></div>
        </div>
      </div>

      {/* 헤더 영역 */}
      <div className="bg-black px-6 py-8 text-center">
        <p className="text-sm text-gray-300 mb-2">시작이 반이다! 빠른 실행력의 해결사</p>
        <h1 
          className="text-3xl font-bold"
          style={{ color: accentColor }}
        >
          {typeMeta.nickname}
        </h1>
      </div>

      {/* 본문 설명 카드 */}
      <div className="px-6 mb-6">
        {currentTimiCard ? (
          <div className="aspect-[3/2] rounded-lg mb-4 overflow-hidden">
            <img
              src={`/assets/detail/${currentTimiCard.name}_1.png`}
              alt={`${currentTimiCard.name} 상세 1`}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="bg-gray-300 aspect-[3/2] rounded-lg mb-4 flex items-center justify-center">
            <div className="text-gray-500 text-sm">이미지 영역</div>
          </div>
        )}
        <p className="text-sm leading-relaxed text-gray-300 mb-6">
          {typeMeta.description}
        </p>
        
        {/* 속성 바들 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">긍정력</span>
            <div className="w-24 h-2 bg-gray-700 rounded-full">
              <div className="h-full bg-purple-500 rounded-full" style={{ width: '75%' }}></div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">에너지</span>
            <div className="w-24 h-2 bg-gray-700 rounded-full">
              <div className="h-full bg-purple-500 rounded-full" style={{ width: '85%' }}></div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">인사력</span>
            <div className="w-24 h-2 bg-gray-700 rounded-full">
              <div className="h-full bg-purple-500 rounded-full" style={{ width: '60%' }}></div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">번개력</span>
            <div className="w-24 h-2 bg-gray-700 rounded-full">
              <div className="h-full bg-purple-500 rounded-full" style={{ width: '90%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* 중간 구분 영역 */}
      <div className="px-6 mb-6">
        {currentTimiCard ? (
          <div className="rounded-lg mb-4 overflow-hidden">
            <div className="grid grid-cols-2 gap-2">
              <div className="aspect-[3.5/1] overflow-hidden rounded-lg">
                <img
                  src={`/assets/detail/${currentTimiCard.name}_2.png`}
                  alt={`${currentTimiCard.name} 상세 2`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-[9/5] overflow-hidden rounded-lg">
                <img
                  src={`/assets/detail/${currentTimiCard.name}_3.png`}
                  alt={`${currentTimiCard.name} 상세 3`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-300 h-20 rounded-lg mb-4 flex items-center justify-center">
            <div className="text-gray-500 text-sm">추가 콘텐츠 영역</div>
          </div>
        )}
        <div className="bg-black text-white px-4 py-2 rounded-lg text-center mb-4">
          <span className="text-sm font-medium">나와 잘 어울리는 티미 유형</span>
        </div>
        
        {/* 호환 티미 캐릭터들 */}
        <div className="flex justify-center space-x-4 mb-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-400 rounded-full flex items-center justify-center mb-2">
              <div className="w-12 h-12 bg-orange-300 rounded-full flex items-center justify-center">
                <div className="w-8 h-8 bg-orange-200 rounded-full"></div>
              </div>
            </div>
            <span className="text-xs text-gray-300">활동티미</span>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mb-2">
              <div className="w-12 h-12 bg-yellow-300 rounded-full flex items-center justify-center">
                <div className="w-8 h-8 bg-yellow-200 rounded-full"></div>
              </div>
            </div>
            <span className="text-xs text-gray-300">긍정티미</span>
          </div>
        </div>
        
        <p className="text-xs text-gray-400 leading-relaxed text-center">
          {typeMeta.matchDescription}
        </p>
      </div>

      {/* TIP 카드 */}
      <div className="px-6 mb-6">
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-sm font-bold mb-4" style={{ color: accentColor }}>
            {typeMeta.nickname} TIP
          </h3>
          <div className="space-y-4">
            {typeMeta.tips && typeMeta.tips.slice(0, 3).map((tip, index) => {
              const [title, description] = tip.split('\n');
              return (
                <div key={index}>
                  <div className="flex items-start space-x-3">
                    <span className="text-sm font-bold text-white">{index + 1}.</span>
                    <div>
                      <p className="text-sm font-medium text-white mb-1">{title}</p>
                      {description && (
                        <p className="text-xs text-gray-300 leading-relaxed">{description}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 하단 문구 */}
      <div className="px-6 mb-8">
        <p className="text-sm text-center text-gray-300 italic leading-relaxed">
          {typeMeta.quote}
        </p>
      </div>

      {/* 버튼 영역 */}
      <div className="px-6 pb-8">
        <div className="flex space-x-3">
          <button 
            onClick={() => {
              // 카드 공유 기능
              if (navigator.share) {
                navigator.share({
                  title: `나는 ${typeMeta.nickname}!`,
                  text: `TEAMITAKA 타입 테스트 결과: ${typeMeta.nickname}`,
                  url: window.location.href
                });
              }
            }}
            className="flex-1 bg-white py-3 rounded-lg text-sm font-medium flex items-center justify-center space-x-2"
            style={{ color: '#333' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            <span>카드 공유</span>
          </button>
          <button 
            onClick={handleSaveImage}
            disabled={isSaving}
            className="flex-1 bg-orange-500 py-3 rounded-lg text-sm font-medium flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l4-4m0 0l4 4m-4-4v12" />
            </svg>
            <span>{isSaving ? '저장 중...' : '카드 저장'}</span>
          </button>
        </div>
      </div>

      {/* 하단 안내 */}
      {captureMode && (
        <div className="mt-8 pt-6 border-t border-gray-700 text-center">
          <p className="text-xs text-gray-500">
            TEAMITAKA 타입 테스트 • type.teamitaka.com
          </p>
          <p className="text-xs text-gray-600 mt-1">
            유형은 절대적 기준이 아니라 참고 지표예요
          </p>
        </div>
      )}
    </div>
  );
}