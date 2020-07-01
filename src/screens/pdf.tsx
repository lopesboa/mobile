import * as React from 'react';
import {StatusBar} from 'react-native';
import {NavigationActions, NavigationScreenProps} from 'react-navigation';

import Pdf from '../components/pdf';
import Screen from '../components/screen';
import HeaderBackButton from '../components/header-back-button';
import theme from '../modules/theme';
import {HEADER_BACKGROUND_COLOR} from '../navigator/navigation-options';

export type Params = {
  title?: string;
  source: File | {uri: string};
};

export type Props = NavigationScreenProps<Params>;

class PdfScreen extends React.PureComponent<Props> {
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
          onPress={PdfScreen.handleButtonPress(screenProps)}
          isFloating={false}
          testID="pdf-button-close"
        />
      ),
    };
  };

  static handleButtonPress = ({navigation}: NavigationScreenProps) => () =>
    navigation.dispatch(NavigationActions.back());

  render() {
    const {source} = this.props.navigation.state.params;

    return (
      <Screen testID="pdf-screen" noScroll noSafeArea>
        <StatusBar barStyle="dark-content" backgroundColor={HEADER_BACKGROUND_COLOR} />
        <Pdf source={source} />
      </Screen>
    );
  }
}

export default PdfScreen;
