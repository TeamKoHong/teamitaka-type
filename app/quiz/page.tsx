'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import ProgressBar from '@/components/ProgressBar';
import QuestionCard from '@/components/QuestionCard';
import { questions } from '@/lib/questions';
import { calculateMBTIType, type Answer } from '@/lib/scoring';

export default function QuizPage() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAnswer = async (answer: boolean) => {
    if (isProcessing) return;

    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    // 마지막 질문 완료 시
    if (currentQuestion + 1 === questions.length) {
      setIsProcessing(true);

      // 분석 이벤트
      if (typeof window !== 'undefined' && (window as any).plausible) {
        (window as any).plausible('Quiz Completed');
      }

      // 결과 분석 (의도적 지연으로 UX 개선)
      setTimeout(() => {
        try {
          console.log('답변 배열 길이:', newAnswers.length);
          console.log('질문 총 개수:', questions.length);
          console.log('답변 내용:', newAnswers);
          
          if (newAnswers.length !== questions.length) {
            throw new Error(`답변 길이 불일치: ${newAnswers.length}개 답변, ${questions.length}개 질문`);
          }
          
          const mbtiType = calculateMBTIType(newAnswers);
          
          // 완료 이벤트
          if (typeof window !== 'undefined' && (window as any).plausible) {
            (window as any).plausible('Result Generated', { 
              props: { type: mbtiType } 
            });
          }

          router.push(`/result/${mbtiType}`);
        } catch (error) {
          console.error('타입 계산 오류:', error);
          alert('결과 분석 중 오류가 발생했습니다. 다시 시도해주세요.');
          setIsProcessing(false);
        }
      }, 1500);
    } else {
      // 다음 질문으로
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 200);
    }
  };

  const handleBack = useCallback(() => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setAnswers(answers.slice(0, -1));
    } else {
      router.push('/');
    }
  }, [currentQuestion, answers, router]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleBack();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentQuestion]);

  // 뒤로가기 제스처 처리 (모바일)
  useEffect(() => {
    const handlePopstate = () => {
      if (currentQuestion > 0) {
        handleBack();
      }
    };

    window.addEventListener('popstate', handlePopstate);
    return () => window.removeEventListener('popstate', handlePopstate);
  }, [currentQuestion, handleBack]);

  const isLastQuestion = currentQuestion + 1 === questions.length;

  return (
    <div className="min-h-screen p-4 quiz-container">
      {/* 상단 헤더 */}
      <header className="max-w-2xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            aria-label="이전으로"
            disabled={isProcessing}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <h1 className="text-lg font-semibold text-light-text dark:text-dark-text">
            팀플 성향 테스트
          </h1>
          
          <div className="w-10"></div> {/* 균형을 위한 spacer */}
        </div>

        {/* 진행률 바 */}
        <ProgressBar 
          current={currentQuestion + 1} 
          total={questions.length}
          className="mb-2"
        />
      </header>

      {/* 질문 카드 */}
      <div className="max-w-2xl mx-auto">
        {isProcessing ? (
          <QuestionCard
            question=""
            questionNumber={currentQuestion + 1}
            totalQuestions={questions.length}
            onAnswer={handleAnswer}
            isLoading={true}
          />
        ) : (
          <QuestionCard
            question={questions[currentQuestion].text}
            questionNumber={currentQuestion + 1}
            totalQuestions={questions.length}
            onAnswer={handleAnswer}
            key={currentQuestion} // 질문 변경 시 컴포넌트 리렌더링
          />
        )}
      </div>

      {/* 진행 상태 안내 */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 text-center">
        <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-card text-sm">
          {isProcessing ? (
            <span className="text-primary font-medium">결과 분석 중...</span>
          ) : isLastQuestion ? (
            <span className="text-primary font-medium">마지막 질문이에요!</span>
          ) : (
            <span className="text-gray-500 dark:text-gray-400">
              키보드 ← → 또는 스와이프로도 답변 가능
            </span>
          )}
        </div>
      </div>
    </div>
  );
}