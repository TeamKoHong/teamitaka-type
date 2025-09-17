# 적응티미 이미지 활용 디자인 가이드라인

## 🎯 목표
적응티미 이미지를 활용하면서도 다른 결과 페이지와 동일한 디자인 시스템을 유지하는 방법들

## 📋 4가지 구현 방법

### 방법 1: 이미지 오버레이 방식 (Hybrid Overlay)
**개념**: 적응티미 이미지를 배경으로 사용하되, 기존 ResultCard의 구조와 스타일을 오버레이로 적용

**장점**:
- 기존 디자인 시스템 완전 유지
- 이미지의 시각적 임팩트 활용
- 일관된 사용자 경험

**단점**:
- 이미지와 텍스트 겹침 가능성
- 가독성 저하 위험

**구현 방법**:
```tsx
// 기존 ResultCard 구조 + 배경 이미지
<div className="relative">
  {/* 배경 이미지 */}
  <div 
    className="absolute inset-0"
    style={{
      backgroundImage: 'url(/assets/result/적응티미.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      opacity: 0.3 // 투명도 조절
    }}
  />
  
  {/* 기존 ResultCard 콘텐츠 */}
  <div className="relative z-10">
    {/* 헤더, 설명, TIP 등 기존 구조 */}
  </div>
</div>
```

**적용 영역**: 헤더 배경, 섹션별 배경, 전체 배경

---

### 방법 2: 섹션별 이미지 통합 (Section Integration)
**개념**: 적응티미 이미지를 분할하여 기존 ResultCard의 각 섹션에 맞게 배치

**장점**:
- 기존 레이아웃 구조 유지
- 이미지의 각 부분을 효과적으로 활용
- 자연스러운 통합

**단점**:
- 이미지 분할 작업 필요
- 복잡한 CSS 조정

**구현 방법**:
```tsx
// 각 섹션별로 이미지 영역 설정
<div className="result-card">
  {/* 헤더 섹션 - 이미지 상단 부분 */}
  <div 
    className="header-section"
    style={{
      backgroundImage: 'url(/assets/result/적응티미.png)',
      backgroundPosition: 'center top',
      backgroundSize: 'cover',
      height: '200px'
    }}
  >
    <div className="overlay-content">
      {/* 기존 헤더 텍스트 */}
    </div>
  </div>
  
  {/* 설명 섹션 - 이미지 중간 부분 */}
  <div 
    className="description-section"
    style={{
      backgroundImage: 'url(/assets/result/적응티미.png)',
      backgroundPosition: 'center 25%',
      backgroundSize: 'cover'
    }}
  >
    {/* 기존 설명 텍스트 */}
  </div>
  
  {/* TIP 섹션 - 이미지 하단 부분 */}
  <div 
    className="tip-section"
    style={{
      backgroundImage: 'url(/assets/result/적응티미.png)',
      backgroundPosition: 'center bottom',
      backgroundSize: 'cover'
    }}
  >
    {/* 기존 TIP 텍스트 */}
  </div>
</div>
```

**적용 영역**: 헤더, 설명, 속성 차트, TIP, 인용구 섹션

---

### 방법 3: 조건부 컴포넌트 방식 (Conditional Component)
**개념**: 적응티미일 때만 특별한 레이아웃을 사용하되, 기존 디자인 시스템의 요소들을 재구성

**장점**:
- 기존 디자인 시스템 요소 재활용
- 적응티미만의 특별함 강조
- 유지보수 용이

**단점**:
- 두 가지 다른 디자인 시스템 관리
- 코드 복잡성 증가

