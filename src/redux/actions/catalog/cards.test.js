// @flow strict

import {fakeError} from '../../../utils/tests';
import {createSections} from '../../../__fixtures__/sections';
import {createBrand} from '../../../__fixtures__/brands';
import {createChapter} from '../../../__fixtures__/chapters';
import {
  createDisciplineCard,
  createChapterCard,
  createCardLevel
} from '../../../__fixtures__/cards';
import {createProgression} from '../../../__fixtures__/progression';
import {CARD_STATUS, RESTRICTED_RESOURCE_TYPE} from '../../../layer/data/_const';
import {ERROR_TYPE} from '../../../const';

import {createStoreState} from '../../../__fixtures__/store';
import {SHOW} from '../ui/modal';
import {
  fetchRequest,
  fetchSuccess,
  fetchError,
  fetchCards,
  selectCard,
  selectCardFailure,
  getAndRefreshCard
} from './cards';

jest.mock('../progression', () => ({
  createLevelProgression: jest.fn(() =>
    Promise.resolve({type: '@@mock/CREATE_LEVEL_PROGRESSION', payload: {_id: '__ID__'}})
  ),
  createChapterProgression: jest.fn(() =>
    Promise.resolve({type: '@@mock/CREATE_CHAPTER_PROGRESSION', payload: {_id: '__ID__'}})
  ),
  selectProgression: jest.fn(id =>
    Promise.resolve({type: '@@mock/SELECT_PROGRESSION', payload: {id}})
  )
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
const chapter = createChapter({ref: 'cha1', name: 'chapter'});
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

  describe('selectCard', () => {
    describe('discipline', () => {
      it('should fetch discipline and create progression', async () => {
        const dispatch = jest.fn();
        const getState = jest.fn();
        const options = {
          services: {
            Content: {
              find: jest.fn()
            },
            Progressions: {
              findLast: jest.fn(() => Promise.resolve(null))
            }
          }
        };

        // $FlowFixMe duplicated type between store and layer
        options.services.Content.find.mockReturnValueOnce(Promise.resolve(level));

        dispatch.mockImplementationOnce(async action => {
          expect(await action).toEqual({
            type: '@@mock/CREATE_LEVEL_PROGRESSION',
            payload: {_id: '__ID__'}
          });

          // $FlowFixMe Promise definition
          return action;
        });
        dispatch.mockImplementationOnce(async action => {
          expect(await action).toEqual({
            type: '@@mock/SELECT_PROGRESSION',
            payload: {id: '__ID__'}
          });
          // $FlowFixMe Promise definition
          return action;
        });

        // $FlowFixMe
        const actual = await selectCard(disciplineCard)(dispatch, getState, options);
        return expect(actual).toEqual({
          type: '@@mock/SELECT_PROGRESSION',
          payload: {id: '__ID__'}
        });
      });
      it('should handle card without module and dispatch failure', async () => {
        const dispatch = jest.fn();
        const getState = jest.fn();
        const options = {
          services: {
            Content: {
              find: jest.fn()
            },
            Progressions: {
              findLast: jest.fn(() => Promise.resolve(null))
            }
          }
        };

        const disciplineCardWihoutLevel = createDisciplineCard({
          ref: 'dis1',
          completion: 0,
          levels: [],
          title: 'Discipline'
        });

        const expected = selectCardFailure(
          disciplineCardWihoutLevel,
          new Error('Course has no level')
        );

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
            },
            Progressions: {
              findLast: jest.fn(() => Promise.resolve(null))
            }
          }
        };

        const expected = selectCardFailure(
          disciplineCard,
          new Error('Level progression not created')
        );

        options.services.Content.find.mockReturnValueOnce(Promise.reject(new Error()));

        dispatch.mockImplementationOnce(async action => {
          expect(await action).toEqual(expected);
          // $FlowFixMe Promise definition
          return action;
        });
        // $FlowFixMe
        const actual = await selectCard(disciplineCard)(dispatch, getState, options);

        return expect(actual).toEqual(expected);
      });
      it('should resume discipline progression', async () => {
        const dispatch = jest.fn();
        const getState = jest.fn();
        const options = {
          services: {
            Content: {
              find: jest.fn()
            },
            Progressions: {
              findLast: jest.fn((engineRef, contentRef) => {
                expect(engineRef).toBe('learner');
                expect(contentRef).toBe(level.universalRef);
                return Promise.resolve({_id: '__ID__'});
              })
            }
          }
        };

        dispatch.mockImplementationOnce(async action => {
          // expect(action).toEqual(fetchError('Error'));
          expect(await action).toEqual({
            type: '@@mock/SELECT_PROGRESSION',
            payload: {id: '__ID__'}
          });

          // $FlowFixMe Promise definition
          return action;
        });

        // $FlowFixMe
        const actual = await selectCard(disciplineCard)(dispatch, getState, options);
        return expect(actual).toEqual({
          type: '@@mock/SELECT_PROGRESSION',
          payload: {id: '__ID__'}
        });
      });

      it('should fetch the bundle if no content found at the first attempt', async () => {
        const token = 'TOKEEEEEEN';
        const authentication = {
          user: {
            token,
            isGodModeUser: false
          },
          brand
        };

        const progression = createProgression({
          engine: 'microlearning',
          progressionContent: {
            type: 'level',
            ref: 'lol'
          }
        });

        const mockedStore = createStoreState({
          levels: [],
          disciplines: [],
          chapters: [],
          slides: [],
          progression,
          authentication
        });
        const dispatch = jest.fn();
        const getState = () => mockedStore;
        const options = {
          services: {
            Content: {
              find: jest.fn()
            },
            Bundle: {
              findById: jest.fn(() => Promise.resolve({})),
              store: jest.fn(() => Promise.resolve(undefined))
            },
            Progressions: {
              findLast: jest.fn(() => Promise.resolve(null))
            }
          }
        };

        options.services.Content.find
          .mockImplementationOnce(() => Promise.resolve(null))
          .mockImplementationOnce(() => Promise.resolve(level));

        dispatch.mockImplementationOnce(async action => {
          expect(await action).toEqual({
            type: '@@mock/CREATE_LEVEL_PROGRESSION',
            payload: {_id: '__ID__'}
          });
          // $FlowFixMe Promise definition
          return action;
        });
        dispatch.mockImplementationOnce(async action => {
          expect(await action).toEqual({
            type: '@@mock/SELECT_PROGRESSION',
            payload: {id: '__ID__'}
          });
          // $FlowFixMe Promise definition
          return action;
        });

        // $FlowFixMe
        const actual = await selectCard(disciplineCard)(dispatch, getState, options);

        expect(options.services.Bundle.findById).toHaveBeenCalledWith(
          RESTRICTED_RESOURCE_TYPE.DISCIPLINE,
          disciplineCard.universalRef,
          disciplineCard.lang,
          token,
          brand.host
        );

        return expect(actual).toEqual({
          type: '@@mock/SELECT_PROGRESSION',
          payload: {id: '__ID__'}
        });
      });

      it('should dispatch selectCardFailure if no token or brand is provided', async () => {
        const token = null;
        const authentication = {
          user: {
            token,
            isGodModeUser: false
          },
          brand: null
        };

        const progression = createProgression({
          engine: 'microlearning',
          progressionContent: {
            type: 'level',
            ref: 'lol'
          }
        });

        const mockedStore = createStoreState({
          levels: [],
          disciplines: [],
          chapters: [],
          slides: [],
          progression,
          authentication
        });

        const dispatch = jest.fn();
        const getState = () => mockedStore;
        const options = {
          services: {
            Content: {
              find: jest.fn()
            },
            Bundle: {
              findById: jest.fn(),
              store: jest.fn()
            },
            Progressions: {
              findLast: jest.fn(() => Promise.resolve(null))
            }
          }
        };

        options.services.Content.find.mockImplementationOnce(() => Promise.resolve(null));

        expect(options.services.Bundle.findById).not.toHaveBeenCalled();
        expect(options.services.Bundle.store).not.toHaveBeenCalled();

        const expected = selectCardFailure(
          disciplineCard,
          new Error('Level progression not created')
        );

        dispatch.mockImplementationOnce(async action => {
          expect(await action).toEqual(expected);

          // $FlowFixMe Promise definition
          return action;
        });
        // $FlowFixMe
        const actual = await selectCard(disciplineCard)(dispatch, getState, options);

        return expect(actual).toEqual(expected);
      });

      it('should show a modal if no content found at the second try', async () => {
        const token = 'TOKEEEEEEN';
        const authentication = {
          user: {
            token,
            isGodModeUser: false
          },
          brand
        };

        const progression = createProgression({
          engine: 'microlearning',
          progressionContent: {
            type: 'level',
            ref: 'lol'
          }
        });

        const mockedStore = createStoreState({
          levels: [],
          disciplines: [],
          chapters: [],
          slides: [],
          progression,
          authentication
        });
        const dispatch = jest.fn();
        const getState = () => mockedStore;
        const options = {
          services: {
            Content: {
              find: jest.fn()
            },
            Bundle: {
              findById: jest.fn(),
              store: jest.fn()
            },
            Progressions: {
              findLast: jest.fn(() => Promise.resolve(null))
            }
          }
        };

        options.services.Content.find
          .mockImplementationOnce(() => Promise.resolve(null))
          .mockImplementationOnce(() => Promise.resolve(null));

        const expectedResult = {
          type: SHOW,
          payload: {
            errorType: ERROR_TYPE.NO_CONTENT_FOUND,
            lastAction: expect.any(Function)
          }
        };

        dispatch.mockImplementationOnce(async action => {
          expect(await action).toEqual(expectedResult);
          // $FlowFixMe Promise definition
          return action;
        });

        // $FlowFixMe
        const result = await selectCard(disciplineCard)(dispatch, getState, options);

        expect(options.services.Bundle.findById).toHaveBeenCalledWith(
          RESTRICTED_RESOURCE_TYPE.DISCIPLINE,
          disciplineCard.universalRef,
          disciplineCard.lang,
          token,
          brand.host
        );

        expect(options.services.Bundle.store).toHaveBeenCalled();

        expect(result).toEqual(expectedResult);

        const newResult = await result.payload.lastAction()(dispatch, getState, options);

        expect(newResult).toEqual(undefined);
      });

      it("should dispatch selectCardFailure if a discipline's card level universalId is missing", async () => {
        const token = 'TOKEN';
        const authentication = {
          user: {
            token,
            isGodModeUser: false
          },
          brand: brand
        };

        const progression = createProgression({
          engine: 'microlearning',
          progressionContent: {
            type: 'level',
            ref: 'lol'
          }
        });

        const mockedStore = createStoreState({
          levels: [],
          disciplines: [],
          chapters: [],
          slides: [],
          progression,
          authentication
        });

        const dispatch = jest.fn();
        const getState = () => mockedStore;
        const options = {
          services: {
            Content: {
              find: jest.fn()
            },
            Bundle: {
              findById: jest.fn(),
              store: jest.fn()
            },
            Progressions: {
              findLast: jest.fn(() => Promise.resolve(null))
            }
          }
        };

        const disciplineCard1 = createDisciplineCard({
          ref: 'dis1',
          completion: 0,
          levels: [{...level, universalRef: undefined}],
          title: 'Discipline'
        });

        options.services.Content.find.mockImplementationOnce(() => Promise.resolve(null));

        expect(options.services.Bundle.findById).not.toHaveBeenCalled();
        expect(options.services.Bundle.store).not.toHaveBeenCalled();

        const expectedResult = {
          type: SHOW,
          payload: {
            errorType: ERROR_TYPE.NO_CONTENT_FOUND,
            lastAction: expect.any(Function)
          }
        };
        dispatch.mockImplementationOnce(async action => {
          expect(await action).toEqual(expectedResult);
          // $FlowFixMe
          return action;
        });
        // $FlowFixMe
        const actual = await selectCard(disciplineCard1)(dispatch, getState, options);

        return expect(actual).toEqual(expectedResult);
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
            },
            Progressions: {
              findLast: jest.fn(() => Promise.resolve(null))
            }
          }
        };

        // $FlowFixMe duplicated type between store and layer
        options.services.Content.find.mockReturnValueOnce(Promise.resolve(chapter));

        dispatch.mockImplementationOnce(async action => {
          // expect(action).toEqual(fetchError('Error'));
          expect(await action).toEqual({
            type: '@@mock/CREATE_CHAPTER_PROGRESSION',
            payload: {_id: '__ID__'}
          });
          // $FlowFixMe Promise definition
          return action;
        });

        dispatch.mockImplementationOnce(async action => {
          expect(await action).toEqual({
            type: '@@mock/SELECT_PROGRESSION',
            payload: {id: '__ID__'}
          });

          // $FlowFixMe Promise definition
          return action;
        });

        // $FlowFixMe
        const actual = await selectCard(chapterCard)(dispatch, getState, options);
        return expect(actual).toEqual({
          type: '@@mock/SELECT_PROGRESSION',
          payload: {id: '__ID__'}
        });
      });
      it('should handle content find rejection', async () => {
        const dispatch = jest.fn();
        const getState = jest.fn();
        const options = {
          services: {
            Content: {
              find: jest.fn()
            },
            Progressions: {
              findLast: jest.fn(() => Promise.resolve(null))
            }
          }
        };

        const expected = selectCardFailure(
          chapterCard,
          new Error('Chapter progression not created')
        );

        options.services.Content.find.mockReturnValueOnce(Promise.reject(new Error()));

        dispatch.mockImplementationOnce(action => {
          expect(action).toEqual(expected);
          return Promise.resolve(action);
        });
        // $FlowFixMe
        const actual = await selectCard(chapterCard)(dispatch, getState, options);

        return expect(actual).toEqual(expected);
      });
      it('should resume chapter progression', async () => {
        const dispatch = jest.fn();
        const getState = jest.fn();
        const options = {
          services: {
            Content: {
              find: jest.fn()
            },
            Progressions: {
              findLast: jest.fn((engineRef, contentRef) => {
                expect(engineRef).toBe('microlearning');
                expect(contentRef).toBe(chapter.universalRef);
                return Promise.resolve({_id: '__ID__'});
              })
            }
          }
        };

        dispatch.mockImplementationOnce(async action => {
          // expect(action).toEqual(fetchError('Error'));
          expect(await action).toEqual({
            type: '@@mock/SELECT_PROGRESSION',
            payload: {id: '__ID__'}
          });
          // $FlowFixMe Promise definition
          return action;
        });

        // $FlowFixMe
        const actual = await selectCard(chapterCard)(dispatch, getState, options);
        return expect(actual).toEqual({
          type: '@@mock/SELECT_PROGRESSION',
          payload: {id: '__ID__'}
        });
      });

      it('should fetch the bundle if no content found at the first attempt', async () => {
        const token = 'TOKEEEEEEN';
        const authentication = {
          user: {
            token,
            isGodModeUser: false
          },
          brand
        };

        const progression = createProgression({
          engine: 'microlearning', // in our case don't mind about the engine
          progressionContent: {
            type: 'chapter',
            ref: 'lol'
          }
        });

        const mockedStore = createStoreState({
          levels: [],
          disciplines: [],
          chapters: [],
          slides: [],
          progression,
          authentication
        });
        const dispatch = jest.fn();
        const getState = () => mockedStore;
        const options = {
          services: {
            Content: {
              find: jest.fn()
            },
            Bundle: {
              findById: jest.fn(),
              store: jest.fn()
            },
            Progressions: {
              findLast: jest.fn(() => Promise.resolve(null))
            }
          }
        };

        options.services.Content.find
          .mockImplementationOnce(() => Promise.resolve(null))
          .mockImplementationOnce(() => Promise.resolve(chapter));

        dispatch.mockImplementationOnce(async action => {
          expect(await action).toEqual({
            type: '@@mock/CREATE_CHAPTER_PROGRESSION',
            payload: {_id: '__ID__'}
          });
          // $FlowFixMe Promise definition
          return action;
        });
        dispatch.mockImplementationOnce(async action => {
          expect(await action).toEqual({
            type: '@@mock/SELECT_PROGRESSION',
            payload: {id: '__ID__'}
          });
          // $FlowFixMe Promise definition
          return action;
        });

        // $FlowFixMe
        const actual = await selectCard(chapterCard)(dispatch, getState, options);

        expect(options.services.Bundle.findById).toHaveBeenCalledWith(
          RESTRICTED_RESOURCE_TYPE.CHAPTER,
          chapterCard.universalRef,
          chapterCard.lang,
          token,
          brand.host
        );

        expect(options.services.Bundle.store).toHaveBeenCalled();

        return expect(actual).toEqual({
          type: '@@mock/SELECT_PROGRESSION',
          payload: {id: '__ID__'}
        });
      });

      it('should dispatch selectCardFailure if no token or brand is provided', async () => {
        const token = undefined;
        const authentication = {
          user: {
            token,
            isGodModeUser: false
          },
          brand: undefined
        };

        const progression = createProgression({
          engine: 'microlearning',
          progressionContent: {
            type: 'level',
            ref: 'lol'
          }
        });

        const mockedStore = createStoreState({
          levels: [],
          disciplines: [],
          chapters: [],
          slides: [],
          progression,
          authentication
        });

        const dispatch = jest.fn();
        const getState = () => mockedStore;
        const options = {
          services: {
            Content: {
              find: jest.fn()
            },
            Bundle: {
              findById: jest.fn(),
              store: jest.fn()
            },
            Progressions: {
              findLast: jest.fn(() => Promise.resolve(null))
            }
          }
        };

        options.services.Content.find.mockImplementationOnce(() => Promise.resolve(undefined));

        expect(options.services.Bundle.findById).not.toHaveBeenCalled();
        expect(options.services.Bundle.store).not.toHaveBeenCalled();

        const expected = selectCardFailure(
          disciplineCard,
          new Error('Chapter progression not created')
        );

        dispatch.mockImplementationOnce(async action => {
          expect(await action).toEqual(expected);
          // $FlowFixMe Promise definition
          return action;
        });
        // $FlowFixMe
        const actual = await selectCard(chapterCard)(dispatch, getState, options);

        return expect(actual).toEqual(expected);
      });

      it('should show a modal if no content found at the second try', async () => {
        const token = 'TOKEEEEEEN';
        const authentication = {
          user: {
            token,
            isGodModeUser: false
          },
          brand
        };

        const progression = createProgression({
          engine: 'microlearning',
          progressionContent: {
            type: 'level',
            ref: 'lol'
          }
        });

        const mockedStore = createStoreState({
          levels: [],
          disciplines: [],
          chapters: [],
          slides: [],
          progression,
          authentication
        });
        const dispatch = jest.fn();
        const getState = () => mockedStore;
        const options = {
          services: {
            Content: {
              find: jest.fn()
            },
            Bundle: {
              findById: jest.fn(),
              store: jest.fn()
            },
            Progressions: {
              findLast: jest.fn(() => Promise.resolve(null))
            }
          }
        };

        options.services.Content.find
          .mockImplementationOnce(() => Promise.resolve(null))
          .mockImplementationOnce(() => Promise.resolve(null));

        const expectedResult = {
          type: SHOW,
          payload: {
            errorType: ERROR_TYPE.NO_CONTENT_FOUND,
            lastAction: expect.any(Function)
          }
        };

        dispatch.mockImplementationOnce(async action => {
          expect(await action).toEqual(expectedResult);
          // $FlowFixMe Promise definition
          return action;
        });

        // $FlowFixMe
        const result = await selectCard(chapterCard)(dispatch, getState, options);

        expect(options.services.Bundle.findById).toHaveBeenCalledWith(
          RESTRICTED_RESOURCE_TYPE.CHAPTER,
          chapterCard.universalRef,
          chapterCard.lang,
          token,
          brand.host
        );

        expect(options.services.Bundle.store).toHaveBeenCalled();

        expect(result).toEqual(expectedResult);

        const newResult = await result.payload.lastAction()(dispatch, getState, options);

        expect(newResult).toEqual(undefined);
      });
    });

    describe('card type not handled', () => {
      it('should throw an error if the card type is not handled', () => {
        const dispatch = jest.fn();
        const getState = () => jest.fn();
        const options = {
          services: {}
        };
        // $FlowFixMe
        const result = selectCard({...chapterCard, type: 'foo'})(dispatch, getState, options);

        expect(result).rejects.toThrow();
      });
    });
  });

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
      const actual = await getAndRefreshCard('fakeProgressionId', 'en')(
        // $FlowFixMe
        dispatch,
        getState,
        // $FlowFixMe
        options
      );

      expect(actual).toEqual({
        type: '@@cards/REFRESH_CARD',
        payload: {
          language: 'en',
          item: disciplineCard
        }
      });
    });

    it('should return void if no Progression found', async () => {
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
      const actual = await getAndRefreshCard('fakeProgressionId', 'en')(
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
      const actual = await getAndRefreshCard('fakeProgressionId', 'en')(
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
