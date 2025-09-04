export interface OGMeta {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: string;
}

/**
 * 기본 OG 메타데이터 생성
 */
export function getDefaultOGMeta(): OGMeta {
  return {
    title: 'TEAMITAKA 타입 테스트 — 1분 만에 협업 타입 찾기',
    description: '나의 협업 성향은? 재미있는 질문들로 알아보는 팀워크 스타일 테스트. 1분 완료, 개인정보 없이 진행됩니다.',
    image: '/og/og-default.png',
    type: 'website'
  };
}

/**
 * 타입별 OG 메타데이터 생성
 */
export function getTypeOGMeta(typeCode: string, nickname: string, oneLiner: string): OGMeta {
  return {
    title: `나는 ${nickname}! | TEAMITAKA 타입 테스트`,
    description: `${oneLiner} — 내 협업 타입을 친구들과 공유해보세요!`,
    image: `/og/og-${typeCode.toLowerCase()}.png`,
    type: 'website'
  };
}

/**
 * 퀴즈 진행 중 OG 메타데이터
 */
export function getQuizOGMeta(progress: number): OGMeta {
  return {
    title: `퀴즈 진행 중 (${progress}%) | TEAMITAKA 타입 테스트`,
    description: '나의 협업 타입을 알아보는 중... 1분이면 완료!',
    image: '/og/og-default.png',
    type: 'website'
  };
}

/**
 * HTML meta 태그 문자열 생성 (SSR용)
 */
export function generateMetaTags(ogMeta: OGMeta): string {
  const baseUrl = 'https://type.teamitaka.com';
  
  return `
    <title>${ogMeta.title}</title>
    <meta name="description" content="${ogMeta.description}" />
    
    <!-- Open Graph -->
    <meta property="og:title" content="${ogMeta.title}" />
    <meta property="og:description" content="${ogMeta.description}" />
    <meta property="og:image" content="${baseUrl}${ogMeta.image}" />
    <meta property="og:url" content="${baseUrl}${ogMeta.url || ''}" />
    <meta property="og:type" content="${ogMeta.type || 'website'}" />
    <meta property="og:site_name" content="TEAMITAKA" />
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${ogMeta.title}" />
    <meta name="twitter:description" content="${ogMeta.description}" />
    <meta name="twitter:image" content="${baseUrl}${ogMeta.image}" />
    
    <!-- 추가 메타데이터 -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#F76241" />
    <link rel="canonical" href="${baseUrl}${ogMeta.url || ''}" />
  `.trim();
}