// @flow strict

import {createBrand} from '../../__fixtures__/brands';
import {createDisciplineCard, createChapterCard, createCardLevel} from '../../__fixtures__/cards';
import {CARD_STATUS} from '../../layer/data/_const';
import {
  fetchRequest,
  fetchSuccess,
  fetchError,
  fetchCards,
  selectCard,
  selectCardFailure
} from './cards';

jest.mock('./progression', () => ({
  createLevelProgression: jest.fn(() => ({type: '@@mock/CREATE_LEVEL_PROGRESSION'})),
  createChapterProgression: jest.fn(() => ({type: '@@mock/CREATE_CHAPTER_PROGRESSION'}))
}));

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

describe('Cards', () => {
  describe('fetchCards', () => {
    it('success', async () => {
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
        expect(action).toEqual(fetchRequest(language));
        return Promise.resolve(action);
      });
      dispatch.mockImplementationOnce(action => {
        expect(action).toBeInstanceOf(Function);
        return Promise.resolve(action);
      });
      dispatch.mockImplementationOnce(action => {
        expect(action).toEqual(fetchSuccess(items, language));
        return Promise.resolve(action);
      });
      getState.mockReturnValue({authentication: {token: '__TOKEN__', brand}});
      options.services.Cards.find.mockReturnValueOnce(Promise.resolve(items));

      // $FlowFixMe
      const actual = await fetchCards(language)(dispatch, getState, options);
      return expect(actual).toEqual(fetchSuccess(items, language));
    });
    it('token is missing', async () => {
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
        expect(action).toEqual(fetchRequest(language));
        return action;
      });
      dispatch.mockImplementationOnce(action => {
        expect(action).toEqual(fetchError('Token not defined'));
        return action;
      });
      getState.mockReturnValue({authentication: {token: null, brand: null}});

      // $FlowFixMe
      const actual = await fetchCards(language)(dispatch, getState, options);

      expect(options.services.Cards.find).not.toHaveBeenCalled();
      return expect(actual).toEqual(fetchError('Token not defined'));
    });
    it('brand is missing', async () => {
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
        expect(action).toEqual(fetchRequest(language));
        return action;
      });
      dispatch.mockImplementationOnce(action => {
        expect(action).toEqual(fetchError('Brand not defined'));
        return action;
      });
      getState.mockReturnValue({authentication: {token: '__TOKEN__', brand: null}});

      // $FlowFixMe
      const actual = await fetchCards(language)(dispatch, getState, options);

      expect(options.services.Cards.find).not.toHaveBeenCalled();
      return expect(actual).toEqual(fetchError('Brand not defined'));
    });
    it('error on fetch failure', async () => {
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
        expect(action).toEqual(fetchRequest(language));
        return action;
      });
      dispatch.mockImplementationOnce(action => {
        expect(action).toEqual(fetchError('Error'));
        return action;
      });
      getState.mockReturnValue({authentication: {token: '__TOKEN__', brand}});
      options.services.Cards.find.mockRejectedValueOnce(new Error());

      // $FlowFixMe
      const actual = await fetchCards(language)(dispatch, getState, options);

      return expect(actual).toEqual(fetchError('Error'));
    });
  });

  describe('selectCard', () => {
    describe('discipline', () => {
      it('should fetch discipline and create progression', async () => {
        const dispatch = jest.fn();
        const getState = jest.fn();
        const options = {
          services: {
            Content: {
              find: jest.fn()
            }
          }
        };

        options.services.Content.find.mockReturnValueOnce(Promise.resolve(level));

        dispatch.mockImplementationOnce(action => {
          // expect(action).toEqual(fetchError('Error'));
          expect(action).toEqual({type: '@@mock/CREATE_LEVEL_PROGRESSION'});
          return Promise.resolve(action);
        });

        // $FlowFixMe
        const actual = await selectCard(disciplineCard)(dispatch, getState, options);
        return expect(actual).toEqual({type: '@@mock/CREATE_LEVEL_PROGRESSION'});
      });
      it('should handle card without module and dispatch failure', async () => {
        const dispatch = jest.fn();
        const getState = jest.fn();
        const options = {
          services: {
            Content: {
              find: jest.fn()
            }
          }
        };

        const disciplineCardWihoutLevel = createDisciplineCard({
          ref: 'dis1',
          completion: 0,
          levels: [],
          title: 'Discipline'
        });

        const expected = selectCardFailure(disciplineCardWihoutLevel, 'Course has no level');

        options.services.Content.find.mockReturnValueOnce(Promise.reject(new Error()));

        dispatch.mockImplementationOnce(action => {
          expect(action).toEqual(expected);
          return Promise.resolve(action);
        });
        // $FlowFixMe
        const actual = await selectCard(disciplineCardWihoutLevel)(dispatch, getState, options);

        return expect(actual).toEqual(expected);
      });
      it('should handle content find rejection', async () => {
        const dispatch = jest.fn();
        const getState = jest.fn();
        const options = {
          services: {
            Content: {
              find: jest.fn()
            }
          }
        };

        const expected = selectCardFailure(disciplineCard, 'Level progression not created');

        options.services.Content.find.mockReturnValueOnce(Promise.reject(new Error()));

        dispatch.mockImplementationOnce(action => {
          expect(action).toEqual(expected);
          return Promise.resolve(action);
        });
        // $FlowFixMe
        const actual = await selectCard(disciplineCard)(dispatch, getState, options);

        return expect(actual).toEqual(expected);
      });
    });
    describe('chapter', () => {
      it('should fetch chapter and create progression', async () => {
        const dispatch = jest.fn();
        const getState = jest.fn();
        const options = {
          services: {
            Content: {
              find: jest.fn()
            }
          }
        };

        options.services.Content.find.mockReturnValueOnce(Promise.resolve(level));

        dispatch.mockImplementationOnce(action => {
          // expect(action).toEqual(fetchError('Error'));
          expect(action).toEqual({type: '@@mock/CREATE_CHAPTER_PROGRESSION'});
          return Promise.resolve(action);
        });

        // $FlowFixMe
        const actual = await selectCard(chapterCard)(dispatch, getState, options);
        return expect(actual).toEqual({type: '@@mock/CREATE_CHAPTER_PROGRESSION'});
      });
      it('should handle content find rejection', async () => {
        const dispatch = jest.fn();
        const getState = jest.fn();
        const options = {
          services: {
            Content: {
              find: jest.fn()
            }
          }
        };

        const expected = selectCardFailure(chapterCard, 'Chapter progression not created');

        options.services.Content.find.mockReturnValueOnce(Promise.reject(new Error()));

        dispatch.mockImplementationOnce(action => {
          expect(action).toEqual(expected);
          return Promise.resolve(action);
        });
        // $FlowFixMe
        const actual = await selectCard(chapterCard)(dispatch, getState, options);

        return expect(actual).toEqual(expected);
      });
    });
  });
});
