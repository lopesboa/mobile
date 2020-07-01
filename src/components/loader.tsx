import * as React from 'react';
import {Animated, StyleSheet, Easing} from 'react-native';

import type {CompositeAnimation} from 'react-native/Libraries/Animated/src/AnimatedImplementation';
import theme from '../modules/theme';
import {BrandThemeContext} from './brand-theme-provider';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    position: 'absolute',
  },
  red: {
    backgroundColor: theme.colors.negative,
  },
  green: {
    backgroundColor: theme.colors.positive,
  },
  yellow: {
    backgroundColor: theme.colors.battle,
  },
});

interface Props {
  height?: number;
}

const CYCLE_DURATION = 3000;

class Loader extends React.PureComponent<Props> {
  animation: CompositeAnimation;

  scale: Animated.Value = new Animated.Value(0);

  rotation: Animated.Value = new Animated.Value(0);

  componentDidMount() {
    this.animation = Animated.parallel([
      Animated.loop(
        Animated.sequence([
          Animated.timing(this.scale, {toValue: 0, duration: 0, useNativeDriver: false}),
          Animated.timing(this.scale, {
            toValue: 1,
            duration: CYCLE_DURATION,
            useNativeDriver: false,
            easing: Easing.inOut(Easing.sin),
          }),
          Animated.timing(this.scale, {
            toValue: 2,
            duration: CYCLE_DURATION,
            useNativeDriver: false,
            easing: Easing.inOut(Easing.sin),
          }),
          Animated.timing(this.scale, {
            toValue: 3,
            duration: CYCLE_DURATION,
            useNativeDriver: false,
            easing: Easing.inOut(Easing.sin),
          }),
        ]),
      ),
      Animated.loop(
        Animated.sequence([
          Animated.timing(this.rotation, {toValue: 0, duration: 0, useNativeDriver: false}),
          Animated.timing(this.rotation, {
            toValue: 1,
            duration: CYCLE_DURATION,
            useNativeDriver: false,
            easing: Easing.inOut(Easing.sin),
          }),
        ]),
      ),
    ]);

    this.animation.start();
  }

  componentWillUnmount() {
    this.animation.stop();
  }

  render() {
    const {height = 60} = this.props;

    const scale = this.scale.interpolate({
      inputRange: [0, 0.45, 1, 1.32, 1.5, 2, 2.3, 2.64, 3],
      outputRange: [0.5, 0.2, 0.5, 0.5, 0.8, 0.5, 0.5, 0.3, 0.5],
    });
    const rotation = this.rotation.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });
    const dotWidth = this.rotation.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [height / 2, height / 6, height / 2],
    });
    const dotTranslate = this.rotation.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [-25 * (height / 60), -35 * (height / 60), -25 * (height / 60)],
    });
    const dotStyle = {
      width: dotWidth,
      height: height / 6,
      borderRadius: height / 12,
    };

    return (
      <BrandThemeContext.Consumer>
        {(brandTheme) => (
          <Animated.View
            style={[
              styles.container,
              {
                height,
                width: height,
                transform: [{scaleX: scale}, {scaleY: scale}, {rotateZ: rotation}],
              },
            ]}
          >
            <Animated.View
              style={[
                styles.dot,
                styles.red,
                dotStyle,
                {transform: [{rotateZ: '45deg'}, {translateX: dotTranslate}]},
              ]}
            />
            <Animated.View
              style={[
                styles.dot,
                styles.green,
                dotStyle,
                {transform: [{rotateZ: '135deg'}, {translateX: dotTranslate}]},
              ]}
            />
            <Animated.View
              style={[
                styles.dot,
                styles.yellow,
                dotStyle,
                {transform: [{rotateZ: '225deg'}, {translateX: dotTranslate}]},
              ]}
            />
            <Animated.View
              style={[
                styles.dot,
                {backgroundColor: brandTheme.colors.primary},
                dotStyle,
                {transform: [{rotateZ: '315deg'}, {translateX: dotTranslate}]},
              ]}
            />
          </Animated.View>
        )}
      </BrandThemeContext.Consumer>
    );
  }
}

export default Loader;
