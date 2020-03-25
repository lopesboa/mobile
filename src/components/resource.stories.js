// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';
import renderer from 'react-test-renderer';

import {__TEST__} from '../modules/environment';
import {createVideo, createPdf, createImage} from '../__fixtures__/lessons';
import {TestContextProvider, handleFakePress, fakeLayout} from '../utils/tests';
import {getCleanUri} from '../modules/uri';
import {mapToResource} from '../layer/data/mappers';
import {VIDEO_PROVIDER_MIME_TYPE} from '../const';
import {Component as Resource} from './resource';

const _video = createVideo({ref: 'les_1', description: 'Foo bar baz'});
const _pdf = createPdf({ref: 'les_2', description: 'Foo bar baz'});
const _img = createImage({ref: 'les_3', description: 'Foo bar baz'});
const _videoOmniPlayer = createVideo({
  ref: 'les_4',
  description: 'Foo bar baz',
  mimeType: VIDEO_PROVIDER_MIME_TYPE.OMNIPLAYER,
  videoId: '5e6126fdbe444d66709afab1'
});
const [video, pdf, image, videoOmniPlayer] = [_video, _pdf, _img, _videoOmniPlayer]
  .map(mapToResource)
  .filter(lesson => lesson.url);

storiesOf('Resource', module)
  .add('Video', () => (
    <TestContextProvider>
      <Resource
        type={video.type}
        url={video.url}
        layout={fakeLayout}
        description={video.description}
        thumbnail={video.poster}
        mimeType={video.mimeType}
        onPress={handleFakePress}
      />
    </TestContextProvider>
  ))
  .add('Video (with extra life)', () => (
    <TestContextProvider>
      <Resource
        type={video.type}
        url={video.url}
        layout={fakeLayout}
        description={video.description}
        thumbnail={video.poster}
        mimeType={video.mimeType}
        extralifeOverlay
        onPress={handleFakePress}
      />
    </TestContextProvider>
  ))
  .add('Video (omniPlayer)', () => (
    <TestContextProvider>
      <Resource
        type={videoOmniPlayer.type}
        url={videoOmniPlayer.url}
        layout={fakeLayout}
        description={videoOmniPlayer.description}
        thumbnail={videoOmniPlayer.poster}
        mimeType={videoOmniPlayer.mimeType}
        onPress={handleFakePress}
      />
    </TestContextProvider>
  ))
  .add('Video (omniPlayer without thumbnail)', () => (
    <TestContextProvider>
      <Resource
        type={videoOmniPlayer.type}
        url={videoOmniPlayer.url}
        layout={fakeLayout}
        description={videoOmniPlayer.description}
        mimeType={videoOmniPlayer.mimeType}
        onPress={handleFakePress}
      />
    </TestContextProvider>
  ))
  .add('PDF', () => (
    <TestContextProvider>
      <Resource
        type={pdf.type}
        url={pdf.url}
        layout={fakeLayout}
        description={pdf.description}
        thumbnail={pdf.poster}
        mimeType={pdf.mimeType}
        onPress={handleFakePress}
      />
    </TestContextProvider>
  ))
  .add('PDF (with extra life)', () => (
    <TestContextProvider>
      <Resource
        type={pdf.type}
        url={pdf.url}
        layout={fakeLayout}
        description={pdf.description}
        thumbnail={pdf.poster}
        mimeType={pdf.mimeType}
        extralifeOverlay
        onPress={handleFakePress}
      />
    </TestContextProvider>
  ))
  .add('Image', () => (
    <TestContextProvider>
      <Resource
        type={image.type}
        url={image.poster}
        mimeType={image.mimeType}
        layout={fakeLayout}
        description="some description"
      />
    </TestContextProvider>
  ))
  .add('Unsupported type', () => (
    <TestContextProvider>
      <Resource
        // In this case we return null whenever we dont match
        // any of the supported types so react doesn't throw
        // an exception for not returning any React Element
        // in the render method
        // $FlowFixMe
        type="unhandledType"
        url="not really a url"
        description="some description"
        thumbnail={video.poster}
        mimeType={video.mimeType}
        layout={fakeLayout}
        onPress={handleFakePress}
      />
    </TestContextProvider>
  ))
  .add('Without layout', () => (
    <TestContextProvider>
      <Resource
        type={video.type}
        url={video.url}
        description={video.description}
        thumbnail={video.poster}
        mimeType={video.mimeType}
        onPress={handleFakePress}
      />
    </TestContextProvider>
  ));

if (__TEST__) {
  describe('Resource', () => {
    it('should handle onPress callback', () => {
      const handlePress = jest.fn();
      const testID = 'resource-1';
      const component = renderer.create(
        <TestContextProvider>
          <Resource
            type={pdf.type}
            url={pdf.url}
            layout={fakeLayout}
            description={pdf.description}
            thumbnail={pdf.poster}
            mimeType={pdf.mimeType}
            testID={testID}
            onPress={handlePress}
          />
        </TestContextProvider>
      );
      const button = component.root.find(el => el.props.testID === `${testID}-pdf-button`);

      button.props.onPress();
      expect(handlePress.mock.calls.length).toBe(1);
      expect(handlePress.mock.calls[0]).toEqual([getCleanUri(pdf.url), pdf.description]);
    });

    it('should handle onPress callback on video onPlay', () => {
      const handlePress = jest.fn();
      const testID = 'resource-2';
      const component = renderer.create(
        <TestContextProvider>
          <Resource
            type={video.type}
            url={video.url}
            description={video.description}
            thumbnail={video.poster}
            mimeType={video.mimeType}
            layout={fakeLayout}
            testID={testID}
            onPress={handlePress}
          />
        </TestContextProvider>
      );

      const preview = component.root.find(el => el.props.testID === testID && el.props.onPlay);
      preview.props.onPlay();
      expect(handlePress).toHaveBeenCalledTimes(1);
    });

    it('should also render if a default style height is provide', () => {
      const component = renderer.create(
        <TestContextProvider>
          <Resource
            type={image.type}
            url={image.url}
            layout={fakeLayout}
            description="some description"
            style={{height: 300}}
            testID="resource-4"
            onPress={undefined}
          />
        </TestContextProvider>
      );

      expect(component.root).toBeDefined();
    });
  });
}
