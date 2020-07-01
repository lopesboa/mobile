import {EXIT_NODE_TYPE} from '../../layer/data/_const';
import type {BundledDiscipline} from '../../layer/data/_types';
import {createDiscipline} from '../disciplines';
import {createLevel} from '../levels';
import {createChapter} from '../chapters';
import {createSlide} from '../slides';
import {createQCM} from '../questions';
import {createExitNode} from '../exit-nodes';
import {image} from '../medias';
import {createContextWithImage} from '../context';

const failureExitNode = createExitNode({type: EXIT_NODE_TYPE.FAILURE});
const successExitNode = createExitNode({type: EXIT_NODE_TYPE.SUCCESS});
const level = createLevel({
  ref: 'with_image_context_mod_1',
  chapterIds: ['with_image_context_cha_1'],
});
const qcm = createQCM({media: image});
const contextWithImage = createContextWithImage({title: 'A little bit of context with image'});

const bundledDiscipline: BundledDiscipline = {
  disciplines: {
    with_image_context_dis_1: createDiscipline({
      ref: 'with_image_context_dis_1',
      levels: [level],
      name: 'With Context(Image): course',
    }),
  },
  chapters: {
    with_image_context_cha_1: createChapter({
      ref: 'with_image_context_cha_1',
      name: 'With Context Chapter: chapter',
    }),
  },
  slides: {
    // group question type in a same chapter, because progression engine choose randomly one of it
    with_image_context_sli_1: createSlide({
      ref: 'with_image_context_sli_1',
      chapterId: 'with_image_context_cha_1',
      question: qcm,
      context: contextWithImage,
    }),
    with_image_context_sli_2: createSlide({
      ref: 'with_image_context_sli_2',
      chapterId: 'with_image_context_cha_1',
      question: qcm,
      context: contextWithImage,
    }),
    with_image_context_sli_3: createSlide({
      ref: 'with_image_context_sli_3',
      chapterId: 'with_image_context_cha_1',
      question: qcm,
      context: contextWithImage,
    }),
    with_image_context_sli_4: createSlide({
      ref: 'with_image_context_sli_4',
      chapterId: 'with_image_context_cha_1',
      question: qcm,
      context: contextWithImage,
    }),
  },
  exitNodes: {
    [failureExitNode.ref]: failureExitNode,
    [successExitNode.ref]: successExitNode,
  },
  chapterRules: {},
};

export default bundledDiscipline;
