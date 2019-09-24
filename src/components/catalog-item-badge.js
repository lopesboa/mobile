// @flow

import * as React from 'react';
import {StyleSheet, View} from 'react-native';

import theme from '../modules/theme';
import Text from './text';
import {BrandThemeContext} from './brand-theme-provider';

type Props = {|
  label: string,
  size?: 'cover',
  testID?: string
|};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.white,
    borderBottomEndRadius: theme.radius.medium,
    paddingVertical: theme.spacing.micro,
    paddingHorizontal: theme.spacing.tiny
  },
  label: {
    fontWeight: theme.fontWeight.bold,
    textAlign: 'center'
  }
});

const Badge = ({label, size, testID}: Props) => {
  const brandTheme = React.useContext(BrandThemeContext);
  const fontSize = size === 'cover' ? theme.fontSize.small : theme.fontSize.extraSmall;
  const labelStyle = {
    fontSize,
    color: brandTheme.colors.primary
  };

  return (
    <View style={styles.container}>
      <Text testID={testID} style={[styles.label, labelStyle]}>
        {label}
      </Text>
    </View>
  );
};

export default Badge;
