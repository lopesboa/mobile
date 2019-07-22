// @flow strict

import {fakeError} from '../../../../utils/tests';
import {createSections} from '../../../../__fixtures__/sections';
import {createBrand} from '../../../../__fixtures__/brands';
import {
  createDisciplineCard,
  createChapterCard,
  createCardLevel
} from '../../../../__fixtures__/cards';
import {CARD_STATUS} from '../../../../layer/data/_const';
import {fetchRequest, fetchSuccess, fetchError, fetchCards} from './fetch';

const brand = createBrand();
const language = 'en';

const level = createCardLevel({ref: 'mod_1', status: CARD_STATUS.ACTIVE, label: 'Fake level'});
const disciplineCard = createDisciplineCard({
  ref: 'dis1',
  completion: 0,
  levels: [level],
  title: 'Discipline'
});
const chapterCard = createChapterCard({
  ref: 'cha1',
  completion: 0,
  status: CARD_STATUS.ACTIVE,
  title: 'Chapter'
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
            find: jest.fn()
          }
        }
      };

      dispatch.mockImplementationOnce(action => {
        expect(action).toEqual(fetchRequest('foo', 0, 3, language));
        return Promise.resolve(action);
      });
      dispatch.mockImplementationOnce(action => {
        expect(action).toEqual(fetchSuccess('foo', 0, 3, 8, items, language));
        return Promise.resolve(action);
      });
      getState.mockReturnValue({
        authentication: {user: {token: '__TOKEN__', isGodModeUser: false}, brand},
        catalog: {entities: {sections: {foo: {[language]: section}}}}
      });
      options.services.Cards.find.mockReturnValueOnce(
        Promise.resolve({
          cards: items,
          total: 8
        })
      );

      // $FlowFixMe
      const actual = await fetchCards('foo', 0, 3, language)(dispatch, getState, options);
      return expect(actual).toEqual(fetchSuccess('foo', 0, 3, 8, items, language));
    });

    it('should handle missing token', async () => {
      const dispatch = jest.fn();
      const getState = jest.fn();
      const options = {
        services: {
          Cards: {
            find: jest.fn()
          }
        }
      };

      dispatch.mockImplementationOnce(action => {
        expect(action).toEqual(fetchRequest('bar', 2, 5, language));
        return action;
      });
      dispatch.mockImplementationOnce(action => {
        expect(action).toEqual(fetchError(new TypeError('Token not defined')));
        return action;
      });
      getState.mockReturnValue({
        authentication: {user: {token: null, isGodModeUser: false}, brand: null},
        catalog: {entities: {sections: {bar: {[language]: section}}}}
      });

      // $FlowFixMe
      const actual = await fetchCards('bar', 2, 5, language)(dispatch, getState, options);

      expect(options.services.Cards.find).not.toHaveBeenCalled();
      return expect(actual).toEqual(fetchError(new TypeError('Token not defined')));
    });

    it('should handle missing brand', async () => {
      const dispatch = jest.fn();
      const getState = jest.fn();
      const options = {
        services: {
          Cards: {
            find: jest.fn()
          }
        }
      };

      dispatch.mockImplementationOnce(action => {
        expect(action).toEqual(fetchRequest('baz', 3, 6, language));
        return action;
      });
      dispatch.mockImplementationOnce(action => {
        expect(action).toEqual(fetchError(new TypeError('Brand not defined')));
        return action;
      });
      getState.mockReturnValue({
        authentication: {user: {token: '__TOKEN__', isGodModeUser: false}, brand: null},
        catalog: {entities: {sections: {baz: {[language]: section}}}}
      });

      // $FlowFixMe
      const actual = await fetchCards('baz', 3, 6, language)(dispatch, getState, options);

      expect(options.services.Cards.find).not.toHaveBeenCalled();
      return expect(actual).toEqual(fetchError(new TypeError('Brand not defined')));
    });

    it('should handle missing section', async () => {
      const dispatch = jest.fn();
      const getState = jest.fn();
      const options = {
        services: {
          Cards: {
            find: jest.fn()
          }
        }
      };

      dispatch.mockImplementationOnce(action => {
        expect(action).toEqual(fetchRequest('qux', 0, 3, language));
        return action;
      });
      dispatch.mockImplementationOnce(action => {
        expect(action).toEqual(fetchError(new TypeError('Section not found')));
        return action;
      });
      getState.mockReturnValue({
        authentication: {user: {token: '__TOKEN__', isGodModeUser: false}, brand},
        catalog: {entities: {sections: {}}}
      });

      // $FlowFixMe
      const actual = await fetchCards('qux', 0, 3, language)(dispatch, getState, options);

      expect(options.services.Cards.find).not.toHaveBeenCalled();
      return expect(actual).toEqual(fetchError(new TypeError('Section not found')));
    });

    it('should handle error', async () => {
      const dispatch = jest.fn();
      const getState = jest.fn();
      const options = {
        services: {
          Cards: {
            find: jest.fn()
          }
        }
      };

      dispatch.mockImplementationOnce(action => {
        expect(action).toEqual(fetchRequest('quux', 1, 3, language));
        return action;
      });
      dispatch.mockImplementationOnce(async action => {
        expect(await action).toEqual(fetchError(fakeError));
        // $FlowFixMe
        return action;
      });
      getState.mockReturnValue({
        authentication: {user: {token: '__TOKEN__', isGodModeUser: false}, brand},
        catalog: {entities: {sections: {quux: {[language]: section}}}}
      });
      options.services.Cards.find.mockReturnValueOnce(Promise.reject(fakeError));

      // $FlowFixMe
      const actual = await fetchCards('quux', 1, 3, language)(dispatch, getState, options);

      return expect(actual).toEqual(fetchError(fakeError));
    });
  });
});
