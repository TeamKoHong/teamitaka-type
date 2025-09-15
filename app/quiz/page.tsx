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
      // 다음 질문으로 즉시 전환
      setCurrentQuestion(currentQuestion + 1);
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
  }, [handleBack]);

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
    <div className="min-h-screen relative" style={{ backgroundColor: '#f2f2f2', fontFamily: 'Pretendard, Noto Sans KR, system-ui, sans-serif', height: '844px' }}>
      {/* 질문 카드 */}
      <div className="px-4 h-full">
        {isProcessing ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">결과 분석 중...</p>
          </div>
        ) : (
          <QuestionCard
            question={questions[currentQuestion].text}
            questionNumber={currentQuestion + 1}
            totalQuestions={questions.length}
            onAnswer={handleAnswer}
            onBack={handleBack}
            key="quiz-card"
          />
        )}
      </div>

    </div>
  );
}