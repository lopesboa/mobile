// @flow strict

import {
  getCurrentProgression,
  getStepContent,
  getStartRank,
  getEndRank,
  getBestScore as _getBestScore,
  getCurrentSlide
} from '@coorpacademy/player-store';
import type {Context} from '@coorpacademy/progression-engine';

import {CONTENT_TYPE, PERMISSION_STATUS} from '../../const';
import type {Section, ProgressionEngineVersions} from '../../types';
import type {StoreState} from '../store';
import type {State as PermissionsState} from '../reducers/permissions';
import type {State as BrandState} from '../reducers/authentication/brand';
import type {PermissionType} from '../actions/permissions';
import type {DisciplineCard, ChapterCard} from '../../layer/data/_types';
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

export const getToken = (state: StoreState) =>
  state.authentication && state.authentication.user && state.authentication.user.token;

export const getBrand = (state: StoreState): BrandState => state.authentication.brand;

export const hasPermission = (state: PermissionsState, type: PermissionType): boolean =>
  state[type] === PERMISSION_STATUS.AUTHORIZED;

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

export const getBestScore = (state: StoreState): string | void => {
  const progression = getCurrentProgression(state);

  const stars = progression && progression.state && progression.state.stars;
  const bestScore = _getBestScore(state) || 0;

  if (stars) {
    return stars > bestScore ? `${stars - bestScore}` : '0';
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
