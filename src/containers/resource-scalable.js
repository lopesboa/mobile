// @flow

import * as React from 'react';
import type {LessonType} from '@coorpacademy/progression-engine';

import Resource from '../components/resource';
import {EXTRALIFE} from '../components/preview';
import withLayout from './with-layout';
import type {WithLayoutProps} from './with-layout';

type Props = {|
  ...WithLayoutProps,
  type: LessonType | typeof EXTRALIFE,
  thumbnail: string,
  url: string,
  description: string,
  subtitles?: string,
  onPDFButtonPress: (url: string, description: string) => void,
  onVideoPlay: () => void,
  testID?: string,
  extralifeOverlay?: boolean
|};

const ResourceScalable = ({
  layout,
  type,
  thumbnail,
  url,
  description,
  subtitles,
  onPDFButtonPress,
  onVideoPlay,
  testID,
  extralifeOverlay
}: Props) =>
  (layout && (
    <Resource
      type={type}
      thumbnail={thumbnail}
      url={url}
      description={description}
      subtitles={subtitles}
      height={layout.width / (16 / 9)}
      onPDFButtonPress={onPDFButtonPress}
      onVideoPlay={onVideoPlay}
      testID={testID}
      extralifeOverlay={extralifeOverlay}
    />
  )) ||
  null;

export default withLayout(ResourceScalable);
