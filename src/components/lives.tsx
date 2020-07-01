import * as React from 'react';
import {Animated, View, StyleSheet, Easing} from 'react-native';
import {
  NovaSolidVoteRewardsVoteHeart as HeartIcon,
  NovaSolidAudioAudioControlFastForward as FastForward,
  NovaCompositionCoorpacademyBrokenHeart as HeartBrokenIcon,
  NovaCompositionCoorpacademyVoteHeartOutline as HeartOutlineIcon,
} from '@coorpacademy/nova-icons';

import theme from '../modules/theme';
import Text from './text';

const GOD_MODE_TEXT = '∞';
const HEART_OFFSET_RIGHT = 0.4;
const PLACEHOLDER_COLOR = theme.colors.gray.light;
const MAX_SCALE_X = 1.6;
const MAX_SCALE_Y = 1.4;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  heart: {
    position: 'absolute',
  },
  lives: {
    flex: 1,
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.thumbnail,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  livesPlaceholder: {
    backgroundColor: PLACEHOLDER_COLOR,
  },
  text: {
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.gray.dark,
    textAlign: 'center',
  },
  textContainer: {
    alignItems: 'center',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  textAnimated: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },
  heartIcon: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  fastSlide: {
    position: 'absolute',
    top: 0,
    marginTop: theme.spacing.micro,
  },
});

export type AnimationDirection = 'top' | 'bottom';

export interface Props {
  count?: number;
  height: number;
  animationDirection?: AnimationDirection;
  maxScaleX?: number;
  isGodModeEnabled?: boolean;
  isFastSlideEnabled?: boolean;
  onAnimate?: (direction: AnimationDirection | void) => void;
  testID?: string;
}

class Lives extends React.PureComponent<Props> {
  shake: Animated.Value = new Animated.Value(0);

  scale: Animated.Value = new Animated.Value(0);

  broken: Animated.Value = new Animated.Value(0);

  textTranslate: Animated.Value = new Animated.Value(0);

  componentDidMount() {
    this.animate();
  }

  componentDidUpdate(prevProps: Props) {
    this.animate();
  }

  animate = () => {
    const {animationDirection, onAnimate} = this.props;

    this.resetAnimation();

    if (animationDirection === 'top') {
      this.winLife();
    } else if (animationDirection === 'bottom') {
      this.loseLife();
    }

    onAnimate && onAnimate(animationDirection);
  };

  resetAnimation = () =>
    Animated.sequence([
      Animated.timing(this.textTranslate, {toValue: 0, duration: 0, useNativeDriver: false}),
      Animated.timing(this.broken, {toValue: 0, duration: 0, useNativeDriver: false}),
      Animated.timing(this.shake, {toValue: 0, duration: 0, useNativeDriver: false}),
      Animated.timing(this.scale, {toValue: 0, duration: 0, useNativeDriver: false}),
    ]);

