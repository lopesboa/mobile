import * as React from 'react';
import {TouchableOpacity, TouchableHighlight, ViewStyle} from 'react-native';
import type {
  BlurEvent,
  LayoutEvent,
  FocusEvent,
  PressEvent,
} from 'react-native/Libraries/Types/CoreEventTypes';

import theme from '../modules/theme';
import {ANALYTICS_EVENT_TYPE} from '../const';
import type {AnalyticsEventParams} from '../types';
import withAnalytics from '../containers/with-analytics';
import type {WithAnalyticsProps} from '../containers/with-analytics';
import withVibration from '../containers/with-vibration';
import type {WithVibrationProps} from '../containers/with-vibration';

interface Props extends WithAnalyticsProps, WithVibrationProps {
  accessible?: boolean;
  children?: React.ReactNode;
  delayLongPress?: number;
  delayPressIn?: number;
  delayPressOut?: number;
  disabled?: boolean;
  focusable?: boolean;
  hitSlop?: number /* TODO: fix type EdgeInsetsProp,*/;
  onBlur?: (event: BlurEvent) => unknown;
  onFocus?: (event: FocusEvent) => unknown;
  onLayout?: (event: LayoutEvent) => unknown;
  onLongPress?: (event: PressEvent) => unknown;
  onPress?: (event: PressEvent) => unknown;
  onPressIn?: (event: PressEvent) => unknown;
  onPressOut?: (event: PressEvent) => unknown;
  testID?: string;
  isHighlight?: boolean;
  isWithoutFeedback?: boolean;
  // for TouchableOpacity
  activeOpacity?: number;
  style?: ViewStyle;
  // Analytics
  analyticsID: string;
  analyticsParams?: AnalyticsEventParams;
}

class Touchable extends React.PureComponent<Props> {
  handlePress: Pick<Props, 'onPress'> = (event: PressEvent) => {
    const {vibration, analytics, analyticsID, analyticsParams, onPress} = this.props;

    if (!onPress) {
      return;
    }

    vibration.vibrate();

    analytics &&
      analytics.logEvent(ANALYTICS_EVENT_TYPE.PRESS, {
        ...(analyticsParams || {}),
        id: analyticsID,
      });

    onPress(event);
  };

  handleLongPress: Pick<Props, 'onPress'> = (event: PressEvent) => {
    const {vibration, analytics, analyticsID, analyticsParams, onLongPress} = this.props;

    if (!onLongPress) {
      return;
    }

    vibration.vibrate();

    analytics?.logEvent(ANALYTICS_EVENT_TYPE.LONG_PRESS, {
      ...(analyticsParams || {}),
      id: analyticsID,
    });

    onLongPress(event);
  };

  render() {
    const {
      /* only used by this component */
      /* eslint-disable no-unused-vars */
      vibration,
      analytics,
      analyticsID,
      analyticsParams,
      onPress,
      onLongPress,
      /* eslint-enable no-unused-vars */
      isWithoutFeedback,
      isHighlight,
      activeOpacity,
      ...props
    } = this.props;
    const {disabled} = props;

    if (isHighlight) {
      return (
        <TouchableHighlight
          {...props}
          underlayColor={theme.colors.gray.light}
          onPress={this.handlePress}
          onLongPress={this.handleLongPress}
          activeOpacity={activeOpacity || (disabled ? 1 : 0.85)}
        />
      );
    }

    return (
      <TouchableOpacity
        {...props}
        onPress={this.handlePress}
        onLongPress={this.handleLongPress}
        activeOpacity={(isWithoutFeedback && 1) || activeOpacity || (disabled ? 1 : 0.2)}
      />
    );
  }
}

export {Touchable as Component};
export default withVibration(withAnalytics(Touchable));
