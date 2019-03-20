// @flow

import * as React from 'react';
import {StatusBar} from 'react-native';
import {connect} from 'react-redux';

import Splash, {TOP_COLOR} from '../components/splash';
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

class SplashScreen extends React.PureComponent<Props> {
  props: Props;

  async componentDidMount() {
    await this.signIn();
  }

  signIn = async () => {
    const token = await localToken.get();

    if (token) {
      this.props.signIn(token);
      return this.props.navigation.navigate('Home');
    }

    this.props.navigation.navigate('Authentication');
  };

  render() {
    return (
      <Screen testID="splash-screen" noScroll noSafeArea>
        <StatusBar barStyle="light-content" backgroundColor={TOP_COLOR} />
        <Splash />
      </Screen>
    );
  }
}

const mapDispatchToProps: ConnectedDispatchProps = {
  signIn
};

export default connect(null, mapDispatchToProps)(SplashScreen);
