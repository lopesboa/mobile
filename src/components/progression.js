// @flow

import * as React from 'react';
import {View, StyleSheet} from 'react-native';

import theme from '../modules/theme';
import withDarkMode from '../containers/with-dark-mode';
import type {WithDarkModeProps} from '../containers/with-dark-mode';
import ProgressionBar from './progression-bar';
import {BrandThemeContext} from './brand-theme-provider';
import Text from './text';

type Props = {|
  ...WithDarkModeProps,
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
  labelDarkMode: {
    backgroundColor: theme.colors.black.extraLight
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

const Progression = ({current, count, isDarkModeActivated}: Props) => {
  const brandTheme = React.useContext(BrandThemeContext);
  const progressBarBackgroundColor = isDarkModeActivated
    ? theme.colors.black.extraLight
    : theme.colors.white;
  return (
    <View testID="progression">
      <ProgressionBar
        current={current}
        count={count}
        backgroundColor={progressBarBackgroundColor}
      />
      <View style={styles.labelContainer}>
        <View
          style={[styles.label, isDarkModeActivated && styles.labelDarkMode]}
          testID="progression-label"
        >
          <Text
            style={[
              styles.current,
              {color: brandTheme.colors.primary},
              isDarkModeActivated && {color: theme.colors.white}
            ]}
          >
            {current}
          </Text>
          <Text style={[styles.count, isDarkModeActivated && {color: theme.colors.gray.medium}]}>
            /{count}
          </Text>
        </View>
      </View>
    </View>
  );
};

export {Progression as Component};
export default withDarkMode(Progression);
