import {QueryParams} from '../modules/uri';

export type Params = {
  skill?: string;
  theme?: string;
  author?: string;
  type?: string;
  authorType?: string;
  lpath?: string;
  sort?: string;
  goal?: string;
  search?: string;
  playlist?: string;
};

export const getAllowedParamsForSearch = (params: QueryParams): Params => {
  const allowedParams = [
    'skill',
    'theme',
    'author',
    'type',
    'authorType',
    'lpath',
    'sort',
    'goal',
    'search',
    'playlist',
  ];
  // @ts-ignore
  return allowedParams.reduce((acc, allowedParam) => {
    if (allowedParam in params && params[allowedParam] !== undefined) {
      acc[allowedParam] = params[allowedParam];
      return acc;
    }
    return acc;
  }, {});
};
