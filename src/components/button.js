// @flow

import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import ButtonBase from 'apsl-react-native-button';
import theme from '../modules/theme';
import {BrandThemeContext} from './brand-theme-provider';

type PropsType = {|
  onPress: () => void,
  isDisabled?: boolean,
  isInverted?: boolean,
  isLoading?: boolean,
  children: string,
  testID?: string
|};

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
    fontSize: 18,
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
  textInverted: {
    color: theme.colors.gray.dark
  }
});

const Button = ({
  onPress,
  isLoading,
  isInverted,
  isDisabled,
  testID: prefixTestID,
  children
}: PropsType) => (
  <BrandThemeContext.Consumer>
    {brandTheme => {
      const buttonStyle = {backgroundColor: brandTheme.colors.primary};
      const disabledSuffix = prefixTestID && isDisabled ? '-disabled' : '';
      const loadingSuffix = prefixTestID && isLoading ? '-loading' : '';
      return (
        <View testID={prefixTestID && `${prefixTestID}${disabledSuffix}${loadingSuffix}`}>
          <ButtonBase
            onPress={onPress}
            isLoading={isLoading}
            isDisabled={isDisabled}
            style={[styles.button, buttonStyle, isInverted && styles.inverted]}
            textStyle={[
              styles.text,
              isInverted && styles.textInverted,
              isDisabled && styles.textDisabled
            ]}
            disabledStyle={styles.disabled}
            activityIndicatorColor={theme.colors.gray.medium}
          >
            {children}
          </ButtonBase>
        </View>
      );
    }}
  </BrandThemeContext.Consumer>
);

export default Button;
