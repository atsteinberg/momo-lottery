import { draw, preDraw } from './draws';

describe('draws', () => {
  describe('preDraw', () => {
    it('should add the same day snacks of the lunch winner to the results and remove the open draw of that day', () => {
      const openSnackDraws = {
        '2024-01-01': ['a', 'b', 'c'],
        '2024-01-02': ['d', 'e', 'f'],
      };
      const lunchResults = {
        '2024-01-01': 'a',
      };
      expect(preDraw({ openSnackDraws, lunchResults })).toEqual({
        openDraws: {
          '2024-01-02': ['d', 'e', 'f'],
        },
        results: { '2024-01-01': 'a' },
      });
    });
    it('should not modify openDraws and return empty results in case there is no match', () => {
      const openSnackDraws = {
        '2024-01-01': ['a', 'b', 'c'],
      };
      const lunchResults = { '2024-01-01': 'd' };
      expect(preDraw({ openSnackDraws, lunchResults })).toEqual({
        openDraws: { '2024-01-01': ['a', 'b', 'c'] },
        results: {},
      });
    });
    it('should return empty results in case openDraws is empty', () => {
      const openSnackDraws = {};
      const lunchResults = {};
      expect(preDraw({ openSnackDraws, lunchResults })).toEqual({
        openDraws: {},
        results: {},
      });
    });
    it('should add multiple same day snacks of the lunch winners to the results and remove the open draw of that day', () => {
      const openSnackDraws = {
        '2024-01-01': ['a', 'b', 'c'],
        '2024-01-02': ['a', 'b', 'c'],
        '2024-01-03': ['a', 'b', 'c'],
      };
      const lunchResults = {
        '2024-01-01': 'a',
        '2024-01-02': 'b',
      };
      expect(preDraw({ openSnackDraws, lunchResults })).toEqual({
        openDraws: { '2024-01-03': ['a', 'b', 'c'] },
        results: { '2024-01-01': 'a', '2024-01-02': 'b' },
      });
    });
    it('should return all snacks of the lunch winners to the results and return empty openDraws in case all match', () => {
      const openSnackDraws = {
        '2024-01-01': ['a', 'b', 'c'],
        '2024-01-02': ['a', 'b', 'c'],
        '2024-01-03': ['a', 'b', 'c'],
      };
      const lunchResults = {
        '2024-01-01': 'a',
        '2024-01-02': 'b',
        '2024-01-03': 'b',
      };
      expect(preDraw({ openSnackDraws, lunchResults })).toEqual({
        openDraws: {},
        results: { '2024-01-01': 'a', '2024-01-02': 'b', '2024-01-03': 'b' },
      });
    });
  });

  describe('draw', () => {
    let mockMath: jest.SpyInstance;

    beforeEach(() => {
      // Mock Math.random
      mockMath = jest.spyOn(Math, 'random');
    });

    afterEach(() => {
      mockMath.mockRestore();
    });

    it('should return empty results when there areno open draws', () => {
      const openDraws = {};

      expect(draw({ openDraws })).toEqual({
        openDraws: {},
        results: {},
      });
    });

    it('should select first date and first candidate when Math.random returns 0', () => {
      mockMath.mockReturnValue(0); // This will select first items in arrays

      const openDraws = {
        '2024-01-01': ['child1', 'child2'],
        '2024-01-02': ['child3', 'child4'],
      };
      const results = {
        someChild: '2024-01-04',
        otherChild: '2024-01-05',
      };

      expect(draw({ openDraws, results })).toEqual({
        openDraws: { '2024-01-02': ['child3', 'child4'] },
        results: {
          someChild: '2024-01-04',
          otherChild: '2024-01-05',
          child1: '2024-01-01',
        },
      });
    });

    it('should select last date and last candidate when Math.random returns 0.99', () => {
      mockMath.mockReturnValue(0.99); // This will select last items in arrays

      const openDraws = {
        '2024-01-01': ['child1', 'child2'],
        '2024-01-02': ['child3', 'child4'],
      };
      const results = {
        someChild: '2024-01-04',
        otherChild: '2024-01-05',
      };

      expect(draw({ openDraws, results })).toEqual({
        openDraws: { '2024-01-01': ['child1', 'child2'] },
        results: {
          someChild: '2024-01-04',
          otherChild: '2024-01-05',
          child4: '2024-01-02',
        },
      });
    });
    it('should ignore previously selected children', () => {
      mockMath.mockReturnValue(0);
      const openDraws = {
        '2024-01-01': ['child1', 'child2'],
      };
      const results = {
        child1: '2024-01-04',
      };
      expect(draw({ openDraws, results })).toEqual({
        openDraws: {},
        results: { child1: '2024-01-04', child2: '2024-01-01' },
      });
    });
    it('should ignore dates whose results are already in', () => {
      mockMath.mockReturnValue(0);
      const openDraws = {
        '2024-01-01': ['child1', 'child2'],
      };
      const results = {
        child2: '2024-01-01',
      };
      expect(draw({ openDraws, results })).toEqual({
        openDraws: {},
        results: { child2: '2024-01-01' },
      });
    });
    it('should be able to handle dates all of whose children have already been selected', () => {
      mockMath.mockReturnValue(0);
      const openDraws = {
        '2024-01-01': ['child1', 'child2'],
      };
      const results = {
        child1: '2024-01-04',
        child2: '2024-01-05',
      };
      expect(draw({ openDraws, results })).toEqual({
        openDraws: {},
        results: { child1: '2024-01-04', child2: '2024-01-05' },
      });
    });
  });
});
