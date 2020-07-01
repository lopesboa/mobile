import type {Chapter} from '../layer/data/_types';

export const createChapter = ({
  ref,
  name,
  isConditional = false,
  bestScore,
  accessible = true,
}: {
  ref: string;
  name: string;
  isConditional?: boolean;
  bestScore?: number;
  accessible?: boolean;
}): Chapter => ({
  _id: ref,
  universalRef: ref,
  name,
  stars: 20,
  freeRun: true,
  hidden: false,
  meta: {
    taggedNewUntil: '2018-12-08T09:11:54.894Z',
    updatedAt: '2019-01-15T15:19:43.244Z',
    createdAt: '2018-11-29T11:38:40.205Z',
  },
  poster: {
    type: 'img',
    mimeType: 'image/jpeg',
    mediaUrl:
      '//static.coorpacademy.com/content/CoorpAcademy/content-partnerships-fabernovel/cockpit-fabernovel/default/dataculture1a4-1542378128060.jpg',
    subtitles: [],
    posters: [],
    src: [],
  },
  skills: ['skill_NkOqattjS'],
  groups: ['ALL', 'digital', 'them_4kZQpfpgQ', 'them_EJFqsxi7m'],
  partners: ['part_N1RwTvjqz'],
  isStandalone: false,
  isConditional,
  time: 8,
  version: '9',
  bestScore,
  accessible,
});

export default {
  createChapter,
};
