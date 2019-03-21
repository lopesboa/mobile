// @flow

import * as React from 'react';
import {StyleSheet, View, TouchableOpacity, Platform} from 'react-native';
import VideoPlayer from '@coorpacademy/react-native-video-controls';
import {TextTrackType} from 'react-native-video';
import {NovaSolidDesignActionsRedo} from '@coorpacademy/nova-icons';
import RNFetchBlob from 'rn-fetch-blob';

import theme from '../modules/theme';
import {RESOURCE_TYPE} from '../const';
import Preview, {EXTRALIFE} from './preview';
import ResourceOverlay from './resource-overlay';

export type Step = 'preview' | 'play' | 'end';

export type Subtitles = {|
  title: string,
  language: string,
  type: $Values<TextTrackType>,
  uri: string
|};

type Props = {|
  source: File | {uri: string},
  preview: File | {uri: string},
  height: number,
  step: Step,
  subtitles?: string,
  hasSubtitles?: boolean,
  isFullScreen?: boolean,
  onPlay: () => void,
  onEnd: () => void,
  onReady: () => void,
  onExpand?: () => void,
  onShrink?: () => void,
  onSubtitlesToggle?: () => void,
  onRef?: (VideoPlayer | null) => void,
  testID?: string,
  extralifeOverlay?: boolean
|};

export const STEP: {[key: string]: Step} = {
  PREVIEW: 'preview',
  PLAY: 'play',
  END: 'end'
};

const EMPTY_SUBTITLES: Subtitles = {
  title: 'nocc',
  language: 'nc',
  type: TextTrackType.VTT,
  uri: 'file://' + RNFetchBlob.fs.dirs.MainBundleDir + '/assets/empty.vtt'
};

const DEFAULT_SUBTITLES_LANGUAGE = 'en';

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
        zIndex: 1000,
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
    justifyContent: 'center'
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
  onPlay,
  onReady,
  onEnd,
  onExpand,
  onShrink,
  onSubtitlesToggle,
  onRef,
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
      language: DEFAULT_SUBTITLES_LANGUAGE,
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
        value: DEFAULT_SUBTITLES_LANGUAGE
      }
    : disabledSubtitles;

  return (
    <View
      style={[styles.container, isFullScreen && styles.fullScreen, {height: containerHeight}]}
      testID={`video-container${testIDFullscreenSuffix}`}
    >
      {step === STEP.PREVIEW && (
        <Preview
          type={extralifeOverlay ? EXTRALIFE : RESOURCE_TYPE.VIDEO}
          source={preview}
          onPress={onPlay}
          testID={testID}
        />
      )}
      {[STEP.PLAY, STEP.END].includes(step) && (
        <VideoPlayer
          testID={'video' + testIDFullscreenSuffix}
          source={source}
          ref={onRef}
          style={styles.video}
          resizeMode="contain"
          disableVolume
          disableBack
          disableFullscreen={Boolean(!onExpand && !onShrink)}
          toggleResizeModeOnFullscreen={false}
          isFullscreen={isFullScreen}
          onEnterFullscreen={onExpand}
          onExitFullscreen={onShrink}
          onFullscreenPlayerWillDismiss={onShrink}
          onEnd={onEnd}
          onReadyForDisplay={onReady}
          onCC={onSubtitlesToggle}
          disableCC={!subtitlesUri}
          textTracks={(subtitlesUri && subtitles) || undefined}
          selectedTextTrack={(subtitlesUri && selectedSubtitles) || undefined}
          isCC={hasSubtitles}
        />
      )}
      {step === STEP.END && (
        <ResourceOverlay>
          <TouchableOpacity
            onPress={onPlay}
            style={styles.replay}
            testID={'video-replay' + testIDSuffix}
          >
            <NovaSolidDesignActionsRedo color={theme.colors.white} height={40} width={40} />
          </TouchableOpacity>
        </ResourceOverlay>
      )}
    </View>
  );
};

export default Video;
