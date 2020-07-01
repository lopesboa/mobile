import type {BundledChapter} from '../../layer/data/_types';
import basic from './basic';
import template from './template';
import locked from './locked';

const items = [basic, template, locked];

const initialChaptersBundle: BundledChapter = {
  chapters: {},
  slides: {},
  chapterRules: {},
  exitNodes: {},
};

const chaptersBundles: BundledChapter = items.reduce(
  (result, chapterBundle) => ({
    ...result,
    chapters: {
      ...result.chapters,
      ...chapterBundle.chapters,
    },
    slides: {
      ...result.slides,
      ...chapterBundle.slides,
    },
    chapterRules: {
      ...result.chapterRules,
      ...chapterBundle.chapterRules,
    },
    exitNodes: {
      ...result.exitNodes,
      ...chapterBundle.exitNodes,
    },
  }),
  initialChaptersBundle,
);

export default chaptersBundles;
