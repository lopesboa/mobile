import * as React from 'react';
import {View, StyleSheet} from 'react-native';

import {NovaCompositionCoorpacademyCog as SettingsIcon} from '@coorpacademy/nova-icons';
import {HEADER_HEIGHT} from '../navigator/navigation-options';
import theme from '../modules/theme';
import translations from '../translations';
import Text from './text';
import Space from './space';

const ICON_WIDTH = 16;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: theme.colors.gray.dark,
  },
});

const HeaderSettings: React.FC = () => {
  return (
    <View testID="header-settings-title" style={[styles.container, {height: HEADER_HEIGHT}]}>
      <SettingsIcon height={ICON_WIDTH} width={ICON_WIDTH} color={theme.colors.gray.dark} />
      <Space />
      <Text style={styles.title}>{translations.settings}</Text>
    </View>
  );
};

export default HeaderSettings;
