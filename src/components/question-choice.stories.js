// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';

import {handleFakePress} from '../utils/tests';
import {image} from '../__fixtures__/medias';
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
    <QuestionChoice media={image} onPress={handleFakePress} testID="question-choice-3">
      Option 3
    </QuestionChoice>
  ))
  .add('Selected with image', () => (
    <QuestionChoice isSelected media={image} onPress={handleFakePress} testID="question-choice-4">
      Option 4
    </QuestionChoice>
  ))
  .add('Disabled', () => (
    <QuestionChoice
      isSelected
      media={image}
      isDisabled
      onPress={handleFakePress}
      testID="question-choice-5"
    >
      Option 5
    </QuestionChoice>
  ));
