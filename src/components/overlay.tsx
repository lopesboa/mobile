import * as React from 'react';
import {View, StyleSheet} from 'react-native';

interface Props {
  children?: React.ReactNode;
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const Overlay = ({children}: Props) => <View style={styles.container}>{children}</View>;

export default Overlay;
