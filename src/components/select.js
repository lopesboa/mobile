// @flow

import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import {NovaCompositionNavigationArrowDown as ArrowDown} from '@coorpacademy/nova-icons';
import type {QuestionType} from '@coorpacademy/progression-engine';

import {ANALYTICS_EVENT_TYPE} from '../const';
import type {AnalyticsEventType} from '../types';
import theme from '../modules/theme';
import withAnalytics from '../containers/with-analytics';
import type {WithAnalyticsProps} from '../containers/with-analytics';
import ModalAnimated from '../containers/modal-animated';
import ModalSelect from './modal-select';
import type {Props as ModalSelectProps} from './modal-select';
import Space from './space';
import Touchable from './touchable';
import Text from './text';

export type Props = {|
  ...WithAnalyticsProps,
  analyticsID: string,
  questionType: QuestionType,
  isDisabled?: boolean,
  isFocused?: boolean,
  values: $PropertyType<ModalSelectProps, 'values'>,
  value?: $PropertyType<ModalSelectProps, 'value'>,
  placeholder?: string,
  color?: string,
  onChange: $PropertyType<ModalSelectProps, 'onChange'>,
  onFocus: () => void,
  onBlur: () => void,
  style?: ViewStyleProp,
  textStyle?: TextStyleProp,
  testID?: string
|};

const ICON_WIDTH = 15;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  text: {
    flex: 1,
    color: theme.colors.gray.medium,
    textAlign: 'center'
  }
});

class Select extends React.PureComponent<Props> {
  props: Props;

  logEvent = (event: AnalyticsEventType) => {
    const {analytics, analyticsID, questionType} = this.props;
    analytics &&
      analytics.logEvent(event, {
        id: analyticsID,
        questionType
      });
  };

  handleFocus = () => {
    this.props.onFocus();
    this.logEvent(ANALYTICS_EVENT_TYPE.OPEN_SELECT);
  };

  handleBlur = () => {
    this.props.onBlur();
    this.logEvent(ANALYTICS_EVENT_TYPE.CLOSE_SELECT);
  };

  handleChange = (value: string) => {
    this.props.onChange(value);
    this.handleBlur();
  };

  render() {
    const {
      values,
      placeholder,
      value,
      style,
      textStyle,
      color,
      isFocused = false,
      isDisabled = false,
      testID = 'select'
    } = this.props;
    const selectedItem = values.find(item => item.text === value);
    const text = (selectedItem && selectedItem.text) || placeholder || null;

    return (
      <React.Fragment>
        <Touchable disabled={isDisabled} onPress={this.handleFocus} testID={`${testID}-input`}>
          <View style={[styles.container, style]}>
            <Text style={[styles.text, textStyle, color && {color}]}>{text}</Text>
            <Space type="tiny" />
            <ArrowDown
              color={color || theme.colors.gray.dark}
              height={ICON_WIDTH}
              width={ICON_WIDTH}
            />
          </View>
        </Touchable>
        <ModalAnimated
          isVisible={isFocused}
          onClose={this.handleBlur}
          testID={`${testID}-modal-animated`}
        >
          <ModalSelect
            value={value}
            values={values}
            onChange={this.handleChange}
            onClose={this.handleBlur}
            testID={`${testID}-modal`}
          />
        </ModalAnimated>
      </React.Fragment>
    );
  }
}

export {Select as Component};
export default withAnalytics(Select);
