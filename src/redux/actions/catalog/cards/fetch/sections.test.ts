import {fakeError} from '../../../../../utils/tests';
import {createSections} from '../../../../../__fixtures__/sections';
import {createBrand} from '../../../../../__fixtures__/brands';
import {createAuthenticationState} from '../../../../../__fixtures__/store';
import {
  createDisciplineCard,
  createChapterCard,
  createCardLevel,
} from '../../../../../__fixtures__/cards';
import {CARD_STATUS} from '../../../../../layer/data/_const';
import {fetchRequest, fetchSuccess, fetchError, fetchCards} from './sections';

const brand = createBrand();
const language = 'en';

const level = createCardLevel({
  ref: 'mod_1',
  status: CARD_STATUS.ACTIVE,
  label: 'Fake level',
});
const disciplineCard = createDisciplineCard({
  ref: 'dis1',
  completion: 0,
  levels: [level],
  title: 'Discipline',
});
const chapterCard = createChapterCard({
  ref: 'cha1',
  completion: 0,
  status: CARD_STATUS.ACTIVE,
  title: 'Chapter',
});
const items = [disciplineCard, chapterCard];

const section = createSections()[0];

describe('Cards', () => {
  describe('fetchCards', () => {
    it('should fetch cards', async () => {
      const dispatch = jest.fn();
      const getState = jest.fn();
      const options = {
        services: {
          Cards: {
            findBySection: jest.fn(),
          },
        },
      };

      dispatch.mockImplementationOnce((action) => {
        expect(action).toEqual(fetchRequest('foo', 0, 3, language));
        return Promise.resolve(action);
      });
      dispatch.mockImplementationOnce((action) => {
        expect(action).toEqual(fetchSuccess('foo', 0, 3, 8, items, language));
        return Promise.resolve(action);
      });

      getState.mockReturnValue({
        authentication: createAuthenticationState({token: '_TOKEN_', brand}),
        catalog: {entities: {sections: {foo: {[language]: section}}}},
      });
      options.services.Cards.findBySection.mockReturnValueOnce(
        Promise.resolve({
          cards: items,
          total: 8,
        }),
      );

      // @ts-ignore
      const result = await fetchCards('foo', 0, 3)(dispatch, getState, options);
      const expected = fetchSuccess('foo', 0, 3, 8, items, language);

      return expect(result).toEqual(expected);
    });

    it('should handle missing token', async () => {
      const dispatch = jest.fn();
      const getState = jest.fn();
      const options = {
        services: {
          Cards: {
            findBySection: jest.fn(),
          },
        },
      };

      dispatch.mockImplementationOnce((action) => {
        expect(action).toEqual(fetchRequest('bar', 2, 5, language));
        return action;
      });
      dispatch.mockImplementationOnce((action) => {
        expect(action).toEqual(fetchError(new TypeError('Token not defined')));
        return action;
      });
      // @todo replace with fixture creator
      getState.mockReturnValue({
        authentication: createAuthenticationState({token: null, brand: null}),
        catalog: {entities: {sections: {bar: {[language]: section}}}},
      });

      // @ts-ignore
      const result = await fetchCards('bar', 2, 5)(dispatch, getState, options);
      const expected = fetchError(new TypeError('Token not defined'));

      expect(options.services.Cards.findBySection).not.toHaveBeenCalled();
      return expect(result).toEqual(expected);
    });

    it('should handle missing brand', async () => {
      const dispatch = jest.fn();
      const getState = jest.fn();
      const options = {
        services: {
          Cards: {
            findBySection: jest.fn(),
          },
        },
      };

      dispatch.mockImplementationOnce((action) => {
        expect(action).toEqual(fetchRequest('baz', 3, 6, language));
        return action;
      });
      dispatch.mockImplementationOnce((action) => {
        expect(action).toEqual(fetchError(new TypeError('Brand not defined')));
        return action;
      });
      getState.mockReturnValue({
        authentication: createAuthenticationState({
          token: '__TOKEN__',
          brand: null,
        }),
        catalog: {entities: {sections: {baz: {[language]: section}}}},
      });

      // @ts-ignore
      const result = await fetchCards('baz', 3, 6, language)(dispatch, getState, options);
      const expected = fetchError(new TypeError('Brand not defined'));

      expect(options.services.Cards.findBySection).not.toHaveBeenCalled();
      return expect(result).toEqual(expected);
    });

    it('should handle missing section', async () => {
      const dispatch = jest.fn();
      const getState = jest.fn();
      const options = {
        services: {
          Cards: {
            findBySection: jest.fn(),
          },
        },
      };

      dispatch.mockImplementationOnce((action) => {
        expect(action).toEqual(fetchRequest('qux', 0, 3, language));
        return action;
      });
      dispatch.mockImplementationOnce((action) => {
        expect(action).toEqual(fetchError(new TypeError('Section not found')));
        return action;
      });

      getState.mockReturnValue({
        authentication: createAuthenticationState({
          token: '__TOKEN__',
          brand,
        }),
        catalog: {entities: {sections: {}}},
      });

      // @ts-ignore
      const result = await fetchCards('qux', 0, 3)(dispatch, getState, options);
      const expected = fetchError(new TypeError('Section not found'));

      expect(options.services.Cards.findBySection).not.toHaveBeenCalled();
      return expect(result).toEqual(expected);
    });

    it('should handle error', async () => {
      const dispatch = jest.fn();
      const getState = jest.fn();
      const options = {
        services: {
          Cards: {
            findBySection: jest.fn(),
          },
        },
      };

      dispatch.mockImplementationOnce((action) => {
        expect(action).toEqual(fetchRequest('quux', 1, 3, language));
        return action;
      });
      dispatch.mockImplementationOnce(async (action) => {
        expect(await action).toEqual(fetchError(fakeError));
        // @ts-ignore
        return action;
      });
      // @todo replace with fixture creator
      getState.mockReturnValue({
        authentication: createAuthenticationState({
          token: '__TOKEN__',
          brand,
        }),
        catalog: {entities: {sections: {quux: {[language]: section}}}},
      });
      options.services.Cards.findBySection.mockReturnValueOnce(Promise.reject(fakeError));

      // @ts-ignore
      const result = await fetchCards('quux', 1, 3)(dispatch, getState, options);
      const expected = fetchError(fakeError);

      return expect(result).toEqual(expected);
    });
  });
});
