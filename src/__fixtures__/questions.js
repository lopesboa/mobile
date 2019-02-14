// @flow strict

import type {QCMQuestion, QCMGraphicQuestion, Media} from '@coorpacademy/progression-engine';

import {QUESTION_TYPE} from '../const';

import {choices, choicesWithImage} from './question-choices';

export const createQCM = ({media}: {media?: Media}): QCMQuestion => ({
  header: 'Quel store est utilisé pour publier des applications iOS',
  explanation: 'Sélectionnez la bonne réponse.',
  // $FlowFixMe this is the right type
  type: QUESTION_TYPE.QCM,
  content: {
    answers: [[choices[1].label]],
    choices
  },
  medias: (media && [media]) || undefined
});

export const createQCMGraphic = ({media}: {media?: Media}): QCMGraphicQuestion => ({
  header: 'Quel store est utilisé pour publier des applications iOS',
  explanation: 'Sélectionnez la bonne réponse.',
  // $FlowFixMe this is the right type
  type: QUESTION_TYPE.QCM_GRAPHIC,
  content: {
    answers: [[choices[1].label]],
    choices: choicesWithImage
  },
  medias: (media && [media]) || undefined
});

export default {
  createQCM,
  createQCMGraphic
};
