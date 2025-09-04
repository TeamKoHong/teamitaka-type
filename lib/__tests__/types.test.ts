import { describe, it, expect } from 'vitest';
import { TYPE_METADATA } from '../types';

describe('타입 메타데이터 테스트', () => {
  describe('TYPE_METADATA 구조 검증', () => {
    it('16개의 MBTI 타입이 모두 정의되어 있는지 확인', () => {
      const expectedTypes = [
        'ENFP', 'ENFJ', 'ENTP', 'ENTJ',
        'ESFP', 'ESFJ', 'ESTP', 'ESTJ', 
        'INFP', 'INFJ', 'INTP', 'INTJ',
        'ISFP', 'ISFJ', 'ISTP', 'ISTJ'
      ];

      expectedTypes.forEach(type => {
        expect(TYPE_METADATA[type]).toBeDefined();
      });

      expect(Object.keys(TYPE_METADATA)).toHaveLength(16);
    });

    it('각 타입이 필수 필드를 모두 가지고 있는지 확인', () => {
      const requiredFields = ['code', 'nickname', 'oneLiner', 'description', 'strengths', 'bestMatches', 'tips'];

      Object.values(TYPE_METADATA).forEach(typeMeta => {
        requiredFields.forEach(field => {
          expect(typeMeta).toHaveProperty(field);
          expect(typeMeta[field as keyof typeof typeMeta]).toBeTruthy();
        });
      });
    });

    it('강점이 3개씩 정의되어 있는지 확인', () => {
      Object.values(TYPE_METADATA).forEach(typeMeta => {
        expect(typeMeta.strengths).toHaveLength(3);
        typeMeta.strengths.forEach(strength => {
          expect(typeof strength).toBe('string');
          expect(strength.length).toBeGreaterThan(0);
        });
      });
    });

    it('팁이 3개씩 정의되어 있는지 확인', () => {
      Object.values(TYPE_METADATA).forEach(typeMeta => {
        expect(typeMeta.tips).toHaveLength(3);
        typeMeta.tips.forEach(tip => {
          expect(typeof tip).toBe('string');
          expect(tip.length).toBeGreaterThan(0);
        });
      });
    });

    it('궁합 정보가 1-2개 정의되어 있는지 확인', () => {
      Object.values(TYPE_METADATA).forEach(typeMeta => {
        expect(typeMeta.bestMatches.length).toBeGreaterThanOrEqual(1);
        expect(typeMeta.bestMatches.length).toBeLessThanOrEqual(2);
        typeMeta.bestMatches.forEach(match => {
          expect(typeof match).toBe('string');
          expect(match.length).toBeGreaterThan(0);
        });
      });
    });
  });

  describe('콘텐츠 품질 검증', () => {
    it('닉네임이 적절한 길이인지 확인', () => {
      Object.values(TYPE_METADATA).forEach(typeMeta => {
        expect(typeMeta.nickname.length).toBeGreaterThan(2);
        expect(typeMeta.nickname.length).toBeLessThan(10);
        expect(typeMeta.nickname).toMatch(/티미$/); // "티미"로 끝나는지 확인
      });
    });

    it('한줄 소개가 적절한 길이인지 확인', () => {
      Object.values(TYPE_METADATA).forEach(typeMeta => {
        expect(typeMeta.oneLiner.length).toBeGreaterThan(10);
        expect(typeMeta.oneLiner.length).toBeLessThan(100);
      });
    });

    it('설명이 적절한 길이인지 확인', () => {
      Object.values(TYPE_METADATA).forEach(typeMeta => {
        expect(typeMeta.description.length).toBeGreaterThan(50);
        expect(typeMeta.description.length).toBeLessThan(500);
      });
    });

    it('테마 색상이 유효한 hex 코드인지 확인', () => {
      Object.values(TYPE_METADATA).forEach(typeMeta => {
        if (typeMeta.themeAccent) {
          expect(typeMeta.themeAccent).toMatch(/^#[0-9A-F]{6}$/i);
        }
      });
    });
  });

  describe('특정 타입 검증', () => {
    it('ENFP 타입 데이터가 올바른지 확인', () => {
      const enfp = TYPE_METADATA['ENFP'];
      
      expect(enfp.code).toBe('ENFP');
      expect(enfp.nickname).toBe('열정티미');
      expect(enfp.oneLiner).toContain('열정');
      expect(enfp.strengths).toContain('창의적 아이디어 발굴');
      expect(enfp.bestMatches).toEqual(['체계티미 (INTJ)', '실행티미 (ESTJ)']);
    });

    it('INTJ 타입 데이터가 올바른지 확인', () => {
      const intj = TYPE_METADATA['INTJ'];
      
      expect(intj.code).toBe('INTJ');
      expect(intj.nickname).toBe('체계티미');
      expect(intj.oneLiner).toContain('체계');
      expect(intj.strengths).toContain('체계적 계획');
      expect(intj.bestMatches).toEqual(['열정티미 (ENFP)', '조화티미 (ESFP)']);
    });

    it('모든 타입의 code가 키와 일치하는지 확인', () => {
      Object.entries(TYPE_METADATA).forEach(([key, typeMeta]) => {
        expect(typeMeta.code).toBe(key);
      });
    });
  });

  describe('다국어 지원 준비', () => {
    it('모든 텍스트가 한국어로 작성되어 있는지 확인', () => {
      Object.values(TYPE_METADATA).forEach(typeMeta => {
        // 간단한 한글 포함 여부 체크
        expect(typeMeta.nickname).toMatch(/[가-힣]/);
        expect(typeMeta.oneLiner).toMatch(/[가-힣]/);
        expect(typeMeta.description).toMatch(/[가-힣]/);
      });
    });

    it('일관성 있는 톤앤매너를 사용하는지 확인', () => {
      Object.values(TYPE_METADATA).forEach(typeMeta => {
        // 존댓말 사용 확인
        expect(typeMeta.description).toMatch(/습니다|에요/);
        
        // 팁이 명령형/권고형으로 작성되었는지 확인
        typeMeta.tips.forEach(tip => {
          expect(tip).toMatch(/하기$|기$|말기$/);
        });
      });
    });
  });

  describe('궁합 관계 검증', () => {
    it('궁합 관계가 상호 참조되는지 확인', () => {
      // ENFP와 INTJ가 서로 궁합으로 지정되어 있는지 확인
      const enfp = TYPE_METADATA['ENFP'];
      const intj = TYPE_METADATA['INTJ'];
      
      expect(enfp.bestMatches.some(match => match.includes('INTJ'))).toBe(true);
      expect(intj.bestMatches.some(match => match.includes('ENFP'))).toBe(true);
    });

    it('자기 자신을 궁합으로 지정하지 않았는지 확인', () => {
      Object.entries(TYPE_METADATA).forEach(([code, typeMeta]) => {
        typeMeta.bestMatches.forEach(match => {
          expect(match).not.toContain(code);
        });
      });
    });
  });
});