import {
  getCurrentProgression,
  getStepContent,
  getStartRank,
  getEndRank,
  getBestScore as _getBestScore,
  getCurrentSlide,
  getLives,
  hasViewedAResourceAtThisStep as _hasViewedAResourceAtThisStep,
  getCurrentProgressionId,
} from '@coorpacademy/player-store';
import {ROLES, SCOPES, hasRole} from '@coorpacademy/acl';
import decode from 'jwt-decode';
import type {Context} from '../../types/coorpacademy/progression-engine';

import {CONTENT_TYPE, SPECIFIC_CONTENT_REF} from '../../const';
import type {
  Section,
  ProgressionEngineVersions,
  PermissionStatus,
  ErrorType,
  PermissionType,
} from '../../types';
import type {StoreState} from '../store';
import type {State as BrandState} from '../reducers/authentication/brand';
import type {State as SettingsNotificationState} from '../notifications/settings';
import type {State as UserState} from '../reducers/authentication/user';
import type {State as TokenState} from '../reducers/authentication/token';
import type {State as SelectState} from '../reducers/ui/select';

import type {DisciplineCard, ChapterCard, Slide} from '../../layer/data/_types';
import translations from '../../translations';
import type {QueryParams} from '../../modules/uri';

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

export const getNextContentRef = (state: StoreState): string | void => {
  const progression = getCurrentProgression(state);

  return progression && progression.state && progression.state.nextContent.ref;
};

export const getToken = (state: StoreState): TokenState =>
  state.authentication && state.authentication.token;

export const getBrand = (state: StoreState): BrandState =>
  state.authentication && state.authentication.brand;

export const isProgressionsSynchronizing = (state: StoreState): boolean =>
  state.progressions && state.progressions.isSynchronizing;

export const getYoutubeAPIKey = (state: StoreState): string | void => {
  const brand = getBrand(state);
  return (brand && brand.youtube && brand.youtube.apiKey) || undefined;
};

export const getBrandDefaultLanguage = (state: StoreState): string | void => {
  const brand = getBrand(state);

  return (brand && brand.defaultLanguage) || undefined;
};

export const getPermissionStatus = (type: PermissionType) => (
  state: StoreState,
): PermissionStatus => state.permissions[type];

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

export const getNotificationsSettings = (state: StoreState): SettingsNotificationState => {
  return state.notifications.settings;
};

export const getAppSession = (state: StoreState): number => state.appSession;

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

export const getValidationStatus = (state: StoreState): boolean => {
  return state.isValidating;
};

export const isGodModeUser = (state: StoreState): boolean => {
  const token = getToken(state);
  const brand = getBrand(state);

  if (!token || !brand) {
    return false;
  }

  return hasRole(SCOPES.MOOC(brand.name), ROLES.GODMODE, decode(token));
};

export const getQuestion = (state: StoreState): Pick<Slide, 'question'> | void => {
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

export const isSearchFetching = (state: StoreState): boolean => state.search.isFetching;

export const getSearchValue = (state: StoreState): string | void => state.search.value;

export const getSearchParams = (state: StoreState): QueryParams | void => state.search.params;

export const getErrorType = (state: StoreState): ErrorType | void => state.errors.type;

export const getFocusedSelect = (state: StoreState): SelectState => state.select;

export const isNetworkConnected = (state: StoreState): boolean => state.network.isConnected;

export const isVideoFullScreen = (state: StoreState): boolean => state.video.isFullScreen;

export const getLivesCount = (state: StoreState): number | void => {
  const {hide: hideLives, count: livesCount} = getLives(state);
  const lives = hideLives ? undefined : livesCount;
  return lives;
};

export const isContentFinished = (state: StoreState): boolean => {
  const lives = getLivesCount(state);
  const _isExitNode = isExitNode(state);
  const nextContentRef = getNextContentRef(state);
  const hasViewedAResourceAtThisStep = _hasViewedAResourceAtThisStep(state);
  const stateExtraLife = nextContentRef === SPECIFIC_CONTENT_REF.EXTRA_LIFE;
  const offeringExtraLife = stateExtraLife && !hasViewedAResourceAtThisStep;
  const isOfferingExtraLife = lives === 0 && offeringExtraLife;

  const isFinished = _isExitNode || isOfferingExtraLife;
  return isFinished;
};

export const hasSuccessfullyFinished = (state: StoreState): boolean => {
  const nextContent = getStepContent(state);
  if (!nextContent) {
    return false;
  }
  if (isExitNode(state)) {
    return nextContent.type === CONTENT_TYPE.SUCCESS;
  }
  return false;
};

type ContentCorrectionInfo = {
  isAdaptive: boolean;
  progressionId: string;
  hasContext: boolean;
  isContentFinished: boolean;
  isCorrect: boolean;
};

export const getContentCorrectionInfo = (state: StoreState): ContentCorrectionInfo => {
  const lives = getLivesCount(state);
  const _isContentFinished = isContentFinished(state);
  const isContentFinishedSuccessfully = lives === undefined || lives > 0;
  const _isCorrect = isCorrect(state);
  const hasContext = getContext(state) !== undefined;
  const currentProgressionId = getCurrentProgressionId(state);
  const isAdaptive = typeof _isCorrect !== 'boolean';

  return {
    isAdaptive,
    progressionId: currentProgressionId,
    hasContext,
    isContentFinished: _isContentFinished,
    isCorrect:
      !isAdaptive && _isContentFinished
        ? isContentFinishedSuccessfully
        : hasSuccessfullyFinished(state),
  };
};
