export interface TypeMeta {
  code: string;
  nickname: string;
  stats: {
    [key: string]: number;
  };
  bestMatches: {
    name: string;
    reason: string;
  }[];
  themeAccent?: string;
}

export const TYPE_METADATA: Record<string, TypeMeta> = {
  '활동티미': {
    code: '활동티미',
    nickname: '활동티미',
    stats: {
      '긍정력': 5,
      '에너지': 5,
      '인사력': 4,
      '번개력': 4
    },
    bestMatches: [
      { name: '감각티미', reason: '즉흥적 아이디어와 순발력이 잘 맞음' },
      { name: '긍정티미', reason: '활기와 분위기를 함께 살릴 수 있음' }
    ],
    themeAccent: '#FF6B6B'
  },

  '감각티미': {
    code: '감각티미',
    nickname: '감각티미',
    stats: {
      '순발력': 5,
      '창의력': 4,
      '즉흥력': 5,
      '분위기 메이킹': 3
    },
    bestMatches: [
      { name: '활동티미', reason: '에너지와 행동력이 팀에 시너지' },
      { name: '실험티미', reason: '창의적 시도를 함께 빠르게 실행' }
    ],
    themeAccent: '#4ECDC4'
  },

  '통찰티미': {
    code: '통찰티미',
    nickname: '통찰티미',
    stats: {
      '통찰력': 5,
      '직관력': 4,
      '분석적 사고': 3,
      '미래지향성': 4
    },
    bestMatches: [
      { name: '분석티미', reason: '직관과 데이터 기반 판단이 잘 맞음' },
      { name: '안정티미', reason: '차분함으로 큰 그림을 유지' }
    ],
    themeAccent: '#45B7D1'
  },

  '융합티미': {
    code: '융합티미',
    nickname: '융합티미',
    stats: {
      '연결력': 5,
      '협업력': 4,
      '창의력': 4,
      '융통성': 3
    },
    bestMatches: [
      { name: '조율티미', reason: '다양한 의견을 조화롭게 연결' },
      { name: '창의티미', reason: '아이디어를 실질적 해결책으로 엮음' }
    ],
    themeAccent: '#96CEB4'
  },

  '긍정티미': {
    code: '긍정티미',
    nickname: '긍정티미',
    stats: {
      '긍정력': 5,
      '회복탄력성': 4,
      '격려력': 5,
      '낙관성': 4
    },
    bestMatches: [
      { name: '활동티미', reason: '함께 팀 분위기를 활기차게 만들 수 있음' },
      { name: '안정티미', reason: '차분함 속에서도 팀 사기를 지켜줌' }
    ],
    themeAccent: '#FFEAA7'
  },

  '실험티미': {
    code: '실험티미',
    nickname: '실험티미',
    stats: {
      '도전력': 5,
      '실행력': 4,
      '즉흥력': 5,
      '창의력': 4
    },
    bestMatches: [
      { name: '감각티미', reason: '즉흥적 시도와 창의적 실행력 시너지' },
      { name: '창의티미', reason: '새로운 아이디어를 실험하며 발전' }
    ],
    themeAccent: '#FD79A8'
  },

  '적응티미': {
    code: '적응티미',
    nickname: '적응티미',
    stats: {
      '유연성': 5,
      '수용력': 4,
      '협력력': 5,
      '상황대응력': 4
    },
    bestMatches: [
      { name: '안정티미', reason: '변화 속에서도 팀을 부드럽게 연결' },
      { name: '조율티미', reason: '다양한 의견 속에서 균형 유지' }
    ],
    themeAccent: '#81ECEC'
  },

  '안정티미': {
    code: '안정티미',
    nickname: '안정티미',
    stats: {
      '차분함': 5,
      '균형감': 5,
      '인내심': 4,
      '신뢰성': 4
    },
    bestMatches: [
      { name: '분석티미', reason: '차분함과 논리적 판단이 조화' },
      { name: '적응티미', reason: '유연성과 안정감이 시너지' }
    ],
    themeAccent: '#B2DFDB'
  },

  '분석티미': {
    code: '분석티미',
    nickname: '분석티미',
    stats: {
      '논리력': 5,
      '데이터력': 5,
      '계획력': 4,
      '집중력': 4
    },
    bestMatches: [
      { name: '통찰티미', reason: '직관과 논리적 판단이 보완됨' },
      { name: '완벽티미', reason: '체계적 계획과 정확성을 공유' }
    ],
    themeAccent: '#A29BFE'
  },

  '창의티미': {
    code: '창의티미',
    nickname: '창의티미',
    stats: {
      '창의력': 5,
      '독창성': 5,
      '상상력': 4,
      '아이디어 실행력': 3
    },
    bestMatches: [
      { name: '실험티미', reason: '아이디어를 실제로 시도하며 시너지' },
      { name: '융합티미', reason: '다양한 의견과 아이디어를 연결' }
    ],
    themeAccent: '#FDCB6E'
  },

  '조율티미': {
    code: '조율티미',
    nickname: '조율티미',
    stats: {
      '협상력': 5,
      '조화력': 5,
      '의사소통력': 4,
      '균형감': 4
    },
    bestMatches: [
      { name: '융합티미', reason: '다양한 의견을 조화롭게 맞춤' },
      { name: '적응티미', reason: '팀 내 균형과 흐름 유지에 도움' }
    ],
    themeAccent: '#E17055'
  },

  '완벽티미': {
    code: '완벽티미',
    nickname: '완벽티미',
    stats: {
      '완성도': 5,
      '정밀함': 5,
      '체계력': 4,
      '집중력': 4
    },
    bestMatches: [
      { name: '분석티미', reason: '계획적 접근과 정확성이 잘 맞음' },
      { name: '안정티미', reason: '차분함과 완성도를 함께 보조' }
    ],
    themeAccent: '#6C5CE7'
  }
};