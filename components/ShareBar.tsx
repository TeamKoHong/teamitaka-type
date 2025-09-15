'use client';

import { useState } from 'react';

interface ShareBarProps {
  typeCode: string;
  nickname: string;
  onRetest: () => void;
  className?: string;
}

export default function ShareBar({ typeCode, nickname, onRetest, className = '' }: ShareBarProps) {
  const [isSharing, setIsSharing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleShare = async () => {
    setIsSharing(true);
    
    try {
      const shareData = {
        title: `나는 ${nickname}!`,
        text: `TEAMITAKA 타입 테스트 결과: ${nickname} - 나의 협업 타입을 확인해보세요!`,
        url: window.location.origin + `/result/${encodeURIComponent(typeCode)}`
      };

      // Web Share API 지원 여부 확인
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        showToast('공유가 완료되었습니다!');
      } else {
        // 폴백: 클립보드에 링크 복사
        await navigator.clipboard.writeText(shareData.url);
        showToast('링크가 복사되었습니다!');
      }
    } catch (error) {
      console.error('공유 실패:', error);
      
      // 클립보드 복사 폴백
      try {
        await navigator.clipboard.writeText(window.location.href);
        showToast('링크가 복사되었습니다!');
      } catch {
        showToast('공유에 실패했습니다.');
      }
    } finally {
      setIsSharing(false);
    }
  };

  const handleSaveImage = async () => {
    setIsSaving(true);

    try {
      // saved-image 폴더에 있는 이미지 경로
      const imagePath = `/assets/saved-image/${nickname}.png`;
      const fileName = `${nickname}.png`;
      
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
      
      showToast('이미지가 저장되었습니다!');

    } catch (error) {
      console.error('이미지 저장 실패:', error);
      showToast('이미지 저장에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className={`share-bar ${className}`}>
        <button
          onClick={handleShare}
          disabled={isSharing}
          className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 
                     bg-gray-100 hover:bg-gray-200 rounded-2xl transition-colors
                     dark:bg-gray-700 dark:hover:bg-gray-600
                     disabled:opacity-50"
        >
          {isSharing ? (
            <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
          )}
          <span className="text-responsive-button">카드 공유</span>
        </button>

        <button
          onClick={handleSaveImage}
          disabled={isSaving}
          className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 
                     btn-primary disabled:opacity-50"
        >
          {isSaving ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          )}
          <span className="text-responsive-button">이미지로 저장하기</span>
        </button>
      </div>

      {/* 다시하기 링크 */}
      <div className="text-center mt-4 mb-6">
        <button
          onClick={onRetest}
          className="text-primary hover:text-primary/80 underline text-responsive-small transition-colors"
        >
          테스트 다시하기
        </button>
      </div>

      {/* 토스트 알림 */}
      {toast && (
        <div className="toast animate-fade-in text-responsive-small">
          {toast}
        </div>
      )}
    </>
  );
}