export interface Question {
  id: number;
  text: string;
  choices: [string, string]; // [예, 아니오]
}

export const questions: Question[] = [
  {
    id: 1,
    text: "새로운 프로젝트가 시작되면 먼저 팀원들과 만나서 이야기하고 싶다.",
    choices: ["예", "아니오"]
  },
  {
    id: 2,
    text: "회의 중에 자주 발언하고 의견을 나누는 편이다.",
    choices: ["예", "아니오"]
  },
  {
    id: 3,
    text: "팀 내에서 분위기 메이커 역할을 자주 한다.",
    choices: ["예", "아니오"]
  },
  {
    id: 4,
    text: "혼자만의 시간을 가지고 깊이 생각한 후에 의견을 말한다.",
    choices: ["예", "아니오"]
  },
  {
    id: 5,
    text: "프로젝트를 진행할 때 새로운 방식을 시도해보고 싶어한다.",
    choices: ["예", "아니오"]
  },
  {
    id: 6,
    text: "미래의 가능성과 잠재력을 중요하게 생각한다.",
    choices: ["예", "아니오"]
  },
  {
    id: 7,
    text: "문제를 해결할 때 논리적 분석을 먼저 한다.",
    choices: ["예", "아니오"]
  },
  {
    id: 8,
    text: "객관적인 기준과 효율성을 중시한다.",
    choices: ["예", "아니오"]
  },
  {
    id: 9,
    text: "팀원들의 화합과 분위기를 우선적으로 고려한다.",
    choices: ["예", "아니오"]
  },
  {
    id: 10,
    text: "아이디어를 발전시키고 확장하는 것을 좋아한다.",
    choices: ["예", "아니오"]
  },
  {
    id: 11,
    text: "결정을 내릴 때 팀원들의 감정과 상황을 고려한다.",
    choices: ["예", "아니오"]
  },
  {
    id: 12,
    text: "갈등 상황에서 모든 사람이 만족할 해결책을 찾으려 한다.",
    choices: ["예", "아니오"]
  },
  {
    id: 13,
    text: "계획을 세우기보다는 상황에 맞춰 유연하게 대응한다.",
    choices: ["예", "아니오"]
  },
  {
    id: 14,
    text: "검증된 방법과 구체적인 데이터를 선호한다.",
    choices: ["예", "아니오"]
  },
  {
    id: 15,
    text: "마감일보다는 완성도에 더 신경을 쓴다.",
    choices: ["예", "아니오"]
  }
];

// 스코어링 가중치 테이블
export const SCORING_WEIGHTS = {
  // E(외향) - I(내향)
  EI: {
    1: { axis: 'E', weight: 1.0 },  // 새로운 프로젝트에서 팀원들과 이야기
    2: { axis: 'E', weight: 1.0 },  // 회의 중 자주 발언
    3: { axis: 'E', weight: 1.0 },  // 분위기 메이커 역할
    4: { axis: 'I', weight: 0.7 }   // 혼자 생각한 후 의견 (I에 가중치)
  },
  
  // N(직관) - S(감각)  
  NS: {
    5: { axis: 'N', weight: 1.0 },  // 새로운 방식 시도
    6: { axis: 'N', weight: 1.0 },  // 미래 가능성 중시
    10: { axis: 'N', weight: 1.0 }, // 아이디어 발전
    14: { axis: 'S', weight: 1.0 }  // 검증된 방법, 구체적 데이터
  },
  
  // T(사고) - F(감정)
  TF: {
    7: { axis: 'T', weight: 1.0 },  // 논리적 분석 우선
    8: { axis: 'T', weight: 1.0 },  // 객관적 기준, 효율성
    9: { axis: 'F', weight: 1.0 },  // 팀원 화합과 분위기
    11: { axis: 'F', weight: 1.0 }, // 팀원 감정과 상황 고려
    12: { axis: 'F', weight: 1.0 }  // 모든 사람 만족하는 해결책
  },
  
  // P(인식) - J(판단)
  PJ: {
    4: { axis: 'J', weight: 0.3 },  // 깊이 생각 후 의견 (J에 약한 가중치)
    13: { axis: 'P', weight: 1.0 }, // 유연한 대응
    15: { axis: 'P', weight: 1.0 }  // 완성도 중시 (마감일보다)
  }
} as const;