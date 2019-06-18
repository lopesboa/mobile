// @flow strict

import * as React from 'react';
import {Animated, StyleSheet} from 'react-native';

type Props = {|
  color: string,
  translateY?: Animated.Interpolation,
  testID?: string
|};

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    borderTopLeftRadius: 300,
    borderTopRightRadius: 300,
    transform: [{scaleX: 2}]
  }
});

const RoundedFooter = ({color, translateY, testID}: Props) => {
  const footerStyle = {
    backgroundColor: color,
    bottom: translateY
  };

  return <Animated.View style={[styles.footer, footerStyle]} testID={testID} />;
};
export default RoundedFooter;
