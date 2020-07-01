import * as React from 'react';
import {
  ImageBackground as ImageBackgroundBase,
  StyleSheet,
  ViewStyle,
  ImageStyle,
} from 'react-native';
import flattenStyle from 'react-native/Libraries/StyleSheet/flattenStyle';

import {getCleanUri} from '../modules/uri';
import {getResizedImage} from '../modules/image';
import Gradient from './gradient';

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    flex: 1,
  },
});

interface Props extends ImageStyle {
  gradient?: Array<string>;
  gradientStyle?: ViewStyle;
  testID?: string;
}

const ImageBackground = ({
  source,
  gradient,
  gradientStyle,
  style,
  testID = 'image-background',
  ...props
}: Props) => {
  // @ts-ignore this statement is enough but type is too weak
  let uri: string | void = source && source.uri;

  if (uri) {
    const {width: _width, height: _height, resizeMode} = props;
    // @ts-ignore flattenStyle returns object everytime
    const {width, height} = flattenStyle([{width: _width, height: _height}, style]);
    const maxHeight: number | void = typeof height === 'number' ? height : undefined;
    const maxWidth: number | void = typeof width === 'number' ? width : undefined;

    uri = getResizedImage(getCleanUri(uri), {
      maxHeight,
      maxWidth,
      resizeMode,
    });
  }

  const resizedSource = (uri && {uri}) || source;

  if (gradient) {
    const {children, ...remainingProps} = props;

    return (
      <ImageBackgroundBase
        {...remainingProps}
        source={resizedSource}
        style={[styles.image, style]}
        testID={testID}
      >
        <Gradient
          testID={`${testID}-gradient`}
          colors={gradient}
          style={[styles.gradient, gradientStyle]}
        >
          {children}
        </Gradient>
      </ImageBackgroundBase>
    );
  }

  return (
    <ImageBackgroundBase
      {...props}
      source={resizedSource}
      style={[styles.image, style]}
      testID={testID}
    />
  );
};

export default ImageBackground;
