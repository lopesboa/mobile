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
import VideoHotspot from './video-hotspot';

export type Step = 'preview' | 'loading' | 'error' | 'play' | 'pause' | 'end';

export type Subtitles = {|
  title: string,
  language: string,
  type: $Values<TextTrackType>,
  uri: string
|};

// @todo move it in a definition file
export type Metadata = {|
  naturalSize: {
    width: number,
    height: number,
    orientation: 'landscape' | 'portrait'
  },
  currentTime: number,
  duration: number
|};

type Props = {|
  source: File | {uri?: string},
  preview: File | {uri: string},
  height: number,
  step: Step,
  subtitles?: string,
  hasSubtitles?: boolean,
  isFullScreen?: boolean,
  onStart: () => void,
  onPlay: () => void,
  onPause: () => void,
  onSeekChange: number => void,
  onVolumeChange: number => void,
  onMutedChange: boolean => void,
  onEnd: () => void,
  onReady: () => void,
  onExpand?: () => Promise<void> | void,
  onShrink?: () => Promise<void> | void,
  onSubtitlesToggle?: () => void,
  onProgress?: () => void,
  onRef?: (VideoPlayer | null) => void,
  onHotspotRef?: (VideoHotspot | null) => void,
  onError?: () => void,
  onLoad?: Metadata => void,
  testID?: string,
  extralifeOverlay?: boolean
|};

export const STEP: {[key: string]: Step} = {
  PREVIEW: 'preview',
  LOADING: 'loading',
  ERROR: 'error',
  PLAY: 'play',
  PAUSE: 'pause',
  END: 'end'
};

const EMPTY_SUBTITLES: Subtitles = {
  title: 'nocc',
  language: 'nc',
  type: TextTrackType.VTT,
  uri: 'file://' + RNFetchBlob.fs.dirs.MainBundleDir + '/assets/empty.vtt'
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
  subtitles: subtitlesUri,
  hasSubtitles,
  isFullScreen,
  onStart,
  onPlay,
  onPause,
  onSeekChange,
  onVolumeChange,
  onMutedChange,
  onReady,
  onEnd,
  onExpand,
  onShrink,
  onSubtitlesToggle,
  onRef,
  onHotspotRef,
  onError,
  onProgress,
  onLoad,
  testID,
  extralifeOverlay = false
}: Props) => {
  const testIDSuffix = testID ? '-' + testID : '';
  const testIDFullscreenSuffix =
    (testID && (isFullScreen ? '-fullscreen' + testIDSuffix : testIDSuffix)) ||
    (isFullScreen ? '-fullscreen' : '');

  const containerHeight = (!isFullScreen && height) || undefined;
  const subtitles: Array<Subtitles> = Platform.OS === 'ios' ? [EMPTY_SUBTITLES] : [];
  if (subtitlesUri) {
    subtitles.push({
      title: 'Subtitles',
      language: translations.getLanguage(),
      type: TextTrackType.VTT,
      uri: subtitlesUri
    });
  }
  const disabledSubtitles =
    Platform.OS === 'ios'
      ? {type: 'language', value: EMPTY_SUBTITLES.language}
      : {type: 'disabled'};
  const selectedSubtitles = hasSubtitles
    ? {
        type: 'language',
        value: translations.getLanguage()
      }
    : disabledSubtitles;

  return (
    <View
      style={[styles.container, isFullScreen && styles.fullScreen, {height: containerHeight}]}
      testID={`video-container${testIDFullscreenSuffix}`}
    >
      {[STEP.PREVIEW, STEP.LOADING].includes(step) && (
        <Preview
          type={extralifeOverlay ? EXTRALIFE : RESOURCE_TYPE.VIDEO}
          source={preview}
          isLoading={step === STEP.LOADING}
          onPress={onStart}
          testID={testID}
        />
      )}
      {[STEP.PLAY, STEP.PAUSE, STEP.END].includes(step) && (
        <React.Fragment>
          <BlackPortal name="video">
            <VideoPlayer
              testID={`video${testIDFullscreenSuffix}`}
              source={source}
              ref={onRef}
              style={styles.video}
              resizeMode="contain"
              disableVolume
              disableBack
              paused={step === STEP.PAUSE}
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
              onCC={onSubtitlesToggle}
              onPlay={onPlay}
              onPause={onPause}
              onSeek={onSeekChange}
              onLoad={onLoad}
              disableCC={!subtitlesUri}
              textTracks={(subtitlesUri && subtitles) || undefined}
              selectedTextTrack={(subtitlesUri && selectedSubtitles) || undefined}
              isCC={hasSubtitles}
            />
            <VideoHotspot
              ref={onHotspotRef}
              publicationId="mpNHyTH"
              onPlay={onPlay}
              onPause={onPause}
              onSeekChange={onSeekChange}
              onVolumeChange={onVolumeChange}
              onMutedChange={onMutedChange}
            />
          </BlackPortal>
          {(Platform.OS !== 'android' || !isFullScreen) && <WhitePortal name="video" />}
        </React.Fragment>
      )}
      {[STEP.END, STEP.ERROR].includes(step) && (
        <ResourceOverlay>
          <Touchable
            onPress={onPlay}
            style={styles.replay}
            testID={`video-${step}-replay-${testIDSuffix}`}
            analyticsID={`video-${step}-replay`}
          >
            <NovaSolidDesignActionsRedo color={theme.colors.white} height={40} width={40} />
            {step === STEP.ERROR && (
              <React.Fragment>
                <Space />
                <Text style={styles.error}>{translations.videoLoadingError}</Text>
              </React.Fragment>
            )}
          </Touchable>
        </ResourceOverlay>
      )}
    </View>
  );
};

export default Video;
