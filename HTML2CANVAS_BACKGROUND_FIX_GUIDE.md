# html2canvas 배경색 문제 해결 가이드라인

## 문제 상황
html2canvas로 캡처할 때 배경색이 투명하게 되거나 날라가는 현상

## 원인 분석

### 1. 기본 배경 투명도
- html2canvas의 기본 배경은 투명
- CSS로 설정된 배경색이 제대로 캡처되지 않음

### 2. 스타일 상속 문제
- 동적으로 설정된 스타일이 복제 시 누락
- 부모-자식 간 배경색 상속 실패

### 3. 계산된 스타일 누락
- 런타임에 계산된 CSS가 캡처되지 않음
- 외부 CSS 파일의 스타일 누락

## 해결 방법

### 1. html2canvas 옵션 설정
```javascript
const canvas = await html2canvas(element, {
  backgroundColor: '#333131', // 명시적 배경색 설정
  useCORS: true,
  allowTaint: true,
  scale: 2,
  // ... 기타 옵션
});
```

### 2. onclone 콜백에서 스타일 강제 설정
```javascript
onclone: (clonedDoc: Document) => {
  const clonedCard = clonedDoc.getElementById('target-element');
  if (clonedCard) {
    // 메인 요소 배경색 강제 설정
    clonedCard.style.backgroundColor = '#333131';
    clonedCard.style.fontFamily = 'Pretendard, Noto Sans KR, system-ui, sans-serif';
    
    // 자식 요소들의 배경색도 설정
    const headerDiv = clonedCard.querySelector('[style*="backgroundColor"]');
    if (headerDiv) {
      headerDiv.style.backgroundColor = '#333131';
    }
    
    // body 배경색도 설정
    const body = clonedDoc.body;
    if (body) {
      body.style.backgroundColor = '#333131';
    }
  }
}
```

### 3. 인라인 스타일로 배경색 명시
```javascript
<div 
  id="capture-target"
  style={{ 
    backgroundColor: '#333131',
    fontFamily: 'Pretendard, Noto Sans KR, system-ui, sans-serif'
  }}
>
  {/* 콘텐츠 */}
</div>
```

## 추가 최적화 팁

### 1. 폰트 렌더링 개선
- `fontFamily` 인라인 스타일로 명시
- 웹폰트 로딩 완료 후 캡처 실행

### 2. 이미지 로딩 보장
```javascript
// 모든 이미지 로딩 완료 대기
const images = element.querySelectorAll('img');
await Promise.all(Array.from(images).map(img => {
  return new Promise((resolve) => {
    if (img.complete) resolve();
    else img.onload = resolve;
  });
}));
```

### 3. 반응형 대응
```javascript
// 캡처용 고정 크기 설정
windowWidth: 375,
windowHeight: element.scrollHeight,
```

## 디버깅 방법

### 1. 로깅 활성화
```javascript
logging: true, // 디버그 정보 출력
```

### 2. 복제된 DOM 확인
```javascript
onclone: (clonedDoc: Document) => {
  console.log('Cloned DOM:', clonedDoc.body.innerHTML);
  // 스타일 확인 로직
}
```

### 3. 단계별 테스트
1. 단순한 배경색부터 테스트
2. 점진적으로 복잡한 스타일 추가
3. 각 단계에서 결과 확인

## 성능 고려사항

- `scale` 값 조정으로 품질 vs 성능 균형
- 불필요한 DOM 요소 제외
- 캡처 영역 최소화

## 브라우저 호환성

- Chrome: 완전 지원
- Firefox: 부분 지원 (일부 CSS 제한)
- Safari: 제한적 지원 (CORS 이슈 주의)
- Edge: Chrome과 유사

## 결론

배경색 문제는 다음 3가지 방법을 조합하여 해결:
1. html2canvas의 `backgroundColor` 옵션 설정
2. `onclone` 콜백에서 스타일 강제 설정
3. 캡처 대상 요소에 인라인 스타일로 배경색 명시