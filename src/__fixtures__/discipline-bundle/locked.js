// @flow strict

import type {BundledDiscipline} from '../../layer/data/_types';
import {createDiscipline} from '../disciplines';
import {createLevel} from '../levels';
import {createChapter} from '../chapters';
import {createSlide} from '../slides';
import {createQCM} from '../questions';
import {failureExitNode, successExitNode} from '../exit-nodes';
import {image} from '../medias';

const accessible = false;
const level = createLevel({ref: 'locked_mod_1', chapterIds: ['locked_cha_1'], accessible});
const qcm = createQCM({media: image});
const lessons = [];

const bundledDiscipline: BundledDiscipline = {
  disciplines: {
    locked_dis_1: createDiscipline({
      ref: 'locked_dis_1',
      levels: [level],
      name: 'Locked: course',
      accessible
    })
  },
  chapters: {
    locked_cha_1: createChapter({
      ref: 'locked_cha_1',
      name: 'Locked: chapter',
      isConditional: true,
      accessible
    })
  },
  slides: {
    locked_sli_1: createSlide({
      ref: 'locked_sli_1',
      chapterId: 'locked_cha_1',
      question: qcm,
      lessons
    }),
    locked_sli_2: createSlide({
      ref: 'locked_sli_2',
      chapterId: 'locked_cha_1',
      question: qcm,
      lessons
    }),
    locked_sli_3: createSlide({
      ref: 'locked_sli_3',
      chapterId: 'locked_cha_1',
      question: qcm,
      lessons
    }),
    locked_sli_4: createSlide({
      ref: 'locked_sli_4',
      chapterId: 'locked_cha_1',
      question: qcm,
      lessons
    })
  },
  exitNodes: {
    [failureExitNode.ref]: failureExitNode,
    [successExitNode.ref]: successExitNode
  },
  chapterRules: {}
};

export default bundledDiscipline;
