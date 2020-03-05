// @flow strict

export const CLEAR_SEARCH = '@@cards/CLEAR_SEARCH';

export type Action = {|
  type: '@@cards/CLEAR_SEARCH'
|};

export const clearSearch = (): Action => ({
  type: CLEAR_SEARCH
});
