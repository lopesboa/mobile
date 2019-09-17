// @flow

import * as React from 'react';
import {View, StyleSheet} from 'react-native';

import theme from '../modules/theme';
import ProgressionBar from './progression-bar';
import {BrandThemeContext} from './brand-theme-provider';
import Text from './text';

type Props = {|
  current: number,
  count: number
|};

const styles = StyleSheet.create({
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  label: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.tiny,
    paddingVertical: theme.spacing.micro,
    backgroundColor: theme.colors.gray.light,
    borderBottomLeftRadius: theme.radius.medium
  },
  current: {
    fontWeight: theme.fontWeight.bold,
    fontSize: theme.fontSize.medium
  },
  count: {
    color: theme.colors.gray.medium,
    fontWeight: theme.fontWeight.bold,
    fontSize: theme.fontSize.medium
  }
});

const Progression = ({current, count}: Props) => {
  const brandTheme = React.useContext(BrandThemeContext);
  return (
    <View testID="progression">
      <ProgressionBar current={current} count={count} />
      <View style={styles.labelContainer}>
        <View style={styles.label} testID="progression-label">
          <Text style={[styles.current, {color: brandTheme.colors.primary}]}>{current}</Text>
          <Text style={styles.count}>/{count}</Text>
        </View>
      </View>
    </View>
  );
};

export default Progression;
