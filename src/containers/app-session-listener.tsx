import * as React from 'react';
import {AppState, AppStateStatus} from 'react-native';
import {connect} from 'react-redux';
import {increment as incrementAppSession} from '../redux/actions/app-session';

interface ConnectedDispatchProps {
  incrementAppSession: typeof incrementAppSession;
}

type Props = ConnectedDispatchProps;

const AppSessionListener = ({incrementAppSession: incrementSession}: Props) => {
  React.useEffect(() => {
    incrementSession();
  }, [incrementSession]);

  return null;
};

export default connect(null, {incrementAppSession})(AppSessionListener);
