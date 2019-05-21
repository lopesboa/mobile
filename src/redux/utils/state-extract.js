// @flow strict

import {
  getCurrentProgression,
  getCurrentSlide,
  getLives as _getLives,
  getPreviousSlide,
  getRoute,
  getStepContent,
  getStartRank,
  getEndRank,
  getBestScore as _getBestScore
} from '@coorpacademy/player-store';
import type {Slide} from '@coorpacademy/progression-engine';
import type {Lives} from '@coorpacademy/player-store';

import {CONTENT_TYPE, PERMISSION_STATUS} from '../../const';
import type {StoreState} from '../store';
import type {SupportedLanguage} from '../../translations/_types';
import type {OfflineContents, OfflineStatus} from '../reducers/bundle';
import type {State as PermissionsState} from '../reducers/permissions';
import type {PermissionType} from '../actions/permissions';

export const isContentReady = (language: SupportedLanguage, status: OfflineStatus): boolean =>
  status.ready.includes(language);

export const getContents = (
  language: SupportedLanguage,
  contents: OfflineContents
): Array<string> =>
  Object.keys(contents).filter(ref => {
    const status: OfflineStatus = contents[ref];
    return status.pending.concat(status.ready).includes(language);
  });

export const checkIsExitNode = (state: StoreState): boolean => {
  const nextContent = getStepContent(state);
  if (!nextContent) {
    return false;
  }

  const isFinished = [CONTENT_TYPE.SUCCESS, CONTENT_TYPE.FAILURE].includes(nextContent.type);

  return isFinished;
};

export const checkIsCorrect = (state: StoreState): boolean | void => {
  const progression = getCurrentProgression(state);
  const isCorrect =
    progression && progression.state && progression.state.isCorrect !== null
      ? progression.state.isCorrect
      : undefined;

  return isCorrect;
};

export const checkIsValidating = (state: StoreState): boolean => {
  const currentRoute = getRoute(state);
  return currentRoute === 'correction';
};

export const getSlide = (state: StoreState): Slide | void => {
  const nextContent = getStepContent(state);

  if (!nextContent) {
    return;
  }

  const isCorrect = checkIsCorrect(state);
  const isFinished = checkIsExitNode(state);
  const isValidating = checkIsValidating(state);

  const openingCorrection = isValidating && isCorrect !== undefined;
  const slide = isFinished || openingCorrection ? getPreviousSlide(state) : getCurrentSlide(state);

  return slide;
};

export const getLives = (state: StoreState): Lives => {
  const lives = _getLives(state);
  const isCorrect = checkIsCorrect(state);
  const isValidating = checkIsValidating(state);

  return {
    ...lives,
    count: isValidating && !isCorrect ? lives.count + 1 : lives.count
  };
};

export const getCurrentStep = (state: StoreState): number | void => {
  const progression = getCurrentProgression(state);
  const isValidating = checkIsValidating(state);
  const current = progression && progression.state && progression.state.step.current;

  return current !== undefined && isValidating ? current - 1 : current;
};

export const getToken = (state: StoreState) =>
  state.authentication && state.authentication.user && state.authentication.user.token;

export const getBrand = (state: StoreState) => state.authentication.brand;

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
  const bestScore = _getBestScore(state);

  // $FlowFixMe
  if (stars) return stars > bestScore ? `${stars - bestScore}` : '0';
};
