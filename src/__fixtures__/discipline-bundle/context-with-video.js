// @flow strict

import type {BundledDiscipline} from '../../layer/data/_types';

import {createDiscipline} from '../disciplines';
import {createLevel} from '../levels';
import {createChapter} from '../chapters';
import {createSlide} from '../slides';
import {createQCM} from '../questions';
import {failureExitNode, successExitNode} from '../exit-nodes';
import {image} from '../medias';
import {createContextWithVideo} from '../context';

const level = createLevel({
  ref: 'with_video_context_mod_2',
  chapterIds: ['with_video_context_cha_1']
});
const qcm = createQCM({media: image});
const contextWithVideo = createContextWithVideo({title: 'A little bit of context with video'});

const bundledDiscipline: BundledDiscipline = {
  disciplines: {
    with_video_context_dis_2: createDiscipline({
      ref: 'with_video_context_dis_2',
      levels: [level],
      name: 'With Context(Video): course'
    })
  },
  chapters: {
    with_video_context_cha_1: createChapter({
      ref: 'with_video_context_cha_1',
      name: 'With Context Chapter: chapter'
    })
  },
  slides: {
    // group question type in a same chapter, because progression engine choose randomly one of it
    with_video_context_sli_1: createSlide({
      ref: 'with_video_context_sli_1',
      chapterId: 'with_video_context_cha_1',
      question: qcm,
      context: contextWithVideo
    }),
    with_video_context_sli_2: createSlide({
      ref: 'with_video_context_sli_2',
      chapterId: 'with_video_context_cha_1',
      question: qcm,
      context: contextWithVideo
    }),
    with_video_context_sli_3: createSlide({
      ref: 'with_video_context_sli_3',
      chapterId: 'with_video_context_cha_1',
      question: qcm,
      context: contextWithVideo
    }),
    with_video_context_sli_4: createSlide({
      ref: 'with_video_context_sli_4',
      chapterId: 'with_video_context_cha_1',
      question: qcm,
      context: contextWithVideo
    })
  },
  exitNodes: {
    [failureExitNode.ref]: failureExitNode,
    [successExitNode.ref]: successExitNode
  },
  chapterRules: {}
};

export default bundledDiscipline;
