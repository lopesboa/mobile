// @flow strict

import {__E2E__} from '../../modules/environment';
import {createDisciplinesCards} from '../../__fixtures__/cards';
import basic from '../../__fixtures__/discipline-bundle/basic';
import adaptive from '../../__fixtures__/discipline-bundle/adaptive';
import noClue from '../../__fixtures__/discipline-bundle/no-clue';
import withContextVideo from '../../__fixtures__/discipline-bundle/context-with-video';
import withContextImage from '../../__fixtures__/discipline-bundle/context-with-image';
import onboarding from '../../__fixtures__/__temporary__/onboarding-course';
import bescherelle from '../../__fixtures__/__temporary__/bescherelle-course';
import type {SupportedLanguage} from '../../translations/_types';
import type {Discipline, Cards} from './_types';

export const fetchCards = (language: SupportedLanguage): Promise<Cards> => {
  let disciplinesObject: {[key: string]: Discipline} = {};

  if (__E2E__) {
    disciplinesObject = {
      ...basic.disciplines,
      ...adaptive.disciplines,
      ...noClue.disciplines,
      ...withContextVideo.disciplines,
      ...withContextImage.disciplines
    };
  } else {
    disciplinesObject = {
      ...onboarding.disciplines,
      ...bescherelle.disciplines
    };
  }

  // Implement fetching logic here
  const disciplines = Object.keys(disciplinesObject).map(key => disciplinesObject[key]);
  const cards = createDisciplinesCards(disciplines);

  return Promise.resolve(cards);
};

export default {
  fetchCards
};
