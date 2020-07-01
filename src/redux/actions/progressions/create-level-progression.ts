import {createProgression, CONTENT_TYPE} from '@coorpacademy/player-store';
import type {Level} from '@coorpacademy/player-store';
import type {Engine, EngineConfig, GenericContent} from '@coorpacademy/progression-engine';
import {ObjectId} from 'bson';

import {ENGINE} from '../../../const';
import {getMostAccurateRef} from '../../../modules/reference';
import {__TEST__, __E2E__} from '../../../modules/environment';

export const createLevelProgression = (level: Level, engineVersion?: string) => {
  const ref = getMostAccurateRef(level);
  const engine: Engine = {ref: ENGINE.LEARNER, version: engineVersion || 'latest'};
  // @todo use universalRef
  const content: GenericContent = {type: CONTENT_TYPE.LEVEL, ref};
  const engineConfig: EngineConfig = {
    version: engineVersion || 'latest',
    livesDisabled: level.infiniteLives,
  };

  if (__TEST__ || __E2E__ || level.shuffleChoices === false) {
    engineConfig.shuffleChoices = false;
  }

  return createProgression(new ObjectId().toString(), engine, content, engineConfig);
};
