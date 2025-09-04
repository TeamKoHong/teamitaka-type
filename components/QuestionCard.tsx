'use client';

import { useState, useEffect } from 'react';

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
  }, [selectedAnswer, isLoading]);

  const handleAnswerSelect = (answer: boolean) => {
    if (isLoading) return;
    
    setSelectedAnswer(answer);
    setIsAnimating(true);
    
    // 애니메이션 후 자동 진행
    setTimeout(() => {
      handleAnswerSubmit(answer);
    }, 300);
  };

  const handleAnswerSubmit = (answer: boolean = selectedAnswer!) => {
    if (answer === null || isLoading) return;
    
    onAnswer(answer);
    
    // 다음 질문을 위한 상태 리셋
    setTimeout(() => {
      setSelectedAnswer(null);
      setIsAnimating(false);
    }, 100);
  };

  return (
    <div className={`card max-w-2xl mx-auto ${className} ${isAnimating ? 'animate-scale-in' : ''}`}>
      {isLoading ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400">결과 분석 중...</p>
        </div>
      ) : (
        <>
          <div className="text-center mb-8">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              질문 {questionNumber} / {totalQuestions}
            </div>
            <h2 className="question-text">
              {question}
            </h2>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => handleAnswerSelect(true)}
              className={`choice-button ${selectedAnswer === true ? 'selected' : 'unselected'}`}
              disabled={isLoading}
              aria-label="예"
            >
              <div className="flex items-center justify-between">
                <span>예</span>
                <span className="text-sm opacity-70">← 또는 1</span>
              </div>
            </button>

            <button
              onClick={() => handleAnswerSelect(false)}
              className={`choice-button ${selectedAnswer === false ? 'selected' : 'unselected'}`}
              disabled={isLoading}
              aria-label="아니오"
            >
              <div className="flex items-center justify-between">
                <span>아니오</span>
                <span className="text-sm opacity-70">→ 또는 2</span>
              </div>
            </button>
          </div>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              감으로 빠르게 선택해도 좋아요
            </p>
          </div>
        </>
      )}
    </div>
  );
}