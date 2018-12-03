// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';
import type {QuestionChoiceItem} from '../types';
import {handleFakePress} from '../utils/tests';
import Question from './question';

const choices: Array<QuestionChoiceItem> = [
  {
    label: 'M&S',
    value: 'ref_1',
  },
  {
    label: 'App Store',
    value: 'ref_2',
  },
  {
    label: 'iTunes',
    value: 'ref_3',
  },
  {
    label: 'PlayStore',
    value: 'ref_4',
  },
];

// eslint-disable-next-line no-console
const fakeOnChoicePress = (item: QuestionChoiceItem) => console.log('Clicked', item);
const fakeOnButtonPress = handleFakePress('Button pressed');

storiesOf('Question', module)
  .add('QCM', () => (
    <Question
      type="qcm"
      question="What is the online Apple application store called?"
      explanation="Select the correct answers"
      choices={choices}
      onChoicePress={fakeOnChoicePress}
      onButtonPress={fakeOnButtonPress}
    />
  ))
  .add('QCM option selected', () => {
    choices[2].selected = true;
    return (
      <Question
        type="qcm"
        question="What is the online Apple application store called?"
        explanation="Select the correct answers"
        choices={choices}
        onChoicePress={fakeOnChoicePress}
        onButtonPress={fakeOnButtonPress}
      />
    );
  });
