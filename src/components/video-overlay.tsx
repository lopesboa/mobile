import * as React from 'react';
import {StyleSheet, View, Text, Platform} from 'react-native';
import {NovaSolidDesignActionsRedo} from '@coorpacademy/nova-icons';

import theme from '../modules/theme';
import {RESOURCE_TYPE} from '../const';
import translations from '../translations';
import type {SourceURI} from '../types';
import Preview, {EXTRALIFE} from './preview';
import Overlay from './overlay';
import Touchable from './touchable';
import Space from './space';

export type Step = 'preview' | 'loading' | 'error' | 'play' | 'end';

export interface Props {
  preview: File | SourceURI;
  height: number;
  step: Step;
  isFullScreen?: boolean;
  onPlay: () => Promise<void> | void;
  children: React.ReactNode;
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.black,
    overflow: 'hidden',
  },
  fullScreen: {
    ...Platform.select({
      android: {
        zIndex: 10000,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      },
    }),
  },
  replay: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.small,
  },
  error: {
    textAlign: 'center',
    color: theme.colors.white,
  },
});

const VideoOverlay = ({
  preview,
  height,
  step,
  isFullScreen,
  onPlay,
  children,
  extralifeOverlay = false,
  testID = 'video-overlay',
}: Props) => {
  const testIDSuffix = isFullScreen ? '-fullscreen' : '';
  const containerHeight = (!isFullScreen && height) || undefined;

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
      {[STEP.PLAY, STEP.END].includes(step) ? children : null}
      {[STEP.END, STEP.ERROR].includes(step) ? (
        <Overlay>
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
        </Overlay>
      ) : null}
    </View>
  );
};

export default VideoOverlay;
