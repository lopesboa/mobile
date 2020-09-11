import {getStatusBarHeight as _getStatusBarHeight} from 'react-native-status-bar-height';
import {Platform} from 'react-native';
import {HEADER_HEIGHT} from '../navigator/navigation-options';
import {__STORYBOOK__} from './environment';

export const getStatusBarHeight = (): number => {
  if (__STORYBOOK__) {
    return 0;
  }
  return _getStatusBarHeight();
};

export const getHeaderHeight = (hedaerHeight = HEADER_HEIGHT): number => {
  return Platform.OS === 'ios' ? hedaerHeight + _getStatusBarHeight() : hedaerHeight;
};
