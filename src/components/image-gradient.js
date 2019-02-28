// @flow

import * as React from 'react';
import {StyleSheet, ImageBackground} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

type Props = {|
  children: React.Node,
  image: File | {uri: string},
  testID: string,
  gradient?: Array<string>,
  minHeight?: number,
  style?: GenericStyleProp
|};

const styles = StyleSheet.create({
  content: {
    flex: 1
  }
});

const ImageGradient = ({
  image,
  children,
  style,
  gradient = ['rgba(0,0,0,0)', 'rgba(0,0,0,0)', 'rgba(0,0,0,0.9)'],
  minHeight = 205,
  testID
}: Props) => {
  return (
    <ImageBackground
      testID={`background-image-${testID}`}
      source={image}
      style={[styles.content, {minHeight: minHeight}]}
    >
      <LinearGradient
        testID={`gradient-${testID}`}
        colors={gradient}
        style={[styles.content, style]}
      >
        {children}
      </LinearGradient>
    </ImageBackground>
  );
};

export default ImageGradient;
