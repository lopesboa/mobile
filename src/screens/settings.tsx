import * as React from 'react';
import {StatusBar, StyleSheet} from 'react-native';
import {connect} from 'react-redux';

import {NavigationScreenProps} from 'react-navigation';
import {createSelector} from 'reselect';
import Screen from '../components/screen';
import Settings from '../components/settings';
import {HEADER_BACKGROUND_COLOR} from '../navigator/navigation-options';
import {BackHandler} from '../modules/back-handler';
import {PERMISSION_STATUS, NOTIFICATION_TYPE} from '../const';
import {getPermissionStatus, getNotifications} from '../redux/utils/state-extract';
import {StoreState} from '../redux/store';
import type {PermissionStatus, NotificationType} from '../types';
import {toggle as toggleFinishCourseNotification} from '../redux/actions/notifications/finish-course';
import type {State as NotificationsState} from '../redux/reducers/notifications';
import theme from '../modules/theme';

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

interface Props extends NavigationScreenProps, ConnectedStateProps, ConnectedDispatchProps {}

const SettingsScreen = (props: Props) => {
  function handleBackButton() {
    props.navigation.navigate('Home');
    return true;
  }

  React.useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButton);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
    };
  }, []);

  function handleNotificationSettingToggle(type: NotificationType) {
    switch (type) {
      case NOTIFICATION_TYPE.FINISH_COURSE: {
        props.toggleFinishCourseNotification();
        break;
      }
    }
  }

  return (
    <Screen noScroll testID="settings-screen" style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={HEADER_BACKGROUND_COLOR} />
      <Settings
        testID="settings-notifications"
        onSettingToggle={handleNotificationSettingToggle}
        settings={Object.values(props.notificationsSettings)}
      />
    </Screen>
  );
};

const canReceiveNotifications: (state: StoreState) => boolean = createSelector(
  [getPermissionStatus('notifications')],
  (permission) => permission === PERMISSION_STATUS.GRANTED,
);

const currentNotificationsPermission: (state: StoreState) => PermissionStatus = createSelector(
  [getPermissionStatus('notifications')],
  (permission) => permission,
);

const notificationsSettings: (state: StoreState) => NotificationsState = createSelector(
  [getNotifications],
  (settings) => settings,
);

export const mapStateToProps = (state: StoreState): ConnectedStateProps => ({
  canReceiveNotifications: canReceiveNotifications(state),
  currentNotificationsPermission: currentNotificationsPermission(state),
  notificationsSettings: notificationsSettings(state),
});

export {SettingsScreen as Component};
export default connect(mapStateToProps, {
  toggleFinishCourseNotification,
})(SettingsScreen);
