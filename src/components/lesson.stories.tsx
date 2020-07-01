import * as React from 'react';
import {storiesOf} from '@storybook/react-native';
import renderer from 'react-test-renderer';
import {VIDEO_TRACK_TYPE} from '@coorpacademy/player-store';

import {createVideoTracks} from '../__fixtures__/videos';
import {__TEST__} from '../modules/environment';

import {createVideo, createPdf} from '../__fixtures__/lessons';
import {TestContextProvider, handleFakePress, fakeLayout} from '../utils/tests';
import {mapToResource} from '../layer/data/mappers';
import Lesson from './lesson';

const video = createVideo({ref: 'les_1', description: 'Foo bar baz - Video'});
const pdf = createPdf({ref: 'les_2', description: 'Foo bar baz - PDF'});
const videoWithTracks = createVideo({
  ref: 'les_3',
  description: 'Foo bar baz - Video tracks',
  tracks: createVideoTracks('foo', VIDEO_TRACK_TYPE.VTT),
});
const lessons = [video, videoWithTracks, pdf];
const resources = lessons.map(mapToResource).filter((lesson) => lesson.url);

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
        onVideoPlay={handleFakePress}
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
        onVideoPlay={handleFakePress}
      />
    </TestContextProvider>
  ))
  .add('Video tracks', () => (
    <TestContextProvider>
      <Lesson
        header="What was the nationality of Steve Jobs?"
        resources={resources}
        selected={videoWithTracks._id}
        onChange={handleFakePress}
        starsGranted={4}
        layout={fakeLayout}
        onPDFButtonPress={handleFakePress}
        onVideoPlay={handleFakePress}
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
        onVideoPlay={handleFakePress}
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
        onVideoPlay={handleFakePress}
      />
    </TestContextProvider>
  ));

if (__TEST__) {
  describe('Lesson', () => {
    it('should handle onPress callback', () => {
      const handlePress = jest.fn();
      const handleVideoPlay = jest.fn();

      const component = renderer.create(
        <TestContextProvider>
          <Lesson
            header="What was the nationality of Steve Jobs?"
            resources={resources}
            selected={pdf._id}
            onChange={handleFakePress}
            starsGranted={4}
            layout={fakeLayout}
            onPDFButtonPress={handlePress}
            onVideoPlay={handleVideoPlay}
          />
        </TestContextProvider>,
      );

      const button = component.root.find((el) => {
        return el.props.testID === 'lesson-resource';
      });

      button.props.onPress('fakeUrl', 'fakeDescripion');
      expect(handlePress.mock.calls.length).toBe(1);
      expect(handleVideoPlay.mock.calls.length).toBe(0);
    });

    it('should handle onVideoPlay callback', () => {
      const handlePress = jest.fn();
      const handleVideoPlay = jest.fn();
      const testID = 'fake-id';

      const component = renderer.create(
        <TestContextProvider>
          <Lesson
            testID={testID}
            header="What was the nationality of Steve Jobs?"
            resources={resources}
            selected={video._id}
            onChange={handleFakePress}
            starsGranted={4}
            layout={fakeLayout}
            onPDFButtonPress={handlePress}
            onVideoPlay={handleVideoPlay}
          />
        </TestContextProvider>,
      );

      const button = component.root.find((el) => {
        return el.props.testID === 'lesson-resource';
      });

      button.props.onPress();
      expect(handlePress.mock.calls.length).toBe(0);
      expect(handleVideoPlay.mock.calls.length).toBe(1);
    });
  });
}
