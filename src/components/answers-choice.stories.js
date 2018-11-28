// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';
import {handleFakePress} from '../utils/tests';
import AnswersChoice from './answers-choice';

storiesOf('AnswersChoice', module)
  .add('Default', () => <AnswersChoice onPress={handleFakePress}>Option 1</AnswersChoice>)
  .add('Selected', () => (
    <AnswersChoice onPress={handleFakePress} selected>
      Option 1
    </AnswersChoice>
  ));
