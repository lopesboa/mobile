// @flow strict

import type {Progression} from '@coorpacademy/progression-engine';
import {CONTENT_TYPE} from '../const';

export const isDone = (progression: Progression) => {
  if (!progression.state) return false;

  const {nextContent} = progression.state;
  return nextContent.type === CONTENT_TYPE.SUCCESS || nextContent.type === CONTENT_TYPE.FAILURE;
};
