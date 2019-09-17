// @flow strict

import createDataLayer from '.';

describe('Data layer', () => {
  it('should return complete object', () => {
    const result = createDataLayer();

    const expected = {
      fetchBrand: expect.any(Function),
      fetchBundle: expect.any(Function),
      fetchCards: expect.any(Function),
      fetchLanguage: expect.any(Function),
      setLanguage: expect.any(Function),
      getInterfaceLanguage: expect.any(Function),
      fetchSections: expect.any(Function),
      findBestOf: expect.any(Function),
      findChapterById: expect.any(Function),
      findContent: expect.any(Function),
      findLast: expect.any(Function),
      findLevelById: expect.any(Function),
      findProgressionById: expect.any(Function),
      findRecommendations: expect.any(Function),
      findSlideByChapter: expect.any(Function),
      findSlideById: expect.any(Function),
      findVideoUriById: expect.any(Function),
      getAllProgressions: expect.any(Function),
      getCardFromLocalStorage: expect.any(Function),
      getChapterRulesByContent: expect.any(Function),
      getClue: expect.any(Function),
      getCorrectAnswer: expect.any(Function),
      getExitNode: expect.any(Function),
      getNextChapter: expect.any(Function),
      getNextLevel: expect.any(Function),
      logEvent: expect.any(Function),
      refreshCard: expect.any(Function),
      saveProgression: expect.any(Function),
      storeBundle: expect.any(Function),
      synchronizeProgression: expect.any(Function),
      fetchUser: expect.any(Function)
    };
    expect(expected).toEqual(result);
  });
});
