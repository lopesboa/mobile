// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';
import renderer from 'react-test-renderer';

import {handleFakePress, fakeLayout, TestContextProvider} from '../utils/tests';
import {Component as Context} from './context';

const mediaImage = {
  type: 'img',
  src: [
    {
      mimeType: 'image/jpeg',
      _id: 'someImage_ID',
      url:
        '//api-staging.coorpacademy.com/api-service/medias?h=400&w=400&q=90&url=http://static.coorpacademy.com/content/CoorpAcademy/content/cockpitRecette-joan/default/corbeau-1501504511632.jpg'
    }
  ]
};

const mediaVideo = {
  type: 'video',
  src: [
    {
      mimeType: 'video/mp4',
      url:
        '//player.vimeo.com/external/266296552.m3u8?s=316e71edf867847e1f648655833e41cce19da389&oauth2_token_id=411503075',
      _id: 'some_randoMId'
    }
  ]
};

const mediaPDF = {
  type: 'pdf',
  description: 'PDF description',
  mimeType: 'application/pdf',
  mediaUrl:
    '//static.coorpacademy.com/content/CoorpAcademy/content/cockpit-mooc-technique/raw/hierachie-contenu-1494494029567.pdf'
};

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
        mediaSources={mediaImage}
        onPress={handleFakePress}
        onPDFButtonPress={handleFakePress}
        onOpenBrowser={handleFakePress}
        layout={fakeLayout}
      />
    </TestContextProvider>
  ))
  .add('With Video', () => (
    <TestContextProvider>
      <Context
        header="Better now"
        description="You probably think that you are better now <img src='gr\' />"
        mediaSources={mediaVideo}
        onPress={handleFakePress}
        onPDFButtonPress={handleFakePress}
        onOpenBrowser={handleFakePress}
        layout={fakeLayout}
      />
    </TestContextProvider>
  ))
  .add('With PDF', () => (
    <TestContextProvider>
      <Context
        header="Better now"
        description="You probably think that you are better now <img src='gr\' />"
        mediaSources={mediaPDF}
        onPress={handleFakePress}
        onPDFButtonPress={handleFakePress}
        onOpenBrowser={handleFakePress}
        layout={fakeLayout}
      />
    </TestContextProvider>
  ))
  .add('Without Layout', () => (
    <TestContextProvider>
      <Context
        header="Better now"
        description="You probably think that you are better now <img src='gr\' />"
        mediaSources={mediaPDF}
        onPress={handleFakePress}
        onPDFButtonPress={handleFakePress}
        onOpenBrowser={handleFakePress}
      />
    </TestContextProvider>
  ));

if (process.env.NODE_ENV === 'test') {
  describe('Context', () => {
    it('should handle onPress callback', () => {
      const handlePress = jest.fn();
      const component = renderer.create(
        <TestContextProvider>
          <Context
            header="Better now"
            description="You probably think that you are better now <img src='gr\' />"
            mediaSources={mediaPDF}
            onPress={handleFakePress}
            onPDFButtonPress={handlePress}
            onOpenBrowser={handleFakePress}
            layout={fakeLayout}
          />
        </TestContextProvider>
      );

      const button = component.root.find(el => el.props.testID === 'button-open-pdf');
      button.props.onPress();
      expect(handlePress.mock.calls.length).toBe(1);
    });
  });
}
