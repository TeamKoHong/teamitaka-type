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

  // 질문 변경 시 상태 초기화
  useEffect(() => {
    setSelectedAnswer(null);
  }, [question]);

  const handleAnswerSelect = useCallback((answer: boolean) => {
    if (isLoading) return;
    
    // 즉시 선택 상태 표시
    setSelectedAnswer(answer);
    
    // 짧은 지연 후 답변 처리 (시각적 피드백 보장)
    setTimeout(() => {
      onAnswer(answer);
    }, 150);
  }, [isLoading, onAnswer]);

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
          // Enter 키는 비활성화 (즉시 선택 방식이므로 불필요)
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLoading, handleAnswerSelect]);

  return (
    <div className={`w-full h-screen bg-gray-100 relative overflow-hidden ${className}`} style={{ fontFamily: 'Pretendard, sans-serif' }}>
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        </div>
      ) : (
        <>
          {/* 뒤로가기 바 - 위치: (0, 40), 크기: 390x63 */}
          <div className="absolute left-0 w-full h-16 flex items-center justify-between px-4" style={{ top: '40px' }}>
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

          {/* 질문 박스 - 화면 중앙에 배치 */}
          <div className="absolute left-0 w-full flex items-center justify-center px-4" style={{ top: '120px', bottom: '120px' }}>
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

          {/* 답변 버튼들 - 화면 하단에 고정, 175x186 비율 */}
          <div className="absolute left-0 w-full flex gap-2 px-4 justify-center" style={{ bottom: '40px' }}>
            <button
              onClick={() => handleAnswerSelect(false)}
              className={`w-[175px] h-[186px] rounded-lg flex items-center justify-center font-bold text-xl ${
                selectedAnswer === false 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-white text-black'
              }`}
              disabled={isLoading || selectedAnswer !== null}
              aria-label="아니오"
              style={{ lineHeight: '30px' }}
            >
              아니오
            </button>

            <button
              onClick={() => handleAnswerSelect(true)}
              className={`w-[175px] h-[186px] rounded-lg flex items-center justify-center font-bold text-xl ${
                selectedAnswer === true 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-white text-black'
              }`}
              disabled={isLoading || selectedAnswer !== null}
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