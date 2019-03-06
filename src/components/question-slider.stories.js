// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';

import {handleFakePress as fakeOnChange} from '../utils/tests';
import {Component as QuestionSlider} from './question-slider';

storiesOf('QuestionSlider', module)
  .add('Default', () => (
    <QuestionSlider
      minValue={0}
      maxValue={100}
      minLabel="0"
      maxLabel="100"
      value={10}
      step={10}
      onChange={fakeOnChange}
      onSlidingComplete={fakeOnChange}
      color="red"
      testID="question-slider"
    />
  ))
  .add('With Default Step', () => (
    <QuestionSlider
      minValue={0}
      maxValue={100}
      // $FlowFixMe
      step={undefined}
      minLabel="0"
      maxLabel="100"
      value={10}
      onChange={fakeOnChange}
      onSlidingComplete={fakeOnChange}
      color="red"
      testID="question-slider"
    />
  ));
