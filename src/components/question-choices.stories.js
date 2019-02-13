// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';

import {QUESTION_TYPE} from '../const';
import {choices, choicesWithImage} from '../__fixtures__/question-choices';
import {answers} from '../__fixtures__/answers';
import {handleFakePress} from '../utils/tests';
import QuestionChoices from './question-choices';

storiesOf('QuestionChoices', module)
  .add('QCM', () => (
    <QuestionChoices
      type={QUESTION_TYPE.QCM}
      isDisabled={false}
      items={choices}
      userChoices={answers}
      onItemPress={handleFakePress}
    />
  ))
  .add('QCM Graphic', () => (
    <QuestionChoices
      isDisabled={false}
      userChoices={answers}
      type={QUESTION_TYPE.QCM_GRAPHIC}
      items={choicesWithImage.slice(0, 3)}
      onItemPress={handleFakePress}
    />
  ))
  .add('Unsupported question type', () => (
    <QuestionChoices
      // $FlowFixMe its only to test
      type="SomethingElse"
      isDisabled={false}
      items={choices}
      userChoices={answers}
      onItemPress={handleFakePress}
    />
  ));
