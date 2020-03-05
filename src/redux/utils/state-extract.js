// @flow

import {
  getCurrentProgression,
  getStepContent,
  getStartRank,
  getEndRank,
  getBestScore as _getBestScore,
  getCurrentSlide
} from '@coorpacademy/player-store';
import type {Context} from '@coorpacademy/progression-engine';
import {ROLES, SCOPES, hasRole} from '@coorpacademy/acl';
import decode from 'jwt-decode';

import {CONTENT_TYPE} from '../../const';
import type {Section, ProgressionEngineVersions, PermissionStatus, ErrorType} from '../../types';
import type {StoreState} from '../store';
import type {State as BrandState} from '../reducers/authentication/brand';
import type {State as UserState} from '../reducers/authentication/user';
import type {State as TokenState} from '../reducers/authentication/token';
import type {State as SelectState} from '../reducers/ui/select';
import type {PermissionType} from '../actions/permissions';
import type {DisciplineCard, ChapterCard, Slide} from '../../layer/data/_types';
import translations from '../../translations';

export const isExitNode = (state: StoreState): boolean => {
  const nextContent = getStepContent(state);
  if (!nextContent) {
    return false;
  }

  const isFinished = [CONTENT_TYPE.SUCCESS, CONTENT_TYPE.FAILURE].includes(nextContent.type);

  return isFinished;
};

export const isCorrect = (state: StoreState): boolean | void => {
  const progression = getCurrentProgression(state);
  const _isCorrect =
    progression && progression.state && progression.state.isCorrect !== null
      ? progression.state.isCorrect
      : undefined;

  return _isCorrect;
};

export const getCurrentStep = (state: StoreState): number | void => {
  const progression = getCurrentProgression(state);

  return progression && progression.state && progression.state.step.current;
};

export const getNextContentRef = (state: StoreState): string | void => {
  const progression = getCurrentProgression(state);

  return progression && progression.state && progression.state.nextContent.ref;
};

export const getToken = (state: StoreState): TokenState =>
  state.authentication && state.authentication.token;

export const getBrand = (state: StoreState): BrandState =>
  state.authentication && state.authentication.brand;

export const getBrandDefaultLanguage = (state: StoreState): string | void => {
  const brand = getBrand(state);

  return (brand && brand.defaultLanguage) || undefined;
};

export const getPermissionStatus = (type: PermissionType) => (
  state: StoreState
): PermissionStatus | void => state.permissions[type];

export const getBestRank = (state: StoreState): string | null => {
  const start = getStartRank(state);
  const end = getEndRank(state);

  if (start === end) {
    return null;
  } else {
    const sign = end - start > 0 ? '-' : '+';
    const diff = Math.abs(end - start);
    return `${sign}${diff}`;
  }
};

export const getBestScore = (state: StoreState): number | void => {
  const progression = getCurrentProgression(state);

  const stars = progression && progression.state && progression.state.stars;
  const bestScore = (state && _getBestScore(state)) || 0;

  if (stars) {
    return stars > bestScore ? stars - bestScore : 0;
  }
};

export const getSection = (state: StoreState, key: string): Section | void =>
  state.catalog.entities.sections[key] &&
  state.catalog.entities.sections[key][translations.getLanguage()];

export const getCard = (state: StoreState, ref: string): DisciplineCard | ChapterCard | void =>
  state.catalog.entities.cards[ref] &&
  state.catalog.entities.cards[ref][translations.getLanguage()];

export const getEngineVersions = (state: StoreState): ProgressionEngineVersions | void => {
  const brand = getBrand(state);

  return (brand && brand.progressionEngine) || undefined;
};

export const isGodModeEnabled = (state: StoreState): boolean => state.godMode;

export const isFastSlideEnabled = (state: StoreState): boolean => state.fastSlide;

export const getCurrentScreenName = (state: StoreState): string | void =>
  state.navigation.currentScreenName;

export const getCurrentTabName = (state: StoreState): string | void =>
  state.navigation.currentTabName;

export const getContext = (state: StoreState): Context | void => {
  const currentSlide = getCurrentSlide(state);

  return currentSlide && currentSlide.context && currentSlide.context.title
    ? currentSlide.context
    : undefined;
};

export const getUser = (state: StoreState): UserState => state.authentication.user;

export const isGodModeUser = (state: StoreState): boolean => {
  const token = getToken(state);
  const brand = getBrand(state);

  if (!token || !brand) {
    return false;
  }

  return hasRole(SCOPES.MOOC(brand.name), ROLES.GODMODE, decode(token));
};

export const getQuestion = (state: StoreState): $PropertyType<Slide, 'question'> | void => {
  const currentSlide = getCurrentSlide(state);

  return currentSlide ? currentSlide.question : undefined;
};

export const getSections = (state: StoreState) => state.catalog.entities.sections;

export const getSectionsRef = (state: StoreState) => state.catalog.sectionsRef || [];

export const getSearchRef = (state: StoreState) => state.catalog.searchRef;

export const getCards = (state: StoreState) => state.catalog.entities.cards;

export const getHeroRef = (state: StoreState): string | void | null => state.catalog.heroRef;

export const getHero = (state: StoreState): DisciplineCard | ChapterCard | void | null => {
  const ref = getHeroRef(state);

  return typeof ref === 'string' ? getCard(state, ref) : ref;
};

export const isErrorVisible = (state: StoreState): boolean => state.errors.isVisible;

export const isSearchVisible = (state: StoreState): boolean => state.search.isVisible;

export const isSearchFetching = (state: StoreState): boolean => state.search.isFetching;

export const getSearchValue = (state: StoreState): string | void => state.search.value;

export const getErrorType = (state: StoreState): ErrorType | void => state.errors.type;

export const getFocusedSelect = (state: StoreState): SelectState => state.select;

export const isNetworkConnected = (state: StoreState): boolean => state.network.isConnected;

export const isVideoFullScreen = (state: StoreState): boolean => state.video.isFullScreen;
