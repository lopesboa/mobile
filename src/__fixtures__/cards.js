// @flow strict

import type {
  Cards,
  DisciplineCard,
  ChapterCard,
  CardLevel,
  CardStatus,
  LevelType,
  Discipline,
  Chapter,
  CardAuthor
} from '../layer/data/_types';
import {CARD_STATUS} from '../layer/data/_const';
import type {AuthorType} from '../types';
import {AUTHOR_TYPE} from '../const';

export const createCardAuthor = ({
  authorType = AUTHOR_TYPE.VERIFIED
}: {
  authorType?: AuthorType
}): CardAuthor => ({
  ref: 'part_VyFl5hZ3V',
  label: 'A good guy with blue eyes',
  authorType
});

export const createCardLevel = ({
  ref,
  completion = 0,
  isDone = false,
  level = 'base',
  status,
  label,
  stars = 0,
  nbChapters = 3
}: {
  ref: string,
  completion?: number,
  isDone?: boolean,
  level?: LevelType,
  status: CardStatus,
  label: string,
  stars?: number,
  nbChapters?: number
}): CardLevel => ({
  nbChapters,
  ref,
  universalRef: ref,
  version: '1',
  level,
  creditsToAccess: 0,
  isConditional: false,
  taggedNewUntil: '2018-02-22T13:49:05.835Z',
  stars,
  inProgress: completion !== 0,
  isDone,
  completion,
  accessible: true,
  status,
  label: 'Basic'
});

export const createDisciplineCard = ({
  ref,
  completion,
  levels,
  title,
  isAdaptive = false,
  isNew = false,
  isFavorite = false,
  stars = 0,
  nbChapters = 8,
  authors = [createCardAuthor({})]
}: {
  ref: string,
  completion: number,
  levels: Array<CardLevel>,
  title: string,
  isAdaptive?: boolean,
  isNew?: boolean,
  isFavorite?: boolean,
  nbChapters?: number,
  stars?: number,
  authors?: Array<CardAuthor>
}): DisciplineCard => ({
  image:
    '//static.coorpacademy.com/content/CoorpAcademy/content-bescherelle/cockpit-bescherelle/default/image_cours_hatier_accords-1527071992067.jpg',
  time: 40,
  adaptiv: isAdaptive,
  certification: false,
  lang: 'en',
  thematiques: [
    {
      ref: 'ALL',
      label: 'All courses'
    },
    {
      ref: 'them_EJEGNqKn4',
      label: 'Flawless French'
    }
  ],
  skills: [
    {
      ref: 'skill_EkRYdKYjB',
      name: 'Written expression'
    }
  ],
  groupsHidden: 'All courses, Flawless French',
  course: null,
  authors,
  authorsListHidden: 'A good guy',
  type: 'course',
  title,
  position: 0,
  nbChapters,
  modules: levels,
  createdAt: '2018-04-26T07:38:44.780Z',
  taggedNewUntil: '2018-04-22T12:49:05.833Z',
  conditions: [],
  ref,
  universalRef: ref,
  version: '1',
  descriptionHidden:
    "<b> THIS COURSE IS ONLY AVAILABLE IN FRENCH </b> <br/>\nVous rédigez un mail de la plus haute importante et bloquez – encore ! – sur l’accord du participe passé ? Vous écrivez une lettre à l’attention de votre PDG et avez un trou de mémoire au moment d'écrire « je soussigné » ? On pense tous maîtriser – plus ou moins – les bases de la langue française. Pourtant, pas toujours évident de se souvenir de toutes les règles et subtilités d’accord ! Vous pensez faire un sans-faute ? Testez vos connaissances en suivant ce cours !",
  skillsHidden:
    'Maîtriser les différentes natures du sujet Identifier le nom noyau dans un groupe nominal, reconnaître les déterminants indéfinis et maîtriser l’accord de « tout » Comprendre la nature du pronom et connaître les différentes catégories Maîtriser l’accord du verbe avec le sujet quelle que soit sa place Accorder un adjectif quelle que soit sa nature (épithète, attribut du sujet,...) Comprendre dans quel cas le participe passé s’accorde ou non Distinguer l’adjectif verbal en -ant du participe présent afin d’accorder convenablement Faire la différence entre les verbes essentiellement pronominaux et les verbes occasionnellement pronominaux',
  relatedContentHidden:
    "Accorder un verbe avec son sujet (1), Accorder un déterminant, Accorder un pronom avec le nom qu'il représente, Accorder un verbe avec son sujet (2), Accorder un adjectif quelle que soit sa fonction, Accorder un participe passé avec le sujet, quand il convient, Accorder une forme verbale en -ant quand il convient, Accorder le participe passé d'un verbe pronominal",
  _score: null,
  stars,
  completion,
  defaultModuleLevel: 'base',
  isNew,
  favorite: isFavorite
});

export const createChapterCard = ({
  ref,
  completion,
  title,
  isAdaptive = false,
  isNew = false,
  isFavorite = false,
  isDone = false,
  status,
  stars = 0,
  authors = [createCardAuthor({})]
}: {
  ref: string,
  completion: number,
  title: string,
  isAdaptive?: boolean,
  isNew?: boolean,
  isFavorite?: boolean,
  isDone?: boolean,
  status: CardStatus,
  stars?: number,
  authors?: Array<CardAuthor>
}): ChapterCard => ({
  image:
    '//static.coorpacademy.com/content/CoorpAcademy/content-bescherelle/cockpit-bescherelle/default/image_chapitre_hatier_accords-1524216190534.jpg',
  time: 8,
  adaptiv: isAdaptive,
  isStandalone: false,
  certification: false,
  lang: 'en',
  skills: [
    {
      ref: 'skill_EkRYdKYjB',
      name: 'Written expression'
    }
  ],
  thematiques: [
    {
      ref: 'ALL',
      label: 'All courses'
    },
    {
      ref: 'them_EJEGNqKn4',
      label: 'Flawless French'
    }
  ],
  groupsHidden: 'All courses, Flawless French',
  course: null,
  authors,
  authorsListHidden: 'A good guy',
  type: 'chapter',
  title,
  position: -1,
  createdAt: '2018-04-26T07:38:44.779Z',
  taggedNewUntil: '2018-04-22T12:49:05.836Z',
  ref,
  universalRef: ref,
  version: '1',
  isFirst: false,
  moduleRef: 'mod_NyEfthPvE',
  creditsToAccess: 0,
  relatedContentHidden: 'Mastering the rules of agreement in French',
  _score: null,
  stars,
  inProgress: completion !== 0,
  isDone,
  completion,
  accessible: true,
  status,
  isNew,
  favorite: isFavorite
});

export const createDisciplinesCards = (disciplines: Array<Discipline>): Cards => {
  const items: Cards = disciplines.map(discipline =>
    createDisciplineCard({
      ref: discipline.universalRef,
      title: discipline.name,
      completion: 0,
      levels: discipline.modules.map(level =>
        createCardLevel({
          ref: level.ref,
          completion: 0,
          stars: 0,
          status: CARD_STATUS.ACTIVE,
          label: level.name
        })
      )
    })
  );

  return items;
};

export const createChaptersCards = (chapters: Array<Chapter>): Cards => {
  const items: Cards = chapters.map(chapter =>
    createChapterCard({
      ref: chapter.universalRef,
      title: chapter.name,
      completion: 0,
      status: CARD_STATUS.ACTIVE
    })
  );

  return items;
};

export default {
  createDisciplineCard,
  createChapterCard,
  createCardLevel,
  createDisciplinesCards,
  createChaptersCards
};
