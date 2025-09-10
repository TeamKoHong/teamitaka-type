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
  const [imageErrors, setImageErrors] = useState<{[key: string]: boolean}>({});
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
      
      const cardElement = document.getElementById('result-card-content');
      if (!cardElement) return;

      // 폰트 로딩 보장을 위한 대기
      await document.fonts.ready;

      // 모든 이미지 로딩 완료 대기
      const images = cardElement.querySelectorAll('img');
      await Promise.all(Array.from(images).map(img => {
        return new Promise((resolve) => {
          if (img.complete) resolve(null);
          else {
            img.onload = () => resolve(null);
            img.onerror = () => resolve(null);
          }
        });
      }));

      // 정확한 높이 계산 - 충분한 여백 확보
      const rect = cardElement.getBoundingClientRect();
      const computedStyle = window.getComputedStyle(cardElement);
      const scrollHeight = cardElement.scrollHeight;
      const offsetHeight = cardElement.offsetHeight;
      
      // 패딩과 마진을 고려한 실제 높이 계산
      const paddingTop = parseInt(computedStyle.paddingTop) || 0;
      const paddingBottom = parseInt(computedStyle.paddingBottom) || 0;
      const marginTop = parseInt(computedStyle.marginTop) || 0;
      const marginBottom = parseInt(computedStyle.marginBottom) || 0;
      
      const actualHeight = Math.max(scrollHeight, offsetHeight) + paddingTop + paddingBottom + marginTop + marginBottom + 100; // 100px 충분한 여백
      const actualWidth = Math.max(cardElement.offsetWidth, rect.width);

      console.log('Capture dimensions:', { 
        scrollHeight, 
        offsetHeight, 
        actualHeight, 
        actualWidth,
        padding: { paddingTop, paddingBottom },
        margin: { marginTop, marginBottom }
      });

      // html2canvas 고품질 옵션 설정
      const canvas = await html2canvas(cardElement, {
        scale: 3, // 고해상도 (2에서 3으로 향상)
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#333131',
        scrollX: 0,
        scrollY: 0,
        width: actualWidth,
        height: actualHeight,
        windowWidth: actualWidth,
        windowHeight: actualHeight,
        onclone: (clonedDoc: Document) => {
          // 복제된 문서 최적화
          const clonedCard = clonedDoc.getElementById('result-card-content');
          if (clonedCard) {
            // 기본 스타일 설정
            clonedCard.style.backgroundColor = '#333131';
            clonedCard.style.fontFamily = 'Pretendard, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans KR", sans-serif';
            clonedCard.style.boxSizing = 'border-box';
            clonedCard.style.overflow = 'visible';
            clonedCard.style.height = 'auto';
            clonedCard.style.minHeight = `${actualHeight}px`;
            clonedCard.style.paddingBottom = '50px'; // 하단 여백 확보
            clonedCard.style.color = '#ffffff';
            clonedCard.style.fontSize = '14px';
            clonedCard.style.lineHeight = '1.6';
            
            // 모든 하위 div 요소의 배경색 통일
            const allDivs = clonedCard.querySelectorAll('div');
            allDivs.forEach((div: HTMLElement) => {
              const currentBg = div.style.backgroundColor;
              if (!currentBg || currentBg === 'transparent') {
                const computedBg = window.getComputedStyle(div).backgroundColor;
                if (computedBg === 'rgba(0, 0, 0, 0)' || computedBg === 'transparent') {
                  div.style.backgroundColor = '#333131';
                }
              }
            });
            
            // 텍스트 요소들의 스타일 보장
            const textElements = clonedCard.querySelectorAll('p, h1, h2, h3, span');
            textElements.forEach((el) => {
              const htmlEl = el as HTMLElement;
              htmlEl.style.fontFamily = 'Pretendard, -apple-system, BlinkMacSystemFont, sans-serif';
              htmlEl.style.color = '#ffffff';
              htmlEl.style.fontWeight = htmlEl.style.fontWeight || 'normal';
              // 폰트 스무딩을 위한 CSS 속성 설정
              (htmlEl.style as any).webkitFontSmoothing = 'antialiased';
              (htmlEl.style as any).mozOsxFontSmoothing = 'grayscale';
            });

            // 특정 배경색을 가진 요소들 확인 및 둥근 모서리 보장
            const grayBoxes = clonedCard.querySelectorAll('[style*="#505050"]');
            grayBoxes.forEach((box) => {
              const htmlBox = box as HTMLElement;
              htmlBox.style.backgroundColor = '#505050';
              htmlBox.style.borderRadius = '0.5rem'; // rounded-lg와 동일한 값
              htmlBox.style.overflow = 'hidden'; // 둥근 모서리가 제대로 적용되도록
              htmlBox.style.boxSizing = 'border-box';
            });
            
            // TIP 카드와 하단 문구 박스에 특별히 borderRadius 강제 적용
            const tipCards = clonedCard.querySelectorAll('div[class*="rounded-lg"]');
            tipCards.forEach((card) => {
              const htmlCard = card as HTMLElement;
              htmlCard.style.borderRadius = '0.5rem';
              htmlCard.style.overflow = 'hidden';
              htmlCard.style.boxSizing = 'border-box';
              // 부모 요소도 확인
              const parent = htmlCard.parentElement;
              if (parent && parent.style.backgroundColor === '#505050') {
                parent.style.borderRadius = '0.5rem';
                parent.style.overflow = 'hidden';
              }
            });

            // 모든 rounded 클래스 요소에 borderRadius 강제 적용
            const roundedElements = clonedCard.querySelectorAll('.rounded-lg, .rounded');
            roundedElements.forEach((element) => {
              const htmlElement = element as HTMLElement;
              if (element.classList.contains('rounded-lg')) {
                htmlElement.style.borderRadius = '0.5rem';
              } else if (element.classList.contains('rounded')) {
                htmlElement.style.borderRadius = '0.25rem';
              }
            });
          }
          
          // body 스타일 최적화
          const body = clonedDoc.body;
          if (body) {
            body.style.margin = '0';
            body.style.padding = '0';
            body.style.backgroundColor = '#333131';
            body.style.fontFamily = 'Pretendard, -apple-system, BlinkMacSystemFont, sans-serif';
            body.style.overflow = 'visible';
            body.style.height = 'auto';
          }

          // html 요소 스타일
          const html = clonedDoc.documentElement;
          if (html) {
            html.style.backgroundColor = '#333131';
            html.style.height = 'auto';
          }
        }
      } as any);
      
      // 고품질 이미지 다운로드
      const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
      const link = document.createElement('a');
      link.download = `teamitaka-${typeMeta.nickname}-${today}.png`;
      
      // 최고 품질로 PNG 생성 (압축 없음)
      link.href = canvas.toDataURL('image/png', 1.0);
      
      // 다운로드 실행
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
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

  return (
    <div 
      id="result-card"
      className={`w-full max-w-md mx-auto text-white font-sans ${className}`}
      style={{
        fontFamily: 'Pretendard, Noto Sans KR, system-ui, sans-serif',
        backgroundColor: '#333131',
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
          backgroundColor: '#333131',
          fontFamily: 'Pretendard, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans KR", sans-serif',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
          color: '#ffffff',
          lineHeight: 1.6
        }}
      >
        {/* 헤더 영역 */}
      <div className="px-6 py-8 text-center" style={{ backgroundColor: '#333131' }}>
        <p className="text-sm text-white mb-4">어떤 환경에서도 제 역할을 해내는</p>
        <h1 
          className="text-3xl font-bold mb-6"
          style={{ color: accentColor }}
        >
          {typeMeta.nickname}
        </h1>
        
      </div>

      {/* 본문 설명 카드 */}
      <div className="px-6 mb-6">
        {currentTimiCard && !imageErrors[`${currentTimiCard.name}_1`] ? (
          <div className="mb-4">
            <img
              src={`/assets/detail/${currentTimiCard.name}_1.png`}
              alt={`${currentTimiCard.name} 상세 1`}
              className="w-full h-auto object-contain"
              onError={() => handleImageError(`${currentTimiCard.name}_1`)}
            />
          </div>
        ) : (
          <div className="h-48 mb-4 flex items-center justify-center">
            <div className="text-gray-500 text-sm">
              {currentTimiCard ? '이미지를 불러올 수 없습니다' : '이미지 영역'}
            </div>
          </div>
        )}
        <p className="text-sm leading-relaxed text-gray-300 mb-6">
          {typeMeta.description}
        </p>
        
        {/* 속성 바 이미지 */}
        <div className="mb-4">
          {currentTimiCard && !imageErrors[`${currentTimiCard.name}_attributes`] ? (
            <img
              src={`/assets/detail/${currentTimiCard.name}_2.png`}
              alt={`${currentTimiCard.name} 속성`}
              className="w-full h-auto object-contain"
              onError={() => handleImageError(`${currentTimiCard.name}_attributes`)}
            />
          ) : (
            <div className="w-full h-20 flex items-center justify-center">
              <div className="text-gray-500 text-sm">속성 이미지</div>
            </div>
          )}
        </div>
      </div>

      {/* 중간 구분 영역 */}
      <div className="px-6 mb-6">
        {/* 호환 티미 이미지 */}
        <div className="mb-4">
          {currentTimiCard && !imageErrors[`${currentTimiCard.name}_compatible`] ? (
            <img
              src={`/assets/detail/${currentTimiCard.name}_3.png`}
              alt={`${currentTimiCard.name} 호환 티미`}
              className="w-full h-auto object-contain"
              onError={() => handleImageError(`${currentTimiCard.name}_compatible`)}
            />
          ) : (
            <div className="w-full h-32 flex items-center justify-center">
              <div className="text-gray-500 text-sm">호환 티미 이미지</div>
            </div>
          )}
        </div>
        
        {/* 호환성 설명 박스 */}
        <div className="rounded-lg p-3 mb-4" style={{ backgroundColor: '#505050', borderRadius: '0.5rem' }}>
          <p className="text-xs text-white leading-relaxed text-center">
            {typeMeta.matchDescription}
          </p>
        </div>
      </div>

      {/* TIP 카드 */}
      <div className="px-6 mb-6">
        <div className="rounded-lg p-4" style={{ backgroundColor: '#505050', borderRadius: '0.5rem' }}>
          <h3 className="text-sm font-bold mb-4 text-white">
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
        <div className="px-6 mb-6">
          <div className="rounded-lg p-4" style={{ backgroundColor: '#505050', borderRadius: '0.5rem' }}>
            <p className="text-sm text-center text-white leading-relaxed">
              &ldquo;{typeMeta.quote}&rdquo;
            </p>
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