import decode from 'jwt-decode';

import fetch from '../../modules/fetch';
import {get as getToken} from '../../utils/local-token';
import type {JWT} from '../../types';
import translations from '../../translations';
import {__E2E__} from '../../modules/environment';
import {createDisciplinesCards, createChaptersCards} from '../../__fixtures__/cards';
import disciplinesBundle from '../../__fixtures__/discipline-bundle';
import chaptersBundle from '../../__fixtures__/chapter-bundle';
import {buildUrlQueryParams} from '../../modules/uri';
import type {QueryParams} from '../../modules/uri';
import {saveAndRefreshCards} from './cards';
import type {DisciplineCard, ChapterCard} from './_types';

const fetchRecommendations = async (): Promise<Array<DisciplineCard | ChapterCard>> => {
  const language = translations.getLanguage();
  const token = await getToken();

  if (!token) {
    throw new Error('Invalid token');
  }

  let cards;

  if (__E2E__) {
    const disciplines = Object.keys(disciplinesBundle.disciplines).map(
      (key) => disciplinesBundle.disciplines[key],
    );
    const chapters = Object.keys(chaptersBundle.chapters).map(
      (key) => chaptersBundle.chapters[key],
    );

    cards = createDisciplinesCards(disciplines).concat(createChaptersCards(chapters));
  } else {
    const jwt: JWT = decode(token);

    const query: QueryParams = {
      contentType: 'course,chapter',
      lang: language,
    };

    const response = await fetch(
      `${jwt.host}/api/v2/recommendations?${buildUrlQueryParams(query)}`,
      {
        headers: {authorization: token},
      },
    );

    const {hits}: {hits: Array<DisciplineCard | ChapterCard>} = await response.json();

    cards = hits;
  }

  return saveAndRefreshCards(cards, language);
};

// @todo replace fetchRecommendation() by find(type: string, ref: string)
const fetchRecommendation = async (
  limit = 1,
): Promise<DisciplineCard | ChapterCard | Array<DisciplineCard | ChapterCard> | void> => {
  const cards = await fetchRecommendations();
  if (limit > 1) {
    return cards.slice(0, limit);
  }
  return cards[0];
};

export {fetchRecommendation, fetchRecommendations};
