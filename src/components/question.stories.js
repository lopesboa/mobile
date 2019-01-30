// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';
import type {QuestionChoiceItem} from '../types';
import {QUESTION_TYPE} from '../const';
import {handleFakePress} from '../utils/tests';
import choices, {choicesWithImage} from '../__fixtures__/question-choices';
import media from '../__fixtures__/media';
import Question from './question';

// eslint-disable-next-line no-console
const handleFakeOnChoicePress = (item: QuestionChoiceItem) => handleFakePress();

storiesOf('Question', module)
  .add('QCM', () => (
    <Question
      type={QUESTION_TYPE.QCM}
      header="What is the online Apple application store called?"
      explanation="Select the correct answers"
      choices={choices}
      onChoicePress={handleFakeOnChoicePress}
      onButtonPress={handleFakePress}
    />
  ))
  .add('QCM Graphic', () => (
    <Question
      type={QUESTION_TYPE.QCM_GRAPHIC}
      header="What is the online Apple application store called?"
      explanation="Select the correct answers"
      choices={choicesWithImage}
      onChoicePress={handleFakeOnChoicePress}
      onButtonPress={handleFakePress}
    />
  ))
  .add('Option selected', () => {
    const choicesWithSelection = choices.map(
      choice =>
        (choice.value === 'app_store' && {
          ...choice,
          selected: true
        }) ||
        choice
    );
    return (
      <Question
        type={QUESTION_TYPE.QCM}
        header="What is the online Apple application store called?"
        explanation="Select the correct answers"
        choices={choicesWithSelection}
        onChoicePress={handleFakeOnChoicePress}
        onButtonPress={handleFakePress}
      />
    );
  })
  .add('With image', () => (
    <Question
      type={QUESTION_TYPE.QCM}
      header="What is the online Apple application store called?"
      explanation="Select the correct answers"
      choices={choices}
      media={media}
      onChoicePress={handleFakeOnChoicePress}
      onButtonPress={handleFakePress}
    />
  ));
