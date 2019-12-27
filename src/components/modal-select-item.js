// @flow strict

import * as React from 'react';
import {StyleSheet} from 'react-native';

import theme from '../modules/theme';
import {useDarkMode} from '../containers/with-dark-mode';
import {BrandThemeContext} from './brand-theme-provider';
import Text from './text';
import Touchable from './touchable';

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    padding: theme.spacing.small
  },
  containerDarkMode: {
    backgroundColor: null
  },
  text: {
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.black
  },
  textDarkMode: {
    color: theme.colors.white
  }
});

type Props = {|
  isSelected?: boolean,
  children: string,
  onPress: () => void,
  testID?: string
|};

const ModalSelectItem = ({isSelected, children, onPress, testID}: Props) => {
  const brandTheme = React.useContext(BrandThemeContext);
  const isDarkModeActivated = useDarkMode();
  const selectedTextStyle = {
    color: brandTheme.colors.primary
  };

  return (
    <Touchable
      onPress={onPress}
      style={[styles.container, isDarkModeActivated && styles.containerDarkMode]}
      testID={testID}
    >
      <Text
        style={[
          styles.text,
          isSelected && selectedTextStyle,
          isDarkModeActivated && styles.textDarkMode
        ]}
      >
        {children}
      </Text>
    </Touchable>
  );
};

export default ModalSelectItem;
