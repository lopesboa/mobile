// @flow

import * as React from 'react';
import {View, WebView, StyleSheet, TouchableOpacity} from 'react-native';
import {NavigationActions} from 'react-navigation';
import {NovaSolidStatusClose as BackIcon} from '@coorpacademy/nova-icons';

import theme from '../modules/theme';

type Props = {|
  ...ReactNavigation$ScreenProps
|};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
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
      headerStyle: {},
      title: navigation.getParam('title'),
      headerLeft: (
        <View style={styles.close}>
          <TouchableOpacity testID="button-close" onPress={Browser.handleButtonPress(screenProps)}>
            <BackIcon height={16} width={16} color={theme.colors.gray.dark} />
          </TouchableOpacity>
        </View>
      )
    };
  };

  static handleButtonPress = ({navigation}: ReactNavigation$ScreenProps) => () =>
    navigation.dispatch(NavigationActions.back());

  render() {
    const url = this.props.navigation.state.params.url;
    return (
      <View style={styles.container}>
        <WebView source={{uri: url}} originWhitelist={['*']} style={styles.browser} />
      </View>
    );
  }
}

export default Browser;
