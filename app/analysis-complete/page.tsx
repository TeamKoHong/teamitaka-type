'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense, useCallback } from 'react';
import { TYPE_METADATA } from '@/lib/types';
import { timiCards } from '@/lib/data/timiCards';
import { useBrowserOptimization } from '@/lib/hooks/useBrowserOptimization';
import { useViewportHeight } from '@/lib/hooks/useViewportHeight';
import { useSafariViewport } from '@/lib/hooks/useSafariViewport';

interface DiagnosticIssue {
  type: 'error' | 'warning' | 'success';
  message: string;
}

interface DiagnosticResults {
  timestamp: string;
  url: string;
  userAgent: string;
  viewport: string;
  issues: DiagnosticIssue[];
  status: 'checking' | 'error' | 'success';
}

interface CardSize {
  width: number;
  height: number;
}

interface BrowserInfo {
  isSafari: boolean;
  isChrome: boolean;
  isFirefox: boolean;
  isMobile: boolean;
  isIOS: boolean;
  isAndroid: boolean;
}

// 반응형 카드 훅
const useResponsiveCard = () => {
  const [cardSize, setCardSize] = useState<CardSize>({ width: 320, height: 400 });
  const [browserInfo, setBrowserInfo] = useState<BrowserInfo>({
    isSafari: false,
    isChrome: false,
    isFirefox: false,
    isMobile: false,
    isIOS: false,
    isAndroid: false
  });

  useEffect(() => {
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    
    // 브라우저 및 플랫폼 감지
    const newBrowserInfo: BrowserInfo = {
      isSafari: /Safari/.test(userAgent) && !/Chrome/.test(userAgent),
      isChrome: /Chrome/.test(userAgent) && !/Edg/.test(userAgent),
      isFirefox: /Firefox/.test(userAgent),
      isMobile: /Mobi|Android/i.test(userAgent),
      isIOS: /iPad|iPhone|iPod/.test(userAgent),
      isAndroid: /Android/.test(userAgent)
    };
    
    setBrowserInfo(newBrowserInfo);

    // 실제 뷰포트 높이 설정 (Safari 주소창 대응)
    const setViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    // 화면 크기에 따른 카드 사이즈 조정
    const updateCardSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      let newSize: CardSize;
      
      if (width <= 320) {
        // 초소형 디바이스 (Galaxy Fold 접힌 상태)
        newSize = { width: 240, height: 280 };
      } else if (width <= 375) {
        // iPhone SE, iPhone 12 mini
        newSize = { width: 280, height: 320 };
      } else if (width <= 414) {
        // 대부분의 모바일
        newSize = { width: 320, height: 380 };
      } else if (width <= 430) {
        // iPhone 14 Pro Max, iPhone 15 Plus
        newSize = { width: 340, height: 400 };
      } else if (width <= 768) {
        // 큰 모바일, 작은 태블릿
        newSize = { width: 360, height: 420 };
      } else {
        // 태블릿, 데스크톱
        newSize = { width: 400, height: 480 };
      }
      
      setCardSize(newSize);
    };

    const handleResize = () => {
      updateCardSize();
      setViewportHeight();
    };

    const handleOrientationChange = () => {
      // 방향 전환 시 약간의 지연을 두고 사이즈 재계산
      setTimeout(() => {
        updateCardSize();
        setViewportHeight();
      }, 100);
    };

    // 초기 실행
    updateCardSize();
    setViewportHeight();

    // 이벤트 리스너 등록
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  return { cardSize, browserInfo };
};

function AnalysisCompleteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [typeCode, setTypeCode] = useState<string>('');
  const [showBack, setShowBack] = useState<boolean>(false);
  const [diagnostics, setDiagnostics] = useState<DiagnosticResults | null>(null);
  
  // 반응형 카드 훅 사용
  const { cardSize, browserInfo } = useResponsiveCard();
  const browserOptimization = useBrowserOptimization();
  const viewportHeight = useViewportHeight();
  const { viewportHeight: safariVh, isSafari } = useSafariViewport();

  // 브라우저별 클래스 생성
  const getCardClasses = useCallback(() => {
    let classes = `relative cursor-pointer transition-transform duration-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${browserOptimization.layoutClass}`;
    
    // 호버 효과는 데스크톱에서만
    if (!browserInfo.isMobile) {
      classes += " hover:scale-105";
    }
    
    return classes;
  }, [browserInfo, browserOptimization]);

  // 터치 이벤트 최적화
  const handleCardTouch = useCallback((e: React.TouchEvent) => {
    if (browserInfo.isSafari || browserInfo.isIOS) {
      e.preventDefault(); // Safari에서 더블탭 줌 방지
    }
    
    const target = e.currentTarget as HTMLElement;
    
    if (e.type === 'touchstart') {
      target.style.transform = 'scale(0.98)';
    } else if (e.type === 'touchend') {
      target.style.transform = '';
      setShowBack(!showBack);
    }
  }, [browserInfo, showBack]);

  // 이미지 preloading 최적화
  const preloadImageForBrowser = useCallback((src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      // Safari에서 CORS 이슈 방지
      if (browserInfo.isSafari) {
        img.crossOrigin = 'anonymous';
      }
      
      img.onload = () => {
        // Safari에서 이미지 캐싱 강제
        if (browserInfo.isSafari) {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (ctx) {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
          }
        }
        resolve();
      };
      
      img.onerror = reject;
      img.src = src;
    });
  }, [browserInfo]);

  // 진단 함수
  const runDiagnostics = useCallback((): DiagnosticResults => {
    const results: DiagnosticResults = {
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      issues: [],
      status: 'checking'
    };

    // 1. URL 파라미터 체크
    const urlParams = new URLSearchParams(window.location.search);
    const typeParam = urlParams.get('type');
    
    if (!typeParam) {
      results.issues.push({ type: 'error', message: 'URL에 type 파라미터가 없습니다' });
    } else if (!TYPE_METADATA[typeParam]) {
      results.issues.push({ type: 'error', message: `유효하지 않은 타입 코드: ${typeParam}` });
    } else {
      results.issues.push({ type: 'success', message: `타입 파라미터 정상: ${typeParam}` });
    }

    // 2. 데이터 매칭 체크
    const typeMeta = typeParam ? TYPE_METADATA[typeParam] : null;
    const card = timiCards.find(c => c.name === typeMeta?.nickname);
    
    if (!card && typeMeta) {
      results.issues.push({ type: 'error', message: `카드 데이터 매칭 실패: ${typeMeta.nickname}` });
    } else if (card) {
      results.issues.push({ type: 'success', message: `카드 데이터 매칭 성공: ${card.name}` });
    }

    // 3. 반응형 체크
    const isMobile = window.innerWidth < 768;
    if (isMobile && window.innerWidth < 320) {
      results.issues.push({ type: 'warning', message: '화면이 너무 작아 일부 요소가 잘릴 수 있습니다' });
    }

    // 4. 브라우저 호환성 체크
    if (browserInfo.isSafari) {
      results.issues.push({ type: 'success', message: 'Safari 최적화 적용됨' });
    }
    
    if (browserInfo.isChrome) {
      results.issues.push({ type: 'success', message: 'Chrome 성능 최적화 적용됨' });
    }
    
    if (browserInfo.isFirefox) {
      results.issues.push({ type: 'success', message: 'Firefox 호환성 적용됨' });
    }
    
    // 5. 모바일 최적화 체크
    if (browserInfo.isMobile) {
      results.issues.push({ type: 'success', message: '모바일 터치 최적화 활성' });
    }

    results.status = results.issues.some(issue => issue.type === 'error') ? 'error' : 'success';
    return results;
  }, [browserInfo]);

  useEffect(() => {
    // URL에서 타입 코드 가져오기
    const type = searchParams.get('type');
    if (type) {
      setTypeCode(type);
    }

    // 진단 실행
    if (typeof window !== 'undefined') {
      const diagnosticResults = runDiagnostics();
      setDiagnostics(diagnosticResults);
      
      // 개발 환경에서만 콘솔 출력
      if (process.env.NODE_ENV === 'development') {
        console.group('🔍 Analysis Complete 페이지 진단 결과');
        console.log('기본 정보:', diagnosticResults);
        diagnosticResults.issues.forEach((issue: DiagnosticIssue) => {
          const icon = issue.type === 'error' ? '❌' : issue.type === 'warning' ? '⚠️' : '✅';
          console.log(`${icon} ${issue.message}`);
        });
        console.groupEnd();
      }
    }
  }, [searchParams, runDiagnostics]);

  // 타입 메타데이터와 티미 카드 찾기
  const typeMeta = typeCode ? TYPE_METADATA[typeCode] : null;
  const currentTimiCard = typeMeta ? timiCards.find(card => 
    card.name === typeMeta.nickname
  ) : null;

  // 이미지 preloading (브라우저 최적화)
  useEffect(() => {
    if (currentTimiCard) {
      const preloadImages = [currentTimiCard.front, currentTimiCard.back];
      preloadImages.forEach(async (src) => {
        try {
          await preloadImageForBrowser(src);
          process.env.NODE_ENV === 'development' && console.log(`Preloaded: ${src}`);
        } catch (error) {
          console.error(`Failed to preload: ${src}`, error);
        }
      });
    }
  }, [currentTimiCard, preloadImageForBrowser]);

  const handleViewDetails = () => {
    if (!typeCode) {
      console.error('Type code is missing');
      alert('결과 정보를 불러올 수 없습니다. 다시 시도해주세요.');
      return;
    }
    
    try {
      router.push(`/result/${encodeURIComponent(typeCode)}`);
    } catch (error) {
      console.error('Navigation failed:', error);
      alert('페이지 이동 중 오류가 발생했습니다.');
    }
  };

  const handleRetest = () => {
    try {
      router.push('/quiz');
    } catch (error) {
      console.error('Navigation to quiz failed:', error);
      alert('퀴즈 페이지로 이동 중 오류가 발생했습니다.');
    }
  };

  return (
    <div 
      className={`flex flex-col items-center justify-center p-4 sm:p-6 ${
        isSafari ? 'safari-dynamic-height' : 'min-h-screen'
      }`}
      style={{
        backgroundColor: '#323030',
        ...(isSafari && {
          height: `calc(var(--vh, 1vh) * 100)`,
          minHeight: `calc(var(--vh, 1vh) * 100)`
        })
      }}
    >
      {/* 개발 환경 진단 정보 */}
      {process.env.NODE_ENV === 'development' && diagnostics && (
        <div className="fixed top-4 left-4 bg-white p-3 rounded-lg shadow-lg text-xs max-w-xs z-50">
          <div className="font-bold mb-2 flex items-center gap-2">
            🔍 진단 정보
            <span className={`px-2 py-1 rounded text-white text-xs ${
              diagnostics.status === 'error' ? 'bg-red-500' : 'bg-green-500'
            }`}>
              {diagnostics.status}
            </span>
          </div>
          <div className="space-y-1">
            <div>화면: {diagnostics.viewport}</div>
            <div>타입: {typeCode || 'None'}</div>
            <div>브라우저: {
              browserInfo.isSafari ? 'Safari' :
              browserInfo.isChrome ? 'Chrome' :
              browserInfo.isFirefox ? 'Firefox' : 'Other'
            }</div>
            <div>플랫폼: {
              browserInfo.isIOS ? 'iOS' :
              browserInfo.isAndroid ? 'Android' :
              browserInfo.isMobile ? 'Mobile' : 'Desktop'
            }</div>
            <div>카드크기: {cardSize.width}×{cardSize.height}</div>
            <div>문제: {diagnostics.issues.filter((i: DiagnosticIssue) => i.type === 'error').length}개</div>
          </div>
          <details className="mt-2">
            <summary className="cursor-pointer text-blue-600">상세보기</summary>
            <div className="mt-1 space-y-1">
              {diagnostics.issues.map((issue: DiagnosticIssue, index: number) => (
                <div key={index} className={`text-xs ${
                  issue.type === 'error' ? 'text-red-600' : 
                  issue.type === 'warning' ? 'text-yellow-600' : 'text-green-600'
                }`}>
                  {issue.type === 'error' ? '❌' : issue.type === 'warning' ? '⚠️' : '✅'} {issue.message}
                </div>
              ))}
            </div>
          </details>
        </div>
      )}

      {/* 닫기 버튼 - Safe Area 대응 */}
      <div 
        className="absolute right-4 z-40"
        style={{
          top: browserInfo.isIOS 
            ? `max(1rem, calc(env(safe-area-inset-top) + 0.5rem))` 
            : '1rem'
        }}
      >
        <button 
          onClick={() => router.push('/')}
          className="w-8 h-8 bg-white text-gray-500 rounded-full flex items-center justify-center text-xl hover:bg-gray-100 transition-colors shadow-md"
        >
          ✕
        </button>
      </div>

      {/* 01.png 이미지 */}
      <div className="text-center mb-6 sm:mb-8">
        <img
          src="/assets/analysis-complete/01.png"
          alt="성향 분석 완료!"
          className="w-full h-auto object-contain mx-auto"
          style={{ maxWidth: '300px' }}
        />
      </div>

      {/* 카드 영역 */}
      <div className="flex flex-col items-center space-y-6">
        {currentTimiCard ? (
          <button
            type="button"
            className={getCardClasses()}
            style={{
              width: cardSize.width,
              height: cardSize.height,
              // Safari 최적화
              ...(browserInfo.isSafari && {
                WebkitTransform: 'translateZ(0)',
                WebkitBackfaceVisibility: 'hidden',
                WebkitPerspective: '1000px'
              }),
              // Chrome 최적화
              ...(browserInfo.isChrome && {
                willChange: 'transform',
                contain: 'layout style paint'
              })
            }}
            onClick={browserInfo.isMobile ? undefined : () => setShowBack(!showBack)}
            onTouchStart={browserInfo.isMobile ? handleCardTouch : undefined}
            onTouchEnd={browserInfo.isMobile ? handleCardTouch : undefined}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setShowBack(!showBack);
              }
            }}
            aria-label={`티미 카드 ${showBack ? '앞면' : '뒷면'} 보기`}
            aria-pressed={showBack}
            title="카드를 클릭하여 뒤집기"
          >
            {/* 앞면 */}
            <div 
              className={`absolute inset-0 transition-all duration-500 ease-in-out ${
                showBack ? 'opacity-0 [transform:rotateY(180deg)]' : 'opacity-100 [transform:rotateY(0deg)]'
              }`}
            >
              <img
                src={currentTimiCard.front}
                alt={`${currentTimiCard.name} 앞면`}
                className={`w-full h-full object-contain ${browserOptimization.imageClass}`}
                onError={(e) => {
                  console.error('Front image loading failed:', e.currentTarget.src);
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.parentElement?.querySelector('.fallback-front') as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
                onLoad={() => process.env.NODE_ENV === 'development' && console.log('Front image loaded successfully')}
              />
              <div className="fallback-front hidden w-full h-full bg-gray-200 flex items-center justify-center rounded-xl">
                <div className="text-center">
                  <div className="text-4xl mb-2">🎴</div>
                  <div className="text-gray-300">이미지를 불러올 수 없습니다</div>
                </div>
              </div>
            </div>
            
            {/* 뒷면 */}
            <div 
              className={`absolute inset-0 transition-all duration-500 ease-in-out ${
                showBack ? 'opacity-100 [transform:rotateY(0deg)]' : 'opacity-0 [transform:rotateY(-180deg)]'
              }`}
            >
              <img
                src={currentTimiCard.back}
                alt={`${currentTimiCard.name} 뒷면`}
                className={`w-full h-full object-contain ${browserOptimization.imageClass}`}
                onError={(e) => {
                  console.error('Back image loading failed:', e.currentTarget.src);
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.parentElement?.querySelector('.fallback-back') as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
                onLoad={() => process.env.NODE_ENV === 'development' && console.log('Back image loaded successfully')}
              />
              <div className="fallback-back hidden w-full h-full bg-gray-200 flex items-center justify-center rounded-xl">
                <div className="text-center">
                  <div className="text-4xl mb-2">🎴</div>
                  <div className="text-gray-300">이미지를 불러올 수 없습니다</div>
                </div>
              </div>
            </div>
          </button>
        ) : (
          <div 
            className="bg-gray-300 flex flex-col items-center justify-center rounded-xl"
            style={{
              width: cardSize.width,
              height: cardSize.height
            }}
          >
            <div className="text-gray-400 mb-4" style={{ fontSize: Math.min(cardSize.width * 0.15, 60) }}>❓</div>
            <div className="text-gray-300 text-center px-4">
              <div 
                className="font-medium mb-2 text-responsive-header"
              >
                결과를 불러올 수 없습니다
              </div>
              <div 
                className="text-responsive-small"
              >
                {!typeCode 
                  ? 'URL 파라미터가 없습니다' 
                  : !typeMeta 
                  ? '유효하지 않은 타입 코드입니다'
                  : '카드 정보를 찾을 수 없습니다'
                }
              </div>
            </div>
          </div>
        )}

        {/* 하단 버튼들 - Safari 대응 */}
        <div 
          className={`flex flex-col items-center space-y-4 w-full max-w-sm ${
            isSafari ? 'safari-bottom-safe' : ''
          }`}
          style={{
            ...(isSafari ? {} : {
              paddingBottom: browserInfo.isMobile 
                ? `max(1rem, env(safe-area-inset-bottom))` 
                : '1rem'
            })
          }}
        >
          <button
            onClick={handleViewDetails}
            disabled={!typeCode || !typeMeta}
            className={`w-full px-6 py-3 rounded-lg font-medium transition-colors text-center text-responsive-button ${
              typeCode && typeMeta
                ? `bg-gray-800 text-white ${!browserInfo.isMobile ? 'hover:bg-gray-700' : ''}`
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            style={{
              // Android에서 터치 최적화
              ...(browserInfo.isAndroid && {
                WebkitTapHighlightColor: 'transparent',
                touchAction: 'manipulation'
              })
            }}
            title={!typeCode || !typeMeta ? '결과 정보가 없어 상세보기를 할 수 없습니다' : ''}
          >
            {typeCode && typeMeta ? '나의 성향 자세히 보기 →' : '결과 정보 없음'}
          </button>
          
          <button
            onClick={handleRetest}
            className={`text-gray-300 underline transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 rounded px-2 py-1 text-responsive-small ${
              !browserInfo.isMobile ? 'hover:text-gray-200' : ''
            }`}
          >
            테스트 다시하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AnalysisCompletePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300">결과를 불러오는 중...</p>
        </div>
      </div>
    }>
      <AnalysisCompleteContent />
    </Suspense>
  );
}