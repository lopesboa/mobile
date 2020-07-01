import * as React from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import {
  NovaCompositionCoorpacademyBrokenHeart as HeartBrokenIcon,
  NovaCompositionCoorpacademyVoteHeartOutline as HeartOutlineIcon,
} from '@coorpacademy/nova-icons';

import theme from '../modules/theme';

export interface Props {
  style?: ViewStyle;
  testID?: string;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heart: {
    position: 'absolute',
    width: '50%',
    height: '50%',
  },
  brokenHeart: {
    width: '53%',
    height: '53%',
  },
});

const HeartBroken = ({testID, style}: Props) => {
  return (
    <View style={[styles.container, style]} testID={testID}>
      <HeartOutlineIcon color={theme.colors.white} style={styles.heart} />
      <HeartBrokenIcon color={theme.colors.negative} style={styles.brokenHeart} />
    </View>
  );
};

export default HeartBroken;
