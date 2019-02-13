// @flow strict

import {createProgression, CONTENT_TYPE} from '@coorpacademy/player-store';
import type {Level, Chapter} from '@coorpacademy/player-store';
import type {Engine, EngineConfig, GenericContent} from '@coorpacademy/progression-engine';

import {ENGINE} from '../../const';

/* eslint-disable import/prefer-default-export */

const ENGINE_VERSION = '1';
const ENGINE_CONFIG_VERSION = '1';

export const createLevelProgression = (level: Level) => {
  const engine: Engine = {ref: ENGINE.LEARNER, version: ENGINE_VERSION};
  // @todo use universalRef
  const content: GenericContent = {type: CONTENT_TYPE.LEVEL, ref: level.ref};
  const engineConfig: EngineConfig = {
    version: ENGINE_CONFIG_VERSION,
    livesDisabled: level.infiniteLives
  };

  return createProgression(engine, content, engineConfig);
};

export const createChapterProgression = (chapter: Chapter) => {
  const engine: Engine = {ref: ENGINE.MICROLEARNING, version: ENGINE_VERSION};
  const content: GenericContent = {type: CONTENT_TYPE.CHAPTER, ref: chapter.universalRef};
  const engineConfig: EngineConfig = {version: ENGINE_CONFIG_VERSION};

  return createProgression(engine, content, engineConfig);
};
