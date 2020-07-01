import * as React from 'react';
import {StyleSheet, Platform} from 'react-native';
import VideoPlayer from '@coorpacademy/react-native-video-controls';
import {TextTrackType} from 'react-native-video';
import RNFetchBlob from 'rn-fetch-blob';
import {BlackPortal, WhitePortal} from 'react-native-portal';
import type {SourceURI} from '../types';
import VideoOverlay from './video-overlay';

export type Step = 'preview' | 'loading' | 'error' | 'play' | 'end';

export type Track = {
  title: string;
  language: string;
  type: unknown /* TODO: fix this $Values<TextTrackType>*/;
  uri: string;
};

export interface Props {
  source: File | SourceURI;
  preview: File | SourceURI;
  height: number;
  step: Step;
  tracks?: Array<Track>;
  selectedTrack?: string;
  isFullScreen?: boolean;
  onPlay: () => Promise<void> | void;
  onEnd: () => Promise<void> | void;
  onReady: () => Promise<void> | void;
  onExpand?: () => Promise<void> | void;
  onShrink?: () => Promise<void> | void;
  onTracksToggle?: () => Promise<void> | void;
  onProgress?: (progression: {currentTime: number}) => Promise<void> | void;
  onRef?: (player: VideoPlayer | null) => Promise<void> | void;
  onError?: () => Promise<void> | void;
  testID?: string;
  extralifeOverlay?: boolean;
}

export const STEP: Record<string, Step> = {
  PREVIEW: 'preview',
  LOADING: 'loading',
  ERROR: 'error',
  PLAY: 'play',
  END: 'end',
};

const EMPTY_TRACK: Track = {
  title: 'nocc',
  language: 'nc',
  type: TextTrackType.VTT,
  uri: `file://${RNFetchBlob.fs.dirs.MainBundleDir}/assets/empty.vtt`,
};

const styles = StyleSheet.create({
  video: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
});

const Video = ({
  source,
  preview,
  height,
  step,
  tracks = [],
  selectedTrack,
  isFullScreen,
  onPlay,
  onReady,
  onEnd,
  onExpand,
  onShrink,
  onTracksToggle,
  onRef,
  onError,
  onProgress,
  testID = 'video',
  extralifeOverlay = false,
}: Props) => {
  const testIDSuffix = isFullScreen ? '-fullscreen' : '';
  const defaultTracks: Array<Track> = Platform.OS === 'ios' ? [EMPTY_TRACK] : [];
  const disabledTrack =
    Platform.OS === 'ios' ? {type: 'language', value: EMPTY_TRACK.language} : {type: 'disabled'};

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
      <React.Fragment>
        <BlackPortal name="video">
          <VideoPlayer
            testID={`${testID}${testIDSuffix}-player`}
            source={source}
            ref={onRef}
            style={styles.video}
            resizeMode="contain"
            disableVolume
            disableBack
            ignoreSilentSwitch="ignore"
            disableFullscreen={Boolean(!onExpand && !onShrink)}
            toggleResizeModeOnFullscreen={false}
            isFullscreen={isFullScreen}
            onEnterFullscreen={onExpand}
            onExitFullscreen={onShrink}
            onFullscreenPlayerWillDismiss={onShrink}
            onEnd={onEnd}
            onReadyForDisplay={onReady}
            onError={onError}
            onProgress={onProgress}
            onCC={onTracksToggle}
            disableCC={tracks.length === 0}
            textTracks={defaultTracks.concat(tracks)}
            selectedTextTrack={
              selectedTrack ? {type: 'language', value: selectedTrack} : disabledTrack
            }
            isCC={Boolean(selectedTrack)}
          />
        </BlackPortal>
        {Platform.OS !== 'android' || !isFullScreen ? <WhitePortal name="video" /> : null}
      </React.Fragment>
    </VideoOverlay>
  );
};

export default Video;
