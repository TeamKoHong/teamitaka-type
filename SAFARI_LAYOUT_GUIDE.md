# Safari 주소창 대응 레이아웃 가이드라인

## 🚨 문제 상황

Safari 모바일에서 주소창이 하단에 위치하여 페이지 콘텐츠를 가리는 문제가 발생합니다.

### 브라우저별 주소창 위치
- **Chrome**: 상단 고정 (문제 없음)
- **Safari**: 하단 위치 (콘텐츠 가림 문제)
- **Firefox**: 상단 고정 (문제 없음)

## 📱 Safari 주소창 동작 방식

### 1. 주소창 표시/숨김 조건
- **표시**: 페이지 로드 시, 스크롤 업 시
- **숨김**: 스크롤 다운 시 (약 100px 정도)
- **고정**: 특정 스크롤 위치에서 고정

### 2. 뷰포트 높이 변화
- **주소창 표시**: `100vh` = 실제 화면 높이 - 주소창 높이
- **주소창 숨김**: `100vh` = 전체 화면 높이
- **변화량**: 약 100-120px

## 🛠️ 해결 방안

### 1. Safe Area 대응

```css
/* globals.css에 추가 */
@layer base {
  /* Safari 주소창 고려한 뷰포트 높이 */
  .safari-viewport {
    height: 100vh;
    height: -webkit-fill-available; /* Safari 전용 */
    height: 100dvh; /* 최신 브라우저 */
  }
  
  /* 하단 Safe Area 대응 */
  .safari-bottom-safe {
    padding-bottom: env(safe-area-inset-bottom);
    padding-bottom: max(env(safe-area-inset-bottom), 1rem);
  }
  
  /* 동적 뷰포트 높이 */
  .safari-dynamic-height {
    height: calc(var(--vh, 1vh) * 100);
  }
}
```

### 2. JavaScript로 동적 높이 처리

```typescript
// lib/hooks/useSafariViewport.ts
import { useEffect, useState } from 'react';

export const useSafariViewport = () => {
  const [viewportHeight, setViewportHeight] = useState(0);
  const [isSafari, setIsSafari] = useState(false);

  useEffect(() => {
    // Safari 감지
    const userAgent = navigator.userAgent;
    const isSafari = /Safari/.test(userAgent) && !/Chrome/.test(userAgent);
    setIsSafari(isSafari);

    const setViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      setViewportHeight(vh);
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setViewportHeight();
    
    if (isSafari) {
      // Safari에서 주소창 변화 감지
      window.addEventListener('resize', setViewportHeight);
      window.addEventListener('orientationchange', setViewportHeight);
      
      // 스크롤 이벤트로 주소창 상태 감지
      let ticking = false;
      const handleScroll = () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            setViewportHeight();
            ticking = false;
          });
          ticking = true;
        }
      };
      
      window.addEventListener('scroll', handleScroll);
      
      return () => {
        window.removeEventListener('resize', setViewportHeight);
        window.removeEventListener('orientationchange', setViewportHeight);
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  return { viewportHeight, isSafari };
};
```

### 3. 버튼 배치 전략

#### A. 하단 고정 버튼 (권장)

```css
/* 하단 고정 버튼 - Safari 대응 */
.bottom-fixed-safari {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  padding-bottom: max(1rem, env(safe-area-inset-bottom));
  background: white;
  border-top: 1px solid #e5e5e5;
  z-index: 50;
}

/* 메인 콘텐츠 - 하단 버튼 공간 확보 */
.main-content-safari {
  padding-bottom: 120px; /* 버튼 높이 + 여백 */
  min-height: calc(var(--vh, 1vh) * 100);
}
```

#### B. 인라인 버튼 (대안)

```css
/* 인라인 버튼 - 스크롤 가능 */
.inline-buttons-safari {
  padding: 1rem;
  padding-bottom: max(1rem, env(safe-area-inset-bottom));
  background: white;
  border-top: 1px solid #e5e5e5;
}
```

