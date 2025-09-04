import { test, expect } from '@playwright/test';

test.describe('퀴즈 플로우 E2E 테스트', () => {
  test('전체 퀴즈 플로우가 정상 작동하는지 확인', async ({ page }) => {
    // 홈페이지 접속
    await page.goto('/');
    
    // 인트로 페이지 요소 확인
    await expect(page.getByText('성향 분석 시작!')).toBeVisible();
    await expect(page.getByText('1분이면 충분해요')).toBeVisible();
    
    // 테스트 시작 버튼 클릭
    await page.getByRole('button', { name: '1분 테스트 시작' }).click();
    
    // 퀴즈 페이지로 이동 확인
    await expect(page).toHaveURL('/quiz');
    await expect(page.getByText('팀플 성향 테스트')).toBeVisible();
    
    // 진행률 바 확인
    await expect(page.locator('[role="progressbar"]')).toBeVisible();
    
    // 첫 번째 질문 확인
    await expect(page.getByText('질문 1 / 15')).toBeVisible();
    await expect(page.getByText('새로운 프로젝트가 시작되면')).toBeVisible();
    
    // 모든 질문에 답변 (첫 번째 선택지로)
    for (let i = 0; i < 15; i++) {
      // 질문이 로드될 때까지 대기
      await page.waitForSelector('text=질문');
      
      // 첫 번째 선택지 클릭
      await page.getByText('예').click();
      
      // 마지막 질문이 아니라면 다음 질문 로딩 대기
      if (i < 14) {
        await page.waitForTimeout(500);
      }
    }
    
    // 결과 분석 중 화면 확인
    await expect(page.getByText('결과 분석 중')).toBeVisible();
    
    // 결과 페이지로 이동 대기 (최대 5초)
    await page.waitForURL(/\/result\/[A-Z]{4}/, { timeout: 5000 });
    
    // 결과 페이지 요소 확인
    await expect(page.getByText('성향 분석 완료')).toBeVisible();
    await expect(page.locator('[id="result-card"]')).toBeVisible();
    
    // 결과 카드 내용 확인
    await expect(page.locator('.type-nickname')).toBeVisible();
    await expect(page.getByText('주요 강점')).toBeVisible();
    await expect(page.getByText('나와 잘 어울리는 티미 유형')).toBeVisible();
    await expect(page.getByText('적응티미 TIP')).toBeVisible();
    
    // 공유/저장 버튼 확인
    await expect(page.getByText('카드 공유')).toBeVisible();
    await expect(page.getByText('카드 저장')).toBeVisible();
    await expect(page.getByText('테스트 다시하기')).toBeVisible();
  });

  test('키보드 네비게이션이 정상 작동하는지 확인', async ({ page }) => {
    await page.goto('/quiz');
    
    // 첫 번째 질문 대기
    await page.waitForSelector('text=질문 1 / 15');
    
    // 키보드로 답변 선택 (왼쪽 화살표 = 예)
    await page.keyboard.press('ArrowLeft');
    
    // 다음 질문으로 이동 확인
    await page.waitForTimeout(500);
    await expect(page.getByText('질문 2 / 15')).toBeVisible();
    
    // 오른쪽 화살표로 답변 (아니오)
    await page.keyboard.press('ArrowRight');
    
    // 다음 질문으로 이동 확인
    await page.waitForTimeout(500);
    await expect(page.getByText('질문 3 / 15')).toBeVisible();
  });

  test('뒤로가기 기능이 정상 작동하는지 확인', async ({ page }) => {
    await page.goto('/quiz');
    
    // 첫 번째 질문에서 답변
    await page.waitForSelector('text=질문 1 / 15');
    await page.getByText('예').click();
    
    // 두 번째 질문 확인
    await page.waitForTimeout(500);
    await expect(page.getByText('질문 2 / 15')).toBeVisible();
    
    // 뒤로가기 버튼 클릭
    await page.locator('button[aria-label="이전으로"]').click();
    
    // 첫 번째 질문으로 돌아갔는지 확인
    await expect(page.getByText('질문 1 / 15')).toBeVisible();
  });

  test('진행률이 올바르게 표시되는지 확인', async ({ page }) => {
    await page.goto('/quiz');
    
    // 첫 번째 질문에서 진행률 확인
    await page.waitForSelector('text=질문 1 / 15');
    await expect(page.getByText('1 / 15')).toBeVisible();
    await expect(page.getByText('7%')).toBeVisible();
    
    // 몇 문제 답변 후 진행률 확인
    await page.getByText('예').click();
    await page.waitForTimeout(500);
    
    await expect(page.getByText('2 / 15')).toBeVisible();
    await expect(page.getByText('13%')).toBeVisible();
  });

  test('모바일 뷰에서 정상 작동하는지 확인', async ({ page, isMobile }) => {
    if (!isMobile) {
      // 모바일 뷰포트 설정
      await page.setViewportSize({ width: 375, height: 667 });
    }
    
    await page.goto('/');
    
    // 모바일에서도 요소들이 제대로 보이는지 확인
    await expect(page.getByText('성향 분석 시작!')).toBeVisible();
    await page.getByRole('button', { name: '1분 테스트 시작' }).click();
    
    // 퀴즈 화면 확인
    await expect(page).toHaveURL('/quiz');
    await expect(page.getByText('팀플 성향 테스트')).toBeVisible();
    
    // 터치 타겟이 충분한 크기인지 확인 (44px 이상)
    const button = page.getByText('예').first();
    const box = await button.boundingBox();
    expect(box!.height).toBeGreaterThanOrEqual(44);
    expect(box!.width).toBeGreaterThanOrEqual(44);
  });

  test('결과 페이지 직접 접근 테스트', async ({ page }) => {
    // 유효한 타입으로 직접 접근
    await page.goto('/result/ENFP');
    
    await expect(page.getByText('성향 분석 완료')).toBeVisible();
    await expect(page.getByText('열정티미')).toBeVisible();
    
    // 유효하지 않은 타입으로 접근 시 404 처리 확인
    const response = await page.goto('/result/INVALID');
    expect(response?.status()).toBe(404);
  });

  test('다크 모드 토글 기능 확인', async ({ page }) => {
    // ENFP 결과 페이지로 이동
    await page.goto('/result/ENFP');
    
    // 다크 모드 토글 버튼 클릭
    await page.locator('button[aria-label="다크 모드로 변경"]').click();
    
    // 다크 모드 화면 확인
    await expect(page.locator('.bg-gray-900')).toBeVisible();
    
    // 라이트 모드로 다시 토글
    await page.locator('button[aria-label="라이트 모드로 변경"]').click();
    
    // 라이트 모드 화면 확인
    await expect(page.locator('.bg-light-bg')).toBeVisible();
  });
});