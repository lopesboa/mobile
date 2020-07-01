import {createProgression, CONTENT_TYPE} from '@coorpacademy/player-store';
import type {Chapter} from '@coorpacademy/player-store';
import type {Engine, EngineConfig, GenericContent} from '@coorpacademy/progression-engine';
import {ObjectId} from 'bson';

import {getMostAccurateRef} from '../../../modules/reference';
import {__TEST__, __E2E__} from '../../../modules/environment';
import {ENGINE} from '../../../const';

export const createChapterProgression = (chapter: Chapter, engineVersion?: string) => {
  const engine: Engine = {ref: ENGINE.MICROLEARNING, version: engineVersion || 'latest'};
  const ref = getMostAccurateRef(chapter);
  const content: GenericContent = {type: CONTENT_TYPE.CHAPTER, ref};
  const engineConfig: EngineConfig = {
    version: engineVersion || 'latest',
  };
  if (__TEST__ || __E2E__) {
    engineConfig.shuffleChoices = false;
  }
  return createProgression(new ObjectId().toString(), engine, content, engineConfig);
};
