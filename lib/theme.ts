export const theme = {
  colors: {
    primary: '#F76241',
    light: {
      bg: '#F7F7F8',
      text: '#222222',
      card: '#FFFFFF',
      secondary: '#666666',
      border: '#E5E5E5'
    },
    dark: {
      bg: '#1F1F1F',
      text: '#EDEDED',
      card: '#2A2A2A',
      secondary: '#AAAAAA',
      border: '#404040'
    }
  },
  
  shadows: {
    card: '0 8px 24px rgba(0, 0, 0, 0.08)',
    cardDark: '0 8px 24px rgba(0, 0, 0, 0.3)',
    button: '0 4px 12px rgba(247, 98, 65, 0.3)',
    hover: '0 6px 20px rgba(0, 0, 0, 0.15)'
  },

  borderRadius: {
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px'
  },

  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px'
  },

  typography: {
    fonts: {
      primary: ['Pretendard', 'Noto Sans KR', 'system-ui', 'sans-serif'],
    },
    sizes: {
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '30px',
      '4xl': '36px',
    },
    weights: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    lineHeights: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.6',
    }
  },

  transitions: {
    fast: '150ms ease-out',
    normal: '200ms ease-out',
    slow: '300ms ease-out'
  },

  breakpoints: {
    mobile: '430px',
    tablet: '768px',
    desktop: '1024px'
  }
} as const;

export type Theme = typeof theme;