import * as React from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import LottieView from 'lottie-react-native';
import animation from '../assets/animations/trophy';

export interface Props {
  style?: ViewStyle;
  testID?: string;
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    top: -30,
  },
  trophy: {
    flexGrow: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
});

const Trophy = ({testID, style}: Props) => {
  return (
    <View style={[styles.container, style]} testID={testID}>
      <LottieView source={animation} autoPlay loop={false} style={styles.trophy} />
    </View>
  );
};

export default Trophy;
