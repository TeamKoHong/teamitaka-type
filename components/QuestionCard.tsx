'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

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
    <div className={`w-full h-screen bg-gray-100 relative overflow-hidden ${className} ${isAnimating ? 'animate-scale-in' : ''}`} style={{ fontFamily: 'Pretendard, sans-serif' }}>
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        </div>
      ) : (
        <>
          {/* 뒤로가기 바 - 위치: (0, 40), 크기: 390x63 */}
          <div className="absolute top-10 left-0 w-full h-16 flex items-center justify-between px-4">
            <button 
              className="p-2"
              onClick={() => window.history.back()}
              aria-label="뒤로가기"
            >
              <Image 
                src="/back-arrow.svg" 
                alt="뒤로가기" 
                width={7} 
                height={15}
                className="w-auto h-4"
              />
            </button>
            <span className="text-sm font-semibold text-gray-600" style={{ letterSpacing: '-0.03em' }}>
              {questionNumber} / {totalQuestions}
            </span>
            <div className="w-8"></div> {/* 중앙 정렬을 위한 빈 공간 */}
          </div>

          {/* 질문 박스 - 위치: (0, 108), 크기: 390x288 */}
          <div className="absolute top-27 left-0 w-full h-72 flex items-center justify-center px-4">
            <h2 className="text-xl font-semibold leading-8 text-black text-center" style={{ letterSpacing: '-0.03em', lineHeight: '30px' }}>
              {question.split(' ').length > 8 ? 
                question.replace(/(.{20,}?)\s/g, '$1\n').split('\n').map((line, index) => (
                  <span key={index}>
                    {line}
                    {index < question.replace(/(.{20,}?)\s/g, '$1\n').split('\n').length - 1 && <br />}
                  </span>
                )) : 
                question
              }
            </h2>
          </div>

          {/* 답변 버튼들 - 위치: (16, 213)과 (199, 213), 크기: 각각 390x63 */}
          <div className="absolute top-53 left-0 w-full h-16 flex gap-2 px-4">
            <button
              onClick={() => handleAnswerSelect(false)}
              className={`flex-1 h-16 rounded-lg flex items-center justify-center font-bold text-xl transition-all duration-200 ${
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
              className={`flex-1 h-16 rounded-lg flex items-center justify-center font-bold text-xl transition-all duration-200 ${
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