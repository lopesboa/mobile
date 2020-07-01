import * as React from 'react';
import {StyleSheet} from 'react-native';
import YouTube from 'react-native-youtube';
import type {SourceURI} from '../types';
import VideoOverlay from './video-overlay';

import type {Step} from './video-overlay';

type State = 'buffering' | 'playing' | 'paused' | 'ended';

export const STATE: {[key: string]: State} = {
  BUFFERING: 'buffering',
  PLAYING: 'playing',
  PAUSED: 'paused',
  ENDED: 'ended',
};

export type StateChange = {
  state: State;
  target: number;
};

export interface Props {
  id: string;
  preview: File | SourceURI;
  apiKey: string;
  onPlay: () => Promise<void> | void;
  onChangeFullscreen: () => Promise<void> | void;
  onChangeState?: (e: StateChange) => Promise<void> | void;
  onError?: () => Promise<void> | void;
  onRef?: (player: YouTube | null) => Promise<void> | void;
  height: number;
  step: Step;
  isFullScreen?: boolean;
  extralifeOverlay?: boolean;
  testID?: string;
}

const styles = StyleSheet.create({
  video: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
});

const YoutubePlayer = ({
  id,
  isFullScreen,
  apiKey,
  onPlay,
  onError,
  onChangeState,
  onRef,
  onChangeFullscreen,
  height,
  preview,
  step,
  extralifeOverlay,
  testID = 'video-youtube',
}: Props) => {
  return (
    <VideoOverlay
      preview={preview}
      height={height}
      step={step}
      isFullScreen={isFullScreen}
      onPlay={onPlay}
      extralifeOverlay={extralifeOverlay}
      testID={testID}
    >
      <YouTube
        videoId={id} // The YouTube video ID
        play // control playback of video with true/false
        fullScreen={isFullScreen}
        apiKey={apiKey}
        onChangeState={onChangeState}
        onChangeFullscreen={onChangeFullscreen}
        onError={onError}
        style={styles.video}
        ref={onRef}
      />
    </VideoOverlay>
  );
};

export default YoutubePlayer;
