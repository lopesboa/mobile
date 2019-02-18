// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';
import renderer from 'react-test-renderer';

import {lessonWithVideo, lessonWithPdf} from '../__fixtures__/lessons';
import {TestContextProvider, handleFakePress, fakeLayout} from '../utils/tests';
import {getCleanUri} from '../modules/uri';
import {Component as Lesson} from './lesson';

storiesOf('Lesson', module)
  .add('Default', () => (
    <TestContextProvider>
      <Lesson
        header="What was the nationality of Steve Jobs?"
        resources={[lessonWithVideo, lessonWithPdf]}
        layout={fakeLayout}
        onPDFButtonPress={handleFakePress}
      />
    </TestContextProvider>
  ))
  .add('Without layout', () => (
    <TestContextProvider>
      <Lesson
        header="What was the nationality of Steve Jobs?"
        resources={[lessonWithVideo, lessonWithPdf]}
        onPDFButtonPress={handleFakePress}
      />
    </TestContextProvider>
  ));

if (process.env.NODE_ENV === 'test') {
  describe('Lesson', () => {
    it('should handle onPress callback', () => {
      const handlePress = jest.fn();
      const component = renderer.create(
        <TestContextProvider>
          <Lesson
            header="What was the nationality of Steve Jobs?"
            resources={[lessonWithVideo, lessonWithPdf]}
            onPDFButtonPress={handlePress}
            layout={fakeLayout}
          />
        </TestContextProvider>
      );
      const button = component.root.find(el => el.props.testID === 'button-open-pdf');
      button.props.onPress();
      expect(handlePress.mock.calls.length).toBe(1);
      expect(handlePress.mock.calls[0]).toEqual([
        getCleanUri(lessonWithPdf.mediaUrl),
        lessonWithPdf.description
      ]);
    });
  });
}
