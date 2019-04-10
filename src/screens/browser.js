// @flow strict

import * as React from 'react';
import {View, WebView, StyleSheet, StatusBar} from 'react-native';
import {NavigationActions} from 'react-navigation';
import {NovaSolidStatusClose as BackIcon} from '@coorpacademy/nova-icons';

import Screen from '../components/screen';
import Touchable from '../components/touchable';
import theme from '../modules/theme';
import {HEADER_BACKGROUND_COLOR} from '../navigator/navigation-options';

type Params = {|
  url: string
|};

type Props = {|
  ...ReactNavigation$ScreenPropsWithParams<Params>
|};

const styles = StyleSheet.create({
  browser: {
    flex: 1
  },
  close: {
    paddingLeft: theme.spacing.small
  }
});

class Browser extends React.PureComponent<Props> {
  props: Props;

  static navigationOptions = (screenProps: ReactNavigation$ScreenProps) => {
    const {navigationOptions, navigation} = screenProps;

    return {
      ...navigationOptions,
      headerStyle: {
        ...navigationOptions.headerStyle,
        backgroundColor: HEADER_BACKGROUND_COLOR,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.gray.light
      },
      title: navigation.getParam('title'),
      headerLeft: (
        <View style={styles.close}>
          <Touchable
            testID="button-close"
            onPress={Browser.handleButtonPress(screenProps)}
            analyticsID="button-close"
          >
            <BackIcon height={16} width={16} color={theme.colors.gray.dark} />
          </Touchable>
        </View>
      )
    };
  };

  static handleButtonPress = ({navigation}: ReactNavigation$ScreenProps) => () =>
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
