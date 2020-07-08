import * as React from 'react';
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

export {AppSessionListener as Component};
export default connect(null, {incrementAppSession})(AppSessionListener);
