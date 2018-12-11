// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';
import type {QuestionChoiceItem} from '../types';
import {QUESTION_TYPE} from '../const';
import {handleFakePress} from '../utils/tests';
import choices from '../__fixtures__/question-choices';
import media from '../__fixtures__/media';
import Question from './question';

// eslint-disable-next-line no-console
const fakeOnChoicePress = (item: QuestionChoiceItem) => console.log('Pressed', item);
const fakeOnButtonPress = handleFakePress('Button pressed');

storiesOf('Question', module)
  .add('QCM', () => (
    <Question
      type={QUESTION_TYPE.QCM}
      header="What is the online Apple application store called?"
      explanation="Select the correct answers"
      choices={choices}
      onChoicePress={fakeOnChoicePress}
      onButtonPress={fakeOnButtonPress}
    />
  ))
  .add('Option selected', () => {
    const choicesWithSelection = choices.map(
      choice =>
        (choice.value === 'ref_2' && {
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
        onChoicePress={fakeOnChoicePress}
        onButtonPress={fakeOnButtonPress}
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
      onChoicePress={fakeOnChoicePress}
      onButtonPress={fakeOnButtonPress}
    />
  ));
