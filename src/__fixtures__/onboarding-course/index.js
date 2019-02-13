// @flow strict

import type {BundledDiscipline} from '../../layer/data/_types';
import {
  slide_sli_EJ6TGiIIN,
  slide_sli_N1uxMsUIV,
  slide_sli_NJjQLo8LV,
  slide_sli_Nkg5D8BD4
} from './slides';
import chapter_cha_VygSqL8E from './chapters';
import {successExitNode, failExitNode} from './exit-nodes';
import discipline from './discipline';

const bundledDiscipline: BundledDiscipline = {
  disciplines: {
    [discipline.universalRef]: discipline
  },
  chapters: {
    [chapter_cha_VygSqL8E.universalRef]: chapter_cha_VygSqL8E
  },
  slides: {
    [slide_sli_EJ6TGiIIN.universalRef]: slide_sli_EJ6TGiIIN,
    [slide_sli_N1uxMsUIV.universalRef]: slide_sli_N1uxMsUIV,
    [slide_sli_NJjQLo8LV.universalRef]: slide_sli_NJjQLo8LV,
    [slide_sli_Nkg5D8BD4.universalRef]: slide_sli_Nkg5D8BD4
  },
  exitNodes: {
    [failExitNode.ref]: failExitNode,
    [successExitNode.ref]: successExitNode
  },
  chapterRules: {}
};
export default bundledDiscipline;
