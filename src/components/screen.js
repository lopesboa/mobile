// @flow strict

import * as React from 'react';
import {StyleSheet, ScrollView, View} from 'react-native';
import {SafeAreaView} from 'react-navigation';

import theme from '../modules/theme';

type Props = {|
  style?: GenericStyleProp,
  noScroll?: boolean,
  children: React.Node,
|};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: theme.colors.white,
    flex: 1,
  },
  screenScroll: {
    flexGrow: 1,
  },
});

const Screen = ({style, noScroll, children}: Props) => (
  <SafeAreaView style={[styles.screen, style]}>
    {noScroll ? (
      <View style={styles.screenScroll}>{children}</View>
    ) : (
      <ScrollView contentContainerStyle={styles.screenScroll}>{children}</ScrollView>
    )}
  </SafeAreaView>
);

export default Screen;
