import * as React from 'react';
import {View} from 'react-native';
import {storiesOf} from '@storybook/react-native';

import {handleFakePress} from '../utils/tests';
import VideoOverlay, {STEP} from './video-overlay';

const height = 203;
const preview = {
  uri:
    'https://www.cerema.fr/sites/default/files/styles/uas_normal/public/media/images/2017/11/mountain-village-2657307_1920.jpg?h=d6fbcf4a&itok=JMWt0SsS',
};

storiesOf('Video Overlay', module)
  .add('Preview', () => (
    <VideoOverlay
      preview={preview}
      height={height}
      step={STEP.PREVIEW}
      isFullScreen={false}
      onPlay={handleFakePress}
      extralifeOverlay={false}
      testID="overlay"
    >
      <View style={{flex: 1}} />
    </VideoOverlay>
  ))
  .add('Loading', () => (
    <VideoOverlay
      preview={preview}
      height={height}
      step={STEP.LOADING}
      isFullScreen={false}
      onPlay={handleFakePress}
      extralifeOverlay={false}
    >
      <View style={{flex: 1}} />
    </VideoOverlay>
  ))
  .add('Error', () => (
    <VideoOverlay
      preview={preview}
      height={height}
      step={STEP.ERROR}
      isFullScreen={false}
      onPlay={handleFakePress}
      extralifeOverlay={false}
    >
      <View style={{flex: 1}} />
    </VideoOverlay>
  ))
  .add('Play', () => (
    <VideoOverlay
      preview={preview}
      height={height}
      step={STEP.PLAY}
      isFullScreen={false}
      onPlay={handleFakePress}
      extralifeOverlay={false}
    >
      <View style={{flex: 1}} />
    </VideoOverlay>
  ))
  .add('End', () => (
    <VideoOverlay
      preview={preview}
      height={height}
      step={STEP.END}
      isFullScreen={false}
      onPlay={handleFakePress}
      extralifeOverlay={false}
    >
      <View style={{flex: 1}} />
    </VideoOverlay>
  ))
  .add('Extralife', () => (
    <VideoOverlay
      preview={preview}
      height={height}
      step={STEP.PREVIEW}
      isFullScreen={false}
      onPlay={handleFakePress}
      extralifeOverlay
    >
      <View style={{flex: 1}} />
    </VideoOverlay>
  ))
  .add('FullScreen', () => (
    <VideoOverlay
      preview={preview}
      height={height}
      step={STEP.PLAY}
      isFullScreen
      onPlay={handleFakePress}
      extralifeOverlay={false}
    >
      <View style={{flex: 1}} />
    </VideoOverlay>
  ));
