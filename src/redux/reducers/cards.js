// @flow strict

import type {Action, FetchSuccessPayload} from '../actions/cards';
import {FETCH_SUCCESS} from '../actions/cards';
import type {DisciplineCard, ChapterCard} from '../../layer/data/_types';
import type {SupportedLanguage} from '../../translations/_types';

export type State = {|
  entities: {
    [key: string]: {
      [key: SupportedLanguage]: DisciplineCard | ChapterCard
    }
  }
|};

export const initialState: State = {
  entities: {}
};

export const reduceItems = (
  items: Array<DisciplineCard | ChapterCard>,
  language: SupportedLanguage
): {
  [key: string]: DisciplineCard | ChapterCard
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

const reducer = (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case FETCH_SUCCESS: {
      const payload: FetchSuccessPayload = action.payload;
      if (!payload || !payload.items || !payload.language) {
        return state;
      }

      return {
        ...state,
        entities: {
          ...state.entities,
          ...reduceItems(payload.items, payload.language)
        }
      };
    }
    default:
      return state;
  }
};

export default reducer;
