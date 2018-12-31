// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';

import type {QuestionChoiceItem} from '../types';
import {QUESTION_TYPE} from '../const';
import choices from '../__fixtures__/question-choices';
import choicesWithImage from '../__fixtures__/question-choices-with-image';
import QuestionChoices from './question-choices';

// eslint-disable-next-line no-console
const handleClick = (item: QuestionChoiceItem) => console.log('Clicked', item);

storiesOf('QuestionChoices', module)
  .add(QUESTION_TYPE.QCM.toUpperCase(), () => (
    <QuestionChoices type={QUESTION_TYPE.QCM} items={choices} onItemPress={handleClick} />
  ))
  .add(QUESTION_TYPE.QCM_GRAPHIC.toUpperCase(), () => (
    <QuestionChoices
      type={QUESTION_TYPE.QCM_GRAPHIC}
      items={choicesWithImage}
      onItemPress={handleClick}
    />
  ));
