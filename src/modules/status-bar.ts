import {getStatusBarHeight as _getStatusBarHeight} from 'react-native-status-bar-height';

import {__STORYBOOK__} from './environment';

export const getStatusBarHeight = (): number => {
  if (__STORYBOOK__) {
    return 0;
  }

  return _getStatusBarHeight();
};
