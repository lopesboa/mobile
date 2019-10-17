// @flow

import decode from 'jwt-decode';

import translations from '../../translations';
import fetch from '../../modules/fetch';
import {__E2E__} from '../../modules/environment';
import {buildUrlQueryParams} from '../../modules/uri';
import type {QueryParams} from '../../modules/uri';

import type {Section, JWT} from '../../types';
import {createSections} from '../../__fixtures__/sections';

export const fetchSections = async (
  token: string,
  offset: number,
  limit: number
): Promise<{|
  sections: Array<Section>,
  total: number
|}> => {
  if (__E2E__) {
    const fakeSections = createSections();
    return Promise.resolve({
      sections: fakeSections.slice(offset, offset + limit),
      total: fakeSections.length
    });
  }

  const lang = translations.getLanguage();
  const jwt: JWT = decode(token);

  const query: QueryParams = {
    type: 'cards',
    offset,
    limit,
    lang
  };

  const response = await fetch(`${jwt.host}/api/v2/sections?${buildUrlQueryParams(query)}`, {
    headers: {authorization: token}
  });

  const {
    search_meta: {total},
    hits
  }: {search_meta: {total: number}, hits: Array<Section>} = await response.json();

  return {
    sections: hits,
    total
  };
};

export default {
  fetchSections
};
