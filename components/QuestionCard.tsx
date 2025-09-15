'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useBrowserOptimization } from '@/lib/hooks/useBrowserOptimization';
import { useSafariViewport } from '@/lib/hooks/useSafariViewport';

interface QuestionCardProps {
  question: string;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (answer: boolean) => void;
  onBack?: () => void;
  isLoading?: boolean;
  className?: string;
}

export default function QuestionCard({ 
  question, 
  questionNumber, 
  totalQuestions, 
  onAnswer,
  onBack,
  isLoading = false,
  className = ''
}: QuestionCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const browserOptimization = useBrowserOptimization();
  const { viewportHeight, isSafari } = useSafariViewport();

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
    <div 
      className={`w-full bg-gray-100 flex flex-col ${browserOptimization.layoutClass} ${
        isSafari ? 'safari-dynamic-height' : 'min-h-screen'
      } ${className}`} 
      style={{ 
        fontFamily: 'Pretendard, sans-serif',
        ...(isSafari && {
          height: `calc(var(--vh, 1vh) * 100)`,
          minHeight: `calc(var(--vh, 1vh) * 100)`
        })
      }}
    >
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        </div>
      ) : (
        <>
          {/* 뒤로가기 바 - 좌측 정렬 */}
          <div className="flex-shrink-0 h-16 flex items-center px-4 pt-6">
            <button 
              className="p-2 mr-4"
              onClick={onBack || (() => window.history.back())}
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
            <span className="font-semibold text-gray-600 text-responsive-header" style={{ 
              letterSpacing: '-0.03em'
            }}>
              {questionNumber} / {totalQuestions}
            </span>
          </div>

          {/* 질문 박스 - 유연한 중앙 배치 */}
          <div className="flex-1 flex items-center justify-center px-6 py-12">
            <h2 className="font-semibold text-black text-center text-responsive-question" style={{ 
              letterSpacing: '-0.03em', 
              lineHeight: '1.5'
            }}>
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

          {/* 답변 버튼들 - Safari 대응 */}
          <div className={`flex-shrink-0 flex gap-3 px-6 justify-center ${
            isSafari ? 'safari-bottom-safe' : 'pb-8'
          }`}>
            <button
              onClick={() => handleAnswerSelect(false)}
              className={`w-[160px] h-[180px] rounded-xl flex items-center justify-center font-bold text-responsive-button ${
                selectedAnswer === false 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-white text-black'
              }`}
              disabled={isLoading || selectedAnswer !== null}
              aria-label="아니오"
              style={{ 
                lineHeight: '1.2'
              }}
            >
              아니오
            </button>

            <button
              onClick={() => handleAnswerSelect(true)}
              className={`w-[160px] h-[180px] rounded-xl flex items-center justify-center font-bold text-responsive-button ${
                selectedAnswer === true 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-white text-black'
              }`}
              disabled={isLoading || selectedAnswer !== null}
              aria-label="예"
              style={{ 
                lineHeight: '1.2'
              }}
            >
              예
            </button>
          </div>
        </>
      )}
    </div>
  );
}