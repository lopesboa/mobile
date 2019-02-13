// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';

import video from '../__fixtures__/assets/video.mp4';
import image from '../__fixtures__/assets/landscape-1.jpg';
import {handleFakePress} from '../utils/tests';
import Video, {STEP} from './video';

storiesOf('Video', module)
  .add('Local preview', () => (
    <Video
      source={video}
      preview={image}
      step={STEP.PREVIEW}
      onPlay={handleFakePress}
      onEnd={handleFakePress}
      onReady={handleFakePress}
      height={180}
    />
  ))
  .add('Remote preview', () => (
    <Video
      source={video}
      preview={{
        uri:
          'https://www.cerema.fr/sites/default/files/styles/uas_normal/public/media/images/2017/11/mountain-village-2657307_1920.jpg?h=d6fbcf4a&itok=JMWt0SsS'
      }}
      height={180}
      step={STEP.PREVIEW}
      onPlay={handleFakePress}
      onEnd={handleFakePress}
      onReady={handleFakePress}
    />
  ))
  .add('Local video', () => (
    <Video
      source={video}
      preview={image}
      height={180}
      step={STEP.PLAY}
      onPlay={handleFakePress}
      onEnd={handleFakePress}
      onReady={handleFakePress}
    />
  ))
  .add('Remote video', () => (
    <Video
      source={{uri: 'https://content.jwplatform.com/videos/Piqz1Sdy.mp4'}}
      preview={image}
      height={180}
      step={STEP.PLAY}
      onPlay={handleFakePress}
      onEnd={handleFakePress}
      onReady={handleFakePress}
    />
  ))
  .add('Fullscreen', () => (
    <Video
      source={video}
      preview={image}
      height={180}
      step={STEP.PLAY}
      isFullScreen
      onPlay={handleFakePress}
      onEnd={handleFakePress}
      onReady={handleFakePress}
    />
  ))
  .add('Replay', () => (
    <Video
      source={video}
      preview={image}
      height={180}
      step={STEP.END}
      onPlay={handleFakePress}
      onEnd={handleFakePress}
      onReady={handleFakePress}
    />
  ));
