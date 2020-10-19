import * as React from 'react';
import {StatusBar, StyleSheet, Platform} from 'react-native';
import {connect} from 'react-redux';

import {useBackHandler} from '../containers/with-backhandler';
import Screen from '../components/screen';
import Settings from '../components/settings';
import {HEADER_BACKGROUND_COLOR} from '../navigator/navigation-options';
import {PERMISSION_STATUS, NOTIFICATION_TYPE, NOTIFICATION_SETTINGS_STATUS} from '../const';
import {getPermissionStatus, getNotificationsSettings} from '../redux/utils/state-extract';
import {StoreState} from '../redux/store';
import type {PermissionStatus, NotificationType} from '../types';
import withPermissions from '../containers/with-permissions';
import type {WithPermissionsProps} from '../containers/with-permissions';
import {toggle as toggleNotificationSetting} from '../redux/notifications/settings';
import type {State as NotificationsSettingsState} from '../redux/notifications/settings';
import theme from '../modules/theme';
import translations from '../translations';

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.gray.extra,
  },
});
export interface ConnectedStateProps {
  canReceiveNotifications: boolean;
  currentNotificationsPermission: PermissionStatus;
  notificationsSettings: NotificationsSettingsState;
}

interface ConnectedDispatchProps {
  toggleNotificationSetting: typeof toggleNotificationSetting;
}

interface Props
  extends NavigationScreenProps,
    ConnectedStateProps,
    ConnectedDispatchProps,
    WithPermissionsProps {}

export const transformNotificationSettings = (settings: NotificationsSettingsState) => {
  return Object.entries(settings)
    .map(([key, values]) => ({...values, type: key}))
    .sort((a, b) => {
      if (a.type > b.type) {
        return 1;
      }
      return -1;
    });
};

const SettingsScreen = ({
  navigation,
  toggleNotificationSetting: _toggleNotificationSetting,
  notificationsSettings: _notificationsSettings,
  canReceiveNotifications: _canReceiveNotifications,
  requestNotificationsPermission,
}: Props): React.ReactElement => {
  function handleBackButton() {
    navigation.navigate('Home');
    return true;
  }

  useBackHandler(handleBackButton);

  React.useEffect(() => {
    if (!_canReceiveNotifications && Platform.OS === 'ios') {
      _toggleNotificationSetting(
        NOTIFICATION_TYPE.FINISH_COURSE,
        NOTIFICATION_SETTINGS_STATUS.DEACTIVATED,
      );
      _toggleNotificationSetting(
        NOTIFICATION_TYPE.SUGGESTION,
        NOTIFICATION_SETTINGS_STATUS.DEACTIVATED,
      );
    }
  }, [_canReceiveNotifications, _toggleNotificationSetting]);

  async function handleNotificationSettingToggle(type: NotificationType) {
    if (_canReceiveNotifications) {
      _toggleNotificationSetting(type);
    } else {
      await requestNotificationsPermission(translations.permissionNotificationDescription);
    }
  }

  const settings = transformNotificationSettings(_notificationsSettings);
  return (
    <Screen noScroll testID="settings-screen" style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={HEADER_BACKGROUND_COLOR} />
      <Settings
        testID="settings-notifications"
        onSettingToggle={handleNotificationSettingToggle}
        settings={settings}
      />
    </Screen>
  );
};

export const mapStateToProps = (state: StoreState): ConnectedStateProps => ({
  canReceiveNotifications:
    getPermissionStatus('notifications')(state) === PERMISSION_STATUS.GRANTED,
  currentNotificationsPermission: getPermissionStatus('notifications')(state),
  notificationsSettings: getNotificationsSettings(state),
});

export {SettingsScreen as Component};
export default connect(mapStateToProps, {
  toggleNotificationSetting,
})(withPermissions(SettingsScreen, ['notifications']));
