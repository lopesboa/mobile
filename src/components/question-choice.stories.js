// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';
import {handleFakePress} from '../utils/tests';
import media from '../__fixtures__/media';
import QuestionChoice from './question-choice';

storiesOf('QuestionChoice', module)
  .add('Default', () => (
    <QuestionChoice onPress={handleFakePress} testID="question-choice-1">
      Option 1
    </QuestionChoice>
  ))
  .add('Selected', () => (
    <QuestionChoice onPress={handleFakePress} isSelected testID="question-choice-2">
      Option 2
    </QuestionChoice>
  ))
  .add('With image', () => (
    <QuestionChoice media={media} onPress={handleFakePress} testID="question-choice-3">
      Option 3
    </QuestionChoice>
  ))
  .add('Selected with image', () => (
    <QuestionChoice isSelected media={media} onPress={handleFakePress} testID="question-choice-4">
      Option 4
    </QuestionChoice>
  ));
