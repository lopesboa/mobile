// @flow strict

import type {BundledDiscipline} from '../../layer/data/_types';
import adaptive from './adaptive';
import basic from './basic';
import contextWithImage from './context-with-image';
import contextWithVideo from './context-with-video';
import withBasicQuestion from './with-question-basic';
import noClue from './no-clue';
import template from './template';
import qcmDrag from './with-qcm-drag';
import slider from './slider';

const items = [
  adaptive,
  basic,
  contextWithImage,
  contextWithVideo,
  noClue,
  template,
  qcmDrag,
  slider,
  withBasicQuestion
];

const initialDisciplinesBundle: BundledDiscipline = {
  disciplines: {},
  chapters: {},
  slides: {},
  chapterRules: {},
  exitNodes: {}
};

const disciplinesBundles: BundledDiscipline = items.reduce(
  (result, disciplineBundle) => ({
    ...result,
    disciplines: {
      ...result.disciplines,
      ...disciplineBundle.disciplines
    },
    chapters: {
      ...result.chapters,
      ...disciplineBundle.chapters
    },
    slides: {
      ...result.slides,
      ...disciplineBundle.slides
    },
    chapterRules: {
      ...result.chapterRules,
      ...disciplineBundle.chapterRules
    },
    exitNodes: {
      ...result.exitNodes,
      ...disciplineBundle.exitNodes
    }
  }),
  initialDisciplinesBundle
);

export default disciplinesBundles;
