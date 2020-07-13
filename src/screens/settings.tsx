import * as React from 'react';
import {StatusBar, StyleSheet, Platform} from 'react-native';
import {connect} from 'react-redux';

import {NavigationScreenProps} from 'react-navigation';
import Screen from '../components/screen';
import Settings from '../components/settings';
import {HEADER_BACKGROUND_COLOR} from '../navigator/navigation-options';
import {BackHandler} from '../modules/back-handler';
import {PERMISSION_STATUS, NOTIFICATION_TYPE} from '../const';
import {getPermissionStatus, getNotifications} from '../redux/utils/state-extract';
import {StoreState} from '../redux/store';
import type {PermissionStatus, NotificationType} from '../types';
import withPermissions from '../containers/with-permissions';
import type {WithPermissionsProps} from '../containers/with-permissions';
import {toggle as toggleFinishCourseNotification} from '../redux/actions/notifications/finish-course';
import type {State as NotificationsState} from '../redux/reducers/notifications';
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
  notificationsSettings: NotificationsState;
}

interface ConnectedDispatchProps {
  toggleFinishCourseNotification: typeof toggleFinishCourseNotification;
}

interface Props
  extends NavigationScreenProps,
    ConnectedStateProps,
    ConnectedDispatchProps,
    WithPermissionsProps {}

const SettingsScreen = ({
  navigation,
  toggleFinishCourseNotification: _toggleFinishCourseNotification,
  notificationsSettings: _notificationsSettings,
  canReceiveNotifications: _canReceiveNotifications,
  requestNotificationsPermission,
}: Props): React.ReactElement => {
  React.useEffect(() => {
    function handleBackButton() {
      navigation.navigate('Home');
      return true;
    }
    BackHandler.addEventListener('hardwareBackPress', handleBackButton);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
    };
  }, [navigation]);

  React.useEffect(() => {
    if (!_canReceiveNotifications && Platform.OS === 'ios') {
      _toggleFinishCourseNotification(false);
    }
  }, [_canReceiveNotifications, _toggleFinishCourseNotification]);

  async function handleNotificationSettingToggle(type: NotificationType) {
        
    if (_canReceiveNotifications) {
      switch (type) {
        case NOTIFICATION_TYPE.FINISH_COURSE: {
          _toggleFinishCourseNotification();
          break;
        }
      }
    }
    else {
       await requestNotificationsPermission(
        translations.permissionNotificationDescription,
      );
    }
  }

  return (
    <Screen noScroll testID="settings-screen" style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={HEADER_BACKGROUND_COLOR} />
      <Settings
        testID="settings-notifications"
        onSettingToggle={handleNotificationSettingToggle}
        settings={Object.values(_notificationsSettings)}
      />
    </Screen>
  );
};

export const mapStateToProps = (state: StoreState): ConnectedStateProps => ({
  canReceiveNotifications:
    getPermissionStatus('notifications')(state) === PERMISSION_STATUS.GRANTED,
  currentNotificationsPermission: getPermissionStatus('notifications')(state),
  notificationsSettings: getNotifications(state),
});

export {SettingsScreen as Component};
export default connect(mapStateToProps, {
  toggleFinishCourseNotification,
})(withPermissions(SettingsScreen, ['notifications']));
