import * as React from 'react';
import {StyleSheet, View} from 'react-native';

import theme from '../modules/theme';
import Text from './text';
import {BrandThemeContext} from './brand-theme-provider';

interface Props {
  label: string;
  size?: 'cover';
  testID?: string;
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    marginLeft: theme.spacing.tiny,
    marginTop: theme.spacing.tiny,
    backgroundColor: theme.colors.white,
    borderRadius: 100,
    paddingVertical: theme.spacing.micro,
    paddingHorizontal: theme.spacing.tiny * 1.5,
  },
  label: {
    fontWeight: theme.fontWeight.bold,
    textAlign: 'center',
  },
});

const Badge = ({label, size, testID}: Props) => {
  const brandTheme = React.useContext(BrandThemeContext);
  const fontSize = theme.fontSize.small;
  const labelStyle = {
    fontSize,
    color: theme.colors.notification,
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
