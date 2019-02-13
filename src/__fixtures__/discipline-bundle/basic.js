// @flow strict

import type {BundledDiscipline} from '../../layer/data/_types';

import {createDiscipline} from '../disciplines';
import {createLevel} from '../levels';
import {createChapter} from '../chapters';
import {createSlide} from '../slides';
import {qcm, qcmGraphic} from '../questions';
import {failureExitNode, successExitNode} from '../exit-nodes';

const level = createLevel({ref: 'mod_1', chapterIds: ['cha_1', 'cha_2']});

const bundledDiscipline: BundledDiscipline = {
  disciplines: {
    dis_1: createDiscipline({ref: 'dis_1', levels: [level], name: 'Basic course'})
  },
  chapters: {
    cha_1: createChapter({ref: 'cha_1', name: 'Basic chapter 1'}),
    cha_2: createChapter({ref: 'cha_2', name: 'Basic chapter 2'})
  },
  slides: {
    sli_1: createSlide({ref: 'sli_1', chapterId: 'cha_1', question: qcm}),
    sli_2: createSlide({ref: 'sli_2', chapterId: 'cha_1', question: qcmGraphic}),
    sli_3: createSlide({ref: 'sli_3', chapterId: 'cha_1', question: qcm}),
    sli_4: createSlide({ref: 'sli_4', chapterId: 'cha_1', question: qcmGraphic}),
    sli_5: createSlide({ref: 'sli_5', chapterId: 'cha_2', question: qcm}),
    sli_6: createSlide({ref: 'sli_6', chapterId: 'cha_2', question: qcmGraphic}),
    sli_7: createSlide({ref: 'sli_7', chapterId: 'cha_2', question: qcm}),
    sli_8: createSlide({ref: 'sli_8', chapterId: 'cha_2', question: qcmGraphic})
  },
  exitNodes: {
    [failureExitNode.ref]: failureExitNode,
    [successExitNode.ref]: successExitNode
  },
  chapterRules: {}
};

export default bundledDiscipline;