**구현 방법**:
```tsx
// 결과 페이지에서 조건부 렌더링
{typeMeta.nickname === '적응티미' ? (
  <AdaptiveResultCard 
    typeMeta={typeMeta}
    // 적응티미 전용 props
    useImageBackground={true}
    imagePath="/assets/result/적응티미.png"
  />
) : (
  <ResultCard typeMeta={typeMeta} />
)}

// AdaptiveResultCard 내부
const AdaptiveResultCard = ({ typeMeta, useImageBackground, imagePath }) => {
  return (
    <div 
      className="result-card" // 기존 클래스 유지
      style={useImageBackground ? {
        backgroundImage: `url(${imagePath})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      } : {}}
    >
      {/* 기존 ResultCard 구조 재사용 */}
      <div className="header-section">
        {/* 기존 헤더 스타일 유지 */}
      </div>
      
      <div className="content-section">
        {/* 기존 콘텐츠 스타일 유지 */}
      </div>
    </div>
  );
};
```

**적용 영역**: 전체 카드 레이아웃, 개별 컴포넌트

---

### 방법 4: CSS 변수 기반 테마 시스템 (CSS Variables Theme)
**개념**: CSS 변수를 활용하여 적응티미만의 테마를 정의하되, 기존 구조는 그대로 유지

**장점**:
- 완전한 디자인 시스템 통일
- 테마 변경 용이
- 성능 최적화

**단점**:
- CSS 변수 관리 복잡성
- 브라우저 호환성 고려 필요

**구현 방법**:
```css
/* globals.css에 적응티미 전용 CSS 변수 추가 */
:root {
  --adaptive-bg-image: url('/assets/result/적응티미.png');
  --adaptive-bg-size: cover;
  --adaptive-bg-position: center;
  --adaptive-overlay-opacity: 0.8;
}

.adaptive-theme {
  --card-bg: var(--adaptive-bg-image);
  --card-bg-size: var(--adaptive-bg-size);
  --card-bg-position: var(--adaptive-bg-position);
  --overlay-opacity: var(--adaptive-overlay-opacity);
}
```

```tsx
// ResultCard에서 테마 적용
const ResultCard = ({ typeMeta, ...props }) => {
  const isAdaptive = typeMeta.nickname === '적응티미';
  
  return (
    <div 
      className={`result-card ${isAdaptive ? 'adaptive-theme' : ''}`}
      style={{
        // 기존 스타일 유지
        backgroundColor: '#333131',
        // 적응티미일 때만 배경 이미지 적용
        ...(isAdaptive && {
          backgroundImage: 'var(--adaptive-bg-image)',
          backgroundSize: 'var(--adaptive-bg-size)',
          backgroundPosition: 'var(--adaptive-bg-position)'
        })
      }}
    >
      {/* 기존 구조 그대로 유지 */}
    </div>
  );
};
```

**적용 영역**: 전체 테마 시스템, 개별 스타일 속성

---

## 🎨 디자인 원칙

### 1. 일관성 유지
- 기존 ResultCard의 구조와 스타일 가이드 준수
- 동일한 폰트 시스템 사용 (Pretendard)
- 일관된 색상 팔레트 적용

### 2. 가독성 보장
- 텍스트와 이미지 간 충분한 대비
- 오버레이 투명도 적절히 조절
- 중요한 정보는 명확히 구분

### 3. 반응형 고려
- 모바일 우선 디자인
- 다양한 화면 크기 대응
- 터치 친화적 인터페이스

### 4. 성능 최적화
- 이미지 최적화 및 지연 로딩
- CSS 효율성 고려
- 번들 크기 최소화

---

## 📊 방법별 비교표

| 방법 | 구현 난이도 | 디자인 통일성 | 성능 | 유지보수성 | 추천도 |
|------|-------------|---------------|------|------------|--------|
| 1. 오버레이 | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| 2. 섹션 통합 | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| 3. 조건부 컴포넌트 | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ |
| 4. CSS 변수 테마 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

---

## 🚀 추천 구현 순서

1. **1단계**: 방법 1 (오버레이 방식)으로 프로토타입 구현
2. **2단계**: 사용자 피드백 수집 및 디자인 미세 조정
3. **3단계**: 방법 4 (CSS 변수 테마)로 최종 시스템 구축
4. **4단계**: 다른 티미 유형에도 확장 적용 검토
