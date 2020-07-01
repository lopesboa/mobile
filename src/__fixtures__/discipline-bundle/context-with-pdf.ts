import {EXIT_NODE_TYPE} from '../../layer/data/_const';
import type {BundledDiscipline} from '../../layer/data/_types';
import {createDiscipline} from '../disciplines';
import {createLevel} from '../levels';
import {createChapter} from '../chapters';
import {createSlide} from '../slides';
import {createQCM} from '../questions';
import {createExitNode} from '../exit-nodes';
import {image} from '../medias';
import {createContextWithPDF} from '../context';

const failureExitNode = createExitNode({type: EXIT_NODE_TYPE.FAILURE});
const successExitNode = createExitNode({type: EXIT_NODE_TYPE.SUCCESS});
const level = createLevel({
  ref: 'with_pdf_context_mod_2',
  chapterIds: ['with_pdf_context_cha_1'],
});
const qcm = createQCM({media: image});
const contextWithPDF = createContextWithPDF({title: 'A little bit of context with pdf'});

const bundledDiscipline: BundledDiscipline = {
  disciplines: {
    with_pdf_context_dis_2: createDiscipline({
      ref: 'with_pdf_context_dis_2',
      levels: [level],
      name: 'With Context(pdf): course',
    }),
  },
  chapters: {
    with_pdf_context_cha_1: createChapter({
      ref: 'with_pdf_context_cha_1',
      name: 'With Context Chapter: chapter',
    }),
  },
  slides: {
    // group question type in a same chapter, because progression engine choose randomly one of it
    with_pdf_context_sli_1: createSlide({
      ref: 'with_pdf_context_sli_1',
      chapterId: 'with_pdf_context_cha_1',
      question: qcm,
      context: contextWithPDF,
    }),
    with_pdf_context_sli_2: createSlide({
      ref: 'with_pdf_context_sli_2',
      chapterId: 'with_pdf_context_cha_1',
      question: qcm,
      context: contextWithPDF,
    }),
    with_pdf_context_sli_3: createSlide({
      ref: 'with_pdf_context_sli_3',
      chapterId: 'with_pdf_context_cha_1',
      question: qcm,
      context: contextWithPDF,
    }),
    with_pdf_context_sli_4: createSlide({
      ref: 'with_pdf_context_sli_4',
      chapterId: 'with_pdf_context_cha_1',
      question: qcm,
      context: contextWithPDF,
    }),
  },
  exitNodes: {
    [failureExitNode.ref]: failureExitNode,
    [successExitNode.ref]: successExitNode,
  },
  chapterRules: {},
};

export default bundledDiscipline;
