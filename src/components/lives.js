// @flow strict

import * as React from 'react';
import {Animated, View, StyleSheet} from 'react-native';
import {
  NovaSolidVoteRewardsVoteHeart as HeartIcon,
  NovaCompositionCoorpacademyBrokenHeart as HeartBrokenIcon,
  NovaCompositionCoorpacademyVoteHeartOutline as HeartOutlineIcon
} from '@coorpacademy/nova-icons';

import theme from '../modules/theme';
import Text from './text';

export type Props = {|
  count: number,
  height: number,
  winningLife?: boolean,
  isBroken?: boolean,
  testID?: string,
  translateX?: Animated.Interpolation,
  textTranslateY?: Animated.Interpolation,
  scaleX?: Animated.Interpolation,
  scaleY?: Animated.Interpolation,
  heartOpacity?: Animated.Interpolation,
  heartBrokenOpacity?: Animated.Interpolation,
  maxScaleX?: number,
  isGodMode: boolean
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
  }
});

const Lives = ({
  count,
  winningLife = false,
  height,
  isBroken,
  testID = 'lives',
  translateX,
  textTranslateY,
  scaleX,
  scaleY,
  heartOpacity,
  heartBrokenOpacity,
  maxScaleX = 0,
  isGodMode
}: Props) => {
  const heartHeight = height * 0.6;
  const heartIconStyle = {height: heartHeight, width: heartHeight};
  const offsetLeft = (heartHeight * maxScaleX) / 2;
  const heartColor = (isGodMode && theme.colors.positive) || theme.colors.negative;
  const containerStyle = {
    paddingLeft: heartHeight * (1 - HEART_OFFSET_RIGHT) + offsetLeft,
    width: height + heartHeight * (1 - HEART_OFFSET_RIGHT) + offsetLeft,
    height
  };
  const transform = [];
  const textTransform = [];
  if (translateX) {
    transform.push({translateX});
  }
  if (scaleX) {
    transform.push({scaleX});
  }
  if (scaleY) {
    transform.push({scaleY});
  }
  if (textTranslateY) {
    textTransform.push({translateY: textTranslateY});
  }

  const heartStyle = {
    height: heartHeight,
    width: heartHeight,
    transform,
    left: offsetLeft
  };
  const livesStyle = {
    width: height,
    height,
    overflow: 'hidden'
  };
  const textStyle = {
    fontSize: height / 3,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.gray.dark,
    textAlign: 'center'
  };
  const animatedTextStyle = {
    transform: textTransform,
    width: '100%',
    height: '100%',
    alignItems: 'center'
  };

  const textWrapper = {
    alignItems: 'center',
    width: '100%',
    height: '100%',
    justifyContent: 'center'
  };

  const brokenSuffix = isBroken ? '-broken' : '';
  const topText = (isGodMode && '∞') || winningLife ? count - 1 : count;
  const bottomText = winningLife ? count : count + 1;

  return (
    <View style={[styles.container, containerStyle]} testID={testID}>
      <View style={[styles.lives, livesStyle]} testID={`${testID}-${count}${brokenSuffix}`}>
        <Animated.View style={animatedTextStyle}>
          <View style={textWrapper}>
            <Text style={textStyle}>x{topText}</Text>
          </View>
          <View style={textWrapper}>
            <Text style={textStyle}>x{bottomText}</Text>
          </View>
        </Animated.View>
      </View>
      <Animated.View style={[styles.heart, heartStyle]}>
        <HeartOutlineIcon
          color={theme.colors.white}
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
          <HeartIcon color={heartColor} style={heartIconStyle} />
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
