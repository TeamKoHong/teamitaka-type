# 🚨 Next.js 개발 환경 문제 해결 가이드

## 문제 상황
- 페이지가 제대로 로드되지 않음 (별 모양만 표시)
- 콘솔에서 MIME 타입 오류 발생
- 500 Internal Server Error 반복 발생
- `Cannot find module './533.js'` 오류

## 원인 분석

### 1. MIME 타입 오류
```
Refused to apply style from 'http://localhost:3000...' because its MIME type ('text/html') is not a supported stylesheet MIME type
```
- **원인**: Next.js가 CSS/JS 파일을 HTML로 잘못 서빙
- **결과**: 스타일이 적용되지 않아 페이지가 깨짐

### 2. 500 Internal Server Error
```
GET http://localhost:3000... net::ERR_ABORTED 500 (Internal Server Error)
```
- **원인**: 서버가 정적 파일을 제대로 처리하지 못함
- **결과**: 리소스 로딩 실패

### 3. 모듈 찾기 오류
```
Cannot find module './533.js'
```
- **원인**: Next.js 빌드 캐시 손상
- **결과**: 런타임 모듈 로딩 실패

## 해결 방법

### 🔧 즉시 해결 (권장)

#### 방법 1: 자동 복구 스크립트 사용
```bash
# 완전 초기화 및 안정적 서버 시작
npm run reset
```

#### 방법 2: 단계별 수동 해결
```bash
# 1단계: 개발 서버 중지
pkill -f "next dev"

# 2단계: 캐시 완전 삭제
rm -rf .next

# 3단계: 의존성 재설치
rm -rf node_modules package-lock.json
npm install

# 4단계: 안정적 개발 서버 시작
npm run dev:stable
```

#### 방법 3: 빠른 캐시 정리
```bash
# 캐시만 삭제하고 안정적 서버 시작
npm run dev:clean
```

### 🛠️ 추가 해결 방법

#### 방법 1: 포트 변경
```bash
# 다른 포트로 실행
npm run dev -- -p 3001
```

#### 방법 2: 브라우저 캐시 삭제
1. 개발자 도구 열기 (F12)
2. Network 탭에서 "Disable cache" 체크
3. 페이지 새로고침 (Ctrl+Shift+R)

#### 방법 3: Next.js 버전 다운그레이드
```bash
# 안정적인 버전으로 다운그레이드
npm install next@14.2.5
```

## 예방 방법

### 1. 정기적인 캐시 정리
```bash
# 주간 캐시 정리 스크립트
#!/bin/bash
rm -rf .next
rm -rf node_modules
rm package-lock.json
npm install
```

### 2. 개발 환경 모니터링
- 콘솔 오류 정기 확인
- 빌드 성공 여부 체크
- 메모리 사용량 모니터링

### 3. 안정적인 개발 워크플로우
```bash
# 개발 시작 전 체크리스트
1. git status 확인
2. npm run build 테스트
3. 개발 서버 시작
4. 브라우저에서 페이지 확인
```

## 문제 발생 시 체크리스트

### ✅ 기본 확인사항
- [ ] 개발 서버가 실행 중인가?
- [ ] 포트 3000이 사용 가능한가?
- [ ] 브라우저 캐시를 삭제했는가?
- [ ] 콘솔에 오류가 있는가?

### ✅ 고급 확인사항
- [ ] .next 폴더가 존재하는가?
- [ ] node_modules가 완전히 설치되었는가?
- [ ] package-lock.json이 최신인가?
- [ ] Next.js 버전이 호환되는가?

## 자주 발생하는 오류와 해결책

### 오류 1: MIME 타입 오류
```bash
# 해결: 캐시 삭제 후 재시작
rm -rf .next && npm run dev
```

### 오류 2: 모듈 찾기 실패
```bash
# 해결: 의존성 재설치
rm -rf node_modules package-lock.json && npm install
```

### 오류 3: 포트 충돌
```bash
# 해결: 다른 포트 사용
npm run dev -- -p 3001
```

### 오류 4: 메모리 부족
```bash
# 해결: Node.js 메모리 증가
NODE_OPTIONS="--max-old-space-size=4096" npm run dev
```

## 📞 추가 지원

문제가 지속될 경우:
1. `npm run build` 결과 확인
2. 브라우저 콘솔 오류 스크린샷
3. 터미널 오류 메시지 복사
4. Next.js 버전 정보 확인

---
**마지막 업데이트**: 2024년 12월 19일
**Next.js 버전**: 15.0.3
**Node.js 버전**: 권장 18.x 이상