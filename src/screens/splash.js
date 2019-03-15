// @flow

import * as React from 'react';
import {connect} from 'react-redux';

import SplashScreen from '../containers/splash-screen';
import Screen from '../components/screen';
import {signIn} from '../redux/actions/authentication';
import localToken from '../utils/local-token';

type ConnectedDispatchProps = {|
  signIn: typeof signIn
|};

type Props = {|
  ...ReactNavigation$ScreenProps,
  ...ConnectedDispatchProps
|};

class Splash extends React.PureComponent<Props> {
  props: Props;

  async componentDidMount() {
    const token = await localToken.get();
    if (token) {
      this.props.signIn(token);
      return this.props.navigation.navigate('Home');
    }
    this.props.navigation.navigate('Authentication');
  }

  async componentDidUpdate() {
    const token = await localToken.get();
    if (token) {
      this.props.signIn(token);
      return this.props.navigation.navigate('Home');
    }
    this.props.navigation.navigate('Authentication');
  }

  render() {
    return (
      <Screen testID="check-authentication-screen" noScroll noSafeArea>
        <SplashScreen />
      </Screen>
    );
  }
}

const mapDispatchToProps: ConnectedDispatchProps = {
  signIn
};

export default connect(null, mapDispatchToProps)(Splash);
