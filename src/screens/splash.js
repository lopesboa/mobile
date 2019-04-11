// @flow

import * as React from 'react';
import {StatusBar, StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import splashScreen from 'react-native-splash-screen';

import Screen from '../components/screen';
import {signIn} from '../redux/actions/authentication';
import localToken from '../utils/local-token';
import {BLUE_COORP_DARK} from '../modules/theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: BLUE_COORP_DARK
  }
});

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
    const token = await localToken.get();

    if (token) {
      await this.props.signIn(token);
      await this.props.navigation.navigate('Home');
      return splashScreen.hide();
    }

    await this.props.navigation.navigate('Authentication');
    return splashScreen.hide();
  }

  render() {
    return (
      <Screen noSafeArea noScroll style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={BLUE_COORP_DARK} />
      </Screen>
    );
  }
}

const mapDispatchToProps: ConnectedDispatchProps = {
  signIn
};

export default connect(
  null,
  mapDispatchToProps
)(SplashScreen);
