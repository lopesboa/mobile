// @flow strict

import {createDisciplineCard, createCardLevel} from '../../../../__fixtures__/cards';
import {createProgression} from '../../../../__fixtures__/progression';
import {CARD_STATUS} from '../../../../layer/data/_const';
import {getAndRefreshCard, refreshCard} from './refresh';

const level = createCardLevel({ref: 'mod_1', status: CARD_STATUS.ACTIVE, label: 'Fake level'});
const disciplineCard = createDisciplineCard({
  ref: 'dis1',
  completion: 0,
  levels: [level],
  title: 'Discipline'
});

describe('Cards', () => {
  describe('getAndRefreshCard', () => {
    it('should dispatch the update card action', async () => {
      const progressionId = 'fakeProgressionId';
      const fakeProgression = createProgression({
        _id: progressionId,
        engine: 'learner',
        progressionContent: {
          ref: 'foo',
          type: 'chapter'
        }
      });
      const language = 'en';

      const getState = jest.fn();
      const options = {
        services: {
          Cards: {
            getCardFromLocalStorage: jest.fn(() => Promise.resolve(disciplineCard)),
            refreshCard: jest.fn(() => Promise.resolve(disciplineCard))
          },
          Progressions: {
            findById: jest.fn(() => Promise.resolve(fakeProgression))
          }
        }
      };
      const dispatch = jest.fn(action => {
        if (action instanceof Function) return action(dispatch, getState, options);
        return action;
      });

      // $FlowFixMe
      const actual = await getAndRefreshCard(progressionId, language)(
        // $FlowFixMe
        dispatch,
        getState,
        // $FlowFixMe
        options
      );

      expect(actual).toEqual(refreshCard(language, disciplineCard));
    });

    it('should return void if no Progression found', async () => {
      const progressionId = 'fakeProgressionId';
      const language = 'en';

      const getState = jest.fn();
      const options = {
        services: {
          Cards: {
            getCardFromLocalStorage: jest.fn(() => Promise.resolve(disciplineCard)),
            refreshCard: jest.fn(() => Promise.resolve(disciplineCard))
          },
          Progressions: {
            findById: jest.fn(() => Promise.resolve(undefined))
          }
        }
      };

      const dispatch = jest.fn(action => {
        if (action instanceof Function) return action(dispatch, getState, options);
        return action;
      });

      // $FlowFixMe
      const actual = await getAndRefreshCard(progressionId, language)(
        // $FlowFixMe
        dispatch,
        getState,
        // $FlowFixMe
        options
      );

      expect(actual).toEqual(undefined);
    });

    it('should return void if no Card found', async () => {
      const progressionId = 'fakeProgressionId';
      const fakeProgression = createProgression({
        _id: progressionId,
        engine: 'learner',
        progressionContent: {
          ref: 'foo',
          type: 'chapter'
        }
      });
      const language = 'en';

      const getState = jest.fn();
      const options = {
        services: {
          Cards: {
            getCardFromLocalStorage: jest.fn(() => Promise.resolve(undefined)),
            refreshCard: jest.fn(() => Promise.resolve(disciplineCard))
          },
          Progressions: {
            findById: jest.fn(() => Promise.resolve(fakeProgression))
          }
        }
      };
      const dispatch = jest.fn(action => {
        if (action instanceof Function) return action(dispatch, getState, options);
        return action;
      });
      // $FlowFixMe
      const actual = await getAndRefreshCard(progressionId, language)(
        // $FlowFixMe
        dispatch,
        getState,
        // $FlowFixMe
        options
      );

      expect(actual).toEqual(undefined);
    });
  });
});
