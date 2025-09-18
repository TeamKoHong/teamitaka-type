'use client';

import { TypeMeta } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface UnifiedAdaptiveResultCardProps {
  typeMeta: TypeMeta;
  isDark?: boolean;
  className?: string;
  onRetest?: () => void;
}

export default function UnifiedAdaptiveResultCard({ 
  typeMeta, 
  isDark = false, 
  className = '',
  onRetest
}: UnifiedAdaptiveResultCardProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [imageErrors, setImageErrors] = useState<{[key: string]: boolean}>({});
  const accentColor = typeMeta.themeAccent || '#B97DEF';
  
  const handleSaveImage = async () => {
    if (isSaving) return;
    
    try {
      setIsSaving(true);
      
      // 모든 티미 타입에 대해 saved-image 폴더의 이미지 사용
      const imagePath = `/assets/saved-image/${typeMeta.nickname}.png`;
      const fileName = `${typeMeta.nickname}_result.png`;
      
      const response = await fetch(imagePath);
      if (!response.ok) {
        throw new Error('이미지를 찾을 수 없습니다.');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
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

  const handleImageError = (imageKey: string) => {
    setImageErrors(prev => ({ ...prev, [imageKey]: true }));
  };


  // 모든 티미 타입에 대해 통일된 레이아웃 사용
  return (
    <div 
      id="result-card"
      className={`w-full max-w-md mx-auto text-white font-sans ${className}`}
      style={{
        fontFamily: 'Pretendard, Noto Sans KR, system-ui, sans-serif',
        backgroundColor: '#323030'
      }}
    >
      {/* 저장용 콘텐츠 영역 */}
      <div 
        id="result-card-content"
        style={{ 
          backgroundColor: 'transparent',
          fontFamily: 'Pretendard, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans KR", sans-serif',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
          color: '#ffffff',
          lineHeight: 1.6
        }}
      >
        {/* 상단 top.png 이미지 */}
        <div className="mb-4 px-4">
          <img
            src="/assets/result/top.png"
            alt="Top"
            className="w-full h-auto object-contain"
          />
        </div>

        {/* 캐릭터 이미지 */}
        <div 
          className="px-4"
          style={{ marginBottom: 'clamp(24px, calc(48px * (100vw / 390px)), 72px)' }}
        >
          <img
            src={`/assets/result/${typeMeta.nickname}.png`}
            alt={typeMeta.nickname}
            className="w-full h-auto object-contain"
            onError={() => handleImageError(`${typeMeta.nickname}_main`)}
          />
        </div>

      </div>

      {/* 버튼 영역 */}
      <div className="px-6 pb-8">
        <div className="flex space-x-3">
          <button 
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: `나는 ${typeMeta.nickname}!`,
                  text: `TEAMITAKA 타입 테스트 결과: ${typeMeta.nickname}`,
                  url: window.location.href
                });
              }
            }}
            className="flex-1 bg-white py-3 rounded-lg text-sm font-medium flex items-center justify-center space-x-2"
            style={{ color: '#000' }}
          >
            <span>카드 공유</span>
            <img 
              src="/assets/result/share.svg" 
              alt="공유" 
              className="w-4 h-4"
            />
          </button>
          <button 
            onClick={handleSaveImage}
            disabled={isSaving}
            className="flex-1 py-3 rounded-lg text-sm font-medium flex items-center justify-center space-x-2 disabled:opacity-50 text-white"
            style={{ backgroundColor: '#FF6633' }}
          >
            <span>{isSaving ? '저장 중...' : '카드 저장'}</span>
            <img 
              src="/assets/result/download.svg" 
              alt="다운로드" 
              className="w-4 h-4"
            />
          </button>
        </div>
      </div>
    </div>
  );
}
