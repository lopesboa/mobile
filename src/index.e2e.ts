import {LogBox} from 'react-native';
import app from './app';
import {__E2E__} from './modules/environment';

if (__E2E__) {
  // @ts-ignore
  LogBox.ignoreAllLogs(true);
}

LogBox.ignoreLogs(['Warning: Async Storage has been extracted from react-native core']);

export default app;
