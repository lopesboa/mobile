// @flow
import type {Progression, GenericContent} from '@coorpacademy/progression-engine';

import type {Engine} from '../types';

export const createProgression = ({
  engine,
  progressionContent
}: {
  engine: Engine,
  progressionContent: GenericContent
}): Progression => {
  return {
    engine: {
      ref: engine,
      version: '1'
    },
    content: progressionContent,
    engineOptions: {
      version: '1'
    },
    actions: [
      {
        type: 'move',
        payload: {
          instructions: null,
          nextContent: {
            type: 'slide',
            ref: 'sli_N1uxMsUIV'
          }
        }
      }
    ],
    _id: 'progression1',
    state: {
      livesDisabled: false,
      isCorrect: true,
      slides: [],
      lives: 1,
      step: {
        current: 1
      },
      stars: 0,
      requestedClues: [],
      viewedResources: [],
      remainingLifeRequests: 1,
      hasViewedAResourceAtThisStep: false,
      nextContent: {
        type: 'slide',
        ref: 'sli_N1uxMsUIV'
      },
      allAnswers: [],
      variables: {}
    }
  };
};

export default createProgression;
