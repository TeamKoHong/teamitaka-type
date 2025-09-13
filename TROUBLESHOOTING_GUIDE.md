# Analysis Complete 페이지 환경별 문제 진단 및 해결 가이드

## 📋 개요
`/analysis-complete` 페이지에서 발생할 수 있는 환경별 문제점들을 체크하고 해결하는 포괄적인 가이드입니다.

---

## 🔍 문제 진단 체크리스트

### 1. URL 파라미터 문제
**증상**: 티미 카드가 표시되지 않거나 "?" 표시만 나타남

**체크 방법**:
```javascript
// 브라우저 개발자 도구 Console에서 실행
console.log('URL params:', new URLSearchParams(window.location.search).get('type'));
console.log('Available types:', Object.keys(TYPE_METADATA));
```

**가능한 원인**:
- URL에 `type` 파라미터 누락
- 잘못된 타입 코드 전달
- URL 인코딩 문제

**해결책**:
```javascript
// 올바른 URL 형식
// ✅ 정상: /analysis-complete?type=활동티미
// ❌ 문제: /analysis-complete (파라미터 없음)
// ❌ 문제: /analysis-complete?type=invalid_type
```

### 2. 데이터 매칭 문제
**증상**: TYPE_METADATA에는 있지만 timiCards에서 찾을 수 없음

**체크 방법**:
```javascript
// 개발자 도구에서 데이터 매칭 확인
const typeCode = '활동티미'; // 확인하고 싶은 타입
const typeMeta = TYPE_METADATA[typeCode];
const card = timiCards.find(card => card.name === typeMeta?.nickname);
console.log('Type Meta:', typeMeta);
console.log('Card Found:', card);
```

**가능한 원인**:
- `TYPE_METADATA`의 `nickname`과 `timiCards`의 `name`이 불일치
- 카드 데이터 누락

### 3. 이미지 로딩 문제
**증상**: 카드 영역이 비어있거나 이미지가 깨짐

**체크 방법**:
```javascript
// 이미지 경로 확인
const card = timiCards[0]; // 첫 번째 카드로 테스트
console.log('Front image path:', card.front);
console.log('Back image path:', card.back);

// 이미지 로드 테스트
const img = new Image();
img.onload = () => console.log('Image loaded successfully');
img.onerror = () => console.log('Image failed to load');
img.src = card.front;
```

**가능한 원인**:
- 이미지 파일 경로 오류
- 이미지 파일 누락
- 이미지 서버 접근 문제

### 4. 반응형 레이아웃 문제
**증상**: 모바일에서 카드나 버튼이 제대로 표시되지 않음

**체크 방법**:
```css
/* 브라우저 개발자 도구에서 다양한 해상도 테스트 */
/* 모바일: 375px × 667px */
/* 태블릿: 768px × 1024px */
/* 데스크톱: 1920px × 1080px */
```

### 5. 네비게이션 문제
**증상**: "자세히 보기" 또는 "다시하기" 버튼 클릭 시 이동하지 않음

**체크 방법**:
```javascript
// 라우터 상태 확인
console.log('Current pathname:', window.location.pathname);
console.log('Router ready:', router);
```

---

## 🛠️ 환경별 해결 방법

### 개발 환경 (Development)

#### Next.js 개발 서버 문제
```bash
# 1. 개발 서버 재시작
npm run dev
# 또는
yarn dev

# 2. 캐시 클리어 후 재시작
rm -rf .next
npm run dev

# 3. 의존성 재설치
rm -rf node_modules package-lock.json
npm install
npm run dev
```

#### 이미지 경로 문제 해결
```javascript
// next.config.js에서 이미지 설정 확인
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  // public 폴더 정적 파일 서빙 확인
  assetPrefix: process.env.NODE_ENV === 'production' ? '/your-base-path' : '',
}

module.exports = nextConfig
```

### 프로덕션 환경 (Production)

#### 빌드 문제 해결
```bash
# 1. 프로덕션 빌드 테스트
npm run build
npm run start

# 2. 빌드 오류 확인
npm run build 2>&1 | tee build.log

# 3. 정적 파일 경로 확인
ls -la public/assets/timi-cards/
```

#### 서버 배포 환경 이슈
```javascript
// 환경변수 확인
console.log('Environment:', process.env.NODE_ENV);
console.log('Base URL:', process.env.NEXT_PUBLIC_BASE_URL);
```

### 모바일 환경

#### iOS Safari 문제
```css
/* iOS Safari 호환성 개선 */
.card-container {
  -webkit-transform-style: preserve-3d;
  transform-style: preserve-3d;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}

/* iOS 터치 스크롤 개선 */
body {
  -webkit-overflow-scrolling: touch;
}
```

#### Android Chrome 문제
```javascript
// 터치 이벤트 개선
const handleCardFlip = (e) => {
  e.preventDefault();
  e.stopPropagation();
  setShowBack(!showBack);
};
```

---

## 🔧 자동 진단 스크립트

