import {Alert} from 'react-native';
import Permissions from 'react-native-permissions';

export type PermissionsService = {
  request: typeof Permissions.request;
  check: typeof Permissions.check;
  openSettings: typeof Permissions.openSettings;
  alert: typeof Alert.alert;
};

const service: PermissionsService = {
  request: Permissions.request,
  check: Permissions.check,
  openSettings: Permissions.openSettings,
  alert: Alert.alert,
};

export default service;
