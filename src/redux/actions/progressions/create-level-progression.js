// @flow strict

import {createProgression, CONTENT_TYPE} from '@coorpacademy/player-store';
import type {Level} from '@coorpacademy/player-store';
import type {Engine, EngineConfig, GenericContent} from '@coorpacademy/progression-engine';
import {ObjectId} from 'bson';

import {ENGINE} from '../../../const';
import {getMostAccurateRef} from '../../../modules/reference';

const ENGINE_VERSION = '2';
const ENGINE_CONFIG_VERSION = '2';

export const createLevelProgression = (level: Level) => {
  const ref = getMostAccurateRef(level);
  const engine: Engine = {ref: ENGINE.LEARNER, version: ENGINE_VERSION};
  // @todo use universalRef
  const content: GenericContent = {type: CONTENT_TYPE.LEVEL, ref};
  const engineConfig: EngineConfig = {
    version: ENGINE_CONFIG_VERSION,
    livesDisabled: level.infiniteLives
  };

  return createProgression(new ObjectId().toString(), engine, content, engineConfig);
};
