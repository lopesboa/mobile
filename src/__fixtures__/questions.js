// @flow strict

import type {
  QCMQuestion,
  QCMGraphicQuestion,
  Media,
  TemplateQuestion,
  QCMDragQuestion
} from '@coorpacademy/progression-engine';

import {choices, choicesWithImage, createInputChoice, createSelectChoice} from './question-choices';

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
  },
  medias: (media && [media]) || undefined
});

export const createTemplate = ({media}: {media?: Media}): TemplateQuestion => ({
  header: 'Quelle phrase est juste ?',
  explanation:
    'Saisissez votre réponse ou sélectionnez la bonne réponse dans le(s) menu(s) déroulant(s).',
  type: 'template',
  content: {
    template: "L'app de {{inp123456}} est sur {{sel123456}}.",
    matchOrder: true,
    answers: [['Coorpacademy', 'App Store']],
    choices: [createInputChoice({name: 'inp123456'}), createSelectChoice({name: 'sel123456'})]
  },
  medias: (media && [media]) || undefined
});

export const createQCMDrag = ({matchOrder}: {matchOrder: boolean}): QCMDragQuestion => {
  return {
    type: 'qcmDrag',
    header: 'Quels sont les store les plus utilisés pour publier des application?',
    explanation: 'Sélectionnez la bonne réponse.',
    content: {
      matchOrder,
      maxTypos: null,
      answers: [[choices[0].label, choices[1].label]],
      choices
    }
  };
};

export default {
  createQCM,
  createQCMGraphic,
  createTemplate
};
