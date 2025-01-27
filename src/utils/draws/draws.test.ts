import { draw, preDraw } from './draws';

describe('draws', () => {
  describe('preDraw', () => {
    it('should add the same day snacks of the lunch winner to the results and remove the open draw of that day', () => {
      const openSnackDraws = {
        '2024-01-01': [
          { childId: 'a', mealRequestId: 'mr1' },
          { childId: 'b', mealRequestId: 'mr2' },
          { childId: 'c', mealRequestId: 'mr3' },
        ],
        '2024-01-02': [
          { childId: 'd', mealRequestId: 'mr4' },
          { childId: 'e', mealRequestId: 'mr5' },
          { childId: 'f', mealRequestId: 'mr6' },
        ],
      };
      const lunchResults = {
        a: { date: '2024-01-01', mealRequestId: 'mr1' },
      };
      expect(preDraw({ openSnackDraws, lunchResults })).toEqual({
        openDraws: {
          '2024-01-02': [
            { childId: 'd', mealRequestId: 'mr4' },
            { childId: 'e', mealRequestId: 'mr5' },
            { childId: 'f', mealRequestId: 'mr6' },
          ],
        },
        results: {
          a: { date: '2024-01-01', mealRequestId: 'mr1' },
        },
      });
    });
    it('should not modify openDraws and return empty results in case there is no match', () => {
      const openSnackDraws = {
        '2024-01-01': [
          { childId: 'a', mealRequestId: 'mr1' },
          { childId: 'b', mealRequestId: 'mr2' },
          { childId: 'c', mealRequestId: 'mr3' },
        ],
      };
      const lunchResults = {
        d: { date: '2024-01-01', mealRequestId: 'mr4' },
      };
      expect(preDraw({ openSnackDraws, lunchResults })).toEqual({
        openDraws: {
          '2024-01-01': [
            { childId: 'a', mealRequestId: 'mr1' },
            { childId: 'b', mealRequestId: 'mr2' },
            { childId: 'c', mealRequestId: 'mr3' },
          ],
        },
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
        '2024-01-01': [
          { childId: 'a', mealRequestId: 'mr1' },
          { childId: 'b', mealRequestId: 'mr2' },
          { childId: 'c', mealRequestId: 'mr3' },
        ],
        '2024-01-02': [
          { childId: 'a', mealRequestId: 'mr4' },
          { childId: 'b', mealRequestId: 'mr5' },
          { childId: 'c', mealRequestId: 'mr6' },
        ],
        '2024-01-03': [
          { childId: 'a', mealRequestId: 'mr7' },
          { childId: 'b', mealRequestId: 'mr8' },
          { childId: 'c', mealRequestId: 'mr9' },
        ],
      };
      const lunchResults = {
        a: { date: '2024-01-01', mealRequestId: 'mr1' },
        b: { date: '2024-01-02', mealRequestId: 'mr5' },
      };
      expect(preDraw({ openSnackDraws, lunchResults })).toEqual({
        openDraws: {
          '2024-01-03': [
            { childId: 'a', mealRequestId: 'mr7' },
            { childId: 'b', mealRequestId: 'mr8' },
            { childId: 'c', mealRequestId: 'mr9' },
          ],
        },
        results: {
          a: { date: '2024-01-01', mealRequestId: 'mr1' },
          b: { date: '2024-01-02', mealRequestId: 'mr5' },
        },
      });
    });
    it('should return all snacks of the lunch winners to the results and return empty openDraws in case all match', () => {
      const openSnackDraws = {
        '2024-01-01': [
          { childId: 'a', mealRequestId: 'mr1' },
          { childId: 'b', mealRequestId: 'mr2' },
          { childId: 'c', mealRequestId: 'mr3' },
        ],
        '2024-01-02': [
          { childId: 'a', mealRequestId: 'mr4' },
          { childId: 'b', mealRequestId: 'mr5' },
          { childId: 'c', mealRequestId: 'mr6' },
        ],
        '2024-01-03': [
          { childId: 'a', mealRequestId: 'mr7' },
          { childId: 'b', mealRequestId: 'mr8' },
          { childId: 'c', mealRequestId: 'mr9' },
        ],
      };
      const lunchResults = {
        a: { date: '2024-01-01', mealRequestId: 'mr1' },
        b: { date: '2024-01-02', mealRequestId: 'mr5' },
        c: { date: '2024-01-03', mealRequestId: 'mr9' },
      };
      expect(preDraw({ openSnackDraws, lunchResults })).toEqual({
        openDraws: {},
        results: {
          a: { date: '2024-01-01', mealRequestId: 'mr1' },
          b: { date: '2024-01-02', mealRequestId: 'mr5' },
          c: { date: '2024-01-03', mealRequestId: 'mr9' },
        },
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
        '2024-01-01': [
          { childId: 'child1', mealRequestId: 'mr1' },
          { childId: 'child2', mealRequestId: 'mr2' },
        ],
        '2024-01-02': [
          { childId: 'child3', mealRequestId: 'mr3' },
          { childId: 'child4', mealRequestId: 'mr4' },
        ],
      };
      const results = {
        someChild: { date: '2024-01-04', mealRequestId: 'mr5' },
        otherChild: { date: '2024-01-05', mealRequestId: 'mr6' },
      };

      expect(draw({ openDraws, results })).toEqual({
        openDraws: {
          '2024-01-02': [
            { childId: 'child3', mealRequestId: 'mr3' },
            { childId: 'child4', mealRequestId: 'mr4' },
          ],
        },
        results: {
          someChild: { date: '2024-01-04', mealRequestId: 'mr5' },
          otherChild: { date: '2024-01-05', mealRequestId: 'mr6' },
          child1: { date: '2024-01-01', mealRequestId: 'mr1' },
        },
      });
    });

    it('should select last date and last candidate when Math.random returns 0.99', () => {
      mockMath.mockReturnValue(0.99); // This will select last items in arrays

      const openDraws = {
        '2024-01-01': [
          { childId: 'child1', mealRequestId: 'mr1' },
          { childId: 'child2', mealRequestId: 'mr2' },
        ],
        '2024-01-02': [
          { childId: 'child3', mealRequestId: 'mr3' },
          { childId: 'child4', mealRequestId: 'mr4' },
        ],
      };
      const results = {
        someChild: { date: '2024-01-04', mealRequestId: 'mr5' },
        otherChild: { date: '2024-01-05', mealRequestId: 'mr6' },
      };

      expect(draw({ openDraws, results })).toEqual({
        openDraws: {
          '2024-01-01': [
            { childId: 'child1', mealRequestId: 'mr1' },
            { childId: 'child2', mealRequestId: 'mr2' },
          ],
        },
        results: {
          someChild: { date: '2024-01-04', mealRequestId: 'mr5' },
          otherChild: { date: '2024-01-05', mealRequestId: 'mr6' },
          child4: { date: '2024-01-02', mealRequestId: 'mr4' },
        },
      });
    });
    it('should ignore previously selected children', () => {
      mockMath.mockReturnValue(0);
      const openDraws = {
        '2024-01-01': [
          { childId: 'child1', mealRequestId: 'mr1' },
          { childId: 'child2', mealRequestId: 'mr2' },
        ],
      };
      const results = {
        child1: { date: '2024-01-04', mealRequestId: 'mr3' },
      };
      expect(draw({ openDraws, results })).toEqual({
        openDraws: {},
        results: {
          child1: { date: '2024-01-04', mealRequestId: 'mr3' },
          child2: { date: '2024-01-01', mealRequestId: 'mr2' },
        },
      });
    });
    it('should ignore dates whose results are already in', () => {
      mockMath.mockReturnValue(0);
      const openDraws = {
        '2024-01-01': [
          { childId: 'child1', mealRequestId: 'mr1' },
          { childId: 'child2', mealRequestId: 'mr2' },
        ],
      };
      const results = {
        child2: { date: '2024-01-01', mealRequestId: 'mr2' },
      };
      expect(draw({ openDraws, results })).toEqual({
        openDraws: {},
        results: {
          child2: { date: '2024-01-01', mealRequestId: 'mr2' },
        },
      });
    });
    it('should be able to handle dates all of whose children have already been selected', () => {
      mockMath.mockReturnValue(0);
      const openDraws = {
        '2024-01-01': [
          { childId: 'child1', mealRequestId: 'mr1' },
          { childId: 'child2', mealRequestId: 'mr2' },
        ],
      };
      const results = {
        child1: { date: '2024-01-04', mealRequestId: 'mr3' },
        child2: { date: '2024-01-05', mealRequestId: 'mr4' },
      };
      expect(draw({ openDraws, results })).toEqual({
        openDraws: {},
        results: {
          child1: { date: '2024-01-04', mealRequestId: 'mr3' },
          child2: { date: '2024-01-05', mealRequestId: 'mr4' },
        },
      });
    });
  });
});
