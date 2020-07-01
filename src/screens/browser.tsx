import * as React from 'react';
import {StyleSheet, StatusBar} from 'react-native';
import {NavigationActions, NavigationScreenProps} from 'react-navigation';
import {WebView} from 'react-native-webview';

import Screen from '../components/screen';
import HeaderBackButton from '../components/header-back-button';
import theme from '../modules/theme';
import {HEADER_BACKGROUND_COLOR} from '../navigator/navigation-options';

export type Params = {
  url: string;
};

type Props = NavigationScreenProps<Params>;

const styles = StyleSheet.create({
  browser: {
    flex: 1,
  },
});

class Browser extends React.PureComponent<Props> {
  static navigationOptions = (screenProps: NavigationScreenProps) => {
    const {navigationOptions, navigation} = screenProps;

    return {
      ...navigationOptions,
      headerStyle: {
        ...navigationOptions.headerStyle,
        backgroundColor: HEADER_BACKGROUND_COLOR,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.gray.light,
      },
      title: navigation.getParam('title'),
      headerLeft: (
        <HeaderBackButton
          type="close"
          color={theme.colors.gray.dark}
          onPress={Browser.handleButtonPress(screenProps)}
          isFloating={false}
          testID="browser-button-close"
        />
      ),
    };
  };

  static handleButtonPress = ({navigation}: NavigationScreenProps) => () =>
    navigation.dispatch(NavigationActions.back());

  render() {
    const {url} = this.props.navigation.state.params;

    return (
      <Screen noSafeArea noScroll testID="browser-screen">
        <StatusBar barStyle="dark-content" backgroundColor={HEADER_BACKGROUND_COLOR} />
        <WebView source={{uri: url}} originWhitelist={['*']} style={styles.browser} />
      </Screen>
    );
  }
}

export default Browser;
