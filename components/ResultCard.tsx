'use client';

import { TypeMeta } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

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
      className={`w-full max-w-sm mx-auto bg-black text-white font-sans ${className}`}
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
        <div className="bg-gray-300 h-32 rounded-lg mb-4 flex items-center justify-center">
          <div className="text-gray-500 text-sm">이미지 영역</div>
        </div>
        <p className="text-sm leading-relaxed text-gray-300">
          {typeMeta.description}
        </p>
      </div>

      {/* 중간 구분 영역 */}
      <div className="px-6 mb-6">
        <div className="bg-gray-300 h-20 rounded-lg mb-4 flex items-center justify-center">
          <div className="text-gray-500 text-sm">추가 콘텐츠 영역</div>
        </div>
        <div className="bg-black text-white px-4 py-2 rounded-lg text-center">
          <span className="text-sm font-medium">나와 잘 어울리는 티미 유형</span>
        </div>
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
      <div className="px-6 pb-8 space-y-4">
        <button 
          onClick={handleSaveImage}
          disabled={isSaving}
          className="w-full bg-white py-3 rounded-full text-sm font-medium disabled:opacity-50"
          style={{ color: '#FF4D4D' }}
        >
          {isSaving ? '저장 중...' : '이미지로 저장하기'}
        </button>
        <button 
          onClick={handleRetest}
          className="w-full text-gray-400 text-sm underline"
        >
          테스트 다시하기
        </button>
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