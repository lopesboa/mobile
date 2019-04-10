// @flow strict

import createDataLayer from '.';

describe('Data layer', () => {
  it('should return complete object', () => {
    const result = createDataLayer('fr');
    const expected = {
      getExitNode: expect.any(Function),
      findSlideById: expect.any(Function),
      findSlideByChapter: expect.any(Function),
      findChapterById: expect.any(Function),
      findContent: expect.any(Function),
      getCorrectAnswer: expect.any(Function),
      getClue: expect.any(Function),
      findProgressionById: expect.any(Function),
      getAllProgressions: expect.any(Function),
      saveProgression: expect.any(Function),
      synchronizeProgression: expect.any(Function),
      findRecommendations: expect.any(Function),
      getNextLevel: expect.any(Function),
      findLevelById: expect.any(Function),
      fetchCards: expect.any(Function),
      fetchBrand: expect.any(Function),
      findBestOf: expect.any(Function),
      findLast: expect.any(Function),
      refreshCard: expect.any(Function),
      getCardFromLocalStorage: expect.any(Function),
      getChapterRulesByContent: expect.any(Function),
      fetchDisciplineBundle: expect.any(Function),
      storeDisciplineBundle: expect.any(Function),
      logEvent: expect.any(Function),
      setCurrentScreen: expect.any(Function),
      setUserProperty: expect.any(Function)
    };
    expect(expected).toEqual(result);
  });
});
