// @flow
import type {GenericContent, Content, Progression} from '@coorpacademy/progression-engine';
import type {Engine} from '../types';

export const createProgression = ({
  _id,
  engine,
  progressionContent,
  nextContent,
  content
}: {
  _id?: string,
  engine: Engine,
  progressionContent: GenericContent,
  content?: Content,
  nextContent?: Content
}): Progression => {
  return {
    _id: _id || undefined,
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
      content: content || {type: 'slide', ref: 'sli_N1uxMsUIV'},
      nextContent: nextContent || {type: 'slide', ref: 'sli_N1uxMsUIV'},
      allAnswers: [],
      variables: {}
    }
  };
};

export default createProgression;
