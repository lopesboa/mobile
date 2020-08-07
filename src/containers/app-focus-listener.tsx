import * as React from 'react';
import {AppState, AppStateStatus} from 'react-native';
import {connect} from 'react-redux';
import {increment as incrementAppSession} from '../redux/actions/app-session';
import {
  scheduleNotifications,
  unscheduleLocalNotifications,
} from '../redux/actions/notifications/scheduled-notifications';
import {NOTIFICATION_TYPE} from '../const';

interface ConnectedDispatchProps {
  incrementAppSession: typeof incrementAppSession;
  scheduleNotifications: typeof scheduleNotifications;
  unscheduleLocalNotifications: typeof unscheduleLocalNotifications;
}

type Props = ConnectedDispatchProps;

const AppFocusListener = ({
  incrementAppSession: incrementSession,
  scheduleNotifications: _scheduleNotifications,
  unscheduleLocalNotifications: _unscheduleLocalNotifications,
}: Props) => {
  function _handleAppStateChange(nextAppState: AppStateStatus) {
    switch (nextAppState) {
      case 'active': {
        _unscheduleLocalNotifications(NOTIFICATION_TYPE.FINISH_COURSE);
        break;
      }
      case 'background':
      case 'inactive': {
        _scheduleNotifications(NOTIFICATION_TYPE.FINISH_COURSE);
        break;
      }
    }
  }

  React.useEffect(() => {
    AppState.addEventListener('change', _handleAppStateChange);
    incrementSession();

    return () => {
      AppState.removeEventListener('change', _handleAppStateChange);
    };
  }, [incrementSession, _scheduleNotifications, _unscheduleLocalNotifications]);

  return null;
};

export {AppFocusListener as Component};
export default connect(null, {
  incrementAppSession,
  scheduleNotifications,
  unscheduleLocalNotifications,
})(AppFocusListener);
