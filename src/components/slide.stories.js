// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';

import {handleFakePress} from '../utils/tests';
import {QUESTION_TYPE} from '../const';
import type {QuestionChoiceItem} from '../types';
import choices from '../__fixtures__/question-choices';
import Slide from './slide';

// eslint-disable-next-line no-console
const handleChoicePress = (item: QuestionChoiceItem) => console.log('Pressed', item);
const handleButtonPress = handleFakePress('Button pressed');

storiesOf('Slide', module).add('Default', () => {
  const question = {
    type: QUESTION_TYPE.QCM,
    header: 'What is the online Apple application store called?',
    explanation: 'Select the correct answers',
    choices,
    onChoicePress: handleChoicePress,
    onButtonPress: handleButtonPress
  };
  return <Slide question={question} />;
});
