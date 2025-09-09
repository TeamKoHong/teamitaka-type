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

    // 현재 질문에 대한 답변만 추가 (중복 방지)
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    
    // 배열 길이를 현재 질문 + 1로 제한
    if (newAnswers.length > currentQuestion + 1) {
      newAnswers.splice(currentQuestion + 1);
    }
    
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
          
          // 답변 배열을 정확히 15개로 조정
          let finalAnswers = newAnswers.slice(0, questions.length);
          
          // 부족한 답변은 false로 채움 (안전장치)
          while (finalAnswers.length < questions.length) {
            finalAnswers.push(false);
          }
          
          console.log('최종 답변 배열:', finalAnswers);
          
          if (finalAnswers.length !== questions.length) {
            throw new Error(`답변 길이 불일치: ${finalAnswers.length}개 답변, ${questions.length}개 질문`);
          }
          
          const mbtiType = calculateMBTIType(finalAnswers);
          
          // 완료 이벤트
          if (typeof window !== 'undefined' && (window as any).plausible) {
            (window as any).plausible('Result Generated', { 
              props: { type: mbtiType } 
            });
          }

          router.push(`/analysis-complete?type=${encodeURIComponent(mbtiType)}`);
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
      // 현재 질문 위치까지만 답변을 유지
      setAnswers(prev => prev.slice(0, currentQuestion - 1));
    } else {
      router.push('/');
    }
  }, [currentQuestion, router]);

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
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Pretendard, Noto Sans KR, system-ui, sans-serif' }}>
      {/* 상단바 */}
      <div className="bg-black px-4 py-2 flex items-center justify-between text-white text-sm relative">
        <div className="flex items-center space-x-1">
          <span>9:41</span>
        </div>
        
        {/* Dynamic Island / Notch */}
        <div className="absolute left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-full border border-gray-600"></div>
        
        <div className="flex items-center space-x-1">
          {/* 신호 아이콘 */}
          <div className="flex space-x-1">
            <div className="w-1 h-3 bg-white rounded-sm"></div>
            <div className="w-1 h-3 bg-white rounded-sm"></div>
            <div className="w-1 h-3 bg-white rounded-sm"></div>
          </div>
          {/* WiFi 아이콘 */}
          <div className="w-4 h-3 border border-white rounded-sm relative">
            <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-white rounded-tl-sm"></div>
          </div>
          {/* 배터리 아이콘 */}
          <div className="w-6 h-3 border border-white rounded-sm relative">
            <div className="absolute right-0 top-0 w-1 h-1 bg-white rounded-r-sm"></div>
            <div className="absolute left-0.5 top-0.5 w-4 h-2 bg-white rounded-sm"></div>
          </div>
        </div>
      </div>

      {/* 헤더 */}
      <header className="px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="이전으로"
            disabled={isProcessing}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <h1 className="text-lg font-semibold text-black">
            팀플 성향 테스트
            {currentQuestion > 0 && <span className="text-gray-500 ml-2">(인터랙션)</span>}
          </h1>
          
          <div className="w-10"></div> {/* 균형을 위한 spacer */}
        </div>

        {/* 진행 표시 */}
        <div className="text-sm text-gray-500 mb-6">
          {currentQuestion + 1} / {questions.length}
        </div>
      </header>

      {/* 질문 카드 */}
      <div className="px-4">
        {isProcessing ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">결과 분석 중...</p>
          </div>
        ) : (
          <QuestionCard
            question={questions[currentQuestion].text}
            questionNumber={currentQuestion + 1}
            totalQuestions={questions.length}
            onAnswer={handleAnswer}
            key={currentQuestion}
          />
        )}
      </div>
    </div>
  );
}