'use client';

import { TypeMeta } from '@/lib/types';

interface ResultCardProps {
  typeMeta: TypeMeta;
  isDark?: boolean;
  className?: string;
  captureMode?: boolean;
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
        {/* 닉네임 */}
        <h1 
          className="text-3xl font-bold mb-2"
          style={{ color: accentColor }}
        >
          {typeMeta.nickname}
        </h1>
        {/* 서브타이틀 */}
        {typeMeta.subtitle && (
          <p className={`text-lg font-medium mb-4 ${subtitleClass}`}>
            {typeMeta.subtitle}
          </p>
        )}
      </div>

      {/* 썸네일 영역 */}
      <div className="mb-8 flex justify-center">
        <div 
          className="w-32 h-32 rounded-2xl flex items-center justify-center"
          style={{ backgroundColor: accentColor + '10' }}
        >
          <div 
            className="text-4xl font-bold"
            style={{ color: accentColor }}
          >
            {typeMeta.nickname.charAt(0)}
          </div>
        </div>
      </div>

      {/* 설명 */}
      {typeMeta.description && (
        <div className="mb-8">
          <p className={`text-sm leading-relaxed ${textClass}`}>
            {typeMeta.description}
          </p>
        </div>
      )}

      {/* 능력치 */}
      <div className="mb-8">
        <h3 className="text-lg font-bold mb-4 text-center">능력치</h3>
        <div className="space-y-3">
          {Object.entries(typeMeta.stats).map(([statName, value]) => (
            <div key={statName} className="flex items-center justify-between">
              <span className="text-sm font-medium">{statName}</span>
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="w-4 h-4 rounded-full"
                      style={{
                        backgroundColor: i <= value ? accentColor : (isDark ? '#444' : '#e5e5e5')
                      }}
                    />
                  ))}
                </div>
                <span className="text-lg font-bold" style={{ color: accentColor }}>{value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 잘 맞는 티미 */}
      <div className="mb-8">
        <h3 className="text-lg font-bold mb-4 text-center">잘 맞는 티미</h3>
        <div className="space-y-4">
          {typeMeta.bestMatches.map((match, index) => (
            <div key={index} className="p-3 rounded-lg" style={{ backgroundColor: accentColor + '10' }}>
              <div className="flex items-start space-x-3">
                <div 
                  className="w-3 h-3 rounded-full mt-1 flex-shrink-0"
                  style={{ backgroundColor: accentColor }}
                />
                <div>
                  <div className="font-semibold text-sm" style={{ color: accentColor }}>
                    {match.name}
                  </div>
                  <div className="text-xs mt-1 leading-relaxed">
                    {match.reason}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 팀플 TIP */}
      {typeMeta.tips && typeMeta.tips.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-bold mb-4 text-center">팀플 TIP</h3>
          <div className="space-y-4">
            {typeMeta.tips.map((tip, index) => {
              const [title, description] = tip.split('\n');
              return (
                <div key={index} className="p-4 rounded-lg" style={{ backgroundColor: accentColor + '10' }}>
                  <div className="flex items-start space-x-3">
                    <div 
                      className="w-3 h-3 rounded-full mt-1 flex-shrink-0"
                      style={{ backgroundColor: accentColor }}
                    />
                    <div>
                      <div className="font-semibold text-sm mb-1" style={{ color: accentColor }}>
                        {title}
                      </div>
                      {description && (
                        <div className="text-xs leading-relaxed opacity-80">
                          {description}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 명언 */}
      {typeMeta.quote && (
        <div className="mb-8">
          <div className="p-4 rounded-lg text-center" style={{ backgroundColor: accentColor + '10' }}>
            <div className="text-sm font-medium italic" style={{ color: accentColor }}>
              {typeMeta.quote}
            </div>
          </div>
        </div>
      )}

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