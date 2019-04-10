// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';
import renderer from 'react-test-renderer';

import {__TEST__} from '../modules/environment';
import {createVideo, createPdf} from '../__fixtures__/lessons';
import {TestContextProvider, handleFakePress} from '../utils/tests';
import {getCleanUri} from '../modules/uri';
import {reduceToResources} from '../layer/data/mappers';
import Resource from './resource';

const _video = createVideo({ref: 'les_1', description: 'Foo bar baz'});
const _pdf = createPdf({ref: 'les_2', description: 'Foo bar baz'});
const [video, pdf] = reduceToResources([_video, _pdf]);

storiesOf('Resource', module)
  .add('Video', () => (
    <TestContextProvider>
      <Resource
        type={video.type}
        url={video.url}
        description={video.description}
        thumbnail={video.poster}
        height={200}
        onPDFButtonPress={handleFakePress}
        onVideoPlay={handleFakePress}
      />
    </TestContextProvider>
  ))
  .add('Video (with extra life)', () => (
    <TestContextProvider>
      <Resource
        type={video.type}
        url={video.url}
        description={video.description}
        thumbnail={video.poster}
        height={200}
        extralifeOverlay
        onPDFButtonPress={handleFakePress}
        onVideoPlay={handleFakePress}
      />
    </TestContextProvider>
  ))
  .add('PDF', () => (
    <TestContextProvider>
      <Resource
        type={pdf.type}
        url={pdf.url}
        description={pdf.description}
        thumbnail={pdf.poster}
        height={200}
        onPDFButtonPress={handleFakePress}
        onVideoPlay={handleFakePress}
      />
    </TestContextProvider>
  ))
  .add('PDF (with extra life)', () => (
    <TestContextProvider>
      <Resource
        type={pdf.type}
        url={pdf.url}
        description={pdf.description}
        thumbnail={pdf.poster}
        height={200}
        extralifeOverlay
        onPDFButtonPress={handleFakePress}
        onVideoPlay={handleFakePress}
      />
    </TestContextProvider>
  ))
  .add('Default', () => (
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
        height={200}
        onPDFButtonPress={handleFakePress}
        onVideoPlay={handleFakePress}
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
            description={pdf.description}
            thumbnail={pdf.poster}
            height={200}
            onPDFButtonPress={handlePress}
            onVideoPlay={handlePress}
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
            height={200}
            testID="demo"
            onPDFButtonPress={handlePress}
            onVideoPlay={handlePress}
          />
        </TestContextProvider>
      );

      const preview = component.root.find(el => el.props.testID === 'preview-video-demo');
      preview.props.onPress();
      expect(handlePress.mock.calls.length).toBe(1);
    });
  });
}
