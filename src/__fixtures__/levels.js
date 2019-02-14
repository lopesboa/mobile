// @flow strict

import type {Level} from '../layer/data/_types';

export const createLevel = ({
  ref,
  chapterIds
}: {
  ref: string,
  chapterIds: Array<string>
}): Level => ({
  _id: 'foobarbaz',
  taggedNewUntil: '2018-12-08T09:07:19.302Z',
  timeAlloted: 15,
  name: 'How to play on the platform?',
  levelTranslation: 'Basic',
  mediaUrl:
    'https://static.coorpacademy.com/content/CoorpAcademy/content-catalogue/cockpit-tutorial-course/default/iphone__mockup-1531230955049.jpg',
  level: 'base',
  universalRef: ref,
  deliverCoachStatus: true,
  ref: ref,
  eligibleBattle: true,
  creditsToAccess: 0,
  infiniteLives: false,
  isConditional: false,
  data: [],
  stats: {
    userTriesCount: 0,
    userDoneCount: 0
  },
  chapterIds,
  acquiredSkills: [
    'Définir la data, le big data, la smart data, et comprendre leur importance',
    'Appréhender comment la construction d’une culture data peut servir l’entreprise',
    "Identifier les enjeux liés à un champ d’application majeur de la donnée : l'Intelligence Artificielle"
  ],
  version: '2',
  external_refs: []
});

export default {
  createLevel
};
