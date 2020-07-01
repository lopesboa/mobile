import * as React from 'react';
import {AppState, AppStateStatus} from 'react-native';
import {connect} from 'react-redux';
import {increment as incrementAppSession} from '../redux/actions/app-session';

interface ConnectedDispatchProps {
  incrementAppSession: typeof incrementAppSession;
};

interface Props extends ConnectedDispatchProps {}

const AppSessionListener = (props: Props) => {
  const [appState, setAppState] = React.useState(AppState.currentState);

  console.log({appStateeee: appState})
  React.useEffect(() => {
    AppState.addEventListener("change", _handleAppStateChange);
    return () => {
      AppState.removeEventListener("change", _handleAppStateChange);
    };
  }, []);

  const _handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (appState.match(/inactive|background/) && nextAppState === "active") {
      props.incrementAppSession()
    }
    setAppState(nextAppState);
  };
  return null;
};

export default connect(null, {incrementAppSession})(AppSessionListener);