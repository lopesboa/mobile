import * as React from 'react';
import {View, Animated} from 'react-native';

import theme from '../modules/theme';
import {BrandThemeContext} from './brand-theme-provider';

interface Props {
  current: number;
  total: number;
  isInnerRounded?: boolean;
  height?: number;
  backgroundColor?: string;
  topBarColor?: string;
}

const BAR_HEIGHT = 3;

class ProgressionBar extends React.PureComponent<Props> {
  percentage: Animated.Value = new Animated.Value(this.props.current / this.props.total);

  render() {
    const {current, total, height, isInnerRounded, backgroundColor, topBarColor} = this.props;
    const barHeight = height ? height : BAR_HEIGHT;
    const barRadius = isInnerRounded ? barHeight / 2 : 0;
    const barStyle = {
      height: barHeight,
      borderBottomRightRadius: barRadius,
      borderTopRightRadius: barRadius,
    };

    const barContainer = {
      backgroundColor: backgroundColor || theme.colors.gray.light,
    };

    Animated.timing(this.percentage, {
      toValue: current / total,
      useNativeDriver: false,
    }).start();

    const width = this.percentage.interpolate({
      inputRange: [0, 1],
      outputRange: ['0%', '100%'],
    });

    return (
      <BrandThemeContext.Consumer>
        {(brandTheme) => (
          <View style={barContainer} testID="progression-bar">
            <Animated.View
              style={[
                barStyle,
                {backgroundColor: topBarColor ? topBarColor : theme.colors.positive, width},
              ]}
              testID={`progression-bar-${current}`}
            />
          </View>
        )}
      </BrandThemeContext.Consumer>
    );
  }
}

export default ProgressionBar;
