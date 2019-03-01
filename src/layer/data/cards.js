// @flow strict

import fetch from 'cross-fetch';
import {__E2E__} from '../../modules/environment';
import {createDisciplinesCards} from '../../__fixtures__/cards';
import basic from '../../__fixtures__/discipline-bundle/basic';
import adaptive from '../../__fixtures__/discipline-bundle/adaptive';
import noClue from '../../__fixtures__/discipline-bundle/no-clue';
import withContextVideo from '../../__fixtures__/discipline-bundle/context-with-video';
import withContextImage from '../../__fixtures__/discipline-bundle/context-with-image';
import type {SupportedLanguage} from '../../translations/_types';
import type {Discipline, Cards} from './_types';

const fetchFavoriteCards = async (
  language: SupportedLanguage,
  host: string,
  token: string
): Promise<Cards> => {
  const response = await fetch(
    `${host}/api/v2/contents?contentType=course&limit=5&playlist=favorites&lang=${language}`,
    {
      headers: {authorization: token}
    }
  );
  const result: {hits?: Cards} = await response.json();
  return result.hits || [];
};
const fetchRecommendationCards = async (
  language: SupportedLanguage,
  host: string,
  token: string
): Promise<Cards> => {
  const response = await fetch(
    `${host}/api/v2/recommendations?contentType=course&limit=5&lang=${language}`,
    {
      headers: {authorization: token}
    }
  );
  const result: {hits?: Cards} = await response.json();

  return result.hits || [];
};

const LIMIT_CARDS = 5;

export const fetchCards = async (
  language: SupportedLanguage,
  host: string,
  token: string
): Promise<Cards> => {
  if (__E2E__) {
    const disciplinesObject: {[key: string]: Discipline} = {
      ...basic.disciplines,
      ...adaptive.disciplines,
      ...noClue.disciplines,
      ...withContextVideo.disciplines,
      ...withContextImage.disciplines
    };

    const disciplines = Object.keys(disciplinesObject).map(key => disciplinesObject[key]);
    const cards = createDisciplinesCards(disciplines);

    return cards;
  }
  const [favorites, recommendations] = await Promise.all([
    fetchFavoriteCards(language, host, token),
    fetchRecommendationCards(language, host, token)
  ]);

  return [...favorites, ...recommendations].slice(0, LIMIT_CARDS);
};

export default {
  fetchCards
};
