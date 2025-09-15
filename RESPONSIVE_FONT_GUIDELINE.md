# 반응형 폰트 디자인 가이드라인

## 기준 디바이스
- **기준 크기**: 390px × 944px
- **기준 폰트 크기**: 20px (질문 텍스트)

## 반응형 폰트 크기 계산 공식

### 1. 뷰포트 기반 계산
```css
/* 기준: 390px 너비에서 20px 폰트 */
font-size: calc(20px * (100vw / 390px));

/* 최소/최대 크기 제한 */
font-size: clamp(16px, calc(20px * (100vw / 390px)), 24px);
```

### 2. 브레이크포인트별 고정 크기
```css
/* 모바일 (320px - 430px) */
@media (max-width: 430px) {
  .question-text {
    font-size: 18px; /* 390px 기준에서 약간 작게 */
  }
}

/* 중간 크기 (431px - 768px) */
@media (min-width: 431px) and (max-width: 768px) {
  .question-text {
    font-size: 20px; /* 기준 크기 유지 */
  }
}

/* 태블릿 (769px - 1024px) */
@media (min-width: 769px) and (max-width: 1024px) {
  .question-text {
    font-size: 22px; /* 약간 크게 */
  }
}

/* 데스크톱 (1025px+) */
@media (min-width: 1025px) {
  .question-text {
    font-size: 24px; /* 더 크게 */
  }
}
```

## 실제 적용 예시

### 1. CSS 변수 활용
```css
:root {
  --base-font-size: 20px;
  --base-viewport-width: 390px;
  
  /* 반응형 폰트 크기 */
  --question-font-size: clamp(
    16px, 
    calc(var(--base-font-size) * (100vw / var(--base-viewport-width))), 
    24px
  );
}

.question-text {
  font-size: var(--question-font-size);
}
```

### 2. Tailwind CSS 커스텀 클래스
```css
@layer utilities {
  .text-responsive-question {
    font-size: clamp(16px, calc(20px * (100vw / 390px)), 24px);
  }
  
  .text-responsive-header {
    font-size: clamp(14px, calc(16px * (100vw / 390px)), 20px);
  }
  
  .text-responsive-button {
    font-size: clamp(16px, calc(18px * (100vw / 390px)), 22px);
  }
}
```

### 3. JavaScript 기반 동적 계산
```typescript
const calculateResponsiveFontSize = (baseSize: number, baseWidth: number = 390) => {
  const viewportWidth = window.innerWidth;
  const ratio = viewportWidth / baseWidth;
  const calculatedSize = baseSize * ratio;
  
  // 최소/최대 크기 제한
  return Math.max(16, Math.min(24, calculatedSize));
};

// 사용 예시
const questionFontSize = calculateResponsiveFontSize(20, 390);
```

## 디바이스별 권장 크기

### 모바일 (320px - 430px)
- **질문 텍스트**: 18px - 20px
- **헤더 텍스트**: 14px - 16px
- **버튼 텍스트**: 16px - 18px

### 태블릿 (431px - 768px)
- **질문 텍스트**: 20px - 22px
- **헤더 텍스트**: 16px - 18px
- **버튼 텍스트**: 18px - 20px

### 데스크톱 (769px+)
- **질문 텍스트**: 22px - 24px
- **헤더 텍스트**: 18px - 20px
- **버튼 텍스트**: 20px - 22px

## 접근성 고려사항

### 1. 최소 폰트 크기
- **최소 16px**: 모바일에서 읽기 가능한 최소 크기
- **최대 24px**: 과도하게 크지 않도록 제한

### 2. 줄 간격 조정
```css
.question-text {
  font-size: clamp(16px, calc(20px * (100vw / 390px)), 24px);
  line-height: 1.5; /* 폰트 크기에 비례하여 조정 */
}
```

### 3. 터치 친화적 크기
- **버튼 텍스트**: 최소 16px (터치 영역과 함께 고려)
- **링크 텍스트**: 최소 14px

## 구현 우선순위

### 1단계: 기본 반응형 적용
- `clamp()` 함수를 사용한 기본 반응형 폰트
- 최소/최대 크기 제한

### 2단계: 브레이크포인트별 최적화
- 주요 디바이스 크기별 세밀한 조정
- 가독성 테스트

### 3단계: 사용자 경험 검증
- 실제 디바이스에서 테스트
- 접근성 가이드라인 준수 확인

## 테스트 방법

### 1. 개발자 도구
- 다양한 뷰포트 크기로 테스트
- 폰트 크기 변화 확인

### 2. 실제 디바이스
- 모바일, 태블릿, 데스크톱에서 확인
- 가독성 및 사용성 평가

### 3. 접근성 도구
- 스크린 리더 테스트
- 시각적 접근성 확인

## 주의사항

1. **성능**: `calc()` 함수는 CPU 사용량이 적으므로 안전
2. **호환성**: `clamp()` 함수는 최신 브라우저에서만 지원 (폴백 필요)
3. **일관성**: 전체 앱에서 동일한 기준 적용
4. **테스트**: 다양한 디바이스에서 충분한 테스트 필요