### 브라우저 Console 진단 스크립트
```javascript
// analysis-complete-diagnostics.js
function diagnoseAnalysisCompletePage() {
  const results = {
    timestamp: new Date().toISOString(),
    url: window.location.href,
    userAgent: navigator.userAgent,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    issues: []
  };

  // 1. URL 파라미터 체크
  const urlParams = new URLSearchParams(window.location.search);
  const typeParam = urlParams.get('type');
  
  if (!typeParam) {
    results.issues.push('❌ URL에 type 파라미터가 없습니다');
  } else if (typeof TYPE_METADATA !== 'undefined' && !TYPE_METADATA[typeParam]) {
    results.issues.push(`❌ 유효하지 않은 타입 코드: ${typeParam}`);
  } else {
    results.issues.push(`✅ 타입 파라미터 정상: ${typeParam}`);
  }

  // 2. 데이터 매칭 체크
  if (typeof TYPE_METADATA !== 'undefined' && typeof timiCards !== 'undefined') {
    const typeMeta = TYPE_METADATA[typeParam];
    const card = timiCards.find(c => c.name === typeMeta?.nickname);
    
    if (!card) {
      results.issues.push(`❌ 카드 데이터 매칭 실패: ${typeMeta?.nickname}`);
    } else {
      results.issues.push(`✅ 카드 데이터 매칭 성공: ${card.name}`);
    }
  }

  // 3. 이미지 로딩 체크
  const images = document.querySelectorAll('img');
  images.forEach((img, index) => {
    if (img.complete && img.naturalWidth === 0) {
      results.issues.push(`❌ 이미지 로딩 실패: ${img.src}`);
    } else if (img.complete) {
      results.issues.push(`✅ 이미지 로딩 성공: 이미지 ${index + 1}`);
    }
  });

  // 4. 반응형 체크
  const isMobile = window.innerWidth < 768;
  const cardElement = document.querySelector('.w-72, .w-80');
  if (cardElement) {
    const cardRect = cardElement.getBoundingClientRect();
    if (isMobile && cardRect.width > window.innerWidth - 32) {
      results.issues.push('⚠️ 모바일에서 카드가 화면을 벗어날 수 있습니다');
    } else {
      results.issues.push('✅ 카드 크기 적절');
    }
  }

  // 결과 출력
  console.group('🔍 Analysis Complete 페이지 진단 결과');
  console.log('기본 정보:', results);
  results.issues.forEach(issue => console.log(issue));
  console.groupEnd();

  return results;
}

// 진단 실행
diagnoseAnalysisCompletePage();
```

---

## 📱 환경별 테스트 가이드

### 데스크톱 테스트
1. **Chrome**: 개발자 도구 → Device Toolbar → 다양한 해상도 테스트
2. **Firefox**: 반응형 디자인 모드 테스트
3. **Safari**: 웹 인스펙터로 성능 확인

### 모바일 테스트
1. **iOS Safari**: 
   - 실제 기기에서 테스트
   - 카드 플립 애니메이션 확인
   - 터치 반응 확인

2. **Android Chrome**:
   - 다양한 Android 버전 테스트
   - 터치 이벤트 반응 확인
   - 성능 모니터링

### 네트워크 테스트
```javascript
// 네트워크 상태 확인
navigator.connection && console.log('Network:', {
  effectiveType: navigator.connection.effectiveType,
  downlink: navigator.connection.downlink,
  rtt: navigator.connection.rtt
});
```

---

## 🚨 일반적인 문제 해결책

### 1. 카드가 표시되지 않는 경우
```typescript
// page.tsx에서 디버깅 추가
useEffect(() => {
  console.log('Search params:', searchParams.toString());
  console.log('Type code:', typeCode);
  console.log('Type meta:', typeMeta);
  console.log('Current card:', currentTimiCard);
}, [searchParams, typeCode, typeMeta, currentTimiCard]);
```

### 2. 이미지 로딩 실패
```typescript
// 이미지 로딩 에러 핸들링 추가
<img
  src={currentTimiCard.front}
  alt={`${currentTimiCard.name} 앞면`}
  className="w-full h-full object-contain"
  onError={(e) => {
    console.error('Image loading failed:', e.currentTarget.src);
    e.currentTarget.src = '/assets/fallback-image.png'; // 대체 이미지
  }}
  onLoad={() => console.log('Image loaded successfully')}
/>
```

### 3. 라우팅 문제
```typescript
// 라우터 상태 확인 및 에러 핸들링
const handleViewDetails = () => {
  if (!typeCode) {
    console.error('Type code is missing');
    return;
  }
  
  try {
    router.push(`/result/${encodeURIComponent(typeCode)}`);
  } catch (error) {
    console.error('Navigation failed:', error);
  }
};
```

### 4. 성능 최적화
```typescript
// 이미지 preload 추가
useEffect(() => {
  if (currentTimiCard) {
    const preloadImages = [currentTimiCard.front, currentTimiCard.back];
    preloadImages.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }
}, [currentTimiCard]);
```

---

## 📊 모니터링 및 로깅

### 에러 추적
```typescript
// 에러 바운더리 추가 권장
class AnalysisCompleteErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Analysis Complete Error:', error, errorInfo);
    // 에러 리포팅 서비스로 전송
  }
}
```

### 성능 모니터링
```typescript
// 성능 측정
useEffect(() => {
  const startTime = performance.now();
  
  return () => {
    const endTime = performance.now();
    console.log(`Component render time: ${endTime - startTime}ms`);
  };
}, []);
```

이 가이드를 통해 다양한 환경에서 발생할 수 있는 문제들을 체계적으로 진단하고 해결할 수 있습니다.