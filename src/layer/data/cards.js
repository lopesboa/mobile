// @flow strict

import {AsyncStorage} from 'react-native';
import fetch from 'cross-fetch';
import {__E2E__} from '../../modules/environment';
import {createDisciplinesCards} from '../../__fixtures__/cards';
import disciplinesBundle from '../../__fixtures__/discipline-bundle';
import type {SupportedLanguage} from '../../translations/_types';
import {uniqBy} from '../../utils';
import {getItem} from './core';
import type {Cards, DisciplineCard, ChapterCard} from './_types';
import {CARD_TYPE} from './_const';

export const getCardFromLocalStorage = async (
  ref: string,
  language: SupportedLanguage
): Promise<DisciplineCard | ChapterCard> => {
  // $FlowFixMe
  const card = await getItem('card', ref, language);
  return card;
};

const cardsToPairs = (cards: {[key: string]: DisciplineCard | ChapterCard}) => {
  return Object.entries(cards).reduce((acc, card) => {
    const [cardKey, cardContent] = card;
    return [...acc, [cardKey, JSON.stringify(cardContent)]];
  }, []);
};

const createDisiciplineCardForModules = (card: DisciplineCard, language: SupportedLanguage) => {
  return card.modules.reduce((acc, mod) => {
    const key = `card:${language}:${mod.universalRef || mod.ref}`;
    const moduleCard = {
      ...acc,
      [key]: card
    };
    return moduleCard;
  }, {});
};

export const cardsToKeys = (
  cards: Array<DisciplineCard | ChapterCard>,
  language: SupportedLanguage
): {[key: string]: DisciplineCard | ChapterCard} => {
  return cards.reduce((acc, card) => {
    const cardType = card.type;
    let modulesCards = {};
    let disciplinesCards = {};
    let chapterCard = {};
    if (cardType === CARD_TYPE.COURSE) {
      disciplinesCards = {
        [`card:${language}:${card.ref || card.universalRef}`]: card
      };
      modulesCards = {
        // $FlowFixMe
        ...createDisiciplineCardForModules(card, language)
      };
    }
    if (cardType === CARD_TYPE.CHAPTER) {
      chapterCard = {[`card:${language}:${card.ref || card.universalRef}`]: card};
    }

    const keyedCards = {
      ...acc,
      ...chapterCard,
      ...disciplinesCards,
      ...modulesCards
    };
    return keyedCards;
  }, {});
};

const saveDashboardCardsInAsyncStorage = async (
  cards: Array<DisciplineCard | ChapterCard>,
  language: SupportedLanguage
): Promise<void> => {
  const _cards = cardsToKeys(cards, language);
  try {
    await AsyncStorage.multiSet(cardsToPairs(_cards));
  } catch (e) {
    throw new Error('could not store the dashboard cards');
  }
};

const fetchFavoriteCards = async (
  token: string,
  host: string,
  language: SupportedLanguage
): Promise<Cards> => {
  const response = await fetch(
    `${host}/api/v2/contents?contentType=course&limit=5&playlist=favorites&withoutAdaptive=true&lang=${language}`,
    {
      headers: {authorization: token}
    }
  );
  const result: {hits?: Cards} = await response.json();
  return result.hits || [];
};
const fetchRecommendationCards = async (
  token: string,
  host: string,
  language: SupportedLanguage
): Promise<Cards> => {
  const response = await fetch(
    `${host}/api/v2/recommendations?contentType=course&limit=5&withoutAdaptive=true&lang=${language}`,
    {
      headers: {authorization: token}
    }
  );
  const result: {hits?: Cards} = await response.json();
  return result.hits || [];
};

const LIMIT_CARDS = 5;

export const fetchCards = async (
  token: string,
  host: string,
  language: SupportedLanguage
): Promise<Cards> => {
  if (__E2E__) {
    const disciplines = Object.keys(disciplinesBundle.disciplines).map(
      key => disciplinesBundle.disciplines[key]
    );
    const cards = createDisciplinesCards(disciplines);

    return cards;
  }

  const favoritesP = fetchFavoriteCards(token, host, language);
  const recommendationsP = fetchRecommendationCards(token, host, language);

  const favorites = await favoritesP;

  if (favorites.length >= 5) {
    const fetchedFavorites = favorites.slice(0, 5);
    await saveDashboardCardsInAsyncStorage(fetchedFavorites, language);
    return fetchedFavorites;
  }
  const recommendations = await recommendationsP;

  const recoCards = uniqBy(card => card.universalRef, [...favorites, ...recommendations]).slice(
    0,
    LIMIT_CARDS
  );
  await saveDashboardCardsInAsyncStorage(recoCards, language);

  return recoCards;
};

export default {
  fetchCards,
  getCardFromLocalStorage,
  cardsToKeys
};
