// @flow

import type {Progression} from '@coorpacademy/progression-engine';
import {CONTENT_TYPE} from '../const';

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

export const isDone = (progression: Progression) => {
  return isFailure(progression) || isSuccess(progression);
};

export const sortProgressionChronologicaly = (
  progressions: Array<Progression>
): Array<Progression> =>
  progressions.sort((a: Progression, b: Progression) => {
    if (a.actions && a.actions.length > 0 && b.actions && b.actions.length > 0) {
      const aCreatedAt = a.actions[0].createdAt;
      const bCreatedAt = b.actions[0].createdAt;
      if (aCreatedAt && bCreatedAt) {
        return new Date(aCreatedAt) - new Date(bCreatedAt);
      }
      return 0;
    }

    return 0;
  });
