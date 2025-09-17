'use client';

import { TypeMeta } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

interface MinimalAdaptiveResultCardProps {
  typeMeta: TypeMeta;
  isDark?: boolean;
  className?: string;
  captureMode?: boolean;
  onRetest?: () => void;
}

export default function MinimalAdaptiveResultCard({ 
  typeMeta, 
  isDark = false, 
  className = '',
  captureMode = false,
  onRetest
}: MinimalAdaptiveResultCardProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);
  
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

  // 이미지 로드 확인
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImageLoaded(true);
    };
    img.onerror = () => {
      console.error('배경 이미지 로드 실패');
      setImageLoaded(true); // 로딩 인디케이터는 숨김
    };
    img.src = '/assets/result/적응티미.png';
  }, []);

  return (
    <div 
      id="result-card"
      className={`w-full max-w-md mx-auto text-white font-sans ${className}`}
      style={{
        fontFamily: 'Pretendard, Noto Sans KR, system-ui, sans-serif',
        backgroundColor: '#323030',
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
          backgroundColor: '#323030',
          fontFamily: 'Pretendard, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans KR", sans-serif',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
          color: '#ffffff',
          lineHeight: 1.6
        }}
      >
        {/* 메인 이미지 - 이미지에 모든 정보가 포함되어 있음 */}
        <div 
          ref={imageRef}
          className="relative w-full bg-black rounded-lg overflow-hidden" 
          style={{ 
            aspectRatio: '9/16', 
            minHeight: '600px',
            backgroundImage: 'url(/assets/result/적응티미.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
            backgroundRepeat: 'no-repeat'
          }}
        >
          {/* 이미지 로딩 상태 표시 */}
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
              <div className="text-white text-center">
                <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-sm">이미지 로딩 중...</p>
              </div>
            </div>
          )}
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

      {/* 버튼 영역 - 이미지 하단 */}
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
