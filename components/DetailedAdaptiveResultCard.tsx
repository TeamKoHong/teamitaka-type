'use client';

import { TypeMeta } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface DetailedAdaptiveResultCardProps {
  typeMeta: TypeMeta;
  isDark?: boolean;
  className?: string;
  captureMode?: boolean;
  onRetest?: () => void;
}

export default function DetailedAdaptiveResultCard({ 
  typeMeta, 
  isDark = false, 
  className = '',
  captureMode = false,
  onRetest
}: DetailedAdaptiveResultCardProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const accentColor = typeMeta.themeAccent || '#B97DEF';
  
  const handleSaveImage = async () => {
    if (isSaving) return;
    
    try {
      setIsSaving(true);
      
      // 적응티미 결과 이미지 경로
      const imagePath = `/assets/result/${typeMeta.nickname}.png`;
      const fileName = `${typeMeta.nickname}_result.png`;
      
      // 이미지를 fetch로 가져와서 다운로드
      const response = await fetch(imagePath);
      if (!response.ok) {
        throw new Error('이미지를 찾을 수 없습니다.');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      // 다운로드 링크 생성 및 클릭
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

  return (
    <div 
      id="result-card"
      className={`w-full max-w-md mx-auto text-white font-sans ${className}`}
      style={{
        fontFamily: 'Pretendard, Noto Sans KR, system-ui, sans-serif',
        backgroundColor: '#323030',
        ...(captureMode && {
          width: '375px',
          minHeight: '800px',
          position: 'relative'
        })
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
        {/* 메인 이미지 배경 */}
        <div className="relative w-full" style={{ aspectRatio: '9/16', minHeight: '800px' }}>
          {/* 적응티미 결과 이미지를 배경으로 사용 */}
          <img
            src="/assets/result/적응티미.png"
            alt={`${typeMeta.nickname} 결과`}
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              filter: 'brightness(0.9) contrast(1.05)'
            }}
          />
          
          {/* 오버레이 그라데이션 */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.6) 100%)'
            }}
          />
          
          {/* 콘텐츠 오버레이 */}
          <div className="relative z-10 p-6 h-full flex flex-col">
            
            {/* 상단 제목 영역 */}
            <div className="pt-8 text-center">
              <p className="result-subtitle text-white mb-2">
                {typeMeta.subtitle}
              </p>
              <h1 
                className="result-title mb-4"
                style={{ color: accentColor }}
              >
                {typeMeta.nickname}
              </h1>
              
              {/* 캐릭터 이미지 영역 */}
              <div className="mb-6">
                {/* 적응티미 캐릭터 이미지가 여기에 위치 */}
                <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                  <div className="text-6xl">🤖</div>
                </div>
              </div>
            </div>

            {/* 설명 영역 */}
            <div className="mb-8">
              <p className="result-description text-white text-center leading-relaxed">
                {typeMeta.description}
              </p>
            </div>

            {/* 속성 바 차트 영역 */}
            <div className="mb-8">
              <div className="space-y-4">
                {Object.entries(typeMeta.stats).map(([key, value]) => (
                  <div key={key} className="flex items-center space-x-3">
                    <div className="w-20 text-sm font-medium text-white">{key}</div>
                    <div className="flex-1 bg-gray-700 rounded-full h-3 overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-1000"
                        style={{ 
                          width: `${(value / 5) * 100}%`,
                          backgroundColor: accentColor
                        }}
                      />
                    </div>
                    <div className="w-8 text-sm text-white">{value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 호환 티미 영역 */}
            <div className="mb-8">
              <h3 className="result-section-title text-white mb-4 text-center">
                나와 잘 어울리는 티미 유형
              </h3>
              
              <div className="flex justify-center space-x-8 mb-4">
                {typeMeta.bestMatches.map((match, index) => (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                      <div className="text-2xl">⭐</div>
                    </div>
                    <p className="result-match-names text-white">{match.name}</p>
                  </div>
                ))}
              </div>
              
              {/* 시너지 설명 */}
              <div className="bg-black bg-opacity-50 rounded-lg p-4">
                <p className="result-synergy-text text-white text-center leading-relaxed">
                  {typeMeta.matchDescription}
                </p>
              </div>
            </div>

            {/* TIP 영역 */}
            <div className="flex-1">
              <h3 className="result-tip-title text-white mb-6 text-center" style={{ color: accentColor }}>
                {typeMeta.nickname} TIP
              </h3>
              
              <div className="space-y-4">
                {typeMeta.tips && typeMeta.tips.slice(0, 3).map((tip, index) => {
                  const [title, description] = tip.split('\n');
                  return (
                    <div key={index} className="bg-black bg-opacity-50 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <span className="result-tip-item-title text-white flex-shrink-0">{index + 1}.</span>
                        <div>
                          <p className="result-tip-item-title text-white mb-2">{title}</p>
                          {description && (
                            <p className="result-tip-item-description text-gray-300 leading-relaxed">{description}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* 하단 인용구 */}
            <div className="mt-8 mb-8">
              <div className="bg-black bg-opacity-50 rounded-lg p-4">
                <p className="result-quote text-white text-center leading-relaxed">
                  &ldquo;{typeMeta.quote}&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 캡처용 추가 여백 */}
        <div className="h-8"></div>

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
