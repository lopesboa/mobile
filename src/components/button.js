// @flow

import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import ButtonBase from 'apsl-react-native-button';

import theme from '../modules/theme';
import withAnalytics from '../containers/with-analytics';
import type {WithAnalyticsProps} from '../containers/with-analytics';
import type {AnalyticsEventParams} from '../types';
import {ANALYTICS_EVENT_TYPE} from '../const';
import {BrandThemeContext} from './brand-theme-provider';

export type Props = $Exact<{|
  ...WithAnalyticsProps,
  onPress: () => void,
  isDisabled?: boolean,
  isInverted?: boolean,
  isInlined?: boolean,
  isSecondary?: boolean,
  isLoading?: boolean,
  isTextSecondary?: boolean,
  children: string | React$Node,
  testID?: string,
  analyticsID: string,
  analyticsParams?: AnalyticsEventParams
|}>;

export const HEIGHT = 54;

const styles = StyleSheet.create({
  button: {
    borderWidth: 0,
    borderRadius: theme.radius.button,
    marginBottom: 0,
    height: HEIGHT
  },
  text: {
    color: theme.colors.white,
    fontSize: theme.fontSize.large,
    fontWeight: theme.fontWeight.bold,
    textAlign: 'center'
  },
  disabled: {
    backgroundColor: theme.colors.gray.light
  },
  textDisabled: {
    color: theme.colors.gray.medium
  },
  inverted: {
    backgroundColor: theme.colors.white
  },
  inlined: {
    borderWidth: 2,
    borderColor: theme.colors.white,
    backgroundColor: 'transparent'
  },
  textInverted: {
    color: theme.colors.gray.dark
  },
  textInlined: {
    color: theme.colors.white
  }
});

class Button extends React.PureComponent<Props> {
  props: Props;

  handlePress = () => {
    const {onPress, analytics, analyticsID, analyticsParams} = this.props;

    analytics &&
      analytics.logEvent(ANALYTICS_EVENT_TYPE.PRESS, {
        ...(analyticsParams || {}),
        id: analyticsID
      });

    onPress();
  };

  render() {
    const {
      isLoading,
      isInverted,
      isInlined,
      isSecondary,
      isTextSecondary,
      isDisabled,
      testID: prefixTestID,
      children
    } = this.props;

    return (
      <BrandThemeContext.Consumer>
        {brandTheme => {
          const buttonStyle = {backgroundColor: brandTheme.colors.primary};
          const secondaryButtonStyle = {
            ...styles.inlined,
            borderColor: brandTheme.colors.primary
          };
          const secondaryTextStyle = {color: brandTheme.colors.primary};
          const disabledSuffix = prefixTestID && isDisabled ? '-disabled' : '';
          const loadingSuffix = prefixTestID && isLoading ? '-loading' : '';
          return (
            <View testID={prefixTestID && `${prefixTestID}${disabledSuffix}${loadingSuffix}`}>
              <ButtonBase
                onPress={this.handlePress}
                isLoading={isLoading}
                isDisabled={isDisabled}
                style={[
                  styles.button,
                  buttonStyle,
                  isInverted && styles.inverted,
                  isInlined && styles.inlined,
                  isSecondary && secondaryButtonStyle,
                  isInverted && isSecondary && secondaryButtonStyle
                ]}
                textStyle={[
                  styles.text,
                  isInverted && styles.textInverted,
                  isDisabled && styles.textDisabled,
                  isInlined && styles.textInlined,
                  isSecondary && secondaryTextStyle,
                  isTextSecondary && secondaryTextStyle
                ]}
                disabledStyle={styles.disabled}
                activityIndicatorColor={theme.colors.gray.medium}
                testID={prefixTestID && `${prefixTestID}-native`}
              >
                {children}
              </ButtonBase>
            </View>
          );
        }}
      </BrandThemeContext.Consumer>
    );
  }
}

export {Button as Component};
export default withAnalytics(Button);
