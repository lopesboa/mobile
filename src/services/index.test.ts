import createDataLayer from '../layer/data';
import createServices from '.';

const dataLayer = createDataLayer();

describe('Services', () => {
  it('should return complete object', () => {
    const result = createServices(dataLayer);

    const expected = {
      Analytics: {
        logEvent: expect.any(Function),
        sendProgressionFinished: expect.any(Function),
        sendViewedMediaAnalytics: expect.any(Function),
      },
      Answers: {
        findById: expect.any(Function),
      },
      Brands: {
        find: expect.any(Function),
      },
      Bundle: {
        findById: expect.any(Function),
        store: expect.any(Function),
      },
      Cards: {
        findBySearch: expect.any(Function),
        findBySection: expect.any(Function),
        getCardFromLocalStorage: expect.any(Function),
        refreshCard: expect.any(Function),
      },
      Clues: {
        findById: expect.any(Function),
      },
      Content: {
        find: expect.any(Function),
        getInfo: expect.any(Function),
      },
      ExitNodes: {
        findById: expect.any(Function),
      },
      Hero: {
        get: expect.any(Function),
      },
      Language: {
        getFromInterface: expect.any(Function),
        set: expect.any(Function),
      },
      LeaderBoard: {
        __esModule: true,
        getRank: expect.any(Function),
      },
      Logger: {
        error: expect.any(Function),
        setProperties: expect.any(Function),
      },
      Permissions: {
        alert: expect.any(Function),
        check: expect.any(Function),
        openSettings: expect.any(Function),
        request: expect.any(Function),
        requestNotifications: expect.any(Function),
        checkNotifications: expect.any(Function),
      },
      NotificationContent: {
        getAllContentByMostRecent: expect.any(Function),
        getRecommendationContent: expect.any(Function),
      },
      Progressions: {
        acceptExtraLife: expect.any(Function),
        create: expect.any(Function),
        findBestOf: expect.any(Function),
        findById: expect.any(Function),
        findLast: expect.any(Function),
        findRemoteProgressionById: expect.any(Function),
        getAll: expect.any(Function),
        getAvailableContent: expect.any(Function),
        getEngineConfig: expect.any(Function),
        getSynchronizedProgressionIds: expect.any(Function),
        markResourceAsViewed: expect.any(Function),
        openAssistance: expect.any(Function),
        postAnswer: expect.any(Function),
        refuseExtraLife: expect.any(Function),
        requestClue: expect.any(Function),
        save: expect.any(Function),
        synchronize: expect.any(Function),
        updateSynchronizedProgressionIds: expect.any(Function),
      },
      Recommendations: {
        find: expect.any(Function),
        getNext: expect.any(Function),
      },
      Sections: {
        find: expect.any(Function),
      },
      Users: {
        find: expect.any(Function),
      },
      Videos: {
        findTracksById: expect.any(Function),
        findUriById: expect.any(Function),
      },
    };
    expect(expected).toEqual(result);
  });
});
