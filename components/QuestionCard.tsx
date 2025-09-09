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
    <div className={`max-w-2xl mx-auto ${className} ${isAnimating ? 'animate-scale-in' : ''}`}>
      {isLoading ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300">결과 분석 중...</p>
        </div>
      ) : (
        <>
          {/* 질문 카드 */}
          <div className="bg-white rounded-lg p-6 mb-6 shadow-lg">
            <h2 className="text-lg font-medium text-black leading-relaxed text-center">
              {question}
            </h2>
          </div>

          {/* 답변 버튼들 - 가로 레이아웃 */}
          <div className="flex space-x-4">
            <button
              onClick={() => handleAnswerSelect(false)}
              className={`flex-1 py-4 px-6 rounded-lg text-center font-medium transition-all duration-200 ${
                selectedAnswer === false 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-white text-black border border-gray-200'
              }`}
              disabled={isLoading}
              aria-label="아니오"
            >
              아니오
            </button>

            <button
              onClick={() => handleAnswerSelect(true)}
              className={`flex-1 py-4 px-6 rounded-lg text-center font-medium transition-all duration-200 ${
                selectedAnswer === true 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-white text-black border border-gray-200'
              }`}
              disabled={isLoading}
              aria-label="예"
            >
              예
            </button>
          </div>
        </>
      )}
    </div>
  );
}