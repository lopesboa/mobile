// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';

import video from '../__fixtures__/video.mp4';
import image from '../__fixtures__/image-landscape-1.jpg';
import Video, {STEP} from './video';

const handleFake = () => {};

storiesOf('Video', module)
  .add('Local preview', () => (
    <Video
      source={video}
      preview={image}
      step={STEP.PREVIEW}
      onPlay={handleFake}
      onEnd={handleFake}
      onReady={handleFake}
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
      onPlay={handleFake}
      onEnd={handleFake}
      onReady={handleFake}
    />
  ))
  .add('Local video', () => (
    <Video
      source={video}
      preview={image}
      height={180}
      step={STEP.PLAY}
      onPlay={handleFake}
      onEnd={handleFake}
      onReady={handleFake}
    />
  ))
  .add('Remote video', () => (
    <Video
      source={{uri: 'https://content.jwplatform.com/videos/Piqz1Sdy.mp4'}}
      preview={image}
      height={180}
      step={STEP.PLAY}
      onPlay={handleFake}
      onEnd={handleFake}
      onReady={handleFake}
    />
  ))
  .add('Fullscreen', () => (
    <Video
      source={video}
      preview={image}
      height={180}
      step={STEP.PLAY}
      isFullScreen
      onPlay={handleFake}
      onEnd={handleFake}
      onReady={handleFake}
    />
  ))
  .add('Replay', () => (
    <Video
      source={video}
      preview={image}
      height={180}
      step={STEP.END}
      onPlay={handleFake}
      onEnd={handleFake}
      onReady={handleFake}
    />
  ));
