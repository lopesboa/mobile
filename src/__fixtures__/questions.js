// @flow strict

import type {QCMQuestion, QCMGraphicQuestion, Media} from '@coorpacademy/progression-engine';

import {choices, choicesWithImage} from './question-choices';

export const createQCM = ({media}: {media?: Media}): QCMQuestion => ({
  header: 'Quel store est utilisé pour publier des applications iOS',
  explanation: 'Sélectionnez la bonne réponse.',
  type: 'qcm',
  content: {
    answers: [[choices[1].label]],
    choices
  },
  medias: (media && [media]) || undefined
});

export const createQCMGraphic = ({media}: {media?: Media}): QCMGraphicQuestion => ({
  header: 'Quel store est utilisé pour publier des applications iOS',
  explanation: 'Sélectionnez la bonne réponse.',
  type: 'qcmGraphic',
  content: {
    answers: [[choices[1].label]],
    choices: choicesWithImage
  }
});

export default {
  createQCM,
  createQCMGraphic
};
