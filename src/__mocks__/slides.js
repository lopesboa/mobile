// @flow strict

import {QUESTION_TYPE} from '../const';
import type {QuestionChoiceItem, QuestionType, Media, Answer} from '../types';
import media from '../__fixtures__/media';

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

const slide: MockSlide = {
  ref: 'foobarbaz',
  question: {
    type: QUESTION_TYPE.QCM,
    header: 'What is the online Apple application store called?',
    explanation: 'Select the correct answers',
    choices: [
      {label: 'Option 1', value: 'ref_1'},
      {label: 'Option 2', value: 'ref_2'},
      {label: 'Option 3', value: 'ref_3'},
      {label: 'Option 4', value: 'ref_4'}
    ],
    answers: ['ref_2']
  }
};

const slides: Array<MockSlide> = [
  {...slide, ref: 'slide_1'},
  {...slide, ref: 'slide_2', question: {...slide.question, media}}
];

export default slides;
