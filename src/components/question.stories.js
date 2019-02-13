// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';

import {QUESTION_TYPE} from '../const';
import {handleFakePress} from '../utils/tests';
import {choices, choicesWithImage} from '../__fixtures__/question-choices';
import {image} from '../__fixtures__/medias';
import Question from './question';

storiesOf('Question', module)
  .add('QCM', () => (
    <Question
      type={QUESTION_TYPE.QCM}
      header="What is the online Apple application store called?"
      explanation="Select the correct answers"
      choices={choices}
      userChoices={[]}
      onChoicePress={handleFakePress}
      onButtonPress={handleFakePress}
      isValidating={false}
    />
  ))
  .add('QCM Graphic', () => (
    <Question
      type={QUESTION_TYPE.QCM_GRAPHIC}
      header="What is the online Apple application store called?"
      explanation="Select the correct answers"
      choices={choicesWithImage}
      userChoices={[]}
      onChoicePress={handleFakePress}
      onButtonPress={handleFakePress}
      isValidating={false}
    />
  ))
  .add('Option selected', () => (
    <Question
      type={QUESTION_TYPE.QCM}
      header="What is the online Apple application store called?"
      explanation="Select the correct answers"
      choices={choices}
      userChoices={[choices[1].label]}
      onChoicePress={handleFakePress}
      onButtonPress={handleFakePress}
      isValidating={false}
    />
  ))
  .add('With image', () => (
    <Question
      type={QUESTION_TYPE.QCM}
      header="What is the online Apple application store called?"
      explanation="Select the correct answers"
      choices={choices}
      userChoices={[]}
      media={image}
      onChoicePress={handleFakePress}
      onButtonPress={handleFakePress}
      isValidating={false}
    />
  ));
