import * as React from 'react';
import {storiesOf} from '@storybook/react-native';
import renderer from 'react-test-renderer';

import {handleFakePress, TestContextProvider} from '../utils/tests';
import {mediaContextImage, mediaContextVideo, mediaContextPDF} from '../__fixtures__/context';
import {__TEST__} from '../modules/environment';
import Context from './context';

storiesOf('Context', module)
  .add('Default', () => (
    <TestContextProvider>
      <Context
        header="Better now"
        description="You probably think that you are better now <img src='gr\' />"
        media={{}}
        onPress={handleFakePress}
        onPDFButtonPress={handleFakePress}
        onLinkPress={handleFakePress}
      />
    </TestContextProvider>
  ))
  .add('With badly formatted video', () => (
    <TestContextProvider>
      <Context
        header="Better now"
        description="You probably think that you are better now <img src='gr\' />"
        // @ts-ignore
        media={{type: 'video', src: [{url: null}]}}
        onPress={handleFakePress}
        onPDFButtonPress={handleFakePress}
        onLinkPress={handleFakePress}
      />
    </TestContextProvider>
  ))
  .add('With Image', () => (
    <TestContextProvider>
      <Context
        header="Better now"
        description="You probably think that you are better now <img src='gr\' />"
        media={mediaContextImage}
        onPress={handleFakePress}
        onPDFButtonPress={handleFakePress}
        onLinkPress={handleFakePress}
      />
    </TestContextProvider>
  ))
  .add('With Video', () => (
    <TestContextProvider>
      <Context
        header="Better now"
        description="You probably think that you are better now <img src='gr\' />"
        media={mediaContextVideo}
        onPress={handleFakePress}
        onPDFButtonPress={handleFakePress}
        onLinkPress={handleFakePress}
      />
    </TestContextProvider>
  ))
  .add('With PDF', () => (
    <TestContextProvider>
      <Context
        header="Better now"
        description="You probably think that you are better now <img src='gr\' />"
        media={mediaContextPDF}
        onPress={handleFakePress}
        onPDFButtonPress={handleFakePress}
        onLinkPress={handleFakePress}
      />
    </TestContextProvider>
  ))
  .add('Without Layout', () => (
    <TestContextProvider>
      <Context
        header="Better now"
        description="You probably think that you are better now <img src='gr\' />"
        media={mediaContextPDF}
        onPress={handleFakePress}
        onPDFButtonPress={handleFakePress}
        onLinkPress={handleFakePress}
      />
    </TestContextProvider>
  ))
  .add('Without Layout 2', () => (
    <TestContextProvider>
      <Context
        header="Better now"
        description="You probably think that you are better now <img src='gr\' />"
        media={undefined}
        onPress={handleFakePress}
        onPDFButtonPress={handleFakePress}
        onLinkPress={handleFakePress}
      />
    </TestContextProvider>
  ));

if (__TEST__) {
  describe('Context', () => {
    it('should handle onPress callback', () => {
      const handlePress = jest.fn();
      const testID = 'context-resource-pdf';

      const component = renderer.create(
        <TestContextProvider>
          <Context
            header="Better now"
            description="You probably think that you are better now <img src='gr\' />"
            media={mediaContextPDF}
            onPress={handleFakePress}
            onPDFButtonPress={handlePress}
            onLinkPress={handleFakePress}
          />
        </TestContextProvider>,
      );

      const button = component.root.find((el) => {
        return el.props.testID === testID;
      });

      button.props.onPress('fakeurl', 'fakedescription');
      expect(handlePress.mock.calls.length).toBe(1);
    });

    it('should handle onPress callback -- without context or url', () => {
      const handlePress = jest.fn();
      const testID = 'context-resource-pdf';

      const component = renderer.create(
        <TestContextProvider>
          <Context
            header="Better now"
            description="You probably think that you are better now <img src='gr\' />"
            media={mediaContextPDF}
            onPress={handleFakePress}
            onPDFButtonPress={handlePress}
            onLinkPress={handleFakePress}
          />
        </TestContextProvider>,
      );

      const button = component.root.find((el) => {
        return el.props.testID === testID;
      });

      button.props.onPress();
      expect(handlePress.mock.calls.length).toBe(0);
    });

    it('should render nothing if no accurate pdf url provided', () => {
      const component = renderer.create(
        <TestContextProvider>
          <Context
            header="Better now"
            description="You probably think that you are better now <img src='gr\' />"
            media={{...mediaContextPDF, mediaUrl: undefined}}
            onPress={handleFakePress}
            onPDFButtonPress={handleFakePress}
            onLinkPress={handleFakePress}
          />
        </TestContextProvider>,
      );

      expect(component.children).toBe(undefined);
    });

    it('should render nothing if no accurate image src provided', () => {
      const component = renderer.create(
        <TestContextProvider>
          <Context
            header="Better now"
            description="You probably think that you are better now <img src='gr\' />"
            media={{...mediaContextImage, src: undefined}}
            onPress={handleFakePress}
            onPDFButtonPress={handleFakePress}
            onLinkPress={handleFakePress}
          />
        </TestContextProvider>,
      );

      expect(component.children).toBe(undefined);
    });
  });
}
