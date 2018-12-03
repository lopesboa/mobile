// @flow

import * as React from 'react';
import {StyleSheet} from 'react-native';
import ButtonBase from 'apsl-react-native-button';
import theme from '../modules/theme';
import {BrandThemeContext} from './brand-theme-provider';

type PropsType = {|
  onPress: () => void,
  isDisabled?: boolean,
  isLoading?: boolean,
  children: string,
  testID?: string,
|};

const styles = StyleSheet.create({
  button: {
    borderWidth: 0,
    borderRadius: theme.radius.button,
  },
  text: {
    color: theme.colors.white,
    fontSize: 22,
    textAlign: 'center',
  },
  disabled: {
    backgroundColor: theme.colors.gray.light,
  },
  textDisabled: {
    color: theme.colors.gray.medium,
  },
});

const Button = ({onPress, isLoading, isDisabled, testID, children}: PropsType) => (
  <BrandThemeContext.Consumer>
    {brandTheme => {
      const buttonStyle = {backgroundColor: brandTheme.colors.primary};
      return (
        <ButtonBase
          onPress={onPress}
          isLoading={isLoading}
          isDisabled={isDisabled}
          style={[styles.button, buttonStyle]}
          textStyle={[styles.text, isDisabled && styles.textDisabled]}
          disabledStyle={styles.disabled}
          activityIndicatorColor={theme.colors.gray.medium}
          testID={testID}
        >
          {children}
        </ButtonBase>
      );
    }}
  </BrandThemeContext.Consumer>
);

export default Button;
