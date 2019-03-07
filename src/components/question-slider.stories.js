// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';

import {handleFakePress as fakeOnChange} from '../utils/tests';
import {Component as QuestionSlider} from './question-slider';

storiesOf('QuestionSlider', module)
  .add('Default', () => (
    <QuestionSlider
      minVal={0}
      maxVal={100}
      minLabel="0"
      maxLabel="100"
      value={10}
      step={10}
      onChange={fakeOnChange}
      onSlidingComplete={fakeOnChange}
      color="#0077be"
      testID="question-slider"
    />
  ))
  .add('With Default Step', () => (
    <QuestionSlider
      minVal={0}
      maxVal={100}
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
