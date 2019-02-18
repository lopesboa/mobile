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
  isInlined?: boolean,
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
    fontSize: 17,
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

const Button = ({
  onPress,
  isLoading,
  isInverted,
  isInlined,
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
            style={[
              styles.button,
              buttonStyle,
              isInverted && styles.inverted,
              isInlined && styles.inlined
            ]}
            textStyle={[
              styles.text,
              isInverted && styles.textInverted,
              isDisabled && styles.textDisabled,
              isInlined && styles.textInlined
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
