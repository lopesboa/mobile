// @flow strict

import type {Action as FetchSectionsCardsAction} from '../actions/catalog/cards/fetch/sections';
import type {Action as FetchSearchCardsAction} from '../actions/catalog/cards/fetch/search';
import type {Action as SelectCardAction} from '../actions/catalog/cards/select';
import type {Action as RefreshCardAction} from '../actions/catalog/cards/refresh';
import type {Action as ClearAction} from '../actions/catalog/cards/clear';
import type {Action as SectionsAction} from '../actions/catalog/sections';
import type {Action as HeroAction} from '../actions/catalog/hero';
import {FETCH_SUCCESS as FETCH_SECTIONS_SUCCESS} from '../actions/catalog/sections';
import {FETCH_SUCCESS as FETCH_SECTIONS_CARDS_SUCCESS} from '../actions/catalog/cards/fetch/sections';
import {FETCH_SUCCESS as FETCH_SEARCH_CARDS_SUCCESS} from '../actions/catalog/cards/fetch/search';
import {REFRESH as REFRESH_CARD} from '../actions/catalog/cards/refresh';
import {CLEAR_SEARCH} from '../actions/catalog/cards/clear';
import {FETCH_SUCCESS as FETCH_HERO_SUCCESS} from '../actions/catalog/hero';
import type {DisciplineCard, ChapterCard} from '../../layer/data/_types';
import type {SupportedLanguage} from '../../translations/_types';
import type {Section} from '../../types';

export type State = {|
  heroRef?: string | null,
  sectionsRef?: Array<string | void>,
  searchRef?: Array<string | void>,
  entities: {
    cards: {
      [key: string]: {
        [key: SupportedLanguage]: DisciplineCard | ChapterCard
      }
    },
    sections: {
      [key: string]: {
        [key: SupportedLanguage]: Section
      }
    }
  }
|};

export const initialState: State = {
  heroRef: null,
  entities: {
    cards: {},
    sections: {}
  }
};

export const reduceCards = (
  items: Array<DisciplineCard | ChapterCard>,
  language: SupportedLanguage
): {
  [key: string]: {
    [key: SupportedLanguage]: DisciplineCard | ChapterCard
  }
} =>
  items.reduce(
    (result, item) => ({
      ...result,
      [item.universalRef]: {
        ...result[item.universalRef],
        [language]: item
      }
    }),
    {}
  );

export const reduceSections = (
  items: Array<Section>,
  language: SupportedLanguage,
  cardsRef?: Array<string | void>
): {
  [key: string]: {
    [key: SupportedLanguage]: Section
  }
} =>
  items.reduce(
    (result, item) => ({
      ...result,
      [item.key]: {
        ...result[item.key],
        [language]: {
          ...item,
          cardsRef
        }
      }
    }),
    {}
  );

export const reduceCardsRef = (
  items: Array<DisciplineCard | ChapterCard>,
  offset: number,
  total: number,
  state?: Array<string | void>
): Array<string | void> => {
  let cardsRef = state || new Array(total).fill();

  items.forEach((item, index) => {
    cardsRef[index + offset] = item.universalRef;
  });

  return cardsRef;
};

export const reduceSectionsRef = (
  items: Array<Section>,
  offset: number,
  total: number,
  state?: Array<string | void>
): Array<string | void> => {
  let sectionsRef = state || new Array(total).fill();

  items.forEach((item, index) => {
    sectionsRef[index + offset] = item.key;
  });

  return sectionsRef;
};

const reducer = (
  state: State = initialState,
  action:
    | FetchSectionsCardsAction
    | FetchSearchCardsAction
    | RefreshCardAction
    | ClearAction
    | SelectCardAction
    | SectionsAction
    | HeroAction
): State => {
  switch (action.type) {
    case FETCH_SECTIONS_SUCCESS: {
      const {offset, total, items, language} = action.payload;

      return {
        ...state,
        sectionsRef: reduceSectionsRef(items, offset, total, state.sectionsRef),
        entities: {
          ...state.entities,
          sections: {
            ...state.entities.sections,
            ...reduceSections(
              items.filter(item => {
                const section = state.entities.sections[item.key];
                return !(section && section[language]);
              }),
              language
            )
          }
        }
      };
    }

    case FETCH_SECTIONS_CARDS_SUCCESS: {
      const {sectionKey, offset, total, items, language} = action.payload;
      const section = state.entities.sections[sectionKey];
      const cardsRef = reduceCardsRef(items, offset, total, section[language].cardsRef);
      const sectionWithCardsRef = reduceSections([section[language]], language, cardsRef)[
        sectionKey
      ];
      const sections = {
        ...state.entities.sections,
        [sectionKey]: {
          ...section,
          ...sectionWithCardsRef
        }
      };

      return {
        ...state,
        entities: {
          ...state.entities,
          cards: {
            ...state.entities.cards,
            ...reduceCards(items, language)
          },
          sections
        }
      };
    }

    case FETCH_SEARCH_CARDS_SUCCESS: {
      const {offset, total, items, language, forceRefresh} = action.payload;
      const searchRef = reduceCardsRef(
        items,
        offset,
        total,
        forceRefresh ? undefined : state.searchRef
      );

      return {
        ...state,
        searchRef,
        entities: {
          ...state.entities,
          cards: {
            ...state.entities.cards,
            ...reduceCards(items, language)
          }
        }
      };
    }

    case REFRESH_CARD: {
      const {language, item} = action.payload;
      return {
        ...state,
        entities: {
          ...state.entities,
          cards: {
            ...state.entities.cards,
            [item.universalRef]: {
              ...(state.entities.cards[item.universalRef] || {}),
              [language]: item
            }
          }
        }
      };
    }

    case CLEAR_SEARCH: {
      return {
        ...state,
        searchRef: undefined
      };
    }

    case FETCH_HERO_SUCCESS: {
      const {language, item} = action.payload;

      return {
        ...state,
        heroRef: (item && item.universalRef) || undefined,
        entities: {
          ...state.entities,
          cards: {
            ...state.entities.cards,
            ...(item ? reduceCards([item], language) : {})
          }
        }
      };
    }

    default:
      return state;
  }
};

export default reducer;
