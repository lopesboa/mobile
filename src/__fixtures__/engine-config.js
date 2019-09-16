// @flow strict

import type {EngineConfig} from '@coorpacademy/progression-engine';

export const createEngineConfig = (): EngineConfig => ({
  version: '2',
  starsPerAskingClue: 42,
  starsPerResourceViewed: 1337
});

export default {
  createEngineConfig
};
