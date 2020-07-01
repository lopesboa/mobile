import * as React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import type {ViewStyle} from 'react-native';
import ButtonBase from 'apsl-react-native-button';

import theme from '../modules/theme';
import withAnalytics from '../containers/with-analytics';
import type {WithAnalyticsProps} from '../containers/with-analytics';
import withVibration from '../containers/with-vibration';
import type {WithVibrationProps} from '../containers/with-vibration';
import type {AnalyticsEventParams} from '../types';
import {ANALYTICS_EVENT_TYPE} from '../const';
import {BrandThemeContext} from './brand-theme-provider';
import {DEFAULT_STYLE as DEFAULT_TEXT_TYPE} from './text';

export const HEIGHT = 54;
export const SMALL_HEIGHT = 45;

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    borderRadius: theme.radius.button,
    height: HEIGHT,
    paddingHorizontal: theme.spacing.base,
    borderWidth: 0,
    marginBottom: 0,
  },
  small: {
    height: SMALL_HEIGHT,
  },
  text: {
    ...DEFAULT_TEXT_TYPE,
    color: theme.colors.white,
    fontSize: theme.fontSize.large,
    fontWeight: theme.fontWeight.bold,
    textAlign: 'center',
  },
  textSmall: {
    fontSize: theme.fontSize.regular,
  },
  disabled: {
    backgroundColor: theme.colors.gray.light,
  },
  textDisabled: {
    color: theme.colors.gray.medium,
  },
  inverted: {
    backgroundColor: theme.colors.white,
  },
  inlined: {
    borderWidth: 2,
    borderColor: theme.colors.white,
    backgroundColor: 'transparent',
  },
  textInverted: {
    color: theme.colors.gray.dark,
  },
  textInlined: {
    color: theme.colors.white,
  },
});

export interface OwnProps {
  onPress: () => void;
  isDisabled?: boolean;
  isInverted?: boolean;
  isInlined?: boolean;
  isSecondary?: boolean;
  isLoading?: boolean;
  isTextSecondary?: boolean;
  isPlaceholder?: boolean;
  isSmall?: boolean;
  placeholderColor?: string;
  children: string | React.ReactNode;
  testID?: string;
  analyticsID: string;
  analyticsParams?: AnalyticsEventParams;
  style?: ViewStyle;
}

export interface Props extends WithAnalyticsProps, WithVibrationProps, OwnProps {}

class Button extends React.PureComponent<Props> {
  handlePress = () => {
    const {onPress, vibration, analytics, analyticsID, analyticsParams} = this.props;

    vibration.vibrate();

    analytics &&
      analytics.logEvent(ANALYTICS_EVENT_TYPE.PRESS, {
        ...(analyticsParams || {}),
        id: analyticsID,
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
      isPlaceholder,
      isSmall,
      placeholderColor = theme.colors.gray.light,
      testID: prefixTestID,
      children,
      style,
    } = this.props;

    return (
      <BrandThemeContext.Consumer>
        {(brandTheme) => {
          const buttonStyle = {backgroundColor: brandTheme.colors.primary};
          const secondaryButtonStyle = {
            ...styles.inlined,
            borderColor: brandTheme.colors.primary,
          };
          const secondaryTextStyle = {color: brandTheme.colors.primary};
          const disabledSuffix = prefixTestID && isDisabled ? '-disabled' : '';
          const loadingSuffix = prefixTestID && isLoading ? '-loading' : '';
          const placeholderButtonStyle = {
            backgroundColor: placeholderColor,
          };
          const placeholderTextStyle = {
            color: placeholderColor,
          };
          const textStyles = [
            styles.text,
            isInverted && styles.textInverted,
            isDisabled && styles.textDisabled,
            isInlined && styles.textInlined,
            isSmall && styles.textSmall,
            isSecondary && secondaryTextStyle,
            isTextSecondary && secondaryTextStyle,
            isPlaceholder && placeholderTextStyle,
          ];

          return (
            <View testID={prefixTestID && `${prefixTestID}${disabledSuffix}${loadingSuffix}`}>
              <ButtonBase
                onPress={this.handlePress}
                isLoading={isLoading}
                isDisabled={isPlaceholder || isDisabled}
                style={[
                  styles.button,
                  buttonStyle,
                  isInverted && styles.inverted,
                  isInlined && styles.inlined,
                  isSmall && styles.small,
                  isSecondary && secondaryButtonStyle,
                  isInverted && isSecondary && secondaryButtonStyle,
                  style,
                ]}
                textStyle={textStyles}
                disabledStyle={(isPlaceholder && placeholderButtonStyle) || styles.disabled}
                activityIndicatorColor={theme.colors.gray.medium}
                testID={prefixTestID && `${prefixTestID}-native`}
              >
                {typeof children === 'string' ? (
                  <Text style={textStyles} numberOfLines={1}>
                    {children}
                  </Text>
                ) : null}
                {typeof children !== 'string' && children}
              </ButtonBase>
            </View>
          );
        }}
      </BrandThemeContext.Consumer>
    );
  }
}

export {Button as Component};
export default withVibration(withAnalytics(Button));
