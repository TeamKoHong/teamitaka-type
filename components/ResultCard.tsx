'use client';

import { TypeMeta } from '@/lib/types';

interface ResultCardProps {
  typeMeta: TypeMeta;
  isDark?: boolean;
  className?: string;
  captureMode?: boolean; // 캡쳐용 모드
}

export default function ResultCard({ 
  typeMeta, 
  isDark = false, 
  className = '',
  captureMode = false 
}: ResultCardProps) {
  const cardTheme = isDark ? 'dark' : 'light';
  const bgClass = isDark ? 'bg-gray-900' : 'bg-white';
  const textClass = isDark ? 'text-white' : 'text-gray-900';
  const subtitleClass = isDark ? 'text-gray-300' : 'text-gray-600';
  const accentColor = typeMeta.themeAccent || '#F76241';

  return (
    <div 
      id="result-card"
      className={`result-card ${bgClass} ${textClass} ${className}`}
      style={{
        fontFamily: 'Pretendard, Noto Sans KR, system-ui, sans-serif',
        ...(captureMode && {
          width: '400px',
          minHeight: '600px',
          position: 'relative'
        })
      }}
    >
      {/* 카드 헤더 */}
      <div className="text-center mb-8">
        {/* 타입 코드 */}
        <div 
          className="inline-block px-4 py-2 rounded-full text-sm font-semibold mb-4"
          style={{ 
            backgroundColor: accentColor + '20', 
            color: accentColor 
          }}
        >
          {typeMeta.code}
        </div>
        
        {/* 닉네임 */}
        <h1 
          className="type-nickname"
          style={{ color: accentColor }}
        >
          {typeMeta.nickname}
        </h1>
        
        {/* 한줄 소개 */}
        <p className={`type-subtitle ${subtitleClass}`}>
          {typeMeta.oneLiner}
        </p>
      </div>

      {/* 썸네일 영역 (추후 일러스트 대체) */}
      <div className="mb-8 flex justify-center">
        <div 
          className="w-32 h-32 rounded-2xl flex items-center justify-center"
          style={{ backgroundColor: accentColor + '10' }}
        >
          <div 
            className="text-4xl font-bold"
            style={{ color: accentColor }}
          >
            {typeMeta.code.charAt(0)}
          </div>
        </div>
      </div>

      {/* 타입 설명 */}
      <div className="mb-6">
        <p className="text-sm leading-relaxed text-left">
          {typeMeta.description}
        </p>
      </div>

      {/* 강점 */}
      <div className="mb-6">
        <h3 className="section-title text-base mb-3">주요 강점</h3>
        <div className="flex flex-wrap gap-2">
          {typeMeta.strengths.map((strength, index) => (
            <span
              key={index}
              className="px-3 py-1 text-sm rounded-full border"
              style={{
                borderColor: accentColor + '30',
                backgroundColor: accentColor + '10',
                color: isDark ? accentColor : accentColor
              }}
            >
              {strength}
            </span>
          ))}
        </div>
      </div>

      {/* 궁합 */}
      <div className="mb-6">
        <h3 className="section-title text-base mb-3">나와 잘 어울리는 티미 유형</h3>
        <div className="space-y-2">
          {typeMeta.bestMatches.map((match, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: accentColor }}
              />
              <span className="text-sm">{match}</span>
            </div>
          ))}
        </div>
      </div>

      {/* TIP */}
      <div className="mb-6">
        <h3 className="section-title text-base mb-3">적응티미 TIP</h3>
        <div className="space-y-3">
          {typeMeta.tips.map((tip, index) => (
            <div key={index} className="tip-item">
              <div 
                className="tip-number"
                style={{ backgroundColor: accentColor }}
              >
                {index + 1}
              </div>
              <p className="text-sm leading-relaxed">{tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 하단 안내 */}
      {captureMode && (
        <div className="mt-8 pt-6 border-t text-center" style={{ borderColor: isDark ? '#444' : '#eee' }}>
          <p className="text-xs opacity-70">
            TEAMITAKA 타입 테스트 • type.teamitaka.com
          </p>
          <p className="text-xs opacity-50 mt-1">
            유형은 절대적 기준이 아니라 참고 지표예요
          </p>
        </div>
      )}
    </div>
  );
}