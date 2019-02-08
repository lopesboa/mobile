// @flow

import {Answers, Clues, Content, Progressions} from '@coorpacademy/player-services';

import type {
  AnswersService,
  CluesService,
  DataLayer,
  ContentService,
  ProgressionsService
} from '@coorpacademy/player-services';

export type Services = {
  Answers: AnswersService,
  Clues: CluesService,
  Content: ContentService,
  Progressions: ProgressionsService
};

export type ServicesFactory = DataLayer => Services;

const createServices: ServicesFactory = (dataLayer: DataLayer) => {
  return {
    Answers: Answers(dataLayer),
    Clues: Clues(dataLayer),
    Content: Content(dataLayer),
    Progressions: Progressions(dataLayer)
  };
};

export default createServices;
