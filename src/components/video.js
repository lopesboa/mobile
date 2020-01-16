// @flow

import * as React from 'react';
import {StyleSheet, View, Text, Platform} from 'react-native';
import VideoPlayer from '@coorpacademy/react-native-video-controls';
import {TextTrackType} from 'react-native-video';
import {NovaSolidDesignActionsRedo} from '@coorpacademy/nova-icons';
import RNFetchBlob from 'rn-fetch-blob';
import {BlackPortal, WhitePortal} from 'react-native-portal';

import theme from '../modules/theme';
import {RESOURCE_TYPE} from '../const';
import translations from '../translations';
import Preview, {EXTRALIFE} from './preview';
import ResourceOverlay from './resource-overlay';
import Touchable from './touchable';
import Space from './space';

export type Step = 'preview' | 'loading' | 'error' | 'play' | 'end';

export type Track = {|
  title: string,
  language: string,
  type: $Values<TextTrackType>,
  uri: string
|};

export type Props = {|
  source: File | {uri?: string},
  preview: File | {uri: string},
  height: number,
  step: Step,
  tracks?: Array<Track>,
  selectedTrack?: string,
  isFullScreen?: boolean,
  onPlay: () => Promise<void> | void,
  onEnd: () => Promise<void> | void,
  onReady: () => Promise<void> | void,
  onExpand?: () => Promise<void> | void,
  onShrink?: () => Promise<void> | void,
  onTracksToggle?: () => Promise<void> | void,
  onProgress?: ({currentTime: number}) => Promise<void> | void,
  onRef?: (VideoPlayer | null) => Promise<void> | void,
  onError?: () => Promise<void> | void,
  testID?: string,
  extralifeOverlay?: boolean
|};

export const STEP: {[key: string]: Step} = {
  PREVIEW: 'preview',
  LOADING: 'loading',
  ERROR: 'error',
  PLAY: 'play',
  END: 'end'
};

const EMPTY_TRACK: Track = {
  title: 'nocc',
  language: 'nc',
  type: TextTrackType.VTT,
  uri: `file://${RNFetchBlob.fs.dirs.MainBundleDir}/assets/empty.vtt`
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.black,
    overflow: 'hidden'
  },
  video: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  },
  fullScreenButton: {
    alignSelf: 'flex-end',
    padding: theme.spacing.small,
    margin: theme.spacing.small
  },
  fullScreen: {
    ...Platform.select({
      android: {
        zIndex: 10000,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }
    })
  },
  replay: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.small
  },
  error: {
    textAlign: 'center',
    color: theme.colors.white
  }
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
  extralifeOverlay = false
}: Props) => {
  const testIDSuffix = isFullScreen ? '-fullscreen' : '';
  const containerHeight = (!isFullScreen && height) || undefined;
  const defaultTracks: Array<Track> = Platform.OS === 'ios' ? [EMPTY_TRACK] : [];
  const disabledTrack =
    Platform.OS === 'ios' ? {type: 'language', value: EMPTY_TRACK.language} : {type: 'disabled'};

  return (
    <View
      style={[styles.container, isFullScreen && styles.fullScreen, {height: containerHeight}]}
      testID={`${testID}${testIDSuffix}-container`}
    >
      {[STEP.PREVIEW, STEP.LOADING].includes(step) ? (
        <Preview
          type={extralifeOverlay ? EXTRALIFE : RESOURCE_TYPE.VIDEO}
          source={preview}
          isLoading={step === STEP.LOADING}
          onPress={onPlay}
          testID={`${testID}-preview`}
        />
      ) : null}
      {[STEP.PLAY, STEP.END].includes(step) ? (
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
      ) : null}
      {[STEP.END, STEP.ERROR].includes(step) ? (
        <ResourceOverlay>
          <Touchable
            onPress={onPlay}
            style={styles.replay}
            testID={`${testID}${testIDSuffix}-${step}-replay`}
            analyticsID={`video-${step}-replay`}
          >
            <NovaSolidDesignActionsRedo color={theme.colors.white} height={40} width={40} />
            {step === STEP.ERROR ? (
              <React.Fragment>
                <Space />
                <Text style={styles.error}>{translations.videoLoadingError}</Text>
              </React.Fragment>
            ) : null}
          </Touchable>
        </ResourceOverlay>
      ) : null}
    </View>
  );
};

export default Video;
