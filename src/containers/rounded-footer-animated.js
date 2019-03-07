// @flow

import * as React from 'react';
import {Animated, Easing} from 'react-native';
import type {AnimationType} from '../types';
import {ANIMATION_TYPE} from '../const';

import RoundedFooter from '../components/rounded-footer';

type Props = {|
  color: string,
  testID?: string,
  animationType?: AnimationType
|};

class RoundedFooterAnimated extends React.PureComponent<Props> {
  props: Props;

  footerAnim: Animated.Value = new Animated.Value(0);

  componentDidMount() {
    this.animateFooter();
  }

  componentDidUpdate(prevProps: Props) {
    this.animateFooter();
  }

  animateFooter = () => {
    Animated.timing(this.footerAnim, {
      toValue: 1,
      duration: 1250,
      easing: Easing.out(Easing.poly(5))
    }).start();
  };

  render() {
    const {color, testID, animationType} = this.props;

    const translateY =
      animationType === ANIMATION_TYPE.IN
        ? this.footerAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ['-300%', '-50%']
          })
        : this.footerAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ['-60%', '-300%']
          });

    return <RoundedFooter color={color} translateY={translateY} testID={testID} />;
  }
}

export default RoundedFooterAnimated;
