// @flow strict

import decode from 'jwt-decode';

import fetch from '../../modules/fetch';
import {__E2E__} from '../../modules/environment';
import {SECTION_TYPE} from '../../const';
import type {Section, JWT} from '../../types';
import {createSections} from '../../__fixtures__/sections';

export const fetchSections = async (token: string): Promise<Array<Section>> => {
  if (__E2E__) {
    return createSections();
  }

  const jwt: JWT = decode(token);

  const response = await fetch(`${jwt.host}/api/v2/sections`, {
    headers: {
      authorization: token
    }
  });

  const sections: Array<Section> = await response.json();

  return sections.filter(section => section.type === SECTION_TYPE.CARDS);
};

export default {
  fetchSections
};
