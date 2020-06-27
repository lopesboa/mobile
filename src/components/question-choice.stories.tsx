import * as React from 'react';
import {storiesOf} from '@storybook/react-native';

import {handleFakePress} from '../utils/tests';
import {image} from '../__fixtures__/medias';
import QuestionChoice from './question-choice';

const htmlContent = `
 <i> italic input </i> and <s> stripped input </s>
`;

storiesOf('QuestionChoice', module)
  .add('Default', () => (
    <QuestionChoice onPress={handleFakePress} testID="question-choice-1" questionType="qcm">
      Option 1
    </QuestionChoice>
  ))
  .add('Selected', () => (
    <QuestionChoice
      onPress={handleFakePress}
      isSelected
      testID="question-choice-2"
      questionType="qcm"
    >
      Option 2
    </QuestionChoice>
  ))
  .add('With image', () => (
    <QuestionChoice
      media={image}
      onPress={handleFakePress}
      testID="question-choice-3"
      questionType="qcm"
    >
      A very very very long long long long long long long long long long long long long long long
      long text
    </QuestionChoice>
  ))
  .add('Squeezed', () => (
    <QuestionChoice
      squeezed
      onPress={handleFakePress}
      testID="question-choice-3"
      questionType="qcm"
    >
      A Squeezed Question Choices
    </QuestionChoice>
  ))
  .add('Selected with image', () => (
    <QuestionChoice
      isSelected
      media={image}
      onPress={handleFakePress}
      testID="question-choice-4"
      questionType="qcm"
    >
      Option 4
    </QuestionChoice>
  ))
  .add('with html content', () => (
    <QuestionChoice onPress={handleFakePress} testID="question-choice-1" questionType="qcm">
      {htmlContent}
    </QuestionChoice>
  ))
  .add('Disabled', () => (
    <QuestionChoice
      isSelected
      media={image}
      isDisabled
      onPress={handleFakePress}
      testID="question-choice-5"
      questionType="qcm"
    >
      Option 5
    </QuestionChoice>
  ));
