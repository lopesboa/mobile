// @flow strict

import type {BundledDiscipline} from '../../layer/data/_types';
import {createDiscipline} from '../disciplines';
import {createLevel} from '../levels';
import {createChapter} from '../chapters';
import {createSlide} from '../slides';
import {createVideo, createPdf} from '../lessons';
import {createQCM, createQCMGraphic} from '../questions';
import {failureExitNode, successExitNode} from '../exit-nodes';
import {image} from '../medias';

const level = createLevel({ref: 'basic_mod_1', chapterIds: ['basic_cha_1', 'basic_cha_2']});
const qcm = createQCM({media: image});
const qcmGraphic = createQCMGraphic({});

const lessons = [
  createVideo({ref: 'les_1', description: 'First video'}),
  createVideo({
    ref: 'les_2',
    description: 'Second video'
  }),
  createVideo({
    ref: 'les_3',
    description: 'Third video'
  }),
  createPdf({ref: 'les_4', description: 'First PDF'})
];

const bundledDiscipline: BundledDiscipline = {
  disciplines: {
    basic_dis_1: createDiscipline({ref: 'basic_dis_1', levels: [level], name: 'Basic: course'})
  },
  chapters: {
    basic_cha_1: createChapter({ref: 'basic_cha_1', name: 'Basic: QCM chapter'}),
    basic_cha_2: createChapter({ref: 'basic_cha_2', name: 'Basic: QCM Graphic chapter'})
  },
  slides: {
    // group question type in a same chapter, because progression engine choose randomly one of it
    basic_sli_1: createSlide({
      ref: 'basic_sli_1',
      chapterId: 'basic_cha_1',
      question: qcm,
      lessons
    }),
    basic_sli_2: createSlide({
      ref: 'basic_sli_2',
      chapterId: 'basic_cha_1',
      question: qcm,
      lessons
    }),
    basic_sli_3: createSlide({
      ref: 'basic_sli_3',
      chapterId: 'basic_cha_1',
      question: qcm,
      lessons
    }),
    basic_sli_4: createSlide({
      ref: 'basic_sli_4',
      chapterId: 'basic_cha_1',
      question: qcm,
      lessons
    }),
    basic_sli_5: createSlide({
      ref: 'basic_sli_5',
      chapterId: 'basic_cha_2',
      question: qcmGraphic,
      lessons: lessons.filter(lesson => lesson.ref === 'les_1')
    }),
    basic_sli_6: createSlide({
      ref: 'basic_sli_6',
      chapterId: 'basic_cha_2',
      question: qcmGraphic,
      lessons: lessons.filter(lesson => lesson.ref === 'les_1')
    }),
    basic_sli_7: createSlide({
      ref: 'basic_sli_7',
      chapterId: 'basic_cha_2',
      question: qcmGraphic,
      lessons: lessons.filter(lesson => lesson.ref === 'les_1')
    }),
    basic_sli_8: createSlide({
      ref: 'basic_sli_8',
      chapterId: 'basic_cha_2',
      question: qcmGraphic,
      lessons: lessons.filter(lesson => lesson.ref === 'les_1')
    })
  },
  exitNodes: {
    [failureExitNode.ref]: failureExitNode,
    [successExitNode.ref]: successExitNode
  },
  chapterRules: {}
};

export default bundledDiscipline;
