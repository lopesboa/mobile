import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import navigationOptions, {
  HEADER_HEIGHT,
  SETTINGS_SCREEN_HEADER_BACKGROUND_COLOR,
} from '../navigator/navigation-options';
import {getStatusBarHeight} from '../modules/status-bar';
import HeaderSettingsTitle from '../components/header-settings-title';
import Touchable from '../components/touchable';
import theme, {getHitSlop} from '../modules/theme';
import HeaderBackButton, {SPACING as ICON_SPACING} from '../components/header-back-button';

const SIDE_WIDTH = 20 + ICON_SPACING;

const styles = StyleSheet.create({
  container: {
    height: HEADER_HEIGHT + getStatusBarHeight(),
  },
  header: {
    ...navigationOptions.headerStyle,
    backgroundColor: SETTINGS_SCREEN_HEADER_BACKGROUND_COLOR,
    shadowColor: theme.colors.black,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 9,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: HEADER_HEIGHT + getStatusBarHeight(),
    paddingTop: getStatusBarHeight(),
  },
  side: {
    width: SIDE_WIDTH,
    justifyContent: 'center',
  },
  center: {
    flex: 1,
    padding: theme.spacing.small,
  },
});

type Props = StackScreenProps<never>;

const SettingsHeader = (props: Props): React.ReactNode => {
  function handleGoBack() {
    return props.navigation.goBack();
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.side}>
          <Touchable
            hitSlop={getHitSlop()}
            onPress={handleGoBack}
            testID="settings-header-back"
            analyticsID="settings-header-back"
          >
            <HeaderBackButton
              isFloating={false}
              color={theme.colors.gray.dark}
              testID="settings-back-icon"
              onPress={handleGoBack}
              type="back"
            />
          </Touchable>
        </View>
        <View style={styles.center}>
          <HeaderSettingsTitle />
        </View>
        <View style={styles.side} />
      </View>
    </View>
  );
};

export default SettingsHeader;