  loseLife = () => {
    Animated.sequence([
      Animated.timing(this.shake, {
        toValue: 1,
        useNativeDriver: false,
      }),
      Animated.delay(350),
      Animated.parallel([
        Animated.delay(500),
        Animated.timing(this.textTranslate, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: false,
          easing: Easing.out(Easing.poly(3)),
        }),
        Animated.timing(this.shake, {toValue: 0, duration: 0, useNativeDriver: false}),
        Animated.timing(this.shake, {
          toValue: 1,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(this.scale, {
          toValue: 1,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.sequence([
          Animated.delay(0.6 * 200),
          Animated.timing(this.broken, {
            toValue: 1,
            duration: 0.2 * 200,
            useNativeDriver: false,
          }),
        ]),
      ]),
    ]).start();
  };

  winLife = () => {
    Animated.sequence([
      Animated.parallel([
        Animated.sequence([
          Animated.delay(1000),
          Animated.timing(this.textTranslate, {
            toValue: 1,
            duration: 2200,
            useNativeDriver: false,
            easing: Easing.out(Easing.poly(5)),
          }),
        ]),
        Animated.timing(this.scale, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: false,
        }),
        Animated.timing(this.broken, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: false,
        }),
      ]),
    ]).start();
  };

  render() {
    const {
      count,
      height,
      testID = 'lives',
      maxScaleX = 0,
      isGodModeEnabled,
      isFastSlideEnabled,
      animationDirection,
    } = this.props;

    const heartHeight = height * 0.6;
    const fastSlideIconHeight = height * 0.4;
    const heartIconStyle = {height: heartHeight, width: heartHeight};
    const fastSlideIconStyle = {height: fastSlideIconHeight, width: fastSlideIconHeight};
    const offsetLeft = (heartHeight * maxScaleX) / 2;
    const heartColor =
      (count === undefined && PLACEHOLDER_COLOR) ||
      (isGodModeEnabled && theme.colors.positive) ||
      theme.colors.negative;
    const containerStyle = {
      paddingLeft: heartHeight * (1 - HEART_OFFSET_RIGHT) + offsetLeft,
      width: height + heartHeight * (1 - HEART_OFFSET_RIGHT) + offsetLeft,
      height,
    };
    const fastSlideStyle = {
      paddingLeft: heartHeight * (1 - HEART_OFFSET_RIGHT) + offsetLeft,
    };
    const livesStyle = {
      width: height,
      height,
    };
    const textStyle = {
      fontSize: height / 3,
    };

    const translateX = this.shake.interpolate({
      inputRange: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
      outputRange: [0, -2, 2, -2, 2, -2, 2, -2, 2, -2, 0],
    });
    const scaleX = this.scale.interpolate({
      inputRange: [0, 0.8, 0.95, 1],
      outputRange: [1, MAX_SCALE_X, 0.9, 1],
    });
    const scaleY = this.scale.interpolate({
      inputRange: [0, 0.8, 0.95, 1],
      outputRange: [1, MAX_SCALE_Y, 0.9, 1],
    });
    const heartOpacity = this.broken.interpolate({
      inputRange: [0, 1],
      outputRange: animationDirection === 'top' ? [0, 1] : [1, 0],
    });
    const heartBrokenOpacity = this.broken.interpolate({
      inputRange: [0, 1],
      outputRange: animationDirection === 'top' ? [1, 0] : [0, 1],
    });
    const textTranslateY = this.textTranslate.interpolate({
      inputRange: [0, 1],
      outputRange: (animationDirection === 'bottom' && [0, -height]) ||
        (animationDirection === 'top' && [-height, 0]) || [0, 0],
    });

    const heartStyle = {
      height: heartHeight,
      width: heartHeight,
      transform: [{translateX}, {scaleX}, {scaleY}],
      left: offsetLeft,
    };

    const countSuffix = (count !== undefined && `-${count}`) || '';
    const brokenSuffix = (animationDirection === 'bottom' && '-broken') || '';

    return (
      <View style={[styles.container, containerStyle]} testID={testID}>
        <View
          style={[styles.lives, count === undefined && styles.livesPlaceholder, livesStyle]}
          testID={`${testID}${countSuffix}${brokenSuffix}`}
        >
          {count !== undefined && isGodModeEnabled ? (
            <View style={styles.textContainer}>
              <Text style={[styles.text, textStyle]}>{GOD_MODE_TEXT}</Text>
            </View>
          ) : null}
          {count !== undefined && !isGodModeEnabled ? (
            <Animated.View
              style={[styles.textAnimated, {transform: [{translateY: textTranslateY}]}]}
            >
              <View style={styles.textContainer}>
                <Text style={[styles.text, textStyle]}>
                  x{animationDirection === 'bottom' ? count + 1 : count}
                </Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={[styles.text, textStyle]}>
                  x{animationDirection === 'bottom' ? count : count - 1}
                </Text>
              </View>
            </Animated.View>
          ) : null}
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
                opacity: heartOpacity,
              },
            ]}
          >
            <HeartIcon color={heartColor} style={heartIconStyle} />
          </Animated.View>
          <Animated.View
            style={[
              styles.heartIcon,
              {
                opacity: heartBrokenOpacity,
              },
            ]}
          >
            <HeartBrokenIcon color={heartColor} style={heartIconStyle} />
          </Animated.View>
        </Animated.View>
        {isFastSlideEnabled ? (
          <View style={[styles.fastSlide, fastSlideStyle]}>
            <FastForward color={theme.colors.gray.dark} style={fastSlideIconStyle} />
          </View>
        ) : null}
      </View>
    );
  }
}

export default Lives;
