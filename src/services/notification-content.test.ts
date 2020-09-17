import {createContentRecommendation as createNotificationRecommendation} from '../__fixtures__/content-recommendation';
import type {
  ChapterCard,
  ContentRecommendation as NotificationRecommendation,
} from '../layer/data/_types';

import {createChapterCard} from '../__fixtures__/cards';

jest.mock('../layer/data/progressions', () => ({
  getAggregationsByContent: jest.fn(),
}));

describe('NotificationContent service', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('returns "the most recent content", not finished, having 1 or more questions answered', async () => {
    const createService = require('./notification-content').default;
    const {getAggregationsByContent} = require('../layer/data/progressions');

    const notificationRecommendations: Array<NotificationRecommendation> = [
      createNotificationRecommendation({
        progressionId: 'foo',
        contentRef: 'should not be selected because success: true',
        success: true,
      }),
      createNotificationRecommendation({
        progressionId: 'foo',
        contentRef: 'should be selected 3',
        updatedAt: '2018-05-23T16:10:38.486Z',
        nbSlides: 2,
        success: false,
      }),
      createNotificationRecommendation({
        progressionId: 'foo',
        contentRef: 'should be selected',
        updatedAt: '2018-05-23T16:20:38.486Z',
        nbSlides: 3,
        success: false,
      }),
      createNotificationRecommendation({
        progressionId: 'foo',
        contentRef: 'should be selected 2',
        updatedAt: '2018-04-23T16:10:38.486Z',
        nbSlides: 3,
        success: false,
      }),
      createNotificationRecommendation({
        progressionId: 'foo',
        contentRef: 'should not be selected because success: true',
        success: true,
        updatedAt: '2017-05-23T16:10:38.486Z',
        nbSlides: 8,
      }),
    ];

    // @ts-ignore mock property
    getAggregationsByContent.mockImplementation(() => Promise.resolve(notificationRecommendations));

    const fetchCard = jest.fn();

    // @ts-ignore datalayer doesn't need to be filled with mocks for this test
    const notificationContent = createService({fetchCard});
    await notificationContent.getAllContentByMostRecent();

    expect(fetchCard).toHaveBeenCalledTimes(3);
  });

  it('returns a recommendation content', async () => {
    const createService = require('./notification-content').default;

    const reco: ChapterCard = createChapterCard({
      ref: 'reco',
      status: 'isStarted',
      title: 'plop',
      completion: 12,
    });

    const fetchRecommendation = jest.fn(() => Promise.resolve(reco));

    // @ts-ignore datalayer doesn't need to be filled with mocks for this test
    const notificationContent = createService({fetchRecommendation});
    const result = await notificationContent.getRecommendationContent();

    expect(fetchRecommendation).toHaveBeenCalledTimes(1);
    expect(result).toEqual(reco);
  });

  afterAll(() => {
    jest.resetAllMocks();
  });
});
