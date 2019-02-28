// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';
import renderer from 'react-test-renderer';

import {createVideo, createPdf} from '../__fixtures__/lessons';
import {TestContextProvider, handleFakePress} from '../utils/tests';
import {getCleanUri} from '../modules/uri';
import Resource from './resource';

const video = createVideo({ref: 'les_1', description: 'Foo bar baz'});
const pdf = createPdf({ref: 'les_2', description: 'Foo bar baz'});

storiesOf('Resource', module)
  .add('Video', () => (
    <TestContextProvider>
      <Resource
        type={video.type}
        url={video.mediaUrl}
        description={video.description}
        thumbnail={video.poster}
        height={200}
        onPDFButtonPress={handleFakePress}
      />
    </TestContextProvider>
  ))
  .add('PDF', () => (
    <TestContextProvider>
      <Resource
        type={pdf.type}
        url={pdf.mediaUrl}
        description={pdf.description}
        thumbnail={pdf.poster}
        height={200}
        onPDFButtonPress={handleFakePress}
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
      />
    </TestContextProvider>
  ));

if (process.env.NODE_ENV === 'test') {
  describe('Resource', () => {
    it('should handle onPress callback', () => {
      const handlePress = jest.fn();
      const component = renderer.create(
        <TestContextProvider>
          <Resource
            type={pdf.type}
            url={pdf.mediaUrl}
            description={pdf.description}
            thumbnail={pdf.poster}
            height={200}
            onPDFButtonPress={handlePress}
          />
        </TestContextProvider>
      );

      const button = component.root.find(el => el.props.testID === 'button-open-pdf');
      button.props.onPress();
      expect(handlePress.mock.calls.length).toBe(1);
      expect(handlePress.mock.calls[0]).toEqual([getCleanUri(pdf.mediaUrl), pdf.description]);
    });
  });
}
