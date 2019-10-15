// @flow

import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import LottieView from 'lottie-react-native';

import animation from '../assets/animations/heart';

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden'
  }
});

type Props = {|
  height: number
|};

const Heart = ({height}: Props) => (
  <View style={styles.container}>
    <LottieView source={animation} autoPlay loop style={{height, width: height}} />
  </View>
);

export default Heart;
