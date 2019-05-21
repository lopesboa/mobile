// @flow strict

import type {BundledChapter} from '../../layer/data/_types';
import {createChapter} from '../chapters';
import {createSlide} from '../slides';
import {createVideo, createPdf} from '../lessons';
import {createQCM, createQCMGraphic} from '../questions';
import {failureExitNode, successExitNode} from '../exit-nodes';
import {image} from '../medias';

const qcm = createQCM({media: image});
const qcmGraphic = createQCMGraphic({});

const lessons = [
  createVideo({
    ref: 'les_1',
    description: 'First video',
    subtitleRef: 'ref_subtitle_01'
  }),
  createVideo({
    ref: 'les_2',
    description: 'Second video',
    subtitleRef: 'ref_subtitle_01'
  }),
  createVideo({
    ref: 'les_3',
    description: 'Third video',
    subtitleRef: 'ref_subtitle_01'
  }),
  createPdf({ref: 'les_4', description: 'First PDF'})
];

const bundledChapter: BundledChapter = {
  chapters: {
    microlearning_basic_cha_1: createChapter({
      ref: 'microlearning_basic_cha_1',
      name: 'Microlearning basic: QCM chapter'
    }),
    microlearning_basic_cha_2: createChapter({
      ref: 'microlearning_basic_cha_2',
      name: 'Microlearning basic: QCM Graphic chapter'
    })
  },
  slides: {
    // group question type in a same chapter, because progression engine choose randomly one of it
    microlearning_basic_sli_1: createSlide({
      ref: 'microlearning_basic_sli_1',
      chapterId: 'microlearning_basic_cha_1',
      question: qcm,
      lessons
    }),
    microlearning_basic_sli_2: createSlide({
      ref: 'microlearning_basic_sli_2',
      chapterId: 'microlearning_basic_cha_1',
      question: qcm,
      lessons
    }),
    microlearning_basic_sli_3: createSlide({
      ref: 'microlearning_basic_sli_3',
      chapterId: 'microlearning_basic_cha_1',
      question: qcm,
      lessons
    }),
    microlearning_basic_sli_4: createSlide({
      ref: 'microlearning_basic_sli_4',
      chapterId: 'microlearning_basic_cha_1',
      question: qcm,
      lessons
    }),
    microlearning_basic_sli_5: createSlide({
      ref: 'microlearning_basic_sli_5',
      chapterId: 'microlearning_basic_cha_2',
      question: qcmGraphic,
      lessons: lessons.filter(lesson => lesson.ref === 'les_1')
    }),
    microlearning_basic_sli_6: createSlide({
      ref: 'microlearning_basic_sli_6',
      chapterId: 'microlearning_basic_cha_2',
      question: qcmGraphic,
      lessons: lessons.filter(lesson => lesson.ref === 'les_1')
    }),
    microlearning_basic_sli_7: createSlide({
      ref: 'microlearning_basic_sli_7',
      chapterId: 'microlearning_basic_cha_2',
      question: qcmGraphic,
      lessons: lessons.filter(lesson => lesson.ref === 'les_1')
    }),
    microlearning_basic_sli_8: createSlide({
      ref: 'microlearning_basic_sli_8',
      chapterId: 'microlearning_basic_cha_2',
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

export default bundledChapter;
