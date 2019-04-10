// @flow strict

import * as React from 'react';
import {StyleSheet, View, StatusBar} from 'react-native';
import {NavigationActions} from 'react-navigation';
import {NovaSolidStatusClose as BackIcon} from '@coorpacademy/nova-icons';

import Pdf from '../components/pdf';
import Screen from '../components/screen';
import Touchable from '../components/touchable';
import theme, {defaultHitSlop} from '../modules/theme';
import {HEADER_BACKGROUND_COLOR} from '../navigator/navigation-options';

export type Params = {|
  title: string,
  source: File | {uri: string}
|};

type Props = {|
  ...ReactNavigation$ScreenPropsWithParams<Params>
|};

const styles = StyleSheet.create({
  close: {
    paddingLeft: theme.spacing.small
  }
});

class PdfScreen extends React.PureComponent<Props> {
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
            onPress={PdfScreen.handleButtonPress(screenProps)}
            hitSlop={defaultHitSlop}
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
