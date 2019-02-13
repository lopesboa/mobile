// @flow strict

import type {Discipline, Level} from '../layer/data/_types';

export const createDiscipline = ({
  ref,
  levels,
  name
}: {
  ref: string,
  levels: Array<Level>,
  name: string
}): Discipline => ({
  _id: 'foobarbaz',
  ref,
  universalRef: ref,
  name,
  partnershipType: 'paidpartner',
  hidden: false,
  __v: 0,
  position: 8,
  conditions: [],
  skills: ['skill_NkOqattjS'],
  groups: ['ALL', 'digital', 'them_4kZQpfpgQ', 'them_EJFqsxi7m'],
  stats: {
    userTriesCount: 0,
    userDoneCount: 0
  },
  meta: {
    taggedNewUntil: '2019-02-28T09:07:00.404Z',
    updatedAt: '2019-01-15T15:19:43.245Z',
    createdAt: '2018-11-29T11:38:40.206Z'
  },
  partners: ['part_N1RwTvjqz'],
  modules: levels,
  cover: {
    description:
      'Big data, smart data, data science… autant de termes qui se sont installés dans notre vie professionnelle. Mais que signifient-ils ? Et quel est leur intérêt stratégique pour les entreprises de tous les secteurs ? Dans ce cours, vous comprendrez l’importance cruciale de placer la donnée au cœur de la culture d’entreprise, et de l’intégrer en amont de la construction de vos stratégies, et ce, quel que soit votre cœur de métier ! Comment Uber, Airbnb, Netflix, ou encore SNCF et SUEZ ont-ils valorisé la donnée pour en faire un avantage compétitif ? Toutes les réponses ici !',
    media: {
      type: 'img',
      mimeType: 'image/jpeg',
      mediaUrl:
        '//static.coorpacademy.com/content/CoorpAcademy/content-partnerships-fabernovel/cockpit-fabernovel/default/image-culture-data-1543419545159.jpg',
      subtitles: [],
      posters: [],
      src: []
    }
  },
  version: '2'
});

export default {
  createDiscipline
};
