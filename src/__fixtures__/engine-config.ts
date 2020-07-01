import type {EngineConfig} from '../types/coorpacademy/progression-engine';

export const createEngineConfig = (): EngineConfig => ({
  version: '2',
  starsPerAskingClue: 42,
  starsPerResourceViewed: 1337,
  shuffleChoices: false,
});

export default {
  createEngineConfig,
};
