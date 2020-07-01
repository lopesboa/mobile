import * as React from 'react';
import type {LessonType} from '@type/coorp/progression-engine';
import type {VideoProvider} from '@type/coorp/player-store';

import {ViewStyle} from 'react-native';
import VideoControlable from '../containers/video-controlable';
import {VIDEO_PROVIDER} from '../layer/data/_const';
import YoutubePlayer from '../containers/video-youtube';
import OmniPlayer from './video-omniplayer';

interface Props {
  type: LessonType;
  url?: string;
  id?: string;
  preview: File | {uri: string};
  source: File | {uri: string};
  provider: VideoProvider;
  onPlay: () => Promise<void> | void;
  testID?: string;
  thumbnail?: string;
  height: number;
  style?: ViewStyle;
  extralifeOverlay?: boolean;
}

const ResourceVideo = ({
  id,
  source,
  onPlay,
  provider,
  preview,
  height,
  extralifeOverlay,
  type,
  thumbnail,
  style,
  testID,
}: Props) => {
  switch (provider) {
    case VIDEO_PROVIDER.OMNIPLAYER: {
      return (
        <OmniPlayer
          type={type}
          thumbnail={thumbnail}
          source={source}
          height={height}
          testID={testID}
        />
      );
    }
    case VIDEO_PROVIDER.YOUTUBE: {
      return (
        <YoutubePlayer
          id={id}
          preview={preview}
          testID={testID}
          height={height}
          onPlay={onPlay}
          style={style}
        />
      );
    }
    default: {
      return (
        <VideoControlable
          source={source}
          id={id}
          provider={provider}
          testID={testID}
          preview={preview}
          height={height}
          style={style}
          onPlay={onPlay}
          extralifeOverlay={extralifeOverlay}
        />
      );
    }
  }
};

export default ResourceVideo;
