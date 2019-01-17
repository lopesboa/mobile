// @flow

import * as React from 'react';
import {Image as ImageBase} from 'react-native';
import AssetRegistry from 'react-native/Libraries/Image/AssetRegistry';

import {getImageDimensions} from '../modules/image';

export type Props = {|
  source: File,
  width?: number,
  maxHeight?: number,
  style?: GenericStyleProp,
  testID?: string
|};

const Image = ({source, width, maxHeight, style, testID}: Props) => {
  const imageProperties = AssetRegistry.getAssetByID(source);
  const {width: originalWidth, height: originalHeight} = imageProperties || {};

  const dimensions = getImageDimensions(
    Number(originalWidth),
    Number(originalHeight),
    width,
    maxHeight
  );
  return (
    <ImageBase source={source} style={[dimensions, style]} resizeMode="contain" testID={testID} />
  );
};

export default Image;
