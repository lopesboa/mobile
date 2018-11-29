// @flow

import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import type {SpaceType} from '../types';
import {SPACE} from '../const';
import theme from '../modules/theme';

type Props = {|
  type?: SpaceType,
|};

const styles = StyleSheet.create({
  tiny: {
    width: theme.spacing.tiny,
    height: theme.spacing.tiny,
  },
  small: {
    width: theme.spacing.small,
    height: theme.spacing.small,
  },
  base: {
    width: theme.spacing.base,
    height: theme.spacing.base,
  },
  large: {
    width: theme.spacing.large,
    height: theme.spacing.large,
  },
});

const Space = ({type}: Props) => {
  switch (type) {
    case SPACE.SMALL:
      return <View style={styles.small} />;
    case SPACE.BASE:
      return <View style={styles.base} />;
    case SPACE.LARGE:
      return <View style={styles.large} />;
    default:
      return <View style={styles.tiny} />;
  }
};

export default Space;
