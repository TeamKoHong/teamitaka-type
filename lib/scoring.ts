import { SCORING_WEIGHTS } from './questions';

export type Answer = boolean; // true = 예, false = 아니오
export type Answers = Answer[];
export type MBTIType = string; // ENFP, INTJ 등

interface AxisScores {
  E: number;
  I: number;
  N: number;
  S: number;
  T: number;
  F: number;
  P: number;
  J: number;
}

/**
 * 사용자의 답변을 기반으로 MBTI 타입을 계산합니다.
 * @param answers 15개 질문에 대한 답변 배열 (true=예, false=아니오)
 * @returns MBTI 4글자 타입 (예: "ENFP")
 */
export function calculateMBTIType(answers: Answers): MBTIType {
  if (answers.length !== 15) {
    throw new Error('15개의 답변이 모두 필요합니다.');
  }

  // 각 축별 점수 초기화
  const scores: AxisScores = {
    E: 0, I: 0,
    N: 0, S: 0,
    T: 0, F: 0,
    P: 0, J: 0
  };

  // 답변을 바탕으로 점수 계산
  answers.forEach((answer, index) => {
    const questionId = index + 1;
    const value = answer ? 1 : -1; // 예=+1, 아니오=-1

    // E-I 축 점수 계산
    const eiWeight = SCORING_WEIGHTS.EI[questionId as keyof typeof SCORING_WEIGHTS.EI];
    if (eiWeight) {
      const weightedValue = value * eiWeight.weight;
      if (eiWeight.axis === 'E') {
        scores.E += weightedValue;
      } else {
        scores.I += Math.abs(weightedValue); // I는 항상 양수로 계산
      }
    }

    // N-S 축 점수 계산
    const nsWeight = SCORING_WEIGHTS.NS[questionId as keyof typeof SCORING_WEIGHTS.NS];
    if (nsWeight) {
      const weightedValue = value * nsWeight.weight;
      if (nsWeight.axis === 'N') {
        scores.N += weightedValue;
      } else {
        scores.S += Math.abs(weightedValue);
      }
    }

    // T-F 축 점수 계산
    const tfWeight = SCORING_WEIGHTS.TF[questionId as keyof typeof SCORING_WEIGHTS.TF];
    if (tfWeight) {
      const weightedValue = value * tfWeight.weight;
      if (tfWeight.axis === 'T') {
        scores.T += weightedValue;
      } else {
        scores.F += Math.abs(weightedValue);
      }
    }

    // P-J 축 점수 계산
    const pjWeight = SCORING_WEIGHTS.PJ[questionId as keyof typeof SCORING_WEIGHTS.PJ];
    if (pjWeight) {
      const weightedValue = value * pjWeight.weight;
      if (pjWeight.axis === 'P') {
        scores.P += weightedValue;
      } else {
        scores.J += Math.abs(weightedValue);
      }
    }
  });

  // 각 축에서 더 높은 점수를 가진 성향 선택
  const type = [
    scores.E > scores.I ? 'E' : 'I',
    scores.N > scores.S ? 'N' : 'S', 
    scores.T > scores.F ? 'T' : 'F',
    scores.P > scores.J ? 'P' : 'J'
  ].join('');

  return type as MBTIType;
}

/**
 * 답변 진행률을 계산합니다.
 * @param answers 현재까지의 답변 배열
 * @returns 0-100 사이의 진행률
 */
export function calculateProgress(answers: Answers): number {
  return Math.round((answers.length / 15) * 100);
}

/**
 * 특정 질문 번호에 대한 가중치 정보를 반환합니다.
 * @param questionId 질문 번호 (1-15)
 * @returns 해당 질문의 가중치 정보
 */
export function getQuestionWeight(questionId: number) {
  const weights = [];
  
  if (SCORING_WEIGHTS.EI[questionId as keyof typeof SCORING_WEIGHTS.EI]) {
    weights.push(SCORING_WEIGHTS.EI[questionId as keyof typeof SCORING_WEIGHTS.EI]);
  }
  if (SCORING_WEIGHTS.NS[questionId as keyof typeof SCORING_WEIGHTS.NS]) {
    weights.push(SCORING_WEIGHTS.NS[questionId as keyof typeof SCORING_WEIGHTS.NS]);
  }
  if (SCORING_WEIGHTS.TF[questionId as keyof typeof SCORING_WEIGHTS.TF]) {
    weights.push(SCORING_WEIGHTS.TF[questionId as keyof typeof SCORING_WEIGHTS.TF]);
  }
  if (SCORING_WEIGHTS.PJ[questionId as keyof typeof SCORING_WEIGHTS.PJ]) {
    weights.push(SCORING_WEIGHTS.PJ[questionId as keyof typeof SCORING_WEIGHTS.PJ]);
  }

  return weights;
}

/**
 * 개발/테스트용: 답변 배열의 유효성을 검사합니다.
 */
export function validateAnswers(answers: Answers): boolean {
  return answers.length <= 15 && answers.every(answer => typeof answer === 'boolean');
}