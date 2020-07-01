import {fakeError} from '../../../utils/tests';
import {createDisciplineCard, createCardLevel} from '../../../__fixtures__/cards';
import {CARD_STATUS} from '../../../layer/data/_const';
import {fetchRequest, fetchSuccess, fetchError, fetchHero} from './hero';

const language = 'en';

const level = createCardLevel({
  ref: 'mod_1',
  status: CARD_STATUS.ACTIVE,
  label: 'Fake level',
});
const card = createDisciplineCard({
  ref: 'dis1',
  completion: 0,
  levels: [level],
  title: 'Discipline',
});

describe('Hero', () => {
  describe('fetchHero', () => {
    it('should fetch hero', async () => {
      const dispatch = jest.fn();
      const getState = jest.fn();
      const options = {
        services: {
          Hero: {
            get: jest.fn(),
          },
        },
      };

      dispatch.mockImplementationOnce((action) => {
        expect(action).toEqual(fetchRequest(language));
        return Promise.resolve(action);
      });
      dispatch.mockImplementationOnce((action) => {
        expect(action).toEqual(fetchSuccess(card, language));
        return Promise.resolve(action);
      });

      options.services.Hero.get.mockReturnValueOnce(Promise.resolve(card));

      // @ts-ignore
      const actual = await fetchHero()(dispatch, getState, options);
      return expect(actual).toEqual(fetchSuccess(card, language));
    });

    it('should handle error', async () => {
      const dispatch = jest.fn();
      const getState = jest.fn();
      const options = {
        services: {
          Hero: {
            get: jest.fn(),
          },
        },
      };

      dispatch.mockImplementationOnce((action) => {
        expect(action).toEqual(fetchRequest(language));
        return action;
      });
      dispatch.mockImplementationOnce(async (action) => {
        expect(await action).toEqual(fetchError(fakeError));
        // @ts-ignore
        return action;
      });
      options.services.Hero.get.mockReturnValueOnce(Promise.reject(fakeError));

      // @ts-ignore
      const actual = await fetchHero()(dispatch, getState, options);

      return expect(actual).toEqual(fetchError(fakeError));
    });
  });
});
