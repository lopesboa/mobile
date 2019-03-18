// @flow

import * as React from 'react';
import {View, StyleSheet, Image} from 'react-native';

import Gradient from '../components/gradient';
import theme, {BLUE_COORP_DARK, BLUE_COORP_LIGHT} from '../modules/theme';

const styles: GenericStyleProp = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  wrapper: {
    padding: theme.spacing.base
  },
  logo: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  logoImg: {
    width: 192,
    height: 105
  }
});

const SplashScreen = () => {
  return (
    <Gradient colors={[BLUE_COORP_DARK, BLUE_COORP_LIGHT]} style={styles.container}>
      <View style={[styles.wrapper, styles.logo]} testID="logo-header">
        <Image source={require('../assets/images/logo.png')} style={styles.logoImg} />
      </View>
    </Gradient>
  );
};

export default SplashScreen;
