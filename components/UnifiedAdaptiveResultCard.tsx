'use client';

import { TypeMeta } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { timiCards } from '@/lib/data/timiCards';

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
  
  // 적응티미인지 확인
  const isAdaptive = typeMeta.nickname === '적응티미';
  
  // 현재 티미의 카드 찾기
  const currentTimiCard = timiCards.find(card => 
    card.name === typeMeta.nickname || 
    card.name.includes(typeMeta.nickname?.replace('티미', '') || '')
  );
  
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

  // 적응티미일 때는 단일 이미지 사용
  if (isAdaptive) {
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
          <div className="mb-4">
            <img
              src="/assets/result/top.png"
              alt="Top"
              className="w-full h-auto object-contain"
            />
          </div>

          {/* 적응티미 단일 이미지 */}
          <div className="mb-4">
            <img
              src="/assets/result/적응티미.png"
              alt="적응티미"
              className="w-full h-auto object-contain"
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
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
              <span>카드 공유</span>
            </button>
            <button 
              onClick={handleSaveImage}
              disabled={isSaving}
              className="flex-1 py-3 rounded-lg text-sm font-medium flex items-center justify-center space-x-2 disabled:opacity-50 text-white"
              style={{ backgroundColor: '#FF6633' }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>{isSaving ? '저장 중...' : '카드 저장'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 적응티미가 아닐 때는 기존 ResultCard 구조 사용
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
          backgroundColor: '#323030',
          fontFamily: 'Pretendard, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans KR", sans-serif',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
          color: '#ffffff',
          lineHeight: 1.6
        }}
      >
        {/* 헤더 영역 */}
        <div className="px-6 py-8 text-center">
          <p className="text-responsive-small text-white mb-4">{typeMeta.subtitle}</p>
          <h1 
            className="font-bold mb-6 text-responsive-question"
            style={{ 
              color: accentColor,
              fontSize: 'clamp(24px, calc(30px * (100vw / 390px)), 36px)'
            }}
          >
            {typeMeta.nickname}
          </h1>
          
          {/* 캐릭터 이미지 표시 */}
          {currentTimiCard && !imageErrors[`${currentTimiCard.name}_1`] && (
            <div className="mb-4">
              <img
                src={`/assets/detail/${currentTimiCard.name}_1.png`}
                alt={`${currentTimiCard.name} 상세 1`}
                className="w-full h-auto object-contain"
                onError={() => handleImageError(`${currentTimiCard.name}_1`)}
              />
            </div>
          )}
        </div>

        {/* 본문 설명 카드 */}
        <div className="px-6 mb-6">
          <p className="text-responsive-small leading-relaxed text-gray-300 mb-6">
            {typeMeta.description}
          </p>
          
          {/* 속성 바 이미지 */}
          {currentTimiCard && !imageErrors[`${currentTimiCard.name}_attributes`] && (
            <div className="mb-4">
              <img
                src={`/assets/detail/${currentTimiCard.name}_2.png`}
                alt={`${currentTimiCard.name} 속성`}
                className="w-full h-auto object-contain"
                onError={() => handleImageError(`${currentTimiCard.name}_attributes`)}
              />
            </div>
          )}
        </div>

        {/* 중간 구분 영역 */}
        <div className="px-6 mb-6">
          {/* 호환 티미 이미지 */}
          {currentTimiCard && !imageErrors[`${currentTimiCard.name}_compatible`] && (
            <div className="mb-4">
              <img
                src={`/assets/detail/${currentTimiCard.name}_3.png`}
                alt={`${currentTimiCard.name} 호환 티미`}
                className="w-full h-auto object-contain"
                onError={() => handleImageError(`${currentTimiCard.name}_compatible`)}
              />
            </div>
          )}
          
          {/* 호환성 설명 박스 */}
          <div className="rounded-lg p-3 mb-4" style={{ backgroundColor: 'rgba(80, 80, 80, 0.8)', borderRadius: '0.5rem' }}>
            <p className="text-xs text-white leading-relaxed text-center">
              {typeMeta.matchDescription}
            </p>
          </div>
        </div>

        {/* TIP 카드 */}
        <div className="px-6 mb-6">
          <div className="rounded-lg p-4" style={{ backgroundColor: 'rgba(80, 80, 80, 0.8)', borderRadius: '0.5rem' }}>
            <h3 className="text-sm font-bold mb-4 text-white" style={{ color: accentColor }}>
              {typeMeta.nickname} TIP
            </h3>
            <div className="space-y-4">
              {typeMeta.tips && typeMeta.tips.slice(0, 3).map((tip, index) => {
                const [title, description] = tip.split('\n');
                return (
                  <div key={index}>
                    <div className="flex items-start space-x-3">
                      <span className="text-responsive-small font-bold text-white">{index + 1}.</span>
                      <div>
                        <p className="text-responsive-small font-medium text-white mb-1">{title}</p>
                        {description && (
                          <p className="text-responsive-small text-gray-300 leading-relaxed">{description}</p>
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
        <div className="px-6 mb-6">
          <div className="rounded-lg p-4" style={{ backgroundColor: 'rgba(80, 80, 80, 0.8)', borderRadius: '0.5rem' }}>
            <p className="text-responsive-small text-center text-white leading-relaxed">
              &ldquo;{typeMeta.quote}&rdquo;
            </p>
          </div>
        </div>

        {/* 캡처용 추가 여백 */}
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
            style={{ color: '#000' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
            <span>카드 공유</span>
          </button>
          <button 
            onClick={handleSaveImage}
            disabled={isSaving}
            className="flex-1 py-3 rounded-lg text-sm font-medium flex items-center justify-center space-x-2 disabled:opacity-50 text-white"
            style={{ backgroundColor: '#FF6633' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>{isSaving ? '저장 중...' : '카드 저장'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
