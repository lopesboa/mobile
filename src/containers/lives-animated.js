// @flow

import * as React from 'react';
import {Animated} from 'react-native';

import Lives from '../components/lives';

type Props = {|
  count: number,
  height: number,
  isBroken?: boolean,
  testID?: string
|};

class LivesAnimated extends React.PureComponent<Props> {
  props: Props;

  shake: Animated.Value = new Animated.Value(0);

  scale: Animated.Value = new Animated.Value(0);

  broken: Animated.Value = new Animated.Value(0);

  componentDidUpdate(prevProps: Props) {
    if (this.props.count < prevProps.count) {
      this.loseLife();
    }
  }

  loseLife = () => {
    Animated.sequence([
      Animated.timing(this.broken, {toValue: 0, duration: 0}),
      Animated.timing(this.shake, {toValue: 0, duration: 0}),
      Animated.timing(this.shake, {
        toValue: 1
      }),
      Animated.delay(350),
      Animated.parallel([
        Animated.timing(this.shake, {toValue: 0, duration: 0}),
        Animated.timing(this.shake, {
          toValue: 1,
          duration: 200
        }),
        Animated.timing(this.scale, {toValue: 0, duration: 0}),
        Animated.timing(this.scale, {
          toValue: 1,
          duration: 200
        }),
        Animated.sequence([
          Animated.delay(0.6 * 200),
          Animated.timing(this.broken, {
            toValue: 1,
            duration: 0.2 * 200
          })
        ])
      ])
    ]).start();
  };

  render() {
    const {count, height, isBroken, testID} = this.props;

    const translateX = this.shake.interpolate({
      inputRange: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
      outputRange: [0, -2, 2, -2, 2, -2, 2, -2, 2, -2, 0]
    });
    const scaleX = this.scale.interpolate({
      inputRange: [0, 0.8, 0.95, 1],
      outputRange: [1, 1.6, 0.9, 1]
    });
    const scaleY = this.scale.interpolate({
      inputRange: [0, 0.8, 0.95, 1],
      outputRange: [1, 1.4, 0.9, 1]
    });
    const heartOpacity = this.broken.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0]
    });

    const heartBrokenOpacity = this.broken.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1]
    });

    return (
      <Lives
        count={count}
        height={height}
        isBroken={isBroken}
        testID={testID}
        translateX={translateX}
        scaleX={scaleX}
        scaleY={scaleY}
        heartOpacity={heartOpacity}
        heartBrokenOpacity={heartBrokenOpacity}
      />
    );
  }
}

export default LivesAnimated;
