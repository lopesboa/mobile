import * as React from 'react';
import renderer from 'react-test-renderer';
import {createNavigation} from '../__fixtures__/navigation';

jest.mock('../containers/error-listener', () => 'Mock$ErrorListener');

jest.mock('../utils/local-token', () => ({
  get: jest.fn(() => Promise.resolve(null)),
}));
jest.mock('../migrations', () => ({
  migrationsRunner: jest.fn(() => Promise.resolve('foobar')),
}));

jest.mock('../notification-handler.ts', () => {
  const {createChapterCard} = require('../__fixtures__/cards');
  const {CARD_STATUS} = require('../layer/data/_const');
  const card = createChapterCard({
    ref: 'bar',
    completion: 0,
    title: 'Fake chapter',
    status: CARD_STATUS.ACTIVE,
  });
  return {
    __esModule: true,
    default: class {
      constructor(onNotification: (card: unknown) => void) {
        onNotification(card);
      }
    },
  };
});

describe('Authentication - Notifications', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('should handle content', async () => {
    const {Component: Authentication} = require('./authentication');

    const navigation = createNavigation({});
    const selectCard = jest.fn();
    await renderer.create(<Authentication navigation={navigation} selectCard={selectCard} />);

    expect(selectCard).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
});
