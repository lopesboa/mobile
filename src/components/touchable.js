// @flow

import * as React from 'react';
import {TouchableOpacity, TouchableHighlight} from 'react-native';
import type {Props as TouchableGenericProps} from 'react-native/Libraries/Components/Touchable/TouchableWithoutFeedback';

import {ANALYTICS_EVENT_TYPE} from '../const';
import type {AnalyticsEventParams} from '../types';
import withAnalytics from '../containers/with-analytics';
import type {WithAnalyticsProps} from '../containers/with-analytics';
import withVibration from '../containers/with-vibration';
import type {WithVibrationProps} from '../containers/with-vibration';

type OwnProps = {|
  isHighlight?: boolean,
  isWithoutFeedback?: boolean,
  // for TouchableOpacity
  activeOpacity?: number,
  style?: ViewStyleProp,
  // Analytics
  analyticsID: string,
  analyticsParams?: AnalyticsEventParams
|};

type Props = TouchableGenericProps & WithAnalyticsProps & WithVibrationProps & OwnProps;

class Touchable extends React.PureComponent<$ReadOnly<Props>> {
  props: $ReadOnly<Props>;

  handlePress: $PropertyType<Props, 'onPress'> = event => {
    const {vibration, analytics, analyticsID, analyticsParams, onPress} = this.props;

    if (!onPress) {
      return;
    }

    vibration.vibrate();

    analytics &&
      analytics.logEvent(ANALYTICS_EVENT_TYPE.PRESS, {
        ...(analyticsParams || {}),
        id: analyticsID
      });

    onPress(event);
  };

  handleLongPress: $PropertyType<Props, 'onPress'> = event => {
    const {vibration, analytics, analyticsID, analyticsParams, onLongPress} = this.props;

    if (!onLongPress) {
      return;
    }

    vibration.vibrate();

    analytics &&
      analytics.logEvent(ANALYTICS_EVENT_TYPE.LONG_PRESS, {
        ...(analyticsParams || {}),
        id: analyticsID
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
export default withVibration<OwnProps & WithAnalyticsProps>(withAnalytics<OwnProps>(Touchable));
