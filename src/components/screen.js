// @flow strict

import * as React from 'react';
import {StyleSheet, ScrollView, View} from 'react-native';
import {SafeAreaView} from 'react-navigation';
import theme from '../modules/theme';

type Props = {|
  style?: GenericStyleProp,
  noScroll?: boolean,
  children: React.Node,
  testID?: string,
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

const Screen = ({style, noScroll, children, testID}: Props) => (
  <SafeAreaView style={[styles.screen, style]}>
    {noScroll ? (
      <View style={styles.screenScroll} testID={testID}>
        {children}
      </View>
    ) : (
      <ScrollView
        contentContainerStyle={styles.screenScroll}
        showsHorizontalScrollIndicator={false}
        testID={testID}
      >
        {children}
      </ScrollView>
    )}
  </SafeAreaView>
);

export default Screen;
