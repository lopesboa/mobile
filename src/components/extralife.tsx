import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import {
  NovaSolidAudioAudioControlPlay as PlayIcon,
  NovaCompositionCoorpacademyVoteHeartOutline as HeartOutlineIcon,
} from '@coorpacademy/nova-icons';

import theme from '../modules/theme';
import Text from './text';

export interface Props {
  count: number;
  testID?: string;
}

const OUTLINE = 10;
const HEART_SIZE = 28;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    left: -8,
  },
  countCircle: {
    backgroundColor: theme.colors.white,
    height: 59,
    width: 59,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -OUTLINE,
  },
  count: {
    fontWeight: theme.fontWeight.bold,
    fontSize: theme.fontSize.xlarge,
    color: theme.colors.gray.dark,
  },
  heartContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 7,
  },
  heart: {
    position: 'absolute',
    height: HEART_SIZE,
    width: HEART_SIZE,
  },
  heartOutline: {
    width: HEART_SIZE + OUTLINE,
    height: HEART_SIZE + OUTLINE,
  },
  play: {
    height: 45,
    width: 45,
  },
});

const Extralife = ({testID, count}: Props) => (
  <View style={styles.container} testID={testID}>
    <PlayIcon color={theme.colors.white} style={styles.play} />
    <View style={styles.countCircle}>
      <Text style={styles.count}>+{count}</Text>
    </View>
    <View style={styles.heartContainer}>
      <HeartOutlineIcon color={theme.colors.white} style={[styles.heart, styles.heartOutline]} />
      <HeartOutlineIcon color={theme.colors.negative} style={styles.heart} />
    </View>
  </View>
);

export default Extralife;
