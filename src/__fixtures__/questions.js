// @flow strict

import type {QCMQuestion, QCMGraphicQuestion} from '@coorpacademy/progression-engine';

import {QUESTION_TYPE} from '../const';

import {choices, choicesWithImage} from './question-choices';

export const qcm: QCMQuestion = {
  header: 'Quel store est utilisé pour publier des applications iOS',
  explanation: 'Sélectionnez la bonne réponse.',
  // $FlowFixMe this is the right type
  type: QUESTION_TYPE.QCM,
  content: {
    answers: [[choices[1].label]],
    choices
  }
};

export const qcmGraphic: QCMGraphicQuestion = {
  header: 'Quel store est utilisé pour publier des applications iOS',
  explanation: 'Sélectionnez la bonne réponse.',
  // $FlowFixMe this is the right type
  type: QUESTION_TYPE.QCM_GRAPHIC,
  content: {
    answers: [[choices[1].label]],
    choices: choicesWithImage
  }
};

export default {
  qcm,
  qcmGraphic
};
