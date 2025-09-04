import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-light-text dark:text-dark-text mb-2">
            페이지를 찾을 수 없습니다
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/"
            className="btn-primary inline-block"
          >
            홈으로 돌아가기
          </Link>
          
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <p>또는</p>
            <Link
              href="/quiz"
              className="text-primary hover:text-primary/80 underline"
            >
              테스트 바로 시작하기
            </Link>
          </div>
        </div>

        <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            💡 <strong>팁:</strong> MBTI 타입 결과 페이지를 찾고 계신다면<br />
            올바른 형식은 <code className="bg-white dark:bg-gray-700 px-1 rounded">/result/ENFP</code> 같은 4글자 타입 코드입니다.
          </p>
        </div>
      </div>
    </div>
  );
}