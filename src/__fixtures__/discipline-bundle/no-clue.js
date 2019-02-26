// @flow strict

import type {BundledDiscipline} from '../../layer/data/_types';
import {createDiscipline} from '../disciplines';
import {createLevel} from '../levels';
import {createChapter} from '../chapters';
import {createSlide} from '../slides';
import {createQCM} from '../questions';
import {failureExitNode, successExitNode} from '../exit-nodes';
import {image} from '../medias';

const level = createLevel({ref: 'no_clue_mod_1', chapterIds: ['no_clue_cha_1']});
const qcm = createQCM({media: image});

const bundledDiscipline: BundledDiscipline = {
  disciplines: {
    no_clue_dis_1: createDiscipline({
      ref: 'no_clue_dis_1',
      levels: [level],
      name: 'No clue: course'
    })
  },
  chapters: {
    no_clue_cha_1: createChapter({ref: 'no_clue_cha_1', name: 'No clue: chapter'})
  },
  slides: {
    // group question type in a same chapter, because progression engine choose randomly one of it
    no_clue_sli_1: createSlide({
      ref: 'no_clue_sli_1',
      chapterId: 'no_clue_cha_1',
      question: qcm,
      clue: null
    }),
    no_clue_sli_2: createSlide({
      ref: 'no_clue_sli_2',
      chapterId: 'no_clue_cha_1',
      question: qcm,
      clue: null
    }),
    no_clue_sli_3: createSlide({
      ref: 'no_clue_sli_3',
      chapterId: 'no_clue_cha_1',
      question: qcm,
      clue: null
    }),
    no_clue_sli_4: createSlide({
      ref: 'no_clue_sli_4',
      chapterId: 'no_clue_cha_1',
      question: qcm,
      clue: null
    })
  },
  exitNodes: {
    [failureExitNode.ref]: failureExitNode,
    [successExitNode.ref]: successExitNode
  },
  chapterRules: {}
};

export default bundledDiscipline;
