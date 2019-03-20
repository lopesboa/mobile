// @flow

import * as React from 'react';
import {View, StyleSheet, Image} from 'react-native';
import {SafeAreaView} from 'react-navigation';

import logo from '../assets/images/logo.png';
import theme, {BLUE_COORP_DARK, BLUE_COORP_LIGHT} from '../modules/theme';
import Gradient from './gradient';

const styles: GenericStyleProp = StyleSheet.create({
  gradient: {
    flex: 1
  },
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

export const TOP_COLOR = BLUE_COORP_DARK;
export const BOTTOM_COLOR = BLUE_COORP_LIGHT;

const Splash = () => (
  <Gradient colors={[TOP_COLOR, BOTTOM_COLOR]} style={styles.gradient}>
    <SafeAreaView style={styles.container}>
      <View style={[styles.wrapper, styles.logo]} testID="logo-header">
        <Image source={logo} style={styles.logoImg} />
      </View>
    </SafeAreaView>
  </Gradient>
);

export default Splash;
