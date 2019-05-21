// @flow strict

import type {SupportedLanguage} from '../../translations/_types';
import type {Action} from '../actions/bundle';
import {FETCH_REQUEST, FETCH_SUCCESS} from '../actions/bundle';

export type OfflineStatus = {|
  pending: Array<SupportedLanguage>,
  ready: Array<SupportedLanguage>
|};

export type OfflineContents = {[key: string]: OfflineStatus};

export type State = {|
  disciplines: OfflineContents,
  chapters: OfflineContents
|};

export const initialState: State = {
  disciplines: {},
  chapters: {}
};

export const reducePendingContentStatus = (
  prevStatus?: OfflineStatus,
  pending: Array<SupportedLanguage>
): OfflineStatus => ({
  ready: (prevStatus && prevStatus.ready.filter(language => !pending.includes(language))) || [],
  pending:
    (prevStatus &&
      prevStatus.pending.filter(language => !pending.includes(language)).concat(pending)) ||
    pending
});

export const reducePendingContent = (
  prevState: OfflineContents,
  content: {[key: string]: Array<SupportedLanguage>}
): OfflineContents =>
  Object.keys(content).reduce(
    (result, ref) => ({
      ...result,
      [ref]: reducePendingContentStatus(result[ref], content[ref])
    }),
    prevState
  );

export const reduceReadyContentStatus = (
  prevStatus?: OfflineStatus,
  ready: Array<SupportedLanguage>
): OfflineStatus => ({
  pending: (prevStatus && prevStatus.pending.filter(language => !ready.includes(language))) || [],
  ready:
    (prevStatus && prevStatus.ready.filter(language => !ready.includes(language)).concat(ready)) ||
    ready
});

export const reduceReadyContent = (
  prevState: OfflineContents,
  content: {[key: string]: Array<SupportedLanguage>}
): OfflineContents =>
  Object.keys(content).reduce(
    (result, ref) => ({
      ...result,
      [ref]: reduceReadyContentStatus(result[ref], content[ref])
    }),
    prevState
  );

const reducer = (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case FETCH_REQUEST: {
      const {payload} = action;
      return {
        ...state,
        disciplines: reducePendingContent(state.disciplines, {[payload.ref]: payload.languages})
      };
    }
    case FETCH_SUCCESS: {
      const {payload} = action;

      return {
        ...state,
        disciplines: reduceReadyContent(state.disciplines, payload.disciplines),
        chapters: reduceReadyContent(state.chapters, payload.chapters)
      };
    }
    default:
      return state;
  }
};

export default reducer;
