// @flow strict

import type {Action as CardAction} from '../actions/catalog/cards';
import type {Action as SectionAction} from '../actions/catalog/sections';
import {FETCH_SUCCESS as FETCH_SECTIONS_SUCCESS} from '../actions/catalog/sections';
import {FETCH_SUCCESS as FETCH_CARDS_SUCCESS, REFRESH_CARD} from '../actions/catalog/cards';
import type {DisciplineCard, ChapterCard} from '../../layer/data/_types';
import type {SupportedLanguage} from '../../translations/_types';
import type {Section} from '../../types';

export type State = {|
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

const reducer = (state: State = initialState, action: CardAction | SectionAction): State => {
  switch (action.type) {
    case FETCH_SECTIONS_SUCCESS: {
      const {items, language} = action.payload;

      return {
        ...state,
        entities: {
          ...state.entities,
          sections: {
            ...state.entities.sections,
            ...reduceSections(items, language)
          }
        }
      };
    }

    case FETCH_CARDS_SUCCESS: {
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

    case REFRESH_CARD: {
      const {language, item} = action.payload;
      return {
        ...state,
        entities: {
          ...state.entities,
          cards: {
            [item.universalRef]: {
              ...(state.entities[item.universalRef] || {}),
              [language]: item
            }
          }
        }
      };
    }
    default:
      return state;
  }
};

export default reducer;
