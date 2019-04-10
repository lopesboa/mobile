// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';

import {handleFakePress} from '../utils/tests';
import QuestionSlider from './question-slider';

storiesOf('QuestionSlider', module)
  .add('Default', () => (
    <QuestionSlider
      min={{
        label: '0',
        value: 0
      }}
      max={{
        label: '100',
        value: 100
      }}
      value={10}
      step={10}
      onChange={handleFakePress}
      onSlidingComplete={handleFakePress}
      testID="question-slider"
    />
  ))
  .add('With default step', () => (
    <QuestionSlider
      min={{
        label: '0',
        value: 0
      }}
      max={{
        label: '100',
        value: 100
      }}
      value={10}
      onChange={handleFakePress}
      onSlidingComplete={handleFakePress}
      testID="question-slider"
    />
  ));
