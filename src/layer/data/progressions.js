// @flow

import AsyncStorage from '@react-native-community/async-storage';
import type {Progression, Action, ContentType} from '@coorpacademy/progression-engine';
import decode from 'jwt-decode';
import {groupBy} from 'lodash/fp';
import {heroRecommendation} from '@coorpacademy/progression-aggregations';

import {__E2E__} from '../../modules/environment';
import fetch from '../../modules/fetch';
import {getCreatedAt, getUpdatedAt, isDone, isFailure} from '../../utils/progressions';
import {CONTENT_TYPE, SPECIFIC_CONTENT_REF} from '../../const';
import type {JWT} from '../../types';
import {get as getToken} from '../../utils/local-token';
import {ForbiddenError, ConflictError, NotAcceptableError} from '../../models/error';
import type {Record, Completion, HeroRecommendation} from './_types';

export const SYNCHRONIZED_PROGRESSIONS = 'synchronized_progressions';
export const PENDING_PROGRESSION = 'pending_progression';

export const buildCompletionKey = (engineRef: string, contentRef: string) =>
  `completion_${engineRef}_${contentRef}`;

export const mapProgressionToCompletion = (progression: Progression): Completion => {
  const {state} = progression;
  if (!state) {
    throw new Error('the progression got no state');
  }

  const {current} = state.step;
  return {
    current: isFailure(progression) || current === 0 ? 0 : current - 1,
    stars: state.stars
  };
};

export const mergeCompletion = (
  previousCompletion: Completion,
  latestCompletion: Completion
): Completion => {
  return {
    current: latestCompletion.current,
    stars: Math.max(previousCompletion.stars, latestCompletion.stars)
  };
};

export const storeOrReplaceCompletion = async (progression: Progression): Promise<Completion> => {
  const completionKey = buildCompletionKey(progression.engine.ref, progression.content.ref);
  const stringifiedCompletion = await AsyncStorage.getItem(completionKey);

  if (stringifiedCompletion) {
    const mergedCompletion = mergeCompletion(
      JSON.parse(stringifiedCompletion),
      mapProgressionToCompletion(progression)
    );
    await AsyncStorage.mergeItem(completionKey, JSON.stringify(mergedCompletion));
    return mergedCompletion;
  }

  const completion = mapProgressionToCompletion(progression);
  await AsyncStorage.setItem(completionKey, JSON.stringify(completion));
  return completion;
};

export const buildLastProgressionKey = (engineRef: string, contentRef: string) =>
  `last_progression_${engineRef}_${contentRef}`;

export const buildProgressionKey = (progressionId: string) => `progression_${progressionId}`;

const findById = async (id: string) => {
  const progression = await AsyncStorage.getItem(buildProgressionKey(id));
  if (!progression) throw new Error('Progression not found');
  return JSON.parse(progression);
};

const getAll = async (): Promise<Array<Progression>> => {
  const keys = await AsyncStorage.getAllKeys();
  const filteredKeys = keys.filter(key => key.startsWith('progression'));
  const items = await AsyncStorage.multiGet(filteredKeys);

  return items.map(([key, value]) => JSON.parse(value));
};

const getSynchronizedProgressionIds = async (): Promise<Array<string>> => {
  const _synchronizedProgressions: string = await AsyncStorage.getItem(SYNCHRONIZED_PROGRESSIONS);
  return _synchronizedProgressions ? JSON.parse(_synchronizedProgressions) : [];
};

const getPendingProgressionId = async (): Promise<string> => {
  const pendingProgressionId: string = await AsyncStorage.getItem(PENDING_PROGRESSION);
  return pendingProgressionId || '';
};

const updateSynchronizedProgressionIds = (synchronizedProgressions: Array<string>): void => {
  AsyncStorage.setItem(SYNCHRONIZED_PROGRESSIONS, JSON.stringify(synchronizedProgressions));
};

const updatePendingProgressionId = (pendingProgressionId: string): void => {
  AsyncStorage.setItem(PENDING_PROGRESSION, pendingProgressionId);
};

const META = {source: 'mobile'};
const synchronize = async (
  token: string,
  host: string,
  progression: Progression
): Promise<void> => {
  const {_id, content, actions, engine, engineOptions} = progression;

  if (_id === undefined) throw new TypeError('progression has no property _id');

  const response = await fetch(`${host}/api/v2/progressions`, {
    method: 'POST',
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/json',
      Authorization: token
    },
    body: JSON.stringify({
      _id,
      content,
      actions,
      engine,
      engineOptions,
      meta: META
    })
  });

  if (response.status === 403) throw new ForbiddenError(response.statusText);
  if (response.status === 406) throw new NotAcceptableError(response.statusText);
  if (response.status === 409) throw new ConflictError(response.statusText);
  if (response.status >= 400) throw new Error(response.statusText);

  return;
};

