// @flow

import * as React from 'react';
import {StyleSheet, ImageBackground} from 'react-native';

import Gradient from './gradient';

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
  gradient = ['rgba(0,0,0,0)', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,1)'],
  minHeight = 205,
  testID
}: Props) => {
  return (
    <ImageBackground
      testID={`background-image-${testID}`}
      source={image}
      style={[styles.content, {minHeight: minHeight}]}
    >
      <Gradient testID={`gradient-${testID}`} colors={gradient} style={[styles.content, style]}>
        {children}
      </Gradient>
    </ImageBackground>
  );
};

export default ImageGradient;