### 4. 컴포넌트별 적용 가이드

#### QuestionCard 컴포넌트

```typescript
// components/QuestionCard.tsx 수정 예시
export default function QuestionCard({ ... }) {
  const { viewportHeight, isSafari } = useSafariViewport();
  
  return (
    <div 
      className={`w-full min-h-screen bg-gray-100 flex flex-col ${
        isSafari ? 'safari-dynamic-height' : ''
      }`}
      style={{
        fontFamily: 'Pretendard, sans-serif',
        ...(isSafari && {
          height: `calc(var(--vh, 1vh) * 100)`,
          minHeight: `calc(var(--vh, 1vh) * 100)`
        })
      }}
    >
      {/* 질문 영역 */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        {/* 질문 내용 */}
      </div>

      {/* 답변 버튼들 - Safari 대응 */}
      <div className={`flex-shrink-0 flex gap-2 px-4 justify-center ${
        isSafari ? 'safari-bottom-safe' : 'pb-8'
      }`}>
        {/* 버튼들 */}
      </div>
    </div>
  );
}
```

#### Analysis Complete 페이지

```typescript
// app/analysis-complete/page.tsx 수정 예시
function AnalysisCompleteContent() {
  const { viewportHeight, isSafari } = useSafariViewport();
  
  return (
    <div 
      className={`bg-gray-100 flex flex-col items-center justify-center p-4 sm:p-6 ${
        isSafari ? 'safari-dynamic-height' : 'min-h-screen'
      }`}
      style={{
        ...(isSafari && {
          height: `calc(var(--vh, 1vh) * 100)`,
          minHeight: `calc(var(--vh, 1vh) * 100)`
        })
      }}
    >
      {/* 콘텐츠 */}
      
      {/* 하단 버튼들 - Safari 대응 */}
      <div className={`flex flex-col items-center space-y-4 w-full max-w-sm ${
        isSafari ? 'safari-bottom-safe' : ''
      }`}>
        {/* 버튼들 */}
      </div>
    </div>
  );
}
```

## 📋 구현 체크리스트

### 1. 기본 설정
- [ ] `useSafariViewport` 훅 생성
- [ ] CSS 변수 `--vh` 설정
- [ ] Safe Area 대응 CSS 추가

### 2. 컴포넌트 수정
- [ ] QuestionCard: 동적 높이 적용
- [ ] Analysis Complete: 동적 높이 적용
- [ ] Result Page: 동적 높이 적용

### 3. 버튼 배치
- [ ] 하단 고정 버튼으로 변경
- [ ] Safe Area 패딩 적용
- [ ] 메인 콘텐츠 여백 조정

### 4. 테스트
- [ ] Safari 모바일에서 주소창 표시/숨김 테스트
- [ ] 스크롤 시 레이아웃 안정성 확인
- [ ] 다른 브라우저에서 정상 작동 확인

## 🎯 권장 구현 순서

1. **1단계**: `useSafariViewport` 훅 생성
2. **2단계**: CSS Safe Area 스타일 추가
3. **3단계**: QuestionCard 컴포넌트 수정
4. **4단계**: Analysis Complete 페이지 수정
5. **5단계**: Result Page 수정
6. **6단계**: 전체 테스트 및 최적화

## ⚠️ 주의사항

1. **성능 고려**: 스크롤 이벤트는 `requestAnimationFrame`으로 최적화
2. **호환성**: 다른 브라우저에서도 정상 작동하도록 폴백 제공
3. **접근성**: Safe Area가 없는 디바이스에서도 최소 여백 보장
4. **테스트**: 실제 Safari 디바이스에서 충분한 테스트 필요

## 📱 테스트 디바이스

- iPhone SE (Safari)
- iPhone 12/13 (Safari)
- iPhone 14 Pro Max (Safari)
- iPad (Safari)

이 가이드라인을 따라 구현하면 Safari의 주소창 문제를 효과적으로 해결할 수 있습니다.
