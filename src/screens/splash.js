// @flow

import * as React from 'react';
import {connect} from 'react-redux';
import SplashScreenLib from 'react-native-splash-screen';

import {signIn} from '../redux/actions/authentication';
import localToken from '../utils/local-token';

type ConnectedDispatchProps = {|
  signIn: typeof signIn
|};

type Props = {|
  ...ReactNavigation$ScreenProps,
  ...ConnectedDispatchProps
|};

class SplashScreen extends React.PureComponent<Props> {
  props: Props;

  async componentDidMount() {
    await this.signIn();
  }

  signIn = async () => {
    const token = await localToken.get();

    if (token) {
      this.props.signIn(token);
      SplashScreenLib.hide();
      return this.props.navigation.navigate('Home');
    }
    SplashScreenLib.hide();
    return this.props.navigation.navigate('Authentication');
  };

  render() {
    return null;
  }
}

const mapDispatchToProps: ConnectedDispatchProps = {
  signIn
};

export default connect(null, mapDispatchToProps)(SplashScreen);
