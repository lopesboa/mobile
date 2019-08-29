// @flow

import AsyncStorage from '@react-native-community/async-storage';
import {getConfig} from '@coorpacademy/progression-engine';

import fetch from '../../modules/fetch';
import {__E2E__} from '../../modules/environment';
import {createDisciplinesCards, createChaptersCards} from '../../__fixtures__/cards';
import disciplinesBundle from '../../__fixtures__/discipline-bundle';
import chaptersBundle from '../../__fixtures__/chapter-bundle';
import type {SupportedLanguage} from '../../translations/_types';
import translations from '../../translations';
import {buildUrlQueryParams} from '../../modules/uri';
import type {QueryParams} from '../../modules/uri';

import {ENGINE} from '../../const';
import type {Section} from '../../types';
import {getItem} from './core';
import type {Cards, DisciplineCard, ChapterCard, Card, CardLevel, Completion} from './_types';
import {CARD_TYPE} from './_const';
import {buildCompletionKey, mergeCompletion} from './progressions';

// @TODO; Adaptive support
const computeLevelCompletionRate = (
  completion: Completion,
  nbChapters: number,
  slidesToComplete: number
): number => {
  return Math.min(completion.current / (slidesToComplete * nbChapters), 1);
};

const computeCardCompletionRate = (levels: Array<CardLevel>): number =>
  levels.reduce((accumulator, currentValue) => accumulator + currentValue.completion, 0) /
  levels.length;

const cardToCompletion = (card: DisciplineCard | ChapterCard | CardLevel): Completion => ({
  stars: card.stars,
  current: card.completion
});

export const updateDisciplineCardDependingOnCompletion = (
  latestCompletions: Array<Completion | null>,
  card: DisciplineCard
): DisciplineCard => {
  const config = getConfig({
    ref: ENGINE.LEARNER,
    version: '1'
  });

  const levelCards = card.modules.map((levelCard, index) => {
    const latestCompletion = latestCompletions[index];
    if (!latestCompletion) return levelCard;

    const cardCompletion = cardToCompletion(levelCard);

    const levelCompletion = mergeCompletion(cardCompletion, latestCompletion);
    const levelStars = Math.max(levelCard.stars, latestCompletion.stars);
    return {
      ...levelCard,
      completion: computeLevelCompletionRate(
        levelCompletion,
        levelCard.nbChapters,
        config.slidesToComplete
      ),
      stars: levelStars
    };
  });

  const stars = levelCards.reduce((acc, levelCard) => acc + levelCard.stars, 0);

  return {
    ...card,
    modules: levelCards,
    completion: computeCardCompletionRate(levelCards),
    stars
  };
};

export const updateChapterCardAccordingToCompletion = (
  completion: Completion,
  chapterCard: ChapterCard
): ChapterCard => {
  const config = getConfig({
    ref: ENGINE.MICROLEARNING,
    version: '1'
  });

  return {
    ...chapterCard,
    stars: Math.max(completion.stars, chapterCard.stars),
    completion: completion.current / config.slidesToComplete
  };
};

const refreshDisciplineCard = async (disciplineCard: DisciplineCard): Promise<DisciplineCard> => {
  const latestCompletions = await Promise.all(
    disciplineCard.modules.map(
      async (level): Promise<Completion | null> => {
        const completionKey = buildCompletionKey(ENGINE.LEARNER, level.universalRef || level.ref);
        const completionString = await AsyncStorage.getItem(completionKey);
        if (!completionString) return null;
        return JSON.parse(completionString);
      }
    )
  );

  return updateDisciplineCardDependingOnCompletion(latestCompletions, disciplineCard);
};

const refreshChapterCard = async (chapterCard: ChapterCard): Promise<ChapterCard> => {
  const cardCompletion: Completion = {
    stars: chapterCard && chapterCard.stars,
    current: chapterCard && chapterCard.completion
  };
  const completionKey = buildCompletionKey(ENGINE.MICROLEARNING, chapterCard && chapterCard.ref);
  const latestCompletion = await AsyncStorage.getItem(completionKey);

  if (!latestCompletion) {
    return chapterCard;
  }

  const mergedCompletion = mergeCompletion(cardCompletion, JSON.parse(latestCompletion));
  return updateChapterCardAccordingToCompletion(mergedCompletion, chapterCard);
};

export const refreshCard = (card: Card): Promise<Card> => {
  if (card && card.type === 'course') {
    return refreshDisciplineCard(card);
  }
  return refreshChapterCard(card);
};

export const getCardFromLocalStorage = async (
  ref: string
): Promise<DisciplineCard | ChapterCard> => {
  const language = translations.getLanguage();
  // $FlowFixMe
  const card = await getItem('card', language, ref);
  return refreshCard(card);
};

const cardsToPairs = (cards: {[key: string]: DisciplineCard | ChapterCard}) => {
  return Object.entries(cards).reduce((acc, card) => {
    const [cardKey, cardContent] = card;
    return [...acc, [cardKey, JSON.stringify(cardContent)]];
  }, []);
};

const createDisciplineCardForModules = (card: DisciplineCard, language: SupportedLanguage) => {
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
        ...createDisciplineCardForModules(card, language)
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
  if (cards.length > 0) {
    try {
      const _cards = cardsToPairs(cardsToKeys(cards, language));
      await AsyncStorage.multiSet(_cards);
    } catch (e) {
      throw new Error('could not store the dashboard cards');
    }
  }
};

export const fetchCards = async (
  token: string,
  host: string,
  section: Section,
  offset: number,
  limit: number
): Promise<{|
  cards: Cards,
  total: number
|}> => {
  const language = translations.getLanguage();
  let cards;
  let total;

  if (__E2E__) {
    const disciplines = Object.keys(disciplinesBundle.disciplines).map(
      key => disciplinesBundle.disciplines[key]
    );
    const chapters = Object.keys(chaptersBundle.chapters).map(key => chaptersBundle.chapters[key]);

    const _cards = createDisciplinesCards(disciplines).concat(createChaptersCards(chapters));
    cards = _cards.slice(offset, offset + limit);
    total = _cards.length;
  } else {
    const query: QueryParams = {
      ...section.query,
      offset,
      limit,
      lang: language,
      withoutAdaptive: true
    };

    const response = await fetch(`${host}${section.endpoint}?${buildUrlQueryParams(query)}`, {
      headers: {authorization: token}
    });
    const {
      search_meta: {total: _total},
      hits = []
    }: {search_meta: {total: number}, hits?: Cards} = await response.json();

    cards = hits;
    total = _total;
  }

  await saveDashboardCardsInAsyncStorage(cards, language);
  const refreshedCards = await Promise.all(cards.map(refreshCard));

  return {
    cards: refreshedCards,
    total
  };
};

export default {
  fetchCards,
  getCardFromLocalStorage,
  cardsToKeys
};
