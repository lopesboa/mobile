// @flow strict

import {createSections} from '../../__fixtures__/sections';
import {createDisciplineCard} from '../../__fixtures__/cards';
import {FETCH_SUCCESS as FETCH_SECTIONS_SUCCESS} from '../actions/catalog/sections';
import {FETCH_SUCCESS as FETCH_SECTIONS_CARDS_SUCCESS} from '../actions/catalog/cards/fetch/sections';
import {FETCH_SUCCESS as FETCH_SEARCH_CARDS_SUCCESS} from '../actions/catalog/cards/fetch/search';
import {FETCH_SUCCESS as FETCH_HERO_SUCCESS} from '../actions/catalog/hero';
import {REFRESH as REFRESH_CARD} from '../actions/catalog/cards/refresh';
import {CLEAR_SEARCH} from '../actions/catalog/cards/clear';
import type {Action as SectionsAction} from '../actions/catalog/sections';
import type {Action as FetchSectionsCardsAction} from '../actions/catalog/cards/fetch/sections';
import type {Action as FetchSearchCardsAction} from '../actions/catalog/cards/fetch/search';
import type {Action as SelectAction} from '../actions/catalog/cards/select';
import type {Action as RefreshAction} from '../actions/catalog/cards/refresh';
import type {Action as ClearAction} from '../actions/catalog/cards/clear';
import type {Action as FetchHeroAction} from '../actions/catalog/hero';
import reducer, {reduceCards, reduceSections, reduceCardsRef, reduceSectionsRef} from './catalog';
import type {State} from './catalog';

type Action =
  | SectionsAction
  | FetchSectionsCardsAction
  | FetchSearchCardsAction
  | SelectAction
  | RefreshAction
  | ClearAction
  | FetchHeroAction;

const dis1 = createDisciplineCard({
  ref: 'dis1',
  completion: 0,
  levels: [],
  title: 'First discipline'
});
const dis2 = createDisciplineCard({
  ref: 'dis2',
  completion: 0,
  levels: [],
  title: 'Second discipline'
});
const dis3 = createDisciplineCard({
  ref: 'dis3',
  completion: 0,
  levels: [],
  title: 'Third discipline'
});
const sections = createSections().slice(0, 2);

