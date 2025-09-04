'use client';

import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  const handleStartTest = () => {
    // 분석 이벤트 (향후 Plausible/GA4 연동)
    if (typeof window !== 'undefined' && (window as any).plausible) {
      (window as any).plausible('Test Started');
    }
    
    router.push('/quiz');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-lg mx-auto text-center">
        {/* 메인 헤더 */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-light-text dark:text-dark-text mb-4 animate-fade-in">
            성향 분석 시작!
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed animate-slide-up">
            1분이면 충분해요.<br />
            내 협업 타입을 확인해보세요.
          </p>
        </div>

        {/* CTA 버튼 */}
        <div className="mb-8">
          <button
            onClick={handleStartTest}
            className="btn-primary text-lg px-8 py-4 w-full sm:w-auto 
                       transform hover:scale-105 transition-transform duration-200
                       shadow-[0_4px_20px_rgba(247,98,65,0.3)]"
            aria-label="협업 타입 테스트 시작하기"
          >
            1분 테스트 시작
          </button>
        </div>

        {/* 안내 메시지 */}
        <div className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
          <p>개인정보 없이 진행됩니다.</p>
          <p>총 15문항 • 예상 소요시간 1분</p>
        </div>

        {/* 추가 설명 */}
        <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl">
          <h2 className="text-lg font-semibold mb-3 text-light-text dark:text-dark-text">
            🎯 이런 걸 알 수 있어요
          </h2>
          <ul className="text-left space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <li>• 나의 협업 스타일과 성향</li>
            <li>• 팀에서의 역할과 강점</li>
            <li>• 나와 잘 맞는 팀원 유형</li>
            <li>• 더 나은 팀워크를 위한 팁</li>
          </ul>
        </div>

        {/* 소셜 프루프 (옵션) */}
        <div className="mt-8 text-xs text-gray-400">
          <p>✨ 이미 1,000명 이상이 테스트를 완료했어요</p>
        </div>
      </div>
    </div>
  );
}