const findRemoteProgressionById = async (
  token: string,
  host: string,
  progressionId: string
): Promise<Progression | null> => {
  if (!progressionId) throw new TypeError('Must provide a progressionId');
  const response = await fetch(`${host}/api/v2/progressions/${progressionId}`, {
    method: 'GET',
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/json',
      Authorization: token
    }
  });

  if (response.status === 404) return null;
  if (response.status >= 400) throw new Error(response.statusText);
  if (response.status === 200) {
    const progression: Progression = await response.json();
    return progression;
  }
  return null;
};

const addCreatedAtToAction = (progression: Progression): Progression => {
  const now = new Date().toISOString();

  return {
    ...progression,
    actions:
      progression.actions &&
      progression.actions.map(
        (action: Action): Action => {
          // $FlowFixMe spread operator
          return {
            ...action,
            createdAt: action.createdAt || now
          };
        }
      )
  };
};

const persist = async (progression: Progression): Promise<Progression> => {
  const {_id} = progression;
  if (_id === undefined) throw new TypeError('progression has no property _id');

  await AsyncStorage.setItem(buildProgressionKey(_id), JSON.stringify(progression));
  await AsyncStorage.setItem(
    buildLastProgressionKey(progression.engine.ref, progression.content.ref),
    _id
  );

  storeOrReplaceCompletion(progression);

  return progression;
};

const save = (progression: Progression): Promise<Progression> =>
  persist(addCreatedAtToAction(progression));

const findLast = async (engineRef: string, contentRef: string) => {
  const key = buildLastProgressionKey(engineRef, contentRef);
  const progressionId = await AsyncStorage.getItem(key);
  if (!progressionId) return null;

  const stringifiedProgression = await AsyncStorage.getItem(buildProgressionKey(progressionId));

  if (!stringifiedProgression) return null;

  // if Progression is on successNode, failureNode or extraLifeNode
  // then skip resuming

  const progression = JSON.parse(stringifiedProgression);

  if (!progression.state) return null;
  const {nextContent} = progression.state;
  if (
    isDone(progression) ||
    (nextContent.type === CONTENT_TYPE.NODE && nextContent.ref === SPECIFIC_CONTENT_REF.EXTRA_LIFE)
  ) {
    return null;
  }

  return progression;
};

export type FindBestOfResult = {|
  stars: number
|};

export const findApiBestOf = async (
  engineRef: string,
  contentType: ContentType,
  contentRef: string
): Promise<FindBestOfResult> => {
  if (__E2E__) {
    return {stars: 0};
  }

  const token = await getToken();

  if (!token) {
    throw new Error('Invalid token');
  }

  const {host}: JWT = decode(token);

  const response = await fetch(
    `${host}/api/v2/progressions/${engineRef}/bestof/${contentType}/${contentRef}`,
    {
      headers: {
        Authorization: token
      }
    }
  );

  return response.json();
};

const findBestOf = async (
  engineRef: string,
  contentType: ContentType,
  contentRef: string,
  progressionId: string
): Promise<FindBestOfResult> => {
  const {stars: apiStars = 0} = await findApiBestOf(engineRef, contentType, contentRef);

  const progressions = await getAll();
  const sortedProgressions = progressions
    .filter(
      (progression: Progression) =>
        progression.content.ref === contentRef && progression._id !== progressionId
    )
    .sort((a: Progression, b: Progression) => {
      const aStars = (a.state && a.state.stars) || 0;
      const bStars = (b.state && b.state.stars) || 0;

      return bStars - aStars;
    });

  const bestProgression = sortedProgressions[0];
  const localStars = (bestProgression && bestProgression.state && bestProgression.state.stars) || 0;

  return {
    stars: Math.max(apiStars, localStars)
  };
};

const getAggregationsByContent = async (): Promise<Array<HeroRecommendation>> => {
  const progressions: Array<Progression> = await getAll();
  const allRecords: Array<Record> = progressions.map(p => ({
    content: {
      ...p,
      meta: {
        createdAt: getCreatedAt(p.actions),
        updatedAt: getUpdatedAt(p.actions)
      }
    }
  }));
  const recordsByContent: {[string]: Array<Record>} = groupBy(heroRecommendation.mapId, allRecords);

  // $FlowFixMe values are Array<Record> and not 'mixed'
  const _records: Array<[string, Array<Record>]> = Object.entries(recordsByContent);
  const aggregations = _records.reduce((acc, [id: string, records: Array<Record>]) => {
    // $FlowFixMe records is Array<Record> and no 'mixed'
    const values: Array<HeroRecommendation> = records.map(heroRecommendation.mapValue);
    acc.push(values.reduce(heroRecommendation.reduce, undefined));
    return acc;
  }, []);

  return aggregations;
};

export {
  getAggregationsByContent,
  save,
  getAll,
  getSynchronizedProgressionIds,
  getPendingProgressionId,
  findById,
  findLast,
  findBestOf,
  synchronize,
  findRemoteProgressionById,
  updateSynchronizedProgressionIds,
  updatePendingProgressionId
};
