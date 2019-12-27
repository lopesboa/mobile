// @flow

import * as React from 'react';
import {View, StyleSheet} from 'react-native';

import theme from '../modules/theme';
import {useDarkMode} from '../containers/with-dark-mode';
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
  labelDarkMode: {
    backgroundColor: '#373737'
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
  const isDarkModeActivated = useDarkMode();
  const progressBarBackgroundColor = (isDarkModeActivated && '#373737') || null;
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

export default Progression;
