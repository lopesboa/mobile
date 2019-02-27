// @flow strict

import type {DisciplineCard, Cards} from '../../layer/data/_types';

const bescherelleDisciplineCard: DisciplineCard = {
  image:
    '//static.coorpacademy.com/content/CoorpAcademy/content-bescherelle/cockpit-bescherelle/default/image_cours_hatier_accords-1527071992067.jpg',
  time: 40,
  adaptiv: false,
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
  authors: [
    {
      ref: 'part_VyFl5hZ3V',
      label: 'Bescherelle',
      authorType: 'verified'
    }
  ],
  authorsListHidden: 'Bescherelle',
  type: 'course',
  title: 'Mastering the rules of agreement in French',
  position: 0,
  nbChapters: 8,
  modules: [
    {
      nbChapters: 3,
      ref: 'mod_NyEfthPvE',
      universalRef: 'mod_NyEfthPvE',
      version: '1',
      level: 'base',
      creditsToAccess: 0,
      isConditional: false,
      taggedNewUntil: '2018-02-22T13:49:05.835Z',
      stars: 0,
      inProgress: true,
      isDone: false,
      completion: 0.08333333333333333,
      accessible: true,
      status: 'isStarted',
      label: 'Basic'
    },
    {
      nbChapters: 3,
      ref: 'mod_417v9RwvE',
      universalRef: 'mod_417v9RwvE',
      version: '1',
      level: 'advanced',
      creditsToAccess: 1,
      isConditional: false,
      taggedNewUntil: '2018-02-22T16:10:29.803Z',
      stars: 0,
      inProgress: false,
      isDone: false,
      completion: 0,
      accessible: true,
      status: 'isLocked',
      label: 'Advanced'
    },
    {
      nbChapters: 2,
      ref: 'mod_EJpOcRwwN',
      universalRef: 'mod_EJpOcRwwN',
      version: '1',
      level: 'coach',
      creditsToAccess: 1,
      isConditional: false,
      taggedNewUntil: '2018-02-22T16:10:29.806Z',
      stars: 0,
      inProgress: false,
      isDone: false,
      completion: 0,
      accessible: true,
      status: 'isLocked',
      label: 'Coach'
    }
  ],
  createdAt: '2018-04-26T07:38:44.780Z',
  taggedNewUntil: '2018-04-22T12:49:05.833Z',
  conditions: [],
  ref: 'dis_NyQeFnDwV',
  universalRef: 'dis_NyQeFnDwV',
  version: '1',
  descriptionHidden:
    "<b> THIS COURSE IS ONLY AVAILABLE IN FRENCH </b> <br/>\nVous rédigez un mail de la plus haute importante et bloquez – encore ! – sur l’accord du participe passé ? Vous écrivez une lettre à l’attention de votre PDG et avez un trou de mémoire au moment d'écrire « je soussigné » ? On pense tous maîtriser – plus ou moins – les bases de la langue française. Pourtant, pas toujours évident de se souvenir de toutes les règles et subtilités d’accord ! Vous pensez faire un sans-faute ? Testez vos connaissances en suivant ce cours !",
  skillsHidden:
    'Maîtriser les différentes natures du sujet Identifier le nom noyau dans un groupe nominal, reconnaître les déterminants indéfinis et maîtriser l’accord de « tout » Comprendre la nature du pronom et connaître les différentes catégories Maîtriser l’accord du verbe avec le sujet quelle que soit sa place Accorder un adjectif quelle que soit sa nature (épithète, attribut du sujet,...) Comprendre dans quel cas le participe passé s’accorde ou non Distinguer l’adjectif verbal en -ant du participe présent afin d’accorder convenablement Faire la différence entre les verbes essentiellement pronominaux et les verbes occasionnellement pronominaux',
  relatedContentHidden:
    "Accorder un verbe avec son sujet (1), Accorder un déterminant, Accorder un pronom avec le nom qu'il représente, Accorder un verbe avec son sujet (2), Accorder un adjectif quelle que soit sa fonction, Accorder un participe passé avec le sujet, quand il convient, Accorder une forme verbale en -ant quand il convient, Accorder le participe passé d'un verbe pronominal",
  _score: null,
  stars: 0,
  completion: 0.027777777777777776,
  defaultModuleLevel: 'base',
  isNew: false,
  favorite: false
};

const onboardingDisciplineCard: DisciplineCard = {
  image:
    '//static.coorpacademy.com/content/CoorpAcademy/content-catalogue/cockpit-tutorial-course/default/iphone__mockup-1531230955049.jpg',
  time: 5,
  adaptiv: false,
  certification: false,
  lang: 'en',
  thematiques: [
    {
      ref: 'ALL',
      label: 'All courses'
    }
  ],
  skills: [],
  groupsHidden: 'All courses',
  course: null,
  authors: [],
  authorsListHidden: '',
  type: 'course',
  title: 'How to play on the platform?',
  position: 0,
  nbChapters: 1,
  modules: [
    {
      nbChapters: 1,
      ref: 'mod_Nk71ScLUN',
      universalRef: 'mod_Nk71ScLUN',
      version: '1',
      level: 'base',
      creditsToAccess: 0,
      isConditional: false,
      taggedNewUntil: '2018-04-09T12:45:50.430Z',
      stars: 0,
      inProgress: false,
      isDone: false,
      completion: 0,
      accessible: true,
      status: 'isActive',
      label: 'Basic'
    }
  ],
  createdAt: '2018-06-19T13:38:51.587Z',
  taggedNewUntil: '2018-04-09T12:45:50.428Z',
  conditions: [],
  ref: 'dis_4y8q7qLLN',
  universalRef: 'dis_4y8q7qLLN',
  version: '1',
  descriptionHidden:
    'This course will help you to become more familiar with your learning interface.',
  skillsHidden:
    'Identify when a new lesson is available Understand the role and the importance of lives Understand flipped pedagogy',
  relatedContentHidden: 'Tutorial',
  _score: null,
  stars: 0,
  completion: 0,
  defaultModuleLevel: 'base',
  isNew: false,
  favorite: false
};

const cards: Cards = [bescherelleDisciplineCard, onboardingDisciplineCard];

export default cards;
