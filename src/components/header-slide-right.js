// @flow

import * as React from 'react';
import {View, StyleSheet} from 'react-native';

import {HEADER_HEIGHT} from '../navigator/navigation-options';
import theme from '../modules/theme';
import Lives from './lives';

type Props = {|
  count: number
|};

const LIVES_VERTICAL_PADDING = theme.spacing.tiny;

const styles = StyleSheet.create({
  lives: {
    paddingVertical: LIVES_VERTICAL_PADDING,
    paddingHorizontal: theme.spacing.small,
    backgroundColor: theme.colors.gray.light
  }
});

const HeaderSlideRight = ({count}: Props) => (
  <View style={styles.lives}>
    <Lives count={count} height={HEADER_HEIGHT - LIVES_VERTICAL_PADDING * 2} />
  </View>
);

export default HeaderSlideRight;
