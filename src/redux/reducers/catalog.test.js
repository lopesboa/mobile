// @flow strict

import {createSections} from '../../__fixtures__/sections';
import {createDisciplineCard} from '../../__fixtures__/cards';
import {FETCH_SUCCESS as SECTIONS_FETCH_SUCCESS} from '../actions/catalog/sections';
import {FETCH_SUCCESS as CARD_FETCH_SUCCESS, REFRESH_CARD} from '../actions/catalog/cards';
import type {Action as SECTIONS_ACTION} from '../actions/catalog/sections';
import type {Action} from '../actions/catalog/cards';
import reducer, {reduceCards, reduceSections} from './catalog';

import type {State} from './catalog';

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
      const action: SECTIONS_ACTION = {
        type: SECTIONS_FETCH_SUCCESS,
        payload: {
          offset: 1,
          limit: 2,
          total: 4,
          items: sections,
          language: 'en'
        }
      };
      const result = reducer(undefined, action);
      const expected: State = {
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
      const result = reducer(
        {entities: {cards: {}, sections: {[sections[0].key]: {en: sections[0]}}}},
        action
      );
      const expected: State = {
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
            [dis1.universalRef]: {
              ...initialState.entities[dis1.universalRef],
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
