import {createChapterCard} from '../__fixtures__/cards';
import {createContentRecommendation as createHeroRecommendation} from '../__fixtures__/content-recommendation';
import type {ChapterCard, ContentRecommendation as HeroRecommendation} from '../layer/data/_types';

jest.mock('../layer/data/progressions', () => ({
  getAggregationsByContent: jest.fn(),
}));

describe('Hero service', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('should fetchRecommendations when no progression is provided', async () => {
    const createService = require('./hero').default;
    const {getAggregationsByContent} = require('../layer/data/progressions');

    // @ts-ignore mock property
    getAggregationsByContent.mockImplementationOnce(() => Promise.resolve([]));

    const card = createChapterCard({
      ref: 'foo',
      status: 'isStarted',
      title: 'plop',
      completion: 12,
    });

    const fetchCard = jest.fn();
    const fetchRecommendation = jest.fn(() => Promise.resolve(card));

    // @ts-ignore datalayer doesn't need to be filled with mocks for this test
    const heroService = createService({fetchCard, fetchRecommendation});
    const result = await heroService.get();
    expect(result).toEqual(card);
    expect(fetchRecommendation).toHaveBeenCalledTimes(1);
  });

  it('should return "recommendation" when all started progressions are successful', async () => {
    const createService = require('./hero').default;
    const {getAggregationsByContent} = require('../layer/data/progressions');

    const reco: ChapterCard = createChapterCard({
      ref: 'reco',
      status: 'isStarted',
      title: 'plop',
      completion: 12,
    });

    // @ts-ignore mock property
    getAggregationsByContent.mockImplementation(() =>
      Promise.resolve([
        createHeroRecommendation({
          progressionId: 'foo_p',
          contentRef: 'foo',
          success: true,
        }),
        createHeroRecommendation({
          progressionId: 'bar_p',
          contentRef: 'bar',
          success: true,
        }),
      ]),
    );

    const fetchCard = jest.fn();
    const fetchRecommendation = jest.fn(() => Promise.resolve(reco));

    // @ts-ignore datalayer doesn't need to be filled with mocks for this test
    const heroService = createService({fetchCard, fetchRecommendation});
    const result = await heroService.get();

    expect(fetchRecommendation).toHaveBeenCalledTimes(1);
    expect(result).toEqual(reco);
  });

  it('should return "recommendation" if no started content have at least 3 questions answered', async () => {
    const createService = require('./hero').default;
    const {getAggregationsByContent} = require('../layer/data/progressions');

    const heroRecommendations: Array<HeroRecommendation> = [
      createHeroRecommendation({
        progressionId: 'foo',
        contentRef: 'should not be selected because  success: true',
        success: true,
      }),
      createHeroRecommendation({
        progressionId: 'foo',
        contentRef: 'should not be selected because  nbSlides < 3',
        nbSlides: 2,
        success: false,
      }),
      createHeroRecommendation({
        progressionId: 'foo',
        contentRef: 'should not be selected because | date 2018',
        updatedAt: '2018-05-23T16:10:38.486Z',
        nbSlides: 1,
        success: false,
      }),
    ];

    const reco: ChapterCard = createChapterCard({
      ref: 'reco',
      status: 'isStarted',
      title: 'plop',
      completion: 12,
    });

    // @ts-ignore mock property
    getAggregationsByContent.mockImplementation(() => Promise.resolve(heroRecommendations));

    const fetchCard = jest.fn();
    const fetchRecommendation = jest.fn(() => Promise.resolve(reco));

    // @ts-ignore datalayer doesn't need to be filled with mocks for this test
    const heroService = createService({fetchCard, fetchRecommendation});
    const result = await heroService.get();
    expect(result).toEqual(reco);
    expect(fetchCard).toHaveBeenCalledTimes(0);
    expect(fetchRecommendation).toHaveBeenCalledTimes(1);
  });

  it('should return "the most recent content", not finished, having 3 or more questions answered', async () => {
    const createService = require('./hero').default;
    const {getAggregationsByContent} = require('../layer/data/progressions');

    const heroRecommendations: Array<HeroRecommendation> = [
      createHeroRecommendation({
        progressionId: 'foo',
        contentRef: 'should not be selected because success: true',
        success: true,
      }),
      createHeroRecommendation({
        progressionId: 'foo',
        contentRef: 'should not be selected because nbSlides < 3',
        nbSlides: 2,
        success: false,
      }),
      createHeroRecommendation({
        progressionId: 'foo',
        contentRef: 'should not be selected because date 2018',
        updatedAt: '2018-05-23T16:10:38.486Z',
        nbSlides: 3,
        success: false,
      }),
      createHeroRecommendation({
        progressionId: 'foo',
        contentRef: 'should be selected',
        updatedAt: '2019-05-23T16:10:38.486Z',
        nbSlides: 3,
        success: false,
      }),
      createHeroRecommendation({
        progressionId: 'foo',
        contentRef: 'should not be selected because date 2017',
        updatedAt: '2017-05-23T16:10:38.486Z',
        nbSlides: 8,
        success: false,
      }),
    ];

    // @ts-ignore mock property
    getAggregationsByContent.mockImplementation(() => Promise.resolve(heroRecommendations));

    const fetchCard = jest.fn();
    const fetchRecommendation = jest.fn(() => Promise.resolve());

    // @ts-ignore datalayer doesn't need to be filled with mocks for this test
    const heroService = createService({fetchCard, fetchRecommendation});
    await heroService.get();

    expect(fetchRecommendation).toHaveBeenCalledTimes(0);
    expect(fetchCard).toHaveBeenCalledTimes(1);
    expect(fetchCard).toHaveBeenCalledWith({
      ref: 'should be selected',
      type: 'chapter',
      version: '1',
    });
  });

  afterAll(() => {
    jest.resetAllMocks();
  });
});
