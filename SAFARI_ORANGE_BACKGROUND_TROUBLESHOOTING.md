# Safari 주황색 배경 문제 해결 가이드

## 🚨 문제 현상
Safari에서 위로 스크롤할 때 주황색 배경(그림자)이 보이는 현상

## 🔍 원인 분석

### 1. CSS 선택자 특이성 부족 (가장 가능성 높음)
- **문제**: Tailwind 클래스 `bg-[var(--brand)]/30`이 CSS 선택자와 정확히 매칭되지 않음
- **증상**: `z-index: -2 !important` 규칙이 적용되지 않음

### 2. z-index 스택 컨텍스트 문제
- **문제**: `position: relative`가 없는 요소에서 z-index가 제대로 작동하지 않음
- **증상**: z-index 값이 설정되어도 레이어 순서가 변경되지 않음

### 3. Safari 동적 뷰포트 변화
- **문제**: Safari 주소창 변화로 인한 뷰포트 재계산 시 배경 가상 요소가 업데이트되지 않음
- **증상**: 스크롤 중에만 주황색이 보임

### 4. CSS 레이어 우선순위 충돌
- **문제**: `@layer base`와 `@layer components` 간의 우선순위 문제
- **증상**: 일부 CSS 규칙이 무시됨

### 5. Tailwind CSS 클래스명 이스케이프 문제
- **문제**: 특수문자가 포함된 클래스명이 CSS 선택자에서 제대로 매칭되지 않음
- **증상**: CSS 규칙이 적용되지 않음

## 🛠️ 해결 방법

### 방법 1: CSS 선택자 강화 (권장)
```css
/* 더 구체적인 선택자 사용 */
.safari-dynamic-height .bg-\[var\(--brand\)\]\/30,
.safari-dynamic-height [class*="bg-[var(--brand)]/30"] {
  z-index: -2 !important;
}

/* 또는 더 강력한 선택자 */
.safari-dynamic-height *[style*="zIndex: -2"] {
  z-index: -2 !important;
}
```

### 방법 2: 인라인 스타일 우선순위 높이기
```tsx
// HeroMascot.tsx에서
<div 
  className="mx-auto h-3 w-48 rounded-full bg-[var(--brand)]/30 blur-md -mt-4 relative" 
  style={{
    marginTop: '-1rem',
    maxWidth: '12rem',
    zIndex: -2,
    position: 'relative' // 명시적으로 추가
  }}
/>
```

### 방법 3: CSS 변수 활용
```css
.safari-dynamic-height {
  --orange-shadow-z: -2;
}

.safari-dynamic-height .orange-shadow {
  z-index: var(--orange-shadow-z) !important;
}
```

### 방법 4: JavaScript로 동적 처리
```tsx
useEffect(() => {
  if (isSafari) {
    const orangeShadow = document.querySelector('.orange-shadow');
    if (orangeShadow) {
      (orangeShadow as HTMLElement).style.zIndex = '-2';
    }
  }
}, [isSafari]);
```

### 방법 5: 완전한 배경 덮기
```css
.safari-dynamic-height::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--bg);
  z-index: -1;
  pointer-events: none;
  /* Safari에서 더 강력한 배경 덮기 */
  background-image: linear-gradient(var(--bg), var(--bg));
  background-attachment: fixed;
}
```

## 🧪 테스트 방법

### 1. 개발자 도구 확인
```javascript
// 콘솔에서 실행
const orangeShadow = document.querySelector('[class*="bg-[var(--brand)]/30"]');
console.log('Orange shadow element:', orangeShadow);
console.log('Computed z-index:', getComputedStyle(orangeShadow).zIndex);
```

### 2. CSS 규칙 적용 확인
```javascript
// CSS 규칙이 적용되었는지 확인
const rules = Array.from(document.styleSheets)
  .flatMap(sheet => Array.from(sheet.cssRules))
  .filter(rule => rule.selectorText?.includes('safari-dynamic-height'));
console.log('Safari CSS rules:', rules);
```

### 3. Safari 전용 디버깅
```css
/* Safari에서만 보이는 디버그 스타일 */
@supports (-webkit-appearance: none) {
  .safari-dynamic-height::before {
    border: 2px solid red; /* 배경 가상 요소 확인 */
  }
  
  .safari-dynamic-height [class*="bg-[var(--brand)]/30"] {
    border: 2px solid blue; /* 주황색 그림자 확인 */
  }
}
```

## 📋 체크리스트

- [ ] CSS 선택자가 정확히 매칭되는지 확인
- [ ] z-index 값이 실제로 적용되는지 확인
- [ ] position 속성이 올바르게 설정되었는지 확인
- [ ] Safari에서만 발생하는지 다른 브라우저와 비교
- [ ] 스크롤 이벤트와 연관성이 있는지 확인
- [ ] CSS 레이어 우선순위가 올바른지 확인

## 🚀 최종 해결책 (우선순위 순)

1. **CSS 선택자 강화** - 가장 근본적인 해결책
2. **인라인 스타일 우선순위 높이기** - 즉시 적용 가능
3. **JavaScript 동적 처리** - 확실한 해결책
4. **완전한 배경 덮기** - 임시 해결책

## 📝 참고사항

- Safari는 다른 브라우저와 다른 렌더링 엔진을 사용
- CSS 선택자 특이성 계산이 다를 수 있음
- `!important` 사용 시 주의 필요
- 테스트는 실제 Safari 기기에서 진행 권장
