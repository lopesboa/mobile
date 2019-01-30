// @flow strict

import {QUESTION_TYPE} from '../const';
import type {QuestionChoiceItem, QuestionType, Media, Answer} from '../types';
import media from '../__fixtures__/media';
import choices, {choicesWithImage} from '../__fixtures__/question-choices';

export type MockSlide = {|
  ref: string,
  question: {
    type: QuestionType,
    header: string,
    explanation: string,
    choices: Array<QuestionChoiceItem>,
    media?: Media,
    answers: Array<Answer>
  },
  isCorrect?: boolean
|};

export const slide: MockSlide = {
  ref: 'foobarbaz',
  question: {
    type: QUESTION_TYPE.QCM,
    header: 'What is the online Apple application store called?',
    explanation: 'Select the correct answers',
    choices,
    answers: ['app_store']
  }
};

const slideQcmGraphic: MockSlide = {
  ...slide,
  question: {
    ...slide.question,
    type: QUESTION_TYPE.QCM_GRAPHIC,
    choices: choicesWithImage.slice(0, 3)
  }
};

const slideWithMedia: MockSlide = {
  ...slide,
  question: {
    ...slide.question,
    media
  }
};

const slides: Array<MockSlide> = [
  {...slide, ref: 'slide_1'},
  {...slideWithMedia, ref: 'slide_2'},
  {...slideQcmGraphic, ref: 'slide_3'}
];

export default slides;
