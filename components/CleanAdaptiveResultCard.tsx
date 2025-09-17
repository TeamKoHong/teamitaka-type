'use client';

import { TypeMeta } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface CleanAdaptiveResultCardProps {
  typeMeta: TypeMeta;
  isDark?: boolean;
  className?: string;
  captureMode?: boolean;
  onRetest?: () => void;
}

export default function CleanAdaptiveResultCard({ 
  typeMeta, 
  isDark = false, 
  className = '',
  captureMode = false,
  onRetest
}: CleanAdaptiveResultCardProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  
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
        backgroundColor: '#000000',
        ...(captureMode && {
          width: '375px',
          minHeight: '600px',
          position: 'relative'
        })
      }}
    >
      {/* 저장용 콘텐츠 영역 */}
      <div 
        id="result-card-content"
        style={{ 
          backgroundColor: '#000000',
          fontFamily: 'Pretendard, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans KR", sans-serif',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
          color: '#ffffff',
          lineHeight: 1.6
        }}
      >
        {/* 메인 이미지 배경 */}
        <div className="relative w-full" style={{ aspectRatio: '9/16', minHeight: '600px' }}>
          {/* 적응티미 결과 이미지를 배경으로 사용 */}
          <img
            src="/assets/result/적응티미.png"
            alt={`${typeMeta.nickname} 결과`}
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              filter: 'brightness(1.0) contrast(1.0)'
            }}
          />
          
          {/* 최소한의 오버레이 - 이미지의 텍스트 가독성을 위해 */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.2) 100%)'
            }}
          />
          
          {/* 콘텐츠 오버레이 - 이미지 위에 최소한의 UI만 */}
          <div className="relative z-10 h-full flex flex-col">
            
            {/* 상단 빈 공간 - 이미지의 텍스트 영역 보존 */}
            <div className="flex-1"></div>
            
            {/* 하단 액션 영역만 표시 */}
            <div className="p-6 bg-gradient-to-t from-black/80 via-black/50 to-transparent">
              {/* 간단한 액션 버튼들만 표시 */}
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

      {/* 버튼 영역 - 이미지 하단에 중복 표시 */}
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
