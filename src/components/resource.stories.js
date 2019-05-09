// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';
import renderer from 'react-test-renderer';

import {__TEST__} from '../modules/environment';
import {createVideo, createPdf, createImage} from '../__fixtures__/lessons';
import {TestContextProvider, handleFakePress, fakeLayout} from '../utils/tests';
import {getCleanUri} from '../modules/uri';
import {reduceToResources} from '../layer/data/mappers';
import {Component as Resource} from './resource';

const _video = createVideo({ref: 'les_1', description: 'Foo bar baz'});
const _pdf = createPdf({ref: 'les_2', description: 'Foo bar baz'});
const _img = createImage({ref: 'les_2', description: 'Foo bar baz'});
const [video, pdf, image] = reduceToResources([_video, _pdf, _img]);

storiesOf('Resource', module)
  .add('Video', () => (
    <TestContextProvider>
      <Resource
        type={video.type}
        url={video.url}
        layout={fakeLayout}
        description={video.description}
        thumbnail={video.poster}
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
        extralifeOverlay
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
        extralifeOverlay
        onPress={handleFakePress}
      />
    </TestContextProvider>
  ))
  .add('WithImage', () => (
    <TestContextProvider>
      <Resource
        type={image.type}
        url={image.url}
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
        onPress={handleFakePress}
      />
    </TestContextProvider>
  ));

if (__TEST__) {
  describe('Resource', () => {
    it('should handle onPress callback', () => {
      const handlePress = jest.fn();
      const component = renderer.create(
        <TestContextProvider>
          <Resource
            type={pdf.type}
            url={pdf.url}
            layout={fakeLayout}
            description={pdf.description}
            thumbnail={pdf.poster}
            onPress={handlePress}
          />
        </TestContextProvider>
      );
      const button = component.root.find(el => el.props.testID === 'button-open-pdf');

      button.props.onPress();
      expect(handlePress.mock.calls.length).toBe(1);
      expect(handlePress.mock.calls[0]).toEqual([getCleanUri(pdf.url), pdf.description]);
    });

    it('should handle onVideoPlay callback', () => {
      const handlePress = jest.fn();
      const component = renderer.create(
        <TestContextProvider>
          <Resource
            type={video.type}
            url={video.url}
            description={video.description}
            thumbnail={video.poster}
            layout={fakeLayout}
            testID="demo"
            onPress={handlePress}
          />
        </TestContextProvider>
      );

      const preview = component.root.find(el => el.props.testID === 'preview-video-demo');
      preview.props.onPress();
      expect(handlePress.mock.calls.length).toBe(1);
    });

    it('should not call on Press if not provided', () => {
      const component = renderer.create(
        <TestContextProvider>
          <Resource
            type={video.type}
            url={video.url}
            description={video.description}
            thumbnail={video.poster}
            layout={fakeLayout}
            testID="demo"
            onPress={undefined}
          />
        </TestContextProvider>
      );

      const preview = component.root.find(el => el.props.testID === 'preview-video-demo');
      const result = preview.props.onPress();
      expect(result).toBe(undefined);
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
            testID="demo"
            onPress={undefined}
          />
        </TestContextProvider>
      );

      expect(component.root).toBeDefined();
    });
  });
}
