// @flow strict

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
