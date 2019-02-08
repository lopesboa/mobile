// @flow strict

import type {BundledDiscipline} from '../layer/data/types';
import discipline from './discipline';
import {chapter_4yiDgZ4cH, chapter_cha4yoJxV9r} from './chapters';
import {slide_sli_415pDBG2r, slide_sli_666pDBG2r} from './slides';
import {failureExitNode, successExitNode} from './exit-nodes';

const bundledDiscipline: BundledDiscipline = {
  disciplines: {
    [discipline.ref]: discipline
  },
  chapters: {
    [chapter_4yiDgZ4cH.universalRef]: chapter_4yiDgZ4cH,
    [chapter_cha4yoJxV9r.universalRef]: chapter_cha4yoJxV9r
  },
  slides: {
    [slide_sli_415pDBG2r.universalRef]: slide_sli_415pDBG2r,
    [slide_sli_666pDBG2r.universalRef]: slide_sli_666pDBG2r
  },

  exitNodes: {
    [failureExitNode.ref]: failureExitNode,
    [successExitNode.ref]: successExitNode
  },
  chapterRules: {}
};

export default bundledDiscipline;
