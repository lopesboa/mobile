// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';

import {createVideo, createPdf} from '../__fixtures__/lessons';
import {TestContextProvider, handleFakePress, fakeLayout} from '../utils/tests';
import {Component as Lesson} from './lesson';

const video = createVideo({ref: 'les_1', description: 'Foo bar baz - Video'});
const pdf = createPdf({ref: 'les_2', description: 'Foo bar baz - PDF'});
const resources = [video, pdf];

storiesOf('Lesson', module)
  .add('Default', () => (
    <TestContextProvider>
      <Lesson
        header="What was the nationality of Steve Jobs?"
        resources={resources}
        onChange={handleFakePress}
        starsGranted={4}
        layout={fakeLayout}
        onPDFButtonPress={handleFakePress}
      />
    </TestContextProvider>
  ))
  .add('Video selected', () => (
    <TestContextProvider>
      <Lesson
        header="What was the nationality of Steve Jobs?"
        resources={resources}
        selected={video._id}
        onChange={handleFakePress}
        starsGranted={4}
        layout={fakeLayout}
        onPDFButtonPress={handleFakePress}
      />
    </TestContextProvider>
  ))
  .add('PDF selected', () => (
    <TestContextProvider>
      <Lesson
        header="What was the nationality of Steve Jobs?"
        resources={resources}
        selected={pdf._id}
        onChange={handleFakePress}
        starsGranted={4}
        layout={fakeLayout}
        onPDFButtonPress={handleFakePress}
      />
    </TestContextProvider>
  ))
  .add('Without layout', () => (
    <TestContextProvider>
      <Lesson
        header="What was the nationality of Steve Jobs?"
        resources={resources}
        onChange={handleFakePress}
        starsGranted={4}
        onPDFButtonPress={handleFakePress}
      />
    </TestContextProvider>
  ));
