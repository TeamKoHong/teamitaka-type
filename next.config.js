/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // App Router
  },
  images: {
    domains: ['type.teamitaka.com'],
  },
  // TypeScript 빌드 에러를 경고로 처리 (테스트 파일 때문)
  typescript: {
    ignoreBuildErrors: false,
  },
  // ESLint 에러를 경고로 처리
  eslint: {
    ignoreDuringBuilds: false,
  },
  async redirects() {
    return [];
  },
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
        ],
      },
    ];
  },
};

module.exports = nextConfig;