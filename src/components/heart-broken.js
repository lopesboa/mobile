// @flow strict

import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import {
  NovaCompositionCoorpacademyBrokenHeart as HeartBrokenIcon,
  NovaCompositionCoorpacademyVoteHeartOutline as HeartOutlineIcon
} from '@coorpacademy/nova-icons';

import withDarkMode from '../containers/with-dark-mode';
import type {WithDarkModeProps} from '../containers/with-dark-mode';
import theme from '../modules/theme';

export type Props = {|
  ...WithDarkModeProps,
  style?: ViewStyleProp,
  testID?: string
|};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  heart: {
    position: 'absolute',
    width: '50%',
    height: '50%'
  },
  brokenHeart: {
    width: '53%',
    height: '53%'
  }
});

const HeartBroken = ({testID, style, isDarkModeActivated}: Props) => {
  return (
    <View style={[styles.container, style]} testID={testID}>
      <HeartOutlineIcon
        color={isDarkModeActivated ? '#212121' : theme.colors.white}
        style={styles.heart}
      />
      <HeartBrokenIcon color={theme.colors.negative} style={styles.brokenHeart} />
    </View>
  );
};

export {HeartBroken as Component};
export default withDarkMode(HeartBroken);
