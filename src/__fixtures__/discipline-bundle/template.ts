import {EXIT_NODE_TYPE} from '../../layer/data/_const';
import type {BundledDiscipline} from '../../layer/data/_types';
import {createDiscipline} from '../disciplines';
import {createLevel} from '../levels';
import {createChapter} from '../chapters';
import {createSlide} from '../slides';
import {createTemplate} from '../questions';
import {createExitNode} from '../exit-nodes';

const failureExitNode = createExitNode({type: EXIT_NODE_TYPE.FAILURE});
const successExitNode = createExitNode({type: EXIT_NODE_TYPE.SUCCESS});
const level = createLevel({
  ref: 'template_mod_1',
  chapterIds: ['template_cha_1'],
});
const template = createTemplate({});

const bundledDiscipline: BundledDiscipline = {
  disciplines: {
    template_dis_1: createDiscipline({
      ref: 'template_dis_1',
      levels: [level],
      name: 'Template: course',
    }),
  },
  chapters: {
    template_dis_1: createChapter({ref: 'template_dis_1', name: 'Template: chapter'}),
  },
  slides: {
    // group question type in a same chapter, because progression engine choose randomly one of it
    template_sli_1: createSlide({
      ref: 'template_sli_1',
      chapterId: 'template_cha_1',
      question: template,
    }),
    template_sli_2: createSlide({
      ref: 'template_sli_2',
      chapterId: 'template_cha_1',
      question: template,
    }),
    template_sli_3: createSlide({
      ref: 'template_sli_3',
      chapterId: 'template_cha_1',
      question: template,
    }),
    template_sli_4: createSlide({
      ref: 'template_sli_4',
      chapterId: 'template_cha_1',
      question: template,
    }),
  },
  exitNodes: {
    [failureExitNode.ref]: failureExitNode,
    [successExitNode.ref]: successExitNode,
  },
  chapterRules: {},
};

export default bundledDiscipline;
