// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';
import renderer from 'react-test-renderer';

import {RESOURCE_TYPE} from '../const';
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
        mediaSources={{}}
        onPress={handleFakePress}
        onPDFButtonPress={handleFakePress}
        onOpenBrowser={handleFakePress}
      />
    </TestContextProvider>
  ))
  .add('With badly formatted video', () => (
    <TestContextProvider>
      <Context
        header="Better now"
        description="You probably think that you are better now <img src='gr\' />"
        // $FlowFixMe
        mediaSources={{type: 'video', src: [{url: null}]}}
        onPress={handleFakePress}
        onPDFButtonPress={handleFakePress}
        onOpenBrowser={handleFakePress}
      />
    </TestContextProvider>
  ))
  .add('With Image', () => (
    <TestContextProvider>
      <Context
        header="Better now"
        description="You probably think that you are better now <img src='gr\' />"
        mediaSources={mediaContextImage}
        onPress={handleFakePress}
        onPDFButtonPress={handleFakePress}
        onOpenBrowser={handleFakePress}
      />
    </TestContextProvider>
  ))
  .add('With Video', () => (
    <TestContextProvider>
      <Context
        header="Better now"
        description="You probably think that you are better now <img src='gr\' />"
        mediaSources={mediaContextVideo}
        onPress={handleFakePress}
        onPDFButtonPress={handleFakePress}
        onOpenBrowser={handleFakePress}
      />
    </TestContextProvider>
  ))
  .add('With PDF', () => (
    <TestContextProvider>
      <Context
        header="Better now"
        description="You probably think that you are better now <img src='gr\' />"
        mediaSources={mediaContextPDF}
        onPress={handleFakePress}
        onPDFButtonPress={handleFakePress}
        onOpenBrowser={handleFakePress}
      />
    </TestContextProvider>
  ))
  .add('Without Layout', () => (
    <TestContextProvider>
      <Context
        header="Better now"
        description="You probably think that you are better now <img src='gr\' />"
        mediaSources={mediaContextPDF}
        onPress={handleFakePress}
        onPDFButtonPress={handleFakePress}
        onOpenBrowser={handleFakePress}
      />
    </TestContextProvider>
  ));

if (__TEST__) {
  describe('Context', () => {
    it('should handle onPress callback', () => {
      const handlePress = jest.fn();
      const testID = `${RESOURCE_TYPE.PDF}-resource`;

      const component = renderer.create(
        <TestContextProvider>
          <Context
            header="Better now"
            description="You probably think that you are better now <img src='gr\' />"
            mediaSources={mediaContextPDF}
            onPress={handleFakePress}
            onPDFButtonPress={handlePress}
            onOpenBrowser={handleFakePress}
          />
        </TestContextProvider>
      );

      const button = component.root.find(el => {
        return el.props.testID === testID;
      });

      button.props.onPress('fakeurl', 'fakedescription');
      expect(handlePress.mock.calls.length).toBe(1);
    });

    it('should handle onPress callback -- without context or url', () => {
      const handlePress = jest.fn();
      const testID = `${RESOURCE_TYPE.PDF}-resource`;

      const component = renderer.create(
        <TestContextProvider>
          <Context
            header="Better now"
            description="You probably think that you are better now <img src='gr\' />"
            mediaSources={mediaContextPDF}
            onPress={handleFakePress}
            onPDFButtonPress={handlePress}
            onOpenBrowser={handleFakePress}
          />
        </TestContextProvider>
      );

      const button = component.root.find(el => {
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
            mediaSources={{...mediaContextPDF, mediaUrl: undefined}}
            onPress={handleFakePress}
            onPDFButtonPress={handleFakePress}
            onOpenBrowser={handleFakePress}
          />
        </TestContextProvider>
      );

      expect(component.children).toBe(undefined);
    });

    it('should render nothing if no accurate image src provided', () => {
      const component = renderer.create(
        <TestContextProvider>
          <Context
            header="Better now"
            description="You probably think that you are better now <img src='gr\' />"
            mediaSources={{...mediaContextImage, src: undefined}}
            onPress={handleFakePress}
            onPDFButtonPress={handleFakePress}
            onOpenBrowser={handleFakePress}
          />
        </TestContextProvider>
      );

      expect(component.children).toBe(undefined);
    });
  });
}
