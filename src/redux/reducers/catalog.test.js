// @flow strict

import {createSections} from '../../__fixtures__/sections';
import {createDisciplineCard} from '../../__fixtures__/cards';
import {FETCH_SUCCESS as SECTIONS_FETCH_SUCCESS} from '../actions/catalog/sections';
import {FETCH_SUCCESS as CARD_FETCH_SUCCESS} from '../actions/catalog/cards/fetch';
import {FETCH_SUCCESS as HERO_FETCH_SUCCESS} from '../actions/catalog/hero';
import {REFRESH as REFRESH_CARD} from '../actions/catalog/cards/refresh';
import type {Action as SectionAction} from '../actions/catalog/sections';
import type {Action as FetchAction} from '../actions/catalog/cards/fetch';
import type {Action as SelectAction} from '../actions/catalog/cards/select';
import type {Action as RefreshAction} from '../actions/catalog/cards/refresh';
import type {Action as FetchHeroAction} from '../actions/catalog/hero';
import reducer, {reduceCards, reduceSections} from './catalog';

import type {State} from './catalog';

type Action = SectionAction | FetchAction | SelectAction | RefreshAction | FetchHeroAction;

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

  describe(SECTIONS_FETCH_SUCCESS, () => {
    it('Default', () => {
      const action: Action = {
        type: SECTIONS_FETCH_SUCCESS,
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
        sectionsRef: [undefined, sections[0].key, sections[1].key, undefined],
        entities: {
          cards: {},
          sections: reduceSectionsExpected
        }
      };
      expect(result).toEqual(expected);
    });

    it('With already fetched section', () => {
      const action: Action = {
        type: SECTIONS_FETCH_SUCCESS,
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
        sectionsRef: [undefined, sections[0].key, sections[1].key, undefined],
        entities: {
          cards: {},
          sections: reduceSectionsExpected
        }
      };
      expect(result).toEqual(expected);
    });
  });

  describe(CARD_FETCH_SUCCESS, () => {
    it('Default', () => {
      const action: Action = {
        type: CARD_FETCH_SUCCESS,
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
                cardsRef: [undefined, 'dis1', 'dis2', undefined, undefined]
              }
            }
          }
        }
      };
      expect(result).toEqual(expected);
    });
  });

  describe(HERO_FETCH_SUCCESS, () => {
    it('Default', () => {
      const action: Action = {
        type: HERO_FETCH_SUCCESS,
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
        type: HERO_FETCH_SUCCESS,
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

      const dis3 = {
        ...dis2,
        universalRef: dis1.universalRef
      };

      const action: Action = {
        type: REFRESH_CARD,
        payload: {
          item: dis3,
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
              [language]: dis3
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

      const dis3 = {
        ...dis2,
        universalRef: dis1.universalRef
      };

      const action: Action = {
        type: REFRESH_CARD,
        payload: {
          item: dis3,
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
              [language]: dis3
            }
          },
          sections: {}
        }
      };
      expect(result).toEqual(expected);
    });
  });
});
