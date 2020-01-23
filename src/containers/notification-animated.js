// @flow strict

import * as React from 'react';
import {Animated, View} from 'react-native';

import Notification, {DEFAULT_HEIGHT as DEFAULT_HEIGHT_BASE} from '../components/notification';

export const DEFAULT_HEIGHT = DEFAULT_HEIGHT_BASE;

type Props = {|
  height?: number,
  testID?: string,
  style?: ViewStyleProp
|};

class NotificationAnimated extends React.PureComponent<$ReadOnly<Props>> {
  props: $ReadOnly<Props>;

  bounce: Animated.Value = new Animated.Value(0);

  componentDidMount() {
    Animated.loop(
      Animated.sequence([
        Animated.timing(this.bounce, {toValue: 0, duration: 0}),
        Animated.timing(this.bounce, {
          toValue: 1,
          duration: 1000
        }),
        Animated.delay(2000)
      ])
    ).start();
  }

  render() {
    const {height = DEFAULT_HEIGHT, testID, style} = this.props;

    const translateY = this.bounce.interpolate({
      inputRange: [0, 0.2, 0.4, 0.43, 0.53, 0.7, 0.8, 0.9, 1],
      outputRange: [0, 0, -height / 1.5, -height / 1.5, 0, -height / 6, 0, -height / 10, 0]
    });

    return (
      <View style={style}>
        <Animated.View style={[{transform: [{translateY}]}]}>
          <Notification testID={testID} />
        </Animated.View>
      </View>
    );
  }
}

export default NotificationAnimated;
