import {Alert} from 'react-native';
import Permissions from 'react-native-permissions';

export type PermissionsService = {
  request: typeof Permissions.request;
  requestNotifications: typeof Permissions.requestNotifications;
  check: typeof Permissions.check;
  checkNotifications: typeof Permissions.checkNotifications;
  openSettings: typeof Permissions.openSettings;
  alert: typeof Alert.alert;
};

const service: PermissionsService = {
  request: Permissions.request,
  requestNotifications: Permissions.requestNotifications,
  check: Permissions.check,
  checkNotifications: Permissions.checkNotifications,
  openSettings: Permissions.openSettings,
  alert: Alert.alert,
};

export default service;
