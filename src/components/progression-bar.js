// @flow

import * as React from 'react';
import {View, StyleSheet, Animated} from 'react-native';

import theme from '../modules/theme';
import {BrandThemeContext} from './brand-theme-provider';

type Props = {|
  current: number,
  count: number
|};

const BAR_HEIGHT = 3;

const styles = StyleSheet.create({
  barContainer: {
    backgroundColor: theme.colors.gray.light
  },
  bar: {
    height: BAR_HEIGHT
  }
});

class ProgressionBar extends React.PureComponent<Props> {
  props: Props;

  percentage: Animated.Value = new Animated.Value(this.props.current / this.props.count);

  render() {
    const {current, count} = this.props;

    Animated.timing(this.percentage, {
      toValue: current / count
    }).start();

    const width = this.percentage.interpolate({
      inputRange: [0, 1],
      outputRange: ['0%', '100%']
    });

    return (
      <BrandThemeContext.Consumer>
        {brandTheme => (
          <View style={styles.barContainer}>
            <Animated.View
              style={[styles.bar, {backgroundColor: brandTheme.colors.primary, width}]}
              testID={`progression-bar-${current}`}
            />
          </View>
        )}
      </BrandThemeContext.Consumer>
    );
  }
}

export default ProgressionBar;
