// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';

import {lessonWithVideo, lessonWithPdf} from '../__fixtures__/lesson';
import {TestContextProvider} from '../utils/tests';
import {Component as Lesson} from './lesson';

storiesOf('Lesson', module)
  .add('Default', () => (
    <TestContextProvider>
      <Lesson
        header="What was the nationality of Steve Jobs?"
        resources={[lessonWithVideo, lessonWithPdf]}
        layout={{width: 320, height: 768}}
      />
    </TestContextProvider>
  ))
  .add('Without layout', () => (
    <TestContextProvider>
      <Lesson
        header="What was the nationality of Steve Jobs?"
        resources={[lessonWithVideo, lessonWithPdf]}
      />
    </TestContextProvider>
  ));
