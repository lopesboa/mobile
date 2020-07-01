import moment from 'moment';
import type {Action, Progression} from '../types/coorpacademy/progression-engine';
import {CONTENT_TYPE} from '../const';

export const OLDEST_DATE = new Date('1971').toISOString();

export const isSuccess = (progression: Progression) => {
  if (!progression.state) return false;
  const {nextContent} = progression.state;
  return nextContent.type === CONTENT_TYPE.SUCCESS;
};

export const isFailure = (progression: Progression) => {
  if (!progression.state) return false;
  const {nextContent} = progression.state;
  return nextContent.type === CONTENT_TYPE.FAILURE;
};

export const isDone = (progression: Progression): boolean => {
  return isFailure(progression) || isSuccess(progression);
};

export const isAlreadySynchronized = (
  progression: Progression,
  synchronizedProgressionsIds: Array<string>,
): boolean => synchronizedProgressionsIds.includes(progression._id ?? '');

const isAfter = (dateAsBase: string, dateToCheck: string) =>
  moment(dateToCheck).isAfter(dateAsBase);
const isBefore = (dateAsBase: string, dateToCheck: string) =>
  moment(dateToCheck).isBefore(dateAsBase);

export const getUpdatedAt = (actions: Array<Action> | void): string => {
  if (!actions || actions.length === 0) {
    return OLDEST_DATE;
  }
  // @ts-ignore this reduce always returns a string
  return actions.reduce((oldestDate, action) => {
    const createdAt = action.createdAt || oldestDate;
    return isAfter(oldestDate, createdAt) ? createdAt : oldestDate;
  }, OLDEST_DATE);
};

export const getCreatedAt = (actions: Array<Action> | void): string => {
  if (!actions || actions.length === 0) {
    return OLDEST_DATE;
  }
  // @ts-ignore this reduce always returns a string
  return actions.reduce((oldestDate, action) => {
    const createdAt = action.createdAt || OLDEST_DATE;
    return isBefore(oldestDate, createdAt) ? createdAt : oldestDate;
  }, new Date().toISOString());
};

export const sortProgressionChronologicaly = (
  progressions: Array<Progression>,
): Array<Progression> =>
  progressions.sort((a: Progression, b: Progression) => {
    const aCreatedAt = getCreatedAt(a.actions);
    const bCreatedAt = getCreatedAt(b.actions);
    return isBefore(bCreatedAt, aCreatedAt) ? -1 : 1;
  });
