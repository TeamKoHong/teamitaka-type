'use client';

import { useState, useEffect, useCallback } from 'react';

interface QuestionCardProps {
  question: string;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (answer: boolean) => void;
  isLoading?: boolean;
  className?: string;
}

export default function QuestionCard({ 
  question, 
  questionNumber, 
  totalQuestions, 
  onAnswer,
  isLoading = false,
  className = '' 
}: QuestionCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleAnswerSubmit = useCallback((answer: boolean = selectedAnswer!) => {
    if (answer === null || isLoading) return;
    
    onAnswer(answer);
    
    // 다음 질문을 위한 상태 리셋
    setTimeout(() => {
      setSelectedAnswer(null);
      setIsAnimating(false);
    }, 100);
  }, [selectedAnswer, isLoading, onAnswer]);

  const handleAnswerSelect = useCallback((answer: boolean) => {
    if (isLoading) return;
    
    setSelectedAnswer(answer);
    setIsAnimating(true);
    
    // 애니메이션 후 자동 진행
    setTimeout(() => {
      handleAnswerSubmit(answer);
    }, 300);
  }, [isLoading, handleAnswerSubmit]);

  // 키보드 네비게이션
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isLoading) return;
      
      switch (event.key) {
        case 'ArrowLeft':
        case '1':
          event.preventDefault();
          handleAnswerSelect(true);
          break;
        case 'ArrowRight':
        case '2':
          event.preventDefault();
          handleAnswerSelect(false);
          break;
        case 'Enter':
          event.preventDefault();
          if (selectedAnswer !== null) {
            handleAnswerSubmit();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedAnswer, isLoading, handleAnswerSelect, handleAnswerSubmit]);

  return (
    <div className={`w-full ${className} ${isAnimating ? 'animate-scale-in' : ''}`}>
      {isLoading ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">결과 분석 중...</p>
        </div>
      ) : (
        <>
          {/* 진행 표시 */}
          <div className="w-full flex justify-start mb-2">
            <div className="text-sm font-semibold text-gray-600" style={{ letterSpacing: '-0.03em' }}>
              {questionNumber} / {totalQuestions}
            </div>
          </div>

          {/* 질문 텍스트 */}
          <div className="w-full mb-8">
            <h2 className="text-xl font-semibold text-black leading-relaxed" style={{ letterSpacing: '-0.03em', lineHeight: '30px' }}>
              {question}
            </h2>
          </div>

          {/* 답변 버튼들 - 큰 크기 */}
          <div className="absolute bottom-0 left-0 right-0 flex px-4 pb-12 gap-2">
            <button
              onClick={() => handleAnswerSelect(false)}
              className={`w-44 h-48 rounded-lg flex items-center justify-center font-semibold text-xl transition-all duration-200 ${
                selectedAnswer === false 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-white text-black'
              }`}
              disabled={isLoading}
              aria-label="아니오"
              style={{ lineHeight: '30px' }}
            >
              아니오
            </button>

            <button
              onClick={() => handleAnswerSelect(true)}
              className={`w-44 h-48 rounded-lg flex items-center justify-center font-semibold text-xl transition-all duration-200 ${
                selectedAnswer === true 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-white text-black'
              }`}
              disabled={isLoading}
              aria-label="예"
              style={{ lineHeight: '30px' }}
            >
              예
            </button>
          </div>
        </>
      )}
    </div>
  );
}