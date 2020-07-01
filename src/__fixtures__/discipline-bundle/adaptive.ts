import {EXIT_NODE_TYPE} from '../../layer/data/_const';
import type {BundledDiscipline} from '../../layer/data/_types';
import {createVideo} from '../lessons';
import {createDiscipline} from '../disciplines';
import {createLevel} from '../levels';
import {createChapter} from '../chapters';
import {createSlide} from '../slides';
import {createQCM} from '../questions';
import {createExitNode} from '../exit-nodes';
import {image} from '../medias';

const failureExitNode = createExitNode({type: EXIT_NODE_TYPE.FAILURE});
const successExitNode = createExitNode({type: EXIT_NODE_TYPE.SUCCESS});
const level = createLevel({ref: 'adaptive_mod_1', chapterIds: ['adaptive_cha_1']});
const qcm = createQCM({media: image});
const lessons = [
  createVideo({
    ref: 'les_1',
    description: 'First video',
  }),
];

const bundledDiscipline: BundledDiscipline = {
  disciplines: {
    adaptive_dis_1: createDiscipline({
      ref: 'adaptive_dis_1',
      levels: [level],
      name: 'Adaptive: course',
    }),
  },
  chapters: {
    adaptive_cha_1: createChapter({
      ref: 'adaptive_cha_1',
      name: 'Adaptive: chapter',
      isConditional: true,
    }),
  },
  slides: {
    adaptive_sli_1: createSlide({
      ref: 'adaptive_sli_1',
      chapterId: 'adaptive_cha_1',
      question: qcm,
      lessons,
    }),
    adaptive_sli_2: createSlide({
      ref: 'adaptive_sli_2',
      chapterId: 'adaptive_cha_1',
      question: qcm,
      lessons,
    }),
    adaptive_sli_3: createSlide({
      ref: 'adaptive_sli_3',
      chapterId: 'adaptive_cha_1',
      question: qcm,
      lessons,
    }),
    adaptive_sli_4: createSlide({
      ref: 'adaptive_sli_4',
      chapterId: 'adaptive_cha_1',
      question: qcm,
      lessons,
    }),
  },
  exitNodes: {
    [failureExitNode.ref]: failureExitNode,
    [successExitNode.ref]: successExitNode,
  },
  chapterRules: {},
};

export default bundledDiscipline;
