import {EXIT_NODE_TYPE} from '../../layer/data/_const';
import type {BundledChapter} from '../../layer/data/_types';
import {createChapter} from '../chapters';
import {createSlide} from '../slides';
import {createVideo, createPdf} from '../lessons';
import {createTemplate} from '../questions';
import {createExitNode} from '../exit-nodes';

const failureExitNode = createExitNode({type: EXIT_NODE_TYPE.FAILURE});
const successExitNode = createExitNode({type: EXIT_NODE_TYPE.SUCCESS});
const template = createTemplate({});

const lessons = [
  createVideo({
    ref: 'les_1',
    description: 'First video',
  }),
  createVideo({
    ref: 'les_2',
    description: 'Second video',
  }),
  createVideo({
    ref: 'les_3',
    description: 'Third video',
  }),
  createPdf({ref: 'les_4', description: 'First PDF'}),
];

const bundledChapter: BundledChapter = {
  chapters: {
    microlearning_template_cha_1: createChapter({
      ref: 'microlearning_template_cha_1',
      name: 'Microlearning template: Template chapter',
    }),
  },
  slides: {
    // group question type in a same chapter, because progression engine choose randomly one of it
    microlearning_template_sli_1: createSlide({
      ref: 'microlearning_template_sli_1',
      chapterId: 'microlearning_template_cha_1',
      question: template,
      lessons,
    }),
    microlearning_template_sli_2: createSlide({
      ref: 'microlearning_template_sli_2',
      chapterId: 'microlearning_template_cha_1',
      question: template,
      lessons,
    }),
    microlearning_template_sli_3: createSlide({
      ref: 'microlearning_template_sli_3',
      chapterId: 'microlearning_template_cha_1',
      question: template,
      lessons,
    }),
    microlearning_template_sli_4: createSlide({
      ref: 'microlearning_template_sli_4',
      chapterId: 'microlearning_template_cha_1',
      question: template,
      lessons,
    }),
  },
  exitNodes: {
    [failureExitNode.ref]: failureExitNode,
    [successExitNode.ref]: successExitNode,
  },
  chapterRules: {},
};

export default bundledChapter;
