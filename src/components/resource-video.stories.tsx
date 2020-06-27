import * as React from 'react';
import {storiesOf} from '@storybook/react-native';

import {VIDEO_PROVIDER} from '../layer/data/_const';
import {TestContextProvider, handleFakePress} from '../utils/tests';
import image from '../__fixtures__/assets/landscape-1.jpg';
import ResourceVideo from './resource-video';

const omniPlayerVideoId = '5e6126fdbe444d66709afab1';
const youtubeVideoId = 'K7g4WKoS_6U';
const height = 203;

storiesOf('Resource Video', module)
  .add('OmniPlayer', () => (
    <ResourceVideo
      id={omniPlayerVideoId}
      onPlay={handleFakePress}
      provider={VIDEO_PROVIDER.OMNIPLAYER}
      preview={{uri: ''}}
      source={{uri: `https://mms.myomni.live/${omniPlayerVideoId}`}}
      thumbnail="https://www.cerema.fr/sites/default/files/styles/uas_normal/public/media/images/2017/11/mountain-village-2657307_1920.jpg?h=d6fbcf4a&itok=JMWt0SsS"
      height={height}
      extralifeOverlay={false}
      type="video"
    />
  ))
  .add('Youtube', () => (
    <TestContextProvider>
      <ResourceVideo
        id={youtubeVideoId}
        onPlay={handleFakePress}
        provider={VIDEO_PROVIDER.YOUTUBE}
        source={{uri: ''}}
        preview={{uri: ''}}
        thumbnail="https://www.cerema.fr/sites/default/files/styles/uas_normal/public/media/images/2017/11/mountain-village-2657307_1920.jpg?h=d6fbcf4a&itok=JMWt0SsS"
        height={height}
        extralifeOverlay={false}
        type="video"
      />
    </TestContextProvider>
  ))
  .add('Jwplayer', () => (
    <TestContextProvider>
      <ResourceVideo
        id={omniPlayerVideoId}
        onPlay={handleFakePress}
        provider={VIDEO_PROVIDER.JWPLAYER}
        preview={image}
        source={{uri: 'https://content.jwplatform.com/videos/Piqz1Sdy.mp4'}}
        thumbnail="https://www.cerema.fr/sites/default/files/styles/uas_normal/public/media/images/2017/11/mountain-village-2657307_1920.jpg?h=d6fbcf4a&itok=JMWt0SsS"
        height={height}
        extralifeOverlay={false}
        type="video"
      />
    </TestContextProvider>
  ));
