import {SECTION_TYPE, SECTION_CONTENT_TYPE} from '../const';
import type {Section} from '../types';

// @todo explode this function to have a section creator alone
export const createSections = (): Array<Section> => [
  {
    type: SECTION_TYPE.CARDS,
    order: 1,
    endpoint: '/api/v2/recommendations',
    key: 'recommended',
    title: 'Recommandés pour vous',
    query: {
      contentType: SECTION_CONTENT_TYPE.ALL,
    },
  },
  {
    type: SECTION_TYPE.CARDS,
    order: 2,
    endpoint: '/api/v2/most-popular',
    key: 'most-popular',
    title: 'Les plus populaires',
    query: {
      contentType: SECTION_CONTENT_TYPE.COURSE,
    },
  },
  // {
  //   type: SECTION_TYPE.CARDS,
  //   order: 3,
  //   endpoint: '/api/v2/contents',
  //   key: 'skill-1',
  //   title: 'Skill1 FR',
  //   query: {
  //     type: SECTION_CONTENT_TYPE.ALL,
  //     skill: 'skill-1'
  //   }
  // },
  // {
  //   type: SECTION_TYPE.CARDS,
  //   order: 4,
  //   endpoint: '/api/v2/contents',
  //   key: 'most-recent',
  //   title: "5' Learning: Nouveautés",
  //   query: {
  //     sort: '-taggedNewUntil,-_score',
  //     type: SECTION_CONTENT_TYPE.CHAPTER
  //   }
  // },
  // {
  //   type: SECTION_TYPE.CARDS,
  //   order: 5,
  //   endpoint: '/api/v2/contents',
  //   key: SECTION_CONTENT_TYPE.ALL,
  //   title: 'Toutes les thématiques',
  //   query: {
  //     type: SECTION_CONTENT_TYPE.CHAPTER,
  //     theme: SECTION_CONTENT_TYPE.ALL
  //   }
  // },
  // {
  //   type: SECTION_TYPE.CARDS,
  //   order: 6,
  //   endpoint: '/api/v2/contents',
  //   key: 'ref-1',
  //   title: 'Thématique n°1',
  //   query: {
  //     type: SECTION_CONTENT_TYPE.ALL,
  //     theme: 'ref-1'
  //   }
  // },
  // {
  //   type: SECTION_TYPE.CARDS,
  //   order: 7,
  //   endpoint: '/api/v2/contents',
  //   key: 'ref-2',
  //   title: 'Thématique n°2',
  //   query: {
  //     type: SECTION_CONTENT_TYPE.ALL,
  //     theme: 'ref-2'
  //   }
  // },
  // {
  //   type: SECTION_TYPE.CARDS,
  //   order: 8,
  //   endpoint: '/api/v2/contents',
  //   key: 'skill-2',
  //   title: 'Skill2 FR',
  //   query: {
  //     type: SECTION_CONTENT_TYPE.ALL,
  //     skill: 'skill-2'
  //   }
  // },
  // {
  //   type: SECTION_TYPE.CARDS,
  //   order: 9,
  //   endpoint: '/api/v2/contents',
  //   key: 'my-list',
  //   title: "Liste de L'équipe",
  //   query: {
  //     type: SECTION_CONTENT_TYPE.ALL,
  //     sort: '-createdAt,-_score',
  //     playlist: 'favorites'
  //   }
  // }
];
