// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';
import {handleFakePress} from '../utils/tests';
import QuestionChoice from './question-choice';

const fakeOnPress = handleFakePress('Option 1');

storiesOf('QuestionChoice', module)
  .add('Default', () => <QuestionChoice onPress={fakeOnPress}>Option 1</QuestionChoice>)
  .add('Selected', () => (
    <QuestionChoice onPress={fakeOnPress} selected>
      Option 1
    </QuestionChoice>
  ));
