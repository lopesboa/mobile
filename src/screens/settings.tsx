import * as React from 'react';
import {StatusBar} from 'react-native';
import {connect} from 'react-redux';

import Screen from '../components/screen';
import Settings from '../components/settings';
import {HEADER_BACKGROUND_COLOR} from '../navigator/navigation-options';
import {BackHandler} from '../modules/back-handler';
import { NavigationScreenProps } from 'react-navigation';
import { PERMISSION_STATUS } from '../const';
import { createSelector } from 'reselect';
import { getPermissionStatus } from '../redux/utils/state-extract';
import { StoreState } from '../redux/store';
import type {PermissionStatus} from '../types';
import {toggle as toggleNotificationsPermission} from '../redux/actions/permissions/notifications';


export interface ConnectedStateProps {
  canReceiveNotifications: boolean;
  currentNotificationsPermission: PermissionStatus
};

interface ConnectedDispatchProps {
  toggleNotificationsPermission: typeof toggleNotificationsPermission;
};

interface Props extends NavigationScreenProps, ConnectedStateProps, ConnectedDispatchProps {}

const SettingsScreen = (props: Props) => {
  function handleBackButton() {
    props.navigation.navigate('Home');
    return true;
  }


  function handleAuthorizeNotifications() {
    props.toggleNotificationsPermission();
  }

  React.useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButton);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
    };
  }, []);

  return (
    <Screen noScroll testID="settings-screen">
      <StatusBar barStyle="dark-content" backgroundColor={HEADER_BACKGROUND_COLOR} />
      <Settings
        testID="settings-notifications"
        settings={[
          {
            type: 'authorize-notifications',
            label: 'Authorize notifications',
            onPress: handleAuthorizeNotifications,
            isActive: props.canReceiveNotifications
          },
          {type: 'new-courses', label: 'New courses', onPress: () => {}, isActive: false},
          {type: 'new-battles', label: 'New battles', onPress: () => {}, isActive: true}
        ]}
      />
    </Screen>
  );
};

const canReceiveNotifications: (state: StoreState) => boolean = createSelector(
  [getPermissionStatus('notifications')],
  permission => permission === PERMISSION_STATUS.GRANTED
);

const currentNotificationsPermission: (state: StoreState) => PermissionStatus = createSelector(
  [getPermissionStatus('notifications')],
  permission => permission
);

export const mapStateToProps = (state: StoreState): ConnectedStateProps => ({
  canReceiveNotifications: canReceiveNotifications(state),
  currentNotificationsPermission: currentNotificationsPermission(state) 
});

export {SettingsScreen as Component};
export default connect(mapStateToProps, {
  toggleNotificationsPermission
})(SettingsScreen);
