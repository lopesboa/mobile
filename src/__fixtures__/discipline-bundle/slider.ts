import {EXIT_NODE_TYPE} from '../../layer/data/_const';
import type {BundledDiscipline} from '../../layer/data/_types';
import {createDiscipline} from '../disciplines';
import {createLevel} from '../levels';
import {createChapter} from '../chapters';
import {createSlide} from '../slides';
import {createSlider as createSliderQuestion} from '../questions';
import {createExitNode} from '../exit-nodes';

const failureExitNode = createExitNode({type: EXIT_NODE_TYPE.FAILURE});
const successExitNode = createExitNode({type: EXIT_NODE_TYPE.SUCCESS});
const level = createLevel({
  ref: 'with_slider_mod_2',
  chapterIds: ['with_slider_cha_1'],
});
const question = createSliderQuestion({
  min: 10,
  max: 200,
  defaultValue: 30,
  answers: [['159']],
});

const bundledDiscipline: BundledDiscipline = {
  disciplines: {
    with_slider_dis_1: createDiscipline({
      ref: 'with_slider_dis_1',
      levels: [level],
      name: 'With Slider: course',
    }),
  },
  chapters: {
    with_slider_cha_1: createChapter({
      ref: 'with_slider_cha_1',
      name: 'With Slider Chapter: chapter',
    }),
  },
  slides: {
    // group question type in a same chapter, because progression engine choose randomly one of it
    with_slider_sli_1: createSlide({
      ref: 'with_slider_sli_1',
      chapterId: 'with_slider_cha_1',
      question,
    }),
    with_slider_sli_2: createSlide({
      ref: 'with_slider_sli_2',
      chapterId: 'with_slider_cha_1',
      question,
    }),
  },
  exitNodes: {
    [failureExitNode.ref]: failureExitNode,
    [successExitNode.ref]: successExitNode,
  },
  chapterRules: {},
};

export default bundledDiscipline;
