import * as React from 'react';
import {storiesOf} from '@storybook/react-native';

import {handleFakePress} from '../utils/tests';
import QuestionSlider from './question-slider';

storiesOf('QuestionSlider', module)
  .add('Default', () => (
    <QuestionSlider
      min={0}
      max={100}
      value={10}
      onChange={handleFakePress}
      onSlidingComplete={handleFakePress}
      testID="question-slider"
    />
  ))
  .add('With step', () => (
    <QuestionSlider
      min={0}
      max={100}
      value={10}
      step={10}
      onChange={handleFakePress}
      onSlidingComplete={handleFakePress}
      testID="question-slider"
    />
  ))
  .add('With unit', () => (
    <QuestionSlider
      min={0}
      max={100}
      unit="°C"
      value={10}
      step={10}
      onChange={handleFakePress}
      onSlidingComplete={handleFakePress}
      testID="question-slider"
    />
  ));
