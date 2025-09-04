# TEAMITAKA 타입 테스트

> 1분 만에 알아보는 나의 협업 스타일 — 재미있는 공유형 성향 테스트

![TEAMITAKA 타입 테스트](https://type.teamitaka.com/og/og-default.png)

## 🎯 프로젝트 개요

**TEAMITAKA 타입 테스트**는 MBTI식 가벼운 협업 성향 테스트로, 15개 질문을 통해 사용자의 팀워크 스타일을 분석하고 바이럴 가능한 결과 카드를 생성합니다.

### 주요 특징
- ⚡ **1분 완료**: 15문항으로 빠른 테스트
- 🎨 **결과 카드**: 라이트/다크 테마 지원하는 공유 가능한 카드
- 📱 **모바일 최적화**: 반응형 디자인과 터치 친화적 UX
- ♿ **접근성 지원**: 키보드 네비게이션, 스크린 리더 지원
- 🔒 **개인정보 안전**: 개인정보 수집 없는 로컬 처리

### 핵심 KPI
1. **완료율**: 퀴즈 시작 → 결과 페이지 도달
2. **카드 저장률**: 결과 카드 이미지 다운로드
3. **공유 클릭률**: 카드 공유/링크 복사

## 🛠 기술 스택

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Testing**: Vitest (Unit), Playwright (E2E)
- **Image Capture**: html2canvas
- **Deployment**: Vercel (권장)

## 📁 프로젝트 구조

```
teamitaka-type/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # 글로벌 레이아웃
│   ├── page.tsx           # 인트로 페이지 (/)
│   ├── quiz/
│   │   └── page.tsx       # 퀴즈 진행 (/quiz)
│   └── result/[type]/
│       └── page.tsx       # 결과 페이지 (/result/[type])
├── components/            # React 컴포넌트
│   ├── ProgressBar.tsx
│   ├── QuestionCard.tsx
│   ├── ChoiceButton.tsx
│   ├── ResultCard.tsx     # 캡쳐용 결과 카드
│   └── ShareBar.tsx       # 공유/저장 액션바
├── lib/                   # 비즈니스 로직
│   ├── questions.ts       # 15문항 데이터
│   ├── scoring.ts         # MBTI 스코어링 로직
│   ├── types.ts          # 16개 타입 메타데이터
│   ├── theme.ts          # 디자인 토큰
│   └── og.ts             # OG 메타데이터
├── public/
│   └── og/               # OG 이미지
└── e2e/                  # E2E 테스트
```

## 🚀 개발 환경 설정

### 1. 저장소 클론 및 의존성 설치

```bash
git clone https://github.com/your-org/teamitaka-type.git
cd teamitaka-type

# 패키지 설치
npm install

# 또는 yarn
yarn install
```

### 2. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속

### 3. 테스트 실행

```bash
# 단위 테스트
npm run test

# 단위 테스트 (watch 모드)
npm run test:watch

# E2E 테스트
npm run test:e2e

# 타입 체크
npm run type-check
```

## 🏗 빌드 및 배포

### 로컬 빌드

```bash
# 프로덕션 빌드
npm run build

# 빌드 결과 실행
npm run start
```

### Vercel 배포

1. **Vercel 프로젝트 연결**
   ```bash
   npm install -g vercel
   vercel login
   vercel --prod
   ```

2. **환경 변수 설정** (필요시)
   - Vercel 대시보드에서 설정
   - Analytics, SEO 도구 연동

3. **커스텀 도메인 연결**
   ```bash
   # type.teamitaka.com CNAME 설정
   vercel domains add type.teamitaka.com
   ```

### 기타 플랫폼 배포

**Netlify**
```bash
npm run build
# dist 폴더를 Netlify에 업로드
```

**AWS S3 + CloudFront**
```bash
npm run build
aws s3 sync out/ s3://your-bucket --delete
```

## 🔧 커스터마이징

### 질문 수정

`lib/questions.ts`에서 질문 텍스트와 가중치를 수정할 수 있습니다:

```typescript
export const questions: Question[] = [
  {
    id: 1,
    text: "새로운 질문 내용",
    choices: ["예", "아니오"]
  },
  // ...
];
```

### 타입 메타데이터 수정

`lib/types.ts`에서 각 MBTI 타입의 설명, 강점, 팁을 수정:

```typescript
export const TYPE_METADATA: Record<string, TypeMeta> = {
  ENFP: {
    nickname: '열정티미',
    oneLiner: '넘치는 에너지로 팀을 이끄는 아이디어 발전소',
    description: '창의적인 해결책을 제시하고...',
    strengths: ['창의적 아이디어 발굴', '팀 동기부여', '유연한 사고'],
    bestMatches: ['체계티미 (INTJ)', '실행티미 (ESTJ)'],
    tips: ['구체적인 실행 계획 수립하기', '...']
  }
};
```

### 스타일링 테마

`lib/theme.ts`와 `tailwind.config.js`에서 색상, 폰트, 간격 등을 조정:

```typescript
export const theme = {
  colors: {
    primary: '#F76241',  // TEAMITAKA 오렌지
    // ...
  }
};
```

### 가중치 알고리즘

`lib/scoring.ts`의 `SCORING_WEIGHTS`에서 각 질문의 영향도 조정:

```typescript
export const SCORING_WEIGHTS = {
  EI: {
    1: { axis: 'E', weight: 1.0 },  // 가중치 조정 가능
  }
};
```

## 📊 분석 및 모니터링

### Plausible Analytics 연동

```javascript
// app/layout.tsx에 추가
<script defer data-domain="type.teamitaka.com" src="https://plausible.io/js/script.js"></script>
```

### 주요 추적 이벤트

- `Test Started`: 테스트 시작
- `Quiz Completed`: 퀴즈 완료
- `Result Generated`: 결과 생성 (타입별)
- `Result Viewed`: 결과 페이지 조회
- `Card Saved`: 카드 이미지 저장
- `Card Shared`: 카드 공유
- `Retest Started`: 재테스트

### Google Analytics 4 연동

```javascript
// gtag 설정 및 커스텀 이벤트 전송
gtag('event', 'quiz_completed', {
  custom_parameter: 'value'
});
```

## ♿ 접근성 체크리스트

### ✅ 완료된 접근성 기능

- **키보드 네비게이션**: 모든 인터랙션 요소 Tab/Enter 지원
- **터치 대상**: 최소 44px×44px 터치 영역
- **색상 대비**: WCAG AA 기준 4.5:1 이상
- **포커스 표시**: 명확한 포커스 링 표시
- **스크린 리더**: semantic HTML과 ARIA 레이블
- **대체 텍스트**: 의미있는 이미지 alt 속성
- **텍스트 크기**: 브라우저 확대/축소 지원

### 🔄 개선 예정 사항

- [ ] 고대비 모드 지원
- [ ] 모션 감소 옵션 (prefers-reduced-motion)
- [ ] 다국어 지원 (영어, 일본어)
- [ ] 음성 안내 기능

## 📱 반응형 디자인

### 브레이크포인트

- **Mobile**: 360px - 430px (기본 최적화)
- **Tablet**: 431px - 768px (중앙 정렬 카드)
- **Desktop**: 769px+ (최대 너비 제한)

### 주요 반응형 처리

- 퀴즈 카드: 모바일에서 전체 너비, 데스크톱에서 고정 너비
- 결과 카드: 화면 크기에 따른 패딩과 폰트 크기 조정
- 공유 바: 모바일에서 하단 고정, 데스크톱에서 인라인
- 터치 제스처: 스와이프와 탭 최적화

## 🚀 성능 최적화

### Core Web Vitals 목표

- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms  
- **CLS (Cumulative Layout Shift)**: < 0.1

### 적용된 최적화

- **폰트 최적화**: `font-display: swap`으로 FOUT 방지
- **이미지 최적화**: Next.js Image 컴포넌트 사용
- **코드 분할**: 페이지별 자동 코드 분할
- **캐싱**: 정적 assets CDN 캐싱
- **압축**: Gzip/Brotli 압축

### 번들 사이즈 목표

- **Initial Bundle**: < 150KB (gzipped)
- **Total Bundle**: < 500KB (gzipped)
- **이미지 캡쳐**: html2canvas 동적 로딩

## 🔒 보안 및 개인정보

### 개인정보 정책

- **데이터 수집 없음**: 이름, 이메일 등 개인정보 미수집
- **로컬 처리**: 모든 답변과 결과는 브라우저에서만 처리
- **세션 관리**: 새로고침 시 데이터 초기화
- **쿠키 사용 안함**: 분석 도구 제외 쿠키 미사용

### 보안 헤더

```javascript
// next.config.js
headers: [
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-Frame-Options', 
    value: 'DENY',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  }
]
```

## 🐛 트러블슈팅

### 자주 발생하는 문제

**1. 이미지 캡쳐가 안되는 경우**
```bash
# html2canvas 관련 이슈
npm install html2canvas@latest

# 폰트 로딩 완료 후 캡쳐되도록 수정됨
await document.fonts.ready;
```

**2. 모바일에서 공유 버튼이 안되는 경우**
```javascript
// Web Share API 지원 여부 확인 후 폴백
if (navigator.share && navigator.canShare) {
  await navigator.share(shareData);
} else {
  // 클립보드 복사 폴백
  await navigator.clipboard.writeText(url);
}
```

**3. 결과 페이지 직접 접근 시 404**
```javascript
// [type] 다이나믹 라우팅 확인
// 유효한 MBTI 타입(16가지)만 허용
if (!TYPE_METADATA[typeCode?.toUpperCase()]) {
  notFound();
}
```

### 개발자 도구 활용

```bash
# Next.js 번들 분석
npm run build
npx @next/bundle-analyzer

# 라이트하우스 성능 측정  
npm run build && npm run start
# Chrome DevTools > Lighthouse 실행

# 접근성 테스트
npm install -g @axe-core/cli
axe http://localhost:3000
```

## 🤝 기여 가이드

### 개발 워크플로우

1. **이슈 생성**: 새로운 기능이나 버그 리포트
2. **브랜치 생성**: `feature/feature-name` 또는 `fix/bug-name`
3. **개발 진행**: 코드 작성 및 테스트
4. **테스트 실행**: `npm run test && npm run test:e2e`
5. **PR 생성**: 명확한 설명과 함께 Pull Request
6. **코드 리뷰**: 팀 리뷰 후 머지

### 커밋 컨벤션

```bash
feat: 새로운 기능 추가
fix: 버그 수정  
docs: 문서 수정
style: 코드 스타일 변경
refactor: 코드 리팩토링
test: 테스트 추가/수정
chore: 빌드 프로세스 또는 보조 도구 변경
```

### 코딩 스타일

- **ESLint**: Next.js 권장 설정 사용
- **Prettier**: 코드 포맷팅 자동화
- **TypeScript**: 엄격한 타입 체크 활성화
- **접근성**: WCAG 2.1 AA 기준 준수

## 📄 라이선스

MIT License - 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 📞 연락처

- **프로젝트 문의**: [contact@teamitaka.com](mailto:contact@teamitaka.com)
- **버그 리포트**: [GitHub Issues](https://github.com/your-org/teamitaka-type/issues)
- **기능 요청**: [GitHub Discussions](https://github.com/your-org/teamitaka-type/discussions)

## 📚 참고 자료

- [Next.js 15 문서](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Vitest 테스팅](https://vitest.dev/)
- [Playwright E2E](https://playwright.dev/)
- [Web Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

**Made with ❤️ by TEAMITAKA** | [Website](https://teamitaka.com) | [Blog](https://blog.teamitaka.com)