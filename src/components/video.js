// @flow

import * as React from 'react';
import {StyleSheet, View, TouchableOpacity, Platform} from 'react-native';
import VideoPlayer from '@coorpacademy/react-native-video-controls';
import {NovaSolidDesignActionsRedo} from '@coorpacademy/nova-icons';

import theme from '../modules/theme';
import Preview from './preview';
import ResourceOverlay from './resource-overlay';

export type Step = 'preview' | 'play' | 'end';

type Props = {|
  source: File | {uri: string},
  preview: File | {uri: string},
  height: number,
  step: Step,
  isFullScreen?: boolean,
  onPlay: () => void,
  onEnd: () => void,
  onReady: () => void,
  onExpand?: () => void,
  onShrink?: () => void,
  onRef?: (VideoPlayer | null) => void
|};

export const STEP: {[key: string]: Step} = {
  PREVIEW: 'preview',
  PLAY: 'play',
  END: 'end'
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
  isFullScreen,
  onPlay,
  onReady,
  onEnd,
  onExpand,
  onShrink,
  onRef
}: Props) => {
  const testIDSuffix = isFullScreen ? '-fullscreen' : '';
  const containerHeight = (!isFullScreen && height) || undefined;

  return (
    <View
      style={[styles.container, isFullScreen && styles.fullScreen, {height: containerHeight}]}
      testID={`video-container${testIDSuffix}`}
    >
      {step === STEP.PREVIEW && <Preview type="video" source={preview} onPress={onPlay} />}
      {[STEP.PLAY, STEP.END].includes(step) && (
        <VideoPlayer
          testID="video"
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
        />
      )}
      {step === STEP.END && (
        <ResourceOverlay>
          <TouchableOpacity onPress={onPlay} style={styles.replay} testID="video-replay">
            <NovaSolidDesignActionsRedo color={theme.colors.white} height={40} width={40} />
          </TouchableOpacity>
        </ResourceOverlay>
      )}
    </View>
  );
};

export default Video;
