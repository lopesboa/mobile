// @flow strict

import {createProgression, CONTENT_TYPE} from '@coorpacademy/player-store';
import type {Chapter} from '@coorpacademy/player-store';
import type {Engine, EngineConfig, GenericContent} from '@coorpacademy/progression-engine';
import {ObjectId} from 'bson';

import {getMostAccurateRef} from '../../../modules/reference';
import {ENGINE} from '../../../const';

const ENGINE_VERSION = '1';
const ENGINE_CONFIG_VERSION = '1';

export const createChapterProgression = (chapter: Chapter) => {
  const engine: Engine = {ref: ENGINE.MICROLEARNING, version: ENGINE_VERSION};
  const ref = getMostAccurateRef(chapter);
  const content: GenericContent = {type: CONTENT_TYPE.CHAPTER, ref};
  const engineConfig: EngineConfig = {version: ENGINE_CONFIG_VERSION};

  return createProgression(new ObjectId().toString(), engine, content, engineConfig);
};