describe('Catalog', () => {
  const expectedInitialState: State = {
    heroRef: null,
    entities: {
      cards: {},
      sections: {}
    }
  };

  it('Default', () => {
    const action = {
      type: 'FAKE_ACTION'
    };
    // $FlowFixMe we are trying to emulate something else
    const result = reducer(undefined, action);
    expect(result).toEqual(expectedInitialState);
  });

  const reduceCardsExpected = {
    dis1: {
      en: dis1
    },
    dis2: {
      en: dis2
    }
  };

  it('reduceCards', () => {
    const result = reduceCards([dis1, dis2], 'en');
    expect(result).toEqual(reduceCardsExpected);
  });

  const reduceSectionsExpected = {
    [sections[0].key]: {
      en: {
        ...sections[0],
        cardsRef: undefined
      }
    },
    [sections[1].key]: {
      en: {
        ...sections[1],
        cardsRef: undefined
      }
    }
  };

  it('reduceSections', () => {
    const result = reduceSections(sections, 'en');
    expect(result).toEqual(reduceSectionsExpected);
  });

  const reduceCardsRefExpected = [undefined, 'dis1', 'dis2', undefined, undefined];

  it('reduceCardsRef', () => {
    const result = reduceCardsRef([dis1, dis2], 1, 5);
    expect(result).toEqual(reduceCardsRefExpected);
  });

  const reduceSectionsRefExpected = [undefined, sections[0].key, sections[1].key, undefined];

  it('reduceSectionsRef', () => {
    const result = reduceSectionsRef(sections, 1, 4);
    expect(result).toEqual(reduceSectionsRefExpected);
  });

  describe(FETCH_SECTIONS_SUCCESS, () => {
    it('Default', () => {
      const action: Action = {
        type: FETCH_SECTIONS_SUCCESS,
        payload: {
          offset: 1,
          limit: 2,
          total: 4,
          items: sections,
          language: 'en'
        }
      };
      const result = reducer(expectedInitialState, action);
      const expected: State = {
        ...expectedInitialState,
        sectionsRef: reduceSectionsRefExpected,
        entities: {
          cards: {},
          sections: reduceSectionsExpected
        }
      };
      expect(result).toEqual(expected);
    });

    it('With already fetched section', () => {
      const action: Action = {
        type: FETCH_SECTIONS_SUCCESS,
        payload: {
          offset: 1,
          limit: 2,
          total: 4,
          items: sections,
          language: 'en'
        }
      };
      const initialState: State = {
        ...expectedInitialState,
        entities: {
          ...expectedInitialState.entities,
          sections: reduceSectionsExpected
        }
      };
      const result = reducer(initialState, action);
      const expected: State = {
        ...initialState,
        sectionsRef: reduceSectionsRefExpected,
        entities: {
          cards: {},
          sections: reduceSectionsExpected
        }
      };
      expect(result).toEqual(expected);
    });
  });

  describe(FETCH_SECTIONS_CARDS_SUCCESS, () => {
    it('Default', () => {
      const action: Action = {
        type: FETCH_SECTIONS_CARDS_SUCCESS,
        payload: {
          sectionKey: sections[0].key,
          offset: 1,
          limit: 2,
          total: 5,
          items: [dis1, dis2],
          language: 'en'
        }
      };
      const initialState: State = {
        ...expectedInitialState,
        entities: {
          cards: {},
          sections: {
            [sections[0].key]: {
              en: sections[0]
            }
          }
        }
      };
      const result = reducer(initialState, action);
      const expected: State = {
        ...initialState,
        entities: {
          cards: reduceCardsExpected,
          sections: {
            [sections[0].key]: {
              en: {
                ...sections[0],
                cardsRef: reduceCardsRefExpected
              }
            }
          }
        }
      };
      expect(result).toEqual(expected);
    });
  });

  describe(FETCH_SEARCH_CARDS_SUCCESS, () => {
    const defaultExpected: State = {
      ...expectedInitialState,
      searchRef: [undefined, 'dis1', 'dis2', undefined, undefined],
      entities: {
        cards: reduceCardsExpected,
        sections: {}
      }
    };

    it('Default', () => {
      const action: Action = {
        type: FETCH_SEARCH_CARDS_SUCCESS,
        payload: {
          search: 'foo',
          offset: 1,
          limit: 2,
          total: 5,
          items: [dis1, dis2],
          language: 'en',
          forceRefresh: true
        }
      };
      const result = reducer(expectedInitialState, action);

      expect(result).toEqual(defaultExpected);
    });

    it('Force refresh', () => {
      const action: Action = {
        type: FETCH_SEARCH_CARDS_SUCCESS,
        payload: {
          search: 'foo',
          offset: 4,
          limit: 1,
          total: 5,
          items: [dis3],
          language: 'en',
          forceRefresh: false
        }
      };
      const result = reducer(defaultExpected, action);
      const expected: State = {
        ...defaultExpected,
        searchRef: [undefined, 'dis1', 'dis2', undefined, 'dis3'],
        entities: {
          cards: {
            ...reduceCardsExpected,
            ...reduceCards([dis3], 'en')
          },
          sections: {}
        }
      };
      expect(result).toEqual(expected);
    });
  });

  describe(FETCH_HERO_SUCCESS, () => {
    it('Default', () => {
      const action: Action = {
        type: FETCH_HERO_SUCCESS,
        payload: {
          item: dis1,
          language: 'en'
        }
      };
      const result = reducer(expectedInitialState, action);
      const expected: State = {
        heroRef: dis1.universalRef,
        entities: {
          cards: {
            dis1: {
              en: dis1
            }
          },
          sections: {}
        }
      };
      expect(result).toEqual(expected);
    });

    it('Without item', () => {
      const action: Action = {
        type: FETCH_HERO_SUCCESS,
        payload: {
          language: 'en'
        }
      };
      const result = reducer(expectedInitialState, action);
      const expected = {
        ...expectedInitialState,
        heroRef: undefined
      };

      expect(result).toEqual(expected);
    });
  });

  describe(REFRESH_CARD, () => {
    it('Default', () => {
      const language = 'en';
      const initialState = {
        entities: {
          cards: {
            [dis1.universalRef]: {
              [language]: dis1,
              fr: dis1
            },
            [dis2.universalRef]: {
              [language]: dis2,
              fr: dis2
            }
          },
          sections: {}
        }
      };

      const updateDis1 = {
        ...dis2,
        universalRef: dis1.universalRef
      };

      const action: Action = {
        type: REFRESH_CARD,
        payload: {
          item: updateDis1,
          language: language
        }
      };
      const result = reducer(initialState, action);
      const expected: State = {
        entities: {
          ...initialState.entities,
          cards: {
            ...initialState.entities.cards,
            [dis1.universalRef]: {
              ...initialState.entities.cards[dis1.universalRef],
              [language]: updateDis1
            }
          },
          sections: {}
        }
      };
      expect(result).toEqual(expected);
    });
    it('if state is empty', () => {
      const language = 'en';
      const intialState = {
        entities: {
          cards: {},
          sections: {}
        }
      };

      const updateDis1 = {
        ...dis2,
        universalRef: dis1.universalRef
      };

      const action: Action = {
        type: REFRESH_CARD,
        payload: {
          item: updateDis1,
          language: language
        }
      };
      const result = reducer(intialState, action);
      const expected: State = {
        entities: {
          ...intialState.entities,
          cards: {
            [dis1.universalRef]: {
              ...intialState.entities[dis1.universalRef],
              [language]: updateDis1
            }
          },
          sections: {}
        }
      };
      expect(result).toEqual(expected);
    });
  });

  describe(CLEAR_SEARCH, () => {
    it('Default', () => {
      const initialState = {
        searchRef: ['foo', 'bar', 'baz'],
        entities: {
          cards: {},
          sections: {}
        }
      };

      const action: Action = {
        type: CLEAR_SEARCH
      };
      const result = reducer(initialState, action);
      const expected: State = {
        entities: {
          searchRef: undefined,
          cards: {},
          sections: {}
        }
      };
      expect(result).toEqual(expected);
    });
  });
});
