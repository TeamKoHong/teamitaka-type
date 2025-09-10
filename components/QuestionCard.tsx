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
      {/* iPhone 상태바 */}
      <div className="absolute top-0 left-0 right-0 h-12 bg-black text-white flex items-center justify-between px-4 z-20">
        <div className="text-sm font-semibold">9:41</div>
        <div className="flex items-center space-x-1">
          <div className="w-6 h-3 border border-white rounded-sm">
            <div className="w-4 h-2 bg-white rounded-sm m-0.5"></div>
          </div>
          <div className="w-4 h-3 border border-white rounded-sm"></div>
          <div className="w-4 h-3 border border-white rounded-sm"></div>
        </div>
      </div>

      {/* 뒤로가기 버튼 - 상태바 아래 */}
      <button 
        className="absolute top-14 left-4 z-10 p-2"
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

      {/* 진행 표시 - 뒤로가기 버튼 아래 */}
      <div className="absolute top-20 left-4 z-10">
        <span className="text-sm font-semibold text-gray-600" style={{ letterSpacing: '-0.03em' }}>
          {questionNumber} / {totalQuestions}
        </span>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        </div>
      ) : (
        <>
          {/* 질문 영역 - 중앙 상단 */}
          <div className="absolute top-32 left-4 right-4 text-center">
            <h2 className="text-xl font-semibold leading-8 text-black" style={{ letterSpacing: '-0.03em', lineHeight: '30px' }}>
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

          {/* 답변 버튼들 - 하단에 고정, 큰 세로형 직사각형 버튼 */}
          <div className="absolute bottom-12 left-4 right-4 flex gap-2 justify-center">
            <button
              onClick={() => handleAnswerSelect(false)}
              className={`w-[175px] h-[186px] rounded-lg flex items-center justify-center font-bold text-xl transition-all duration-200 ${
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
              className={`w-[175px] h-[186px] rounded-lg flex items-center justify-center font-bold text-xl transition-all duration-200 ${
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

          {/* iPhone 홈 인디케이터 */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-black rounded-full"></div>
        </>
      )}
    </div>
  );
}