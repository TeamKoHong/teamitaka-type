/** @type {import('next').NextConfig} */
const nextConfig = {
  // 개발 서버 안정성 향상
  experimental: {
    // App Router
    optimizeCss: false, // critters 이슈로 인해 비활성화
    // 메모리 사용량 최적화
    memoryBasedWorkersCount: true,
  },
  
  // 이미지 최적화 설정
  images: {
    domains: ['type.teamitaka.com'],
    unoptimized: false,
    // 이미지 로딩 최적화
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // TypeScript 설정
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // ESLint 설정
  eslint: {
    ignoreDuringBuilds: false,
  },
  
        // 웹팩 최적화
        webpack: (config, { dev, isServer }) => {
          // 개발 환경에서 메모리 사용량 최적화
          if (dev) {
            config.watchOptions = {
              poll: 1000,
              aggregateTimeout: 300,
              ignored: /node_modules/,
            };
            
            // 캐시 최적화
            config.cache = {
              type: 'memory',
              maxGenerations: 1,
            };
          }
          
          // MIME 타입 설정
          config.module.rules.push({
            test: /\.(js|mjs|jsx)$/,
            type: 'javascript/auto',
          });
          
          return config;
        },
  
  // 개발 서버 설정
  devIndicators: {
    buildActivity: true,
    buildActivityPosition: 'bottom-right',
  },
  
  // 정적 파일 서빙 최적화
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        // MIME 타입 명시적 설정 (HTML만)
        {
          key: 'Content-Type',
          value: 'text/html; charset=utf-8',
        },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // JavaScript 파일 MIME 타입 설정
      {
        source: '/_next/static/chunks/(.*).js',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/javascript; charset=utf-8',
          },
        ],
      },
      // CSS 파일 MIME 타입 설정
      {
        source: '/_next/static/css/(.*).css',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/css; charset=utf-8',
          },
        ],
      },
      // CSS 청크 파일 MIME 타입 설정
      {
        source: '/_next/static/chunks/app_globals_(.*).css',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/css; charset=utf-8',
          },
        ],
      },
      // 모든 CSS 청크 파일 MIME 타입 설정
      {
        source: '/_next/static/chunks/(.*).css',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/css; charset=utf-8',
          },
        ],
      },
      // 이미지 파일 MIME 타입 설정
      {
        source: '/assets/(.*).png',
        headers: [
          {
            key: 'Content-Type',
            value: 'image/png',
          },
        ],
      },
      {
        source: '/assets/(.*).jpg',
        headers: [
          {
            key: 'Content-Type',
            value: 'image/jpeg',
          },
        ],
      },
      {
        source: '/assets/(.*).jpeg',
        headers: [
          {
            key: 'Content-Type',
            value: 'image/jpeg',
          },
        ],
      },
      {
        source: '/assets/(.*).svg',
        headers: [
          {
            key: 'Content-Type',
            value: 'image/svg+xml',
          },
        ],
      },
      // 개발 모드 특수 파일들 MIME 타입 설정
      {
        source: '/_next/static/development/_ssgManifest.js',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/javascript; charset=utf-8',
          },
        ],
      },
      {
        source: '/_next/static/development/_buildManifest.js',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/javascript; charset=utf-8',
          },
        ],
      },
      {
        source: '/_next/static/development/(.*).js',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/javascript; charset=utf-8',
          },
        ],
      },
    ];
  },
  
  // 리다이렉트 설정
  async redirects() {
    return [];
  },
  
  // 압축 설정
  compress: true,
  
  // 파워드 바이 헤더 제거
  poweredByHeader: false,
  
  // 엄격 모드 비활성화 (개발 안정성)
  reactStrictMode: false,
};

module.exports = nextConfig;