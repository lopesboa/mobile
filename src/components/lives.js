// @flow strict

import * as React from 'react';
import {Animated, View, Text, StyleSheet} from 'react-native';
import {
  NovaSolidVoteRewardsVoteHeart as HeartIcon,
  NovaCompositionCoorpacademyBrokenHeart as HeartBrokenIcon,
  NovaCompositionCoorpacademyVoteHeartOutline as HeartOutlineIcon
} from '@coorpacademy/nova-icons';

import theme from '../modules/theme';

export type Props = {|
  count: number,
  height: number,
  isBroken?: boolean,
  testID?: string,
  translateX?: Animated.Interpolation,
  scaleX?: Animated.Interpolation,
  scaleY?: Animated.Interpolation,
  heartOpacity?: Animated.Interpolation,
  heartBrokenOpacity?: Animated.Interpolation,
  maxScaleX?: number
|};

const HEART_OFFSET_RIGHT = 0.4;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center'
  },
  heart: {
    position: 'absolute'
  },
  lives: {
    flex: 1,
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.thumbnail,
    alignItems: 'center',
    justifyContent: 'center'
  },
  heartIcon: {
    position: 'absolute',
    top: 0,
    left: 0
  },
  text: {
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.gray.dark
  }
});

const Lives = ({
  count,
  height,
  isBroken,
  testID = 'lives',
  translateX,
  scaleX,
  scaleY,
  heartOpacity,
  heartBrokenOpacity,
  maxScaleX = 0
}: Props) => {
  const heartHeight = height * 0.6;
  const heartIconStyle = {height: heartHeight, width: heartHeight};
  const offsetLeft = (heartHeight * maxScaleX) / 2;
  const containerStyle = {
    paddingLeft: heartHeight * (1 - HEART_OFFSET_RIGHT) + offsetLeft,
    width: height + heartHeight * (1 - HEART_OFFSET_RIGHT) + offsetLeft,
    height
  };
  const transform = [];
  if (translateX) {
    transform.push({translateX});
  }
  if (scaleX) {
    transform.push({scaleX});
  }
  if (scaleY) {
    transform.push({scaleY});
  }
  const heartStyle = {
    height: heartHeight,
    width: heartHeight,
    transform,
    left: offsetLeft
  };
  const livesStyle = {
    width: height,
    height
  };
  const textStyle = {
    fontSize: height / 3
  };

  const brokenSuffix = isBroken ? '-broken' : '';

  return (
    <View style={[styles.container, containerStyle]} testID={testID}>
      <View style={[styles.lives, livesStyle]} testID={`${testID}-${count}${brokenSuffix}`}>
        <Text style={[styles.text, textStyle]}>x{count}</Text>
      </View>
      <Animated.View style={[styles.heart, heartStyle]}>
        <HeartOutlineIcon
          color={theme.colors.white}
          stroke={theme.colors.white}
          style={{height: heartHeight, width: heartHeight}}
        />
        <Animated.View
          style={[
            styles.heartIcon,
            {
              opacity: heartOpacity || 1
            }
          ]}
        >
          <HeartIcon color={theme.colors.negative} style={heartIconStyle} />
        </Animated.View>
        <Animated.View
          style={[
            styles.heartIcon,
            {
              opacity: heartBrokenOpacity || 0
            }
          ]}
        >
          <HeartBrokenIcon color={theme.colors.negative} style={heartIconStyle} />
        </Animated.View>
      </Animated.View>
    </View>
  );
};

export default Lives;
