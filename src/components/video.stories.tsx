import * as React from 'react';
import {Platform} from 'react-native';
import {storiesOf} from '@storybook/react-native';
import {TextTrackType} from 'react-native-video';

import video from '../__fixtures__/assets/video.mp4';
import image from '../__fixtures__/assets/landscape-1.jpg';
import {handleFakePress} from '../utils/tests';
import Video, {STEP} from './video';
import type {Track} from './video';

const uri = 'https://onboarding.coorpacademy.com/api/v2/subtitles/ref_subtitle_01.vtt?lang=en';
const trackLanguage = 'en';
const tracks: Array<Track> = [
  {title: 'English', language: trackLanguage, type: TextTrackType.VTT, uri},
];

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
          'https://www.cerema.fr/sites/default/files/styles/uas_normal/public/media/images/2017/11/mountain-village-2657307_1920.jpg?h=d6fbcf4a&itok=JMWt0SsS',
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
  .add('Tracks', () => (
    <Video
      source={{uri: 'https://content.jwplatform.com/videos/Piqz1Sdy.mp4'}}
      preview={image}
      height={180}
      step={STEP.PLAY}
      tracks={tracks}
      selectedTrack={trackLanguage}
      onPlay={handleFakePress}
      onEnd={handleFakePress}
      onReady={handleFakePress}
    />
  ))
  .add('Tracks (Android)', () => {
    Platform.OS = 'android';

    return (
      <Video
        source={{uri: 'https://content.jwplatform.com/videos/Piqz1Sdy.mp4'}}
        preview={image}
        height={180}
        step={STEP.PLAY}
        tracks={tracks}
        selectedTrack={trackLanguage}
        onPlay={handleFakePress}
        onEnd={handleFakePress}
        onReady={handleFakePress}
      />
    );
  })
  .add('Disabled tracks', () => (
    <Video
      source={{uri: 'https://content.jwplatform.com/videos/Piqz1Sdy.mp4'}}
      preview={image}
      height={180}
      step={STEP.PLAY}
      tracks={tracks}
      onPlay={handleFakePress}
      onEnd={handleFakePress}
      onReady={handleFakePress}
    />
  ))
  .add('Disabled tracks (Android)', () => {
    Platform.OS = 'android';

    return (
      <Video
        source={{uri: 'https://content.jwplatform.com/videos/Piqz1Sdy.mp4'}}
        preview={image}
        height={180}
        step={STEP.PLAY}
        tracks={tracks}
        onPlay={handleFakePress}
        onEnd={handleFakePress}
        onReady={handleFakePress}
      />
    );
  })
  .add('Fullscreen with testID', () => (
    <Video
      source={video}
      preview={image}
      height={180}
      step={STEP.PLAY}
      isFullScreen
      testID="1234"
      onPlay={handleFakePress}
      onEnd={handleFakePress}
      onReady={handleFakePress}
    />
  ))
  .add('Fullscreen without testID', () => (
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
  ));
