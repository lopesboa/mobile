// @flow strict

import {createDisciplineCard, createCardLevel} from '../__fixtures__/cards';
import {CARD_STATUS} from '../layer/data/_const';

const level = createCardLevel({
  ref: 'mod_1',
  status: CARD_STATUS.ACTIVE,
  label: 'Fake level'
});
const card = createDisciplineCard({
  ref: 'dis1',
  completion: 0,
  levels: [level],
  title: 'Discipline'
});

describe('Hero service', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('shoud return card in e2e', async () => {
    jest.mock('../modules/environment', () => ({
      __E2E__: true
    }));
    // $FlowFixMe
    const dataLayer: DataLayer = {
      fetchCards: jest.fn(() => Promise.resolve({cards: [card]}))
    };
    const createService = require('./hero').default;
    const service = createService(dataLayer);

    const result = await service.get();
    const expected = card;

    expect(dataLayer.fetchCards).toHaveBeenCalledTimes(1);
    expect(result).toEqual(expected);
  });

  it('shoud not return card in other environments', async () => {
    jest.mock('../modules/environment', () => ({
      __E2E__: false
    }));
    // $FlowFixMe
    const dataLayer: DataLayer = {
      fetchCards: jest.fn(() => Promise.resolve({cards: [card]}))
    };
    const createService = require('./hero').default;
    const service = createService(dataLayer);

    const result = await service.get();

    expect(dataLayer.fetchCards).toHaveBeenCalledTimes(0);
    expect(result).toBeUndefined;
  });

  afterAll(() => {
    jest.resetAllMocks();
  });
});
