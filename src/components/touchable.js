// @flow

import * as React from 'react';
import {TouchableOpacity, TouchableWithoutFeedback, TouchableHighlight} from 'react-native';
import type {Props as TouchableGenericProps} from 'react-native/Libraries/Components/Touchable/TouchableWithoutFeedback';

import {ANALYTICS_EVENT_TYPE} from '../const';
import type {AnalyticsEventParams} from '../types';
import withAnalytics from '../containers/with-analytics';
import type {WithAnalyticsProps} from '../containers/with-analytics';

type Props = $Exact<{|
  ...TouchableGenericProps,
  ...WithAnalyticsProps,
  isHighlight?: boolean,
  isWithoutFeedback?: boolean,
  // for TouchableOpacity
  activeOpacity?: number,
  style?: GenericStyleProp,
  // Analytics
  analyticsID: string,
  analyticsParams?: AnalyticsEventParams
|}>;

class Touchable extends React.PureComponent<Props> {
  props: Props;

  handlePress = () => {
    const {analytics, analyticsID, analyticsParams, onPress} = this.props;

    if (!onPress) {
      return;
    }

    analytics &&
      analytics.logEvent(ANALYTICS_EVENT_TYPE.PRESS, {
        ...(analyticsParams || {}),
        id: analyticsID
      });

    onPress();
  };

  handleLongPress = () => {
    const {analytics, analyticsID, analyticsParams, onLongPress} = this.props;

    if (!onLongPress) {
      return;
    }

    analytics &&
      analytics.logEvent(ANALYTICS_EVENT_TYPE.LONG_PRESS, {
        ...(analyticsParams || {}),
        id: analyticsID
      });

    onLongPress();
  };

  render() {
    const {
      /* only used by this component */
      /* eslint-disable no-unused-vars */
      analytics,
      analyticsID,
      analyticsParams,
      onPress,
      onLongPress,
      /* eslint-enable no-unused-vars */
      isWithoutFeedback,
      isHighlight,
      ...props
    } = this.props;
    const {
      /* eslint-disable no-unused-vars */
      activeOpacity,
      style,
      /* eslint-enable no-unused-vars */
      ...withoutFeedbackProps
    } = props;

    if (isWithoutFeedback) {
      return (
        <TouchableWithoutFeedback
          {...withoutFeedbackProps}
          onPress={this.handlePress}
          onLongPress={this.handleLongPress}
        />
      );
    }

    if (isHighlight) {
      return (
        <TouchableHighlight
          {...props}
          onPress={this.handlePress}
          onLongPress={this.handleLongPress}
        />
      );
    }

    return (
      <TouchableOpacity {...props} onPress={this.handlePress} onLongPress={this.handleLongPress} />
    );
  }
}

export {Touchable as Component};
export default withAnalytics(Touchable);
