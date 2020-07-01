import {EXIT_NODE_TYPE} from '../../layer/data/_const';
import type {BundledDiscipline} from '../../layer/data/_types';
import {createDiscipline} from '../disciplines';
import {createLevel} from '../levels';
import {createChapter} from '../chapters';
import {createSlide} from '../slides';
import {createQCMDrag} from '../questions';
import {createExitNode} from '../exit-nodes';

const failureExitNode = createExitNode({type: EXIT_NODE_TYPE.FAILURE});
const successExitNode = createExitNode({type: EXIT_NODE_TYPE.SUCCESS});
const level = createLevel({
  ref: 'qcm_drag_mod_1',
  chapterIds: ['qcm_drag_cha_1', 'qcm_drag_cha_2'],
});
const qcmMatchOrder = createQCMDrag({matchOrder: true});
const qcmWithoutMatchOrder = createQCMDrag({matchOrder: false});

const bundledDiscipline: BundledDiscipline = {
  disciplines: {
    qcm_drag_dis_1: createDiscipline({
      ref: 'qcm_drag_dis_1',
      levels: [level],
      name: 'qcm_drag: course',
    }),
  },
  chapters: {
    qcm_drag_cha_1: createChapter({ref: 'qcm_drag_cha_1', name: 'qcm_drag: QCM chapter 1'}),
    qcm_drag_cha_2: createChapter({ref: 'qcm_drag_cha_2', name: 'qcm_drag: QCM chapter 2'}),
  },
  slides: {
    // group question type in a same chapter, because progression engine choose randomly one of it
    qcm_drag_sli_1: createSlide({
      ref: 'qcm_drag_sli_1',
      chapterId: 'qcm_drag_cha_1',
      question: qcmWithoutMatchOrder,
    }),
    qcm_drag_sli_2: createSlide({
      ref: 'qcm_drag_sli_2',
      chapterId: 'qcm_drag_cha_1',
      question: qcmWithoutMatchOrder,
    }),
    qcm_drag_sli_3: createSlide({
      ref: 'qcm_drag_sli_3',
      chapterId: 'qcm_drag_cha_1',
      question: qcmWithoutMatchOrder,
    }),
    qcm_drag_sli_4: createSlide({
      ref: 'qcm_drag_sli_4',
      chapterId: 'qcm_drag_cha_1',
      question: qcmWithoutMatchOrder,
    }),
    qcm_drag_sli_5: createSlide({
      ref: 'qcm_drag_sli_5',
      chapterId: 'qcm_drag_cha_2',
      question: qcmMatchOrder,
    }),
    qcm_drag_sli_6: createSlide({
      ref: 'qcm_drag_sli_6',
      chapterId: 'qcm_drag_cha_2',
      question: qcmMatchOrder,
    }),
    qcm_drag_sli_7: createSlide({
      ref: 'qcm_drag_sli_7',
      chapterId: 'qcm_drag_cha_2',
      question: qcmMatchOrder,
    }),
    qcm_drag_sli_8: createSlide({
      ref: 'qcm_drag_sli_8',
      chapterId: 'qcm_drag_cha_2',
      question: qcmMatchOrder,
    }),
  },
  exitNodes: {
    [failureExitNode.ref]: failureExitNode,
    [successExitNode.ref]: successExitNode,
  },
  chapterRules: {},
};

export default bundledDiscipline;
