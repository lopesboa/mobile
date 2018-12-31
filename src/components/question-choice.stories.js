// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';
import {handleFakePress} from '../utils/tests';
import Image from '../__fixtures__/image.png';
import QuestionChoice from './question-choice';

const fakeOnPress = handleFakePress('QuestionChoice pressed');

storiesOf('QuestionChoice', module)
  .add('Default', () => (
    <QuestionChoice onPress={fakeOnPress} testID="question-choice-1">
      Option 1
    </QuestionChoice>
  ))
  .add('Selected', () => (
    <QuestionChoice onPress={fakeOnPress} isSelected testID="question-choice-2">
      Option 2
    </QuestionChoice>
  ))
  .add('WithFile', () => (
    <QuestionChoice image={Image} onPress={fakeOnPress} testID="question-choice-3">
      Option 3
    </QuestionChoice>
  ))
  .add('SelectedWithFile', () => (
    <QuestionChoice isSelected image={Image} onPress={fakeOnPress} testID="question-choice-4">
      Option 4
    </QuestionChoice>
  ));